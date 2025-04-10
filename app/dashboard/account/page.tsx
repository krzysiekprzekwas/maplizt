"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/header";
import { supabase } from "@/lib/supabase";
import { Influencer } from "@/types/database";
import LoadingMarker from "@/components/loading-marker";
import ImageUpload from "@/components/image-upload";

function AccountPageContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  
  // Influencer profile states
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [influencerName, setInfluencerName] = useState("");
  const [influencerSlug, setInfluencerSlug] = useState("");
  const [influencerHandle, setInfluencerHandle] = useState("");
  const [influencerProfileImage, setInfluencerProfileImage] = useState("");
  const [updatingInfluencer, setUpdatingInfluencer] = useState(false);
  const [influencerSuccess, setInfluencerSuccess] = useState("");
  const [influencerError, setInfluencerError] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isManuallyEditingSlug, setIsManuallyEditingSlug] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signup");
    } else if (user) {
      setFullName(user.user_metadata.full_name || "");
      
      // Fetch influencer profile
      const fetchInfluencer = async () => {
        try {
          const response = await fetch('/api/influencers/me');
          if (!response.ok) {
            throw new Error('Failed to fetch influencer profile');
          }
          const data = await response.json();
          setInfluencer(data);
          if (data) {
            setInfluencerName(data.name || "");
            setInfluencerSlug(data.slug || "");
            setOriginalSlug(data.slug || "");
            setInfluencerHandle(data.handle || "");
            setInfluencerProfileImage(data.profile_image || "");
          }
        } catch (error) {
          console.error("Error fetching influencer profile:", error);
        }
      };
      
      fetchInfluencer();
    }
  }, [user, isLoading, router]);

  // Generate slug from name
  useEffect(() => {
    if (!isManuallyEditingSlug && influencerName) {
      const generatedSlug = influencerName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setInfluencerSlug(generatedSlug);
    }
  }, [influencerName, isManuallyEditingSlug]);

  // Check if slug is available
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!influencerSlug || influencerSlug === originalSlug) return;
      
      setIsCheckingSlug(true);
      setSlugError(null);
      
      try {
        const response = await fetch(`/api/influencers/check-slug?slug=${influencerSlug}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to check slug availability");
        }
        
        if (!data.available) {
          setSlugError(data.error || "This URL is already taken. Please choose another one.");
        }
      } catch (error) {
        console.error("Error checking slug:", error);
        setSlugError("Failed to check URL availability");
      } finally {
        setIsCheckingSlug(false);
      }
    };
    
    const debounceTimer = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [influencerSlug, originalSlug]);

  // Add this to your useEffect that runs on mount
  useEffect(() => {
    // Check for Stripe success/error params
    if (searchParams.get('stripe_success') === 'true') {
      setSuccessMessage('Stripe account connected successfully!');
    } else if (searchParams.get('stripe_refresh') === 'true') {
      // User was redirected back to refresh the connection
      handleStripeConnect();
    }
  }, [searchParams]);

  // Add this function to handle Stripe connection
  const handleStripeConnect = async () => {
    setStripeLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'user-email': user?.email || '',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create Stripe Connect account');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      console.error('Stripe Connect error:', error);
      setErrorMessage(error.message || 'Failed to connect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

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
      if (slugError) throw new Error("Please fix the URL slug error before submitting");
      
      // Update or create influencer profile via API
      const response = await fetch('/api/influencer/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: influencerName.trim(),
          slug: influencerSlug.trim(),
          handle: influencerHandle.trim(),
          profile_image: influencerProfileImage
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update influencer profile');
      }

      const updatedProfile = await response.json();
      setInfluencer(updatedProfile);
      setOriginalSlug(updatedProfile.slug);
      setInfluencerSuccess("Influencer profile updated successfully!");
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
        <LoadingMarker />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-all">
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
                <label className="block text-[#19191b] font-medium mb-2">
                  Profile Image
                </label>
                <ImageUpload 
                  images={influencerProfileImage ? [influencerProfileImage] : []}
                  setImages={(images) => setInfluencerProfileImage(images.length > 0 ? images[0] : '')}
                  singleImage={true}
                  imageClassName="w-32 h-32 object-cover rounded-full border-2 border-[#19191b]"
                />
              </div>
              
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
                    onChange={(e) => {
                      setIsManuallyEditingSlug(true);
                      setInfluencerSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    }}
                    onBlur={() => {
                      if (!influencerSlug) {
                        setIsManuallyEditingSlug(false);
                      }
                    }}
                    placeholder="your-profile-url"
                  />
                </div>
                {isCheckingSlug && (
                  <p className="mt-2 text-sm text-gray-500">Checking availability...</p>
                )}
                {slugError && (
                  <p className="mt-2 text-sm text-red-500">{slugError}</p>
                )}
                {!isCheckingSlug && !slugError && influencerSlug && influencerSlug !== originalSlug && (
                  <p className="mt-2 text-sm text-green-500">This URL is available!</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  This will be your public profile URL
                </p>
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="influencerHandle"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Handle
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    id="influencerHandle"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={influencerHandle}
                    onChange={(e) => setInfluencerHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="your_handle"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be your public handle
                </p>
              </div>
              
              <button
                type="submit"
                className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${
                  updatingInfluencer ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={updatingInfluencer}
              >
                {updatingInfluencer ? "Updating..." : influencer ? "Update Influencer Profile" : "Create Influencer Profile"}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-[#19191b] mb-6">
              <h3 className="text-lg font-medium mb-2">Stripe Connect Account</h3>
              <p className="text-gray-600 mb-4">
                {influencer?.stripe_account_id 
                  ? "Your Stripe account is connected. You can receive payments for your recommendations."
                  : "Connect your Stripe account to receive payments for your recommendations."}
              </p>
              
              <button
                onClick={handleStripeConnect}
                disabled={stripeLoading}
                className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${
                  stripeLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {stripeLoading 
                  ? "Connecting..." 
                  : influencer?.stripe_account_id 
                    ? "Update Stripe Account"
                    : "Connect Stripe Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
        <Header />
        <LoadingMarker />
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  );
} 