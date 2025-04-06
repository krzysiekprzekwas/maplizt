"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/header";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signup");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#8d65e3] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null; // This shouldn't show because of the redirect

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 shadow-[8px_8px_0px_0px_#19191b] mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.user_metadata.full_name || user.email}!</h1>
          <p className="text-lg mb-6">This is your personal dashboard where you can manage your Maplizt recommendations and monitor your earnings.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#8d65e3]/10 p-6 rounded-lg border-2 border-[#19191b]">
              <h3 className="font-bold mb-2">Your Lists</h3>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-500">Recommendation lists created</p>
            </div>
            
            <div className="bg-[#7db48f]/10 p-6 rounded-lg border-2 border-[#19191b]">
              <h3 className="font-bold mb-2">Earnings</h3>
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-sm text-gray-500">Total earnings to date</p>
            </div>
            
            <div className="bg-[#97b5ec]/10 p-6 rounded-lg border-2 border-[#19191b]">
              <h3 className="font-bold mb-2">Views</h3>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-500">Total views across all lists</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 shadow-[8px_8px_0px_0px_#19191b]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Recommendation Lists</h2>
            <Link
              href="/create-list"
              className="bg-[#19191b] text-white px-4 py-2 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
            >
              Create New List
            </Link>
          </div>
          
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-[#f8f5ed] rounded-full flex items-center justify-center mb-4">
              <Image src="/globe.svg" alt="Empty" width={40} height={40} className="opacity-40" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Lists Yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              You haven&apos;t created any recommendation lists yet. Create your first list to start sharing and monetizing your recommendations.
            </p>
            <Link
              href="/create-list"
              className="bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
            >
              Create Your First List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 