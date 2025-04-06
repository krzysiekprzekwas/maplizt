"use client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { Influencer, Recommendation } from "@/lib/data"
import InfluencerHeader from "@/components/influencer-header"

export default function ConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const influencerSlug = params.influencerSlug as string
  const recommendationSlug = params.recommendationSlug as string

  const [data, setData] = useState<{ influencer: Influencer; recommendation: Recommendation } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get data on the client side to avoid hydration issues
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/influencers/${influencerSlug}/recommendations/${recommendationSlug}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            router.push("/");
            return;
          }
          throw new Error('Failed to fetch recommendation');
        }
        
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [influencerSlug, recommendationSlug, router]);

  if (loading) {
    return <div className="min-h-screen bg-[#f8f5ed] flex items-center justify-center">Loading...</div>
  }

  if (!data) {
    return null;
  }

  const { influencer, recommendation } = data

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={influencer}/>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto text-center py-12">
          <h1 className="text-5xl font-bold text-[#19191b] mb-8">Amazing!</h1>
          <p className="text-[#19191b] text-lg mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed dui a massa laoreet imperdiet. Aenean
            venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Nullam porttitor et lectus a volutpat.
          </p>

          <div className="space-y-4">
            <Link href="https://maps.google.com" target="_blank" className="block">
              <button
                className={`w-full ${recommendation.color} text-[#19191b] font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow`}
              >
                Open in Google Maps
              </button>
            </Link>

            <Link href={`/${influencer.slug}`} className="block">
              <button className="w-full bg-white text-[#19191b] font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow">
                See other
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="fixed bottom-0 right-0 w-40 h-40 opacity-80">
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-0 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
      </div>
    </div>
  )
}

