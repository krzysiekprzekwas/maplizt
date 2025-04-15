"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-hover">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          <div className="flex border-b border-gray-200 mb-6">
            <Link 
              href="/dashboard/account"
              className={`px-4 py-2 mr-4 font-medium text-lg ${
                isActive("/dashboard/account")
                  ? "text-[#8d65e3] border-b-2 border-[#8d65e3]"
                  : "text-gray-600 hover:text-[#8d65e3]"
              }`}
            >
              Profile
            </Link>
            <Link 
              href="/dashboard/account/influencer"
              className={`px-4 py-2 mr-4 font-medium text-lg ${
                isActive("/dashboard/account/influencer")
                  ? "text-[#8d65e3] border-b-2 border-[#8d65e3]"
                  : "text-gray-600 hover:text-[#8d65e3]"
              }`}
            >
              Influencer Profile
            </Link>
            <Link 
              href="/dashboard/account/payments"
              className={`px-4 py-2 mr-4 font-medium text-lg ${
                isActive("/dashboard/account/payments")
                  ? "text-[#8d65e3] border-b-2 border-[#8d65e3]"
                  : "text-gray-600 hover:text-[#8d65e3]"
              }`}
            >
              Payments
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
} 