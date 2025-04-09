"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/header";

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        // Login with Supabase
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        
        setSuccessMessage("Logged in successfully!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // Sign up with Supabase
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: name,
              slug: slug
            },
          },
        });
        
        if (signUpError) throw signUpError;

        if (user) {
          try {
            // Generate handle from name
            const handle = name.toLowerCase().replace(/\s+/g, '_');
            
            // Create influencer profile immediately
            const response = await fetch('/api/influencer/me', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: name,
                slug: slug,
                handle: handle,
                profile_image: ''
              })
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to create influencer profile');
            }
          } catch (error: any) {
            console.error('Error creating influencer profile:', error);
            setError(error.message || 'Failed to create influencer profile');
            return;
          }
        }
        
        setSuccessMessage("Registration successful! Please check your email to confirm your account.");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error(`${provider} auth error:`, err);
      setError(err.message || `Error signing in with ${provider}`);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <Header hideNav={true} />

      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-all">
          <div className="flex mb-8 border-b-2 border-[#19191b]">
            <button
              className={`w-1/2 pb-4 text-lg font-medium text-center ${
                isLogin
                  ? "text-[#19191b] border-b-4 border-[#8d65e3]"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`w-1/2 pb-4 text-lg font-medium text-center ${
                !isLogin
                  ? "text-[#19191b] border-b-4 border-[#8d65e3]"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    placeholder="Your full name"
                    required={!isLogin}
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
                    <span className="text-gray-500 mr-2">maplizt.com/</span>
                    <input
                      id="slug"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                      placeholder="your-profile-url"
                      required={!isLogin}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This will be your public profile URL
                  </p>
                </div>
              </>
            )}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-[#8d65e3] text-white py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isLogin
                ? "Sign in"
                : "Create account"}
            </button>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link
                  href="#"
                  className="text-[#8d65e3] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#8d65e3] hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="py-3 px-4 border-2 border-[#19191b] rounded-lg flex justify-center items-center gap-2 bg-white hover:bg-gray-50 transition opacity-50 cursor-not-allowed"
                disabled
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_2)">
                    <path
                      d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50237 16.0779 5.21346 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27918 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21214 5.59183 7.50235 3.85336 10.1993 3.85336Z"
                      fill="#EB4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_2">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                className="py-3 px-4 border-2 border-[#19191b] rounded-lg flex justify-center items-center gap-2 bg-white hover:bg-gray-50 transition opacity-50 cursor-not-allowed"
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                  <path d="M10 2c1 .5 2 2 2 5" />
                </svg>
                <span>Apple</span>
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Social login options are currently unavailable
            </div>
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