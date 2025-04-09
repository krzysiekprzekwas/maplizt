"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/header";
import Link from "next/link";
import Image from "next/image";
import { Recommendation } from "@/types/database";
import LoadingMarker from "@/components/loading-marker";

export default function Dashboard() {
  const { user, influencer, isLoading } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signup");
    } else if (user) {
      // Fetch user's recommendations
      fetchUserRecommendations();
    }
  }, [user, isLoading, router]);

  // Function to fetch user's recommendations from the API
  const fetchUserRecommendations = async () => {
    if (!user) return;
    
    setLoadingRecommendations(true);
    try {
      // Use fetch to call our API endpoint
      const response = await fetch('/api/user/recommendations');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (isLoading || loadingRecommendations) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
        <Header />
        <LoadingMarker />
      </div>
    );
  }

  if (!user) return null; // This shouldn't show because of the redirect

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-hover mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.user_metadata.full_name || user.email}!</h1>
          <p className="text-lg mb-6">This is your personal dashboard where you can manage your Maplizt recommendations and monitor your earnings.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-[#19191b] brutal-shadow-all mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Your public page:</span> 
              {influencer ? (
                <a 
                  href={`/${influencer.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#8d65e3] hover:text-[#6d45c3] ml-1"
                >
                  maplizt.com/{influencer.slug}
                </a>
              ) : (
                <span className="text-gray-400 ml-1">Loading...</span>
              )}
            </p>
          </div>
          
          <div className="flex justify-end mb-6">
            <Link
              href="/dashboard/account"
              className="text-[#8d65e3] hover:text-[#6d45c3] font-medium transition"
            >
              Account Settings →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#8d65e3]/10 p-6 rounded-lg border-2 border-[#19191b]">
              <h3 className="font-bold mb-2">Your Lists</h3>
              <p className="text-3xl font-bold">{recommendations.length}</p>
              <p className="text-sm text-gray-500">Recommendation lists created</p>
            </div>
            
            <div className="bg-[#7db48f]/10 p-6 rounded-lg border-2 border-[#19191b]">
              <h3 className="font-bold mb-2">Earnings</h3>
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-sm text-gray-500">Total earnings to date</p>
            </div>
            
            <div className="bg-[#97b5ec]/10 p-6 rounded-lg border-2 border-[#19191b]">
              <h3 className="font-bold mb-2">Views</h3>
              <p className="text-3xl font-bold">
                {recommendations.reduce((total, rec) => total + (rec.view_count || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total views across all lists</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-hover">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Recommendation Lists</h2>
            <Link
              href="/dashboard/recommendation/create"
              className="bg-[#19191b] text-white px-4 py-2 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
            >
              Create New List
            </Link>
          </div>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <Link 
                  key={recommendation.id} 
                  href={`/dashboard/recommendation/edit/${recommendation.slug}`}
                  className="block"
                >
                  <div 
                    className="border-2 border-[#19191b] rounded-lg overflow-hidden shadow-md brutal-shadow-all transition-shadow hover:shadow-lg"
                  >
                    <div className="h-40 bg-gray-200 relative">
                      {recommendation.images && recommendation.images[0] ? (
                        <Image 
                          src={recommendation.images[0]} 
                          alt={recommendation.title} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <Image
                        src="/recommendation_image_placeholder.jpg"
                        alt={recommendation.title}
                        fill
                        className="w-full h-auto object-cover"
                        />
                      )}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                        recommendation.type === 'Premium' 
                          ? 'bg-[#f7bdf6]' 
                          : recommendation.type === 'Paid' 
                            ? 'bg-[#7db48f]' 
                            : 'bg-[#97b5ec]'
                      }`}>
                        {recommendation.type}
                        {recommendation.numeric_price > 0 && ` $${recommendation.numeric_price}`}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{recommendation.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{recommendation.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Created {new Date(recommendation.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-600">
                          {recommendation.view_count || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-[#f8f5ed] rounded-full flex items-center justify-center mb-4">
                <Image src="/maplizt-logo-icon.svg.svg" alt="Empty" width={40} height={40} className="opacity-40" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Lists Yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                You haven&apos;t created any recommendation lists yet. Create your first list to start sharing and monetizing your recommendations.
              </p>
              <Link
                href="/dashboard/recommendation/create"
                className="bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
              >
                Create Your First List
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 