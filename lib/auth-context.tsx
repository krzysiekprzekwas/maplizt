"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { Influencer } from "@/types/database";
import { getInfluencerByUserId } from "./db";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  influencer: Influencer | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get session and user on initial load
    const initializeAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
        }, 5000); // 5 second timeout

        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        // Get authenticated user data
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if(user){
          const influencer = await getInfluencerByUserId(user?.id);
          setInfluencer(influencer);
        }

        clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setSession(null);
        setInfluencer(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          
          // Get authenticated user data when auth state changes
          if (session) {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
          } else {
            setUser(null);
            setInfluencer(null);
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setUser(null);
          setSession(null);
          setInfluencer(null);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, influencer, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 