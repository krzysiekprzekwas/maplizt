"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import LoadingMarker from "./loading-marker";

export default function Header() {
  const { user, signOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b-2 border-[#19191b] bg-[#ffffff]">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/maplizt-logo.png" alt="Maplizt Logo" width={128} height={64} className=" rounded-lg border-4 border-[#19191b] neobrutalist-shadow"/>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="font-medium hover:text-[#8d65e3] transition"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="font-medium hover:text-[#8d65e3] transition"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="font-medium hover:text-[#8d65e3] transition"
          >
            Pricing
          </Link>
        </nav>

        <div className="relative">
          {isLoading ? (
            <LoadingMarker />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-500">
                  Signed in as 
                  <span className="text-[#19191b] ml-1">
                    {user.email}
                  </span>
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-[#8d65e3]/10 border-2 border-[#19191b] overflow-hidden"
                >
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="User avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[#8d65e3] font-bold">
                      {user.email?.[0].toUpperCase() || "U"}
                    </span>
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border-2 border-[#19191b] shadow-lg overflow-hidden z-10">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f5ed] rounded transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f5ed] rounded transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Account settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/signup"
              className="bg-[#8d65e3] text-white px-4 py-2 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 