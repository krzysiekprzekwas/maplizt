"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signInAction } from "../actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                className="rounded-lg border-2 border-[#19191b] brutal-shadow-all" 
              />
            </Link>
          </div>

          <form>
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
              formAction={signInAction}
              className={`w-full bg-[#8d65e3] text-white py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition`}
            >
              Sign in
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-[#8d65e3] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          // Sign up section
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?
              <Link
                href="/auth/signup"
                className="ml-2 text-[#8d65e3] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600">
          By signing in, you agree to our{" "}
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