'use server'

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

interface HeaderProps {
  hideNav?: boolean;
}

export default async function Header({ hideNav = false }: HeaderProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b-2 border-[#19191b] bg-[#ffffff]">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Image src="/maplizt-logo-full.svg" alt="Maplizt Logo" width={158} height={80} className="px-4 py-2 rounded-lg border-2 border-[#19191b] brutal-shadow-all" />
        </Link>

        {!user && !hideNav && (
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
        )}

        <div className="relative">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Link 
                  href="/dashboard/account">
                  <button
                    className="flex brutal-shadow-all items-center justify-center h-10 w-10 rounded-full bg-[#8d65e3]/10 border-2 border-[#19191b] overflow-hidden"
                  >
                    {user?.user_metadata.avatar_url ? (
                      <Image
                        src={user?.user_metadata.avatar_url}
                        alt="User avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[#8d65e3] font-bold">
                        {user?.email?.[0].toUpperCase() || "U"}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            !hideNav && (
              <div className="flex gap-4">
                <Link
                  href="/auth/sign-in"
                  className="inline-block bg-[#f8f5ed] px-4 py-2 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition brutal-shadow-all"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="inline-block bg-[#8d65e3] text-white px-4 py-2 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition brutal-shadow-all"
                >
                  Get Started
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
} 