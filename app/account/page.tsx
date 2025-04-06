"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/header";
import { supabase } from "@/lib/supabase";
import { getInfluencerByUserId, updateInfluencerProfile, createInfluencerProfile } from "@/lib/db";
import { Influencer } from "@/types/database";

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Influencer profile states
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [influencerName, setInfluencerName] = useState("");
  const [influencerSlug, setInfluencerSlug] = useState("");
  const [influencerHandle, setInfluencerHandle] = useState("");
  const [updatingInfluencer, setUpdatingInfluencer] = useState(false);
  const [influencerSuccess, setInfluencerSuccess] = useState("");
  const [influencerError, setInfluencerError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signup");
    } else if (user) {
      setFullName(user.user_metadata.full_name || "");
      
      // Fetch influencer profile
      const fetchInfluencer = async () => {
        try {
          const data = await getInfluencerByUserId(user.id);
          setInfluencer(data);
          if (data) {
            setInfluencerName(data.name || "");
            setInfluencerSlug(data.slug || "");
            setInfluencerHandle(data.handle || "");
          }
        } catch (error) {
          console.error("Error fetching influencer profile:", error);
        }
      };
      
      fetchInfluencer();
    }
  }, [user, isLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      setSuccessMessage("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };
  
  const handleUpdateInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingInfluencer(true);
    setInfluencerSuccess("");
    setInfluencerError("");
    
    try {
      if (!user) throw new Error("You must be logged in to update your profile");
      
      // Validate inputs
      if (!influencerName.trim()) throw new Error("Name is required");
      if (!influencerSlug.trim()) throw new Error("Slug is required");
      if (!influencerHandle.trim()) throw new Error("Handle is required");
      
      // Create or update
      if (influencer) {
        // Update existing profile
        const updatedProfile = await updateInfluencerProfile(user.id, {
          name: influencerName.trim(),
          slug: influencerSlug.trim(),
          handle: influencerHandle.trim()
        });
        
        setInfluencer(updatedProfile);
        setInfluencerSuccess("Influencer profile updated successfully!");
      } else {
        // Create new profile
        const newProfile = await createInfluencerProfile(user.id, {
          name: influencerName.trim(),
          slug: influencerSlug.trim(),
          handle: influencerHandle.trim()
        });
        
        setInfluencer(newProfile);
        setInfluencerSuccess("Influencer profile created successfully!");
      }
    } catch (error: any) {
      console.error("Error updating influencer profile:", error);
      setInfluencerError(error.message || "Error updating influencer profile");
    } finally {
      setUpdatingInfluencer(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#8d65e3] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null; // This shouldn't show because of the redirect

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 shadow-[8px_8px_0px_0px_#19191b]">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          {successMessage && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form onSubmit={handleUpdateProfile}>
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
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50 bg-gray-100"
                  value={user.email || ""}
                  disabled
                />
                <p className="mt-2 text-sm text-gray-500">
                  Your email cannot be changed
                </p>
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="fullName"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              
              <button
                type="submit"
                className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${
                  updating ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Influencer Profile</h2>
            
            {influencerSuccess && (
              <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {influencerSuccess}
              </div>
            )}
            
            {influencerError && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {influencerError}
              </div>
            )}
            
            <form onSubmit={handleUpdateInfluencer}>
              <div className="mb-6">
                <label
                  htmlFor="influencerName"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Influencer Name
                </label>
                <input
                  id="influencerName"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  value={influencerName}
                  onChange={(e) => setInfluencerName(e.target.value)}
                  placeholder="Your public influencer name"
                />
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="influencerSlug"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">maplizt.com/</span>
                  <input
                    id="influencerSlug"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={influencerSlug}
                    onChange={(e) => setInfluencerSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-unique-slug"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Only lowercase letters, numbers, and hyphens. This will be your public profile URL.
                </p>
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="influencerHandle"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Social Handle
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    id="influencerHandle"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={influencerHandle}
                    onChange={(e) => setInfluencerHandle(e.target.value)}
                    placeholder="yourhandle"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${
                  updatingInfluencer ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={updatingInfluencer}
              >
                {updatingInfluencer 
                  ? "Saving..." 
                  : influencer 
                    ? "Update Influencer Profile" 
                    : "Create Influencer Profile"
                }
              </button>
              
              {influencer && (
                <p className="mt-4 text-sm text-gray-600">
                  Your public profile: <a href={`/${influencerSlug}`} className="text-[#8d65e3] hover:underline">maplizt.com/{influencerSlug}</a>
                </p>
              )}
            </form>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-4">Security</h2>
            <div className="mb-6">
              <button
                onClick={() => router.push("/change-password")}
                className="bg-white text-[#19191b] px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-[#f8f5ed] transition"
              >
                Change Password
              </button>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
              <button
                className="text-red-600 px-6 py-3 rounded-lg border-2 border-red-600 font-medium hover:bg-red-50 transition"
              >
                Delete Account
              </button>
              <p className="mt-2 text-sm text-gray-500">
                This action is irreversible. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 