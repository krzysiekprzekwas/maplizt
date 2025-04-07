"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/header";
import LoadingMarker from "@/components/loading-marker";
import { uploadImage } from '@/lib/storage';

type RecommendationType = "Free" | "Paid" | "Premium";

export default function CreateListPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RecommendationType>("Free");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signup");
    }
  }, [user, isLoading, router]);

  // Generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  // Check if slug is available
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!slug || slug.length < 3) return;
      
      setIsCheckingSlug(true);
      setSlugError(null);
      
      try {
        const response = await fetch(`/api/check-slug?slug=${slug}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to check slug availability");
        }
        
        if (!data.available) {
          setSlugError("This URL is already taken. Please choose another one.");
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
  }, [slug]);

  // Handle price change based on type
  useEffect(() => {
    if (type === "Free") {
      setPrice(0);
    } else if (type === "Paid" && price === 0) {
      setPrice(5);
    } else if (type === "Premium" && price < 7) {
      setPrice(7);
    }
  }, [type, price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }
    
    if (!slug.trim()) {
      setError("URL slug is required");
      setIsSubmitting(false);
      return;
    }
    
    if (slugError) {
      setError("Please fix the URL slug error before submitting");
      setIsSubmitting(false);
      return;
    }
    
    if (!description.trim()) {
      setError("Description is required");
      setIsSubmitting(false);
      return;
    }
    
    if (!googleMapsLink.trim()) {
      setError("Google Maps link is required");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          type,
          numeric_price: price,
          images: images.length > 0 ? images : ["/recommendation_image_placeholder.jpg"],
          googleMapsLink,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create recommendation list");
      }
      
      setSuccess("Recommendation list created successfully!");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating recommendation:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if we've reached the maximum number of images
    if (images.length + files.length > 3) {
      setUploadError('Maximum 3 images allowed');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadImage(file)
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Add image removal handler
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 shadow-[8px_8px_0px_0px_#19191b]">
          <h1 className="text-3xl font-bold mb-6">Create New Recommendation List</h1>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-[#19191b] font-medium mb-2"
              >
                List Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Best Coffee Shops in Berlin"
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="slug"
                className="block text-[#19191b] font-medium mb-2"
              >
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">maplizt.com/your-profile/</span>
                <input
                  id="slug"
                  type="text"
                  className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="best-coffee-shops-berlin"
                  required
                />
              </div>
              {isCheckingSlug && (
                <p className="mt-2 text-sm text-gray-500">Checking availability...</p>
              )}
              {slugError && (
                <p className="mt-2 text-sm text-red-500">{slugError}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Only lowercase letters, numbers, and hyphens. This will be your public URL.
              </p>
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-[#19191b] font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50 min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this list is about..."
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="googleMapsLink"
                className="block text-[#19191b] font-medium mb-2"
              >
                Google Maps Link
              </label>
              <input
                id="googleMapsLink"
                type="url"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
                placeholder="https://www.google.com/maps/..."
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Provide a link to the Google Maps location for this recommendation.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-[#19191b] font-medium mb-2">
                List Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 ${
                    type === "Free"
                      ? "bg-[#97b5ec] border-[#19191b]"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setType("Free")}
                >
                  <div className="font-bold">Free</div>
                  <div className="text-sm">No cost</div>
                </button>
                
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 ${
                    type === "Paid"
                      ? "bg-[#7db48f] border-[#19191b]"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setType("Paid")}
                >
                  <div className="font-bold">Paid</div>
                  <div className="text-sm">Low cost</div>
                </button>
                
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 ${
                    type === "Premium"
                      ? "bg-[#f7bdf6] border-[#19191b]"
                      : "bg-white border-gray-300"
                  }`}
                  onClick={() => setType("Premium")}
                >
                  <div className="font-bold">Premium</div>
                  <div className="text-sm">High value</div>
                </button>
              </div>
            </div>
            
            {type !== "Free" && (
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Price (in PLN)
                </label>
                <div className="flex items-center">
                  <input
                    id="price"
                    type="number"
                    min={type === "Premium" ? 7 : 1}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    required
                  />
                  <span className="ml-2 text-gray-500">PLN</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {type === "Premium" 
                    ? "Premium lists must cost at least 7 PLN" 
                    : "Paid lists must cost at least 1 PLN"}
                </p>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-[#19191b] font-medium mb-2">
                Images (Max 3)
              </label>
              <div className="space-y-4">
                {/* Image preview */}
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {images.map((url, index) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border-2 border-[#19191b]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {images.length < 3 && (
                  <div>
                    <input
                      type="file"
                      id="images"
                      accept=".jpg,.jpeg,.png,.webp"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="images"
                      className={`inline-block px-4 py-2 bg-[#19191b] text-white rounded-lg cursor-pointer ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Images'}
                    </label>
                  </div>
                )}

                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
                
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, WebP. Maximum size: 5MB per image.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                className="px-6 py-3 bg-white text-[#19191b] rounded-lg border-2 border-[#19191b] font-medium hover:bg-gray-100 transition"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#19191b] text-white rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
                disabled={isSubmitting || !!slugError}
              >
                {isSubmitting ? "Creating..." : "Create List"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 