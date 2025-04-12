import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/auth/actions";

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
          <Image src="/maplizt-logo-full.svg" alt="Maplizt Logo" width={128} height={64} className="rounded-lg border-2 border-[#19191b] brutal-shadow-all" />
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
                <button
                  className="flex brutal-shadow-all items-center justify-center h-10 w-10 rounded-full bg-[#8d65e3]/10 border-2 border-[#19191b] overflow-hidden"
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

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border-2 border-[#19191b] shadow-lg overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium">{user.user_metadata.full_name}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f5ed] rounded transition"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f5ed] rounded transition"
                      >
                        Account settings
                      </Link>
                      <form>
                      <button
                        formAction={signOutAction}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                      >
                        Sign out
                      </button>

                      </form>
                    </div>
                  </div>
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