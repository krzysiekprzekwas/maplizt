"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FormMessage } from "@/components/form-message";
import AvatarUpload from "../avatar-upload";

interface InfluencerProfile {
  id?: string;
  name: string;
  slug: string;
  handle: string;
  profile_image: string | null;
  stripe_account_id?: string;
}

export default function InfluencerContent() {
  const [userId, setUserId] = useState<string | null>(null);
  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    handle: "",
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    async function getUserAndInfluencer() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        router.push("/auth/sign-in");
        return;
      }
      
      setUserId(data.user.id);
      
      try {
        // Fetch influencer profile from the API
        const response = await fetch("/api/influencers/me");
        if (!response.ok) {
          throw new Error("Failed to fetch influencer profile");
        }
        
        const influencerData = await response.json();
        setInfluencer(influencerData);
        
        if (influencerData) {
          setFormData({
            name: influencerData.name || "",
            slug: influencerData.slug || "",
            handle: influencerData.handle || "",
          });
        }
      } catch (error) {
        console.error("Error fetching influencer profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getUserAndInfluencer();
    
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
      router.replace(`/dashboard/account/influencer?${params.toString()}`);
    }
  }, [router, searchParams]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch("/api/influencers/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          handle: formData.handle,
          profile_image: influencer?.profile_image,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to update influencer profile");
        setSuccess(null);
      } else {
        setSuccess("Influencer profile updated successfully!");
        setInfluencer(data);
      }
    } catch (error) {
      setError("An error occurred while updating your profile");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return (
    <>
      {error && <FormMessage message={{ error }} />}
      {success && <FormMessage message={{ success }} />}

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Influencer Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Image Column */}
            <div className="md:col-span-1">
              <label className="block text-[#19191b] font-medium mb-2 self-start">
                Profile Image
              </label>
              {userId && (
                <AvatarUpload 
                  currentImage={influencer?.profile_image || null}
                  userId={userId}
                  large={true}
                />
              )}
            </div>
            
            {/* Form Fields Column */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Influencer Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your public influencer name"
                />
              </div>
              
              <div>
                <label
                  htmlFor="slug"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">maplizt.com/</span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="your-profile-url"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be your public profile URL
                </p>
              </div>
              
              <div>
                <label
                  htmlFor="handle"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Handle
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    id="handle"
                    name="handle"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="your_handle"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be your public handle
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-right">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Updating..." : "Update Influencer Profile"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 