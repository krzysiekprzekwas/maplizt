"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUpAction } from "../actions";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isManuallyEditingSlug, setIsManuallyEditingSlug] = useState(false);

  // Generate slug from name
  useEffect(() => {
    if (!isManuallyEditingSlug && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [name, isManuallyEditingSlug]);

  // Check if slug is available
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!slug) return;
      
      setIsCheckingSlug(true);
      setSlugError(null);
      
      try {
        const response = await fetch(`/api/influencers/check-slug?slug=${slug}`);
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
  }, [slug]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-hover">
          <div className="flex justify-center items-center mb-8">
            <Link href="/">
              <Image 
                src="/maplizt-logo-full.svg" 
                alt="Maplizt Logo" 
                width={128} 
                height={64} 
                className="px-4 py-2 rounded-lg border-2 border-[#19191b] brutal-shadow-all" 
              />
            </Link>
          </div>

          <form>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-[#19191b] font-medium mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                placeholder="Your full name"
                required
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="slug"
                className="block text-[#19191b] font-medium mb-2"
              >
                Profile URL
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">maplizt.vercel.app/</span>
                <input
                  id="slug"
                  type="text"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setIsManuallyEditingSlug(true);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                  }}
                  onBlur={() => {
                    if (!slug) {
                      setIsManuallyEditingSlug(false);
                    }
                  }}
                  className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  placeholder="your-profile-url"
                  required
                />
              </div>
              {isCheckingSlug && (
                <p className="mt-2 text-sm text-gray-500">Checking availability...</p>
              )}
              {slugError && (
                <p className="mt-2 text-sm text-red-500">{slugError}</p>
              )}
              {!isCheckingSlug && !slugError && slug && (
                <p className="mt-2 text-sm text-green-500">This URL is available!</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                This will be your public profile URL
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-[#19191b] font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-[#19191b] font-medium mb-2"
              >
                Password
              </label>
              <input
                id="new-password"
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              formAction={signUpAction}
              className={`w-full bg-[#8d65e3] text-white py-3 font-medium brutal-shadow-all rounded-lg border-2 border-[#19191b]`}
            >
              Create account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?
              <Link
                href="/auth/sign-in"
                className="ml-2 text-[#8d65e3] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600">
          By signing up, you agree to our{" "}
          <Link href="#" className="text-[#8d65e3] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#8d65e3] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
} 