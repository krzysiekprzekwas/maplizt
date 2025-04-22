"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FormMessage } from "@/components/form-message";
import { User } from "@supabase/auth-js";

export default function AccountContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        router.push("/auth/sign-in");
        return;
      }
      
      setUser(data.user);
      setFullName(data.user.user_metadata.full_name || "");
      setLoading(false);
    }
    
    getUser();
    
    // Get message from URL if any
    const message = searchParams.get("message");
    const messageType = searchParams.get("type");
    
    if (message && messageType) {
      if (messageType === "error") {
        setError(message);
      } else if (messageType === "success") {
        setSuccess(message);
      }
      
      // Clear the URL parameters
      const params = new URLSearchParams(searchParams);
      params.delete("message");
      params.delete("type");
      router.replace(`/dashboard/account?${params.toString()}`);
    }
  }, [router, searchParams]);
  
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };
  
  if (loading && !user) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return (
    <>
      {error && <FormMessage message={{ error }} />}
      {success && <FormMessage message={{ success }} />}

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-[#19191b] font-medium mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50 bg-gray-100"
              value={user?.email || ""}
              disabled
            />
            <p className="mt-2 text-sm text-gray-500">
              Your email cannot be changed
            </p>
          </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Sign out</h2>
        <button
          onClick={handleSignOut}
          className="bg-[#19191b] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
        >
          Sign out
        </button>
      </div>
    </>
  );
} 