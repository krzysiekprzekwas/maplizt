'use server'

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  hideNav?: boolean;
}

interface SafeUser {
  email: string | undefined;
  avatar_url: string | undefined;
}

function getSafeUser(user: User | null): SafeUser | null {
  if (!user) return null;
  
  return {
    email: user.email,
    avatar_url: user.user_metadata?.avatar_url
  };
}

export default async function Header({ hideNav = false }: HeaderProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safeUser = getSafeUser(user);

  return (
    <header className="border-b-2 border-[#19191b] bg-[#ffffff]">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
        <Link href={safeUser ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Image src="/maplizt-logo-full.svg" alt="Maplizt Logo" width={128} height={64} className="rounded-lg border-2 border-[#19191b] brutal-shadow-all" />
        </Link>

        {!safeUser && !hideNav && (
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
          {safeUser ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Link 
                  href="/dashboard/account">
                  <button
                    className="flex brutal-shadow-all items-center justify-center h-10 w-10 rounded-full bg-[#8d65e3]/10 border-2 border-[#19191b] overflow-hidden"
                  >
                    {safeUser?.avatar_url ? (
                      <Image
                        src={safeUser?.avatar_url}
                        alt="User avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[#8d65e3] font-bold">
                        {safeUser?.email?.[0].toUpperCase() || "U"}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            !hideNav && (
              <Link
                href="/auth/sign-up"
                className="inline-block bg-[#8d65e3] text-white px-4 py-2 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition brutal-shadow-all"
              >
                Get Started
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
} 