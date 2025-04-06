"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, CreditCard, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { Influencer, Recommendation } from "@/lib/data"
import InfluencerHeader from "@/components/influencer-header"

export default function CheckoutPage() {
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
  const isFree = recommendation.numericPrice === 0

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/${influencerSlug}/${recommendationSlug}/confirmation`)
  }

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={influencer} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <div className="w-[100px] h-[100px] rounded-lg overflow-hidden border-4 border-[#19191b]">
            <Image
              src={recommendation.image || "/placeholder.svg"}
              alt={recommendation.title}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#19191b]">{recommendation.title}</h1>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-[#19191b]">Qty: 1</p>
                <p className="text-[#19191b] font-bold">{isFree ? "Free" : `Total: $${recommendation.numericPrice}`}</p>
              </div>
              <button className="text-[#e47a5e]">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-[#19191b] mb-4">Checkout:</h2>
          <p className="text-[#19191b] mb-6">
            {isFree
              ? "Please enter your email to receive this free recommendation."
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean venenatis tortor ut lorem elementum, et dignissim."}
          </p>

          {/* Email field - shown for both free and paid */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#19191b] font-medium mb-2">
              Your email:
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b] pr-12 neobrutalist-shadow"
                required
              />
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#19191b]" />
            </div>
          </div>

          {/* Fields only shown for paid recommendations */}
          {!isFree && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-[#19191b] font-medium mb-2">
                    First name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      placeholder="First name"
                      className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-[#19191b] font-medium mb-2">
                    Last name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last name"
                      className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-[#19191b] font-medium mb-2">
                  Your address:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b] pr-12"
                    required
                  />
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#19191b]" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-[#19191b] font-medium mb-2">
                  Card number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="**** **** **** ****"
                    className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b] pr-12"
                    required
                  />
                  <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#19191b]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label htmlFor="expDate" className="block text-[#19191b] font-medium mb-2">
                    Exp. date:
                  </label>
                  <input
                    type="text"
                    id="expDate"
                    placeholder="MM/YY"
                    className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-[#19191b] font-medium mb-2">
                    CVC:
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    placeholder="***"
                    className="w-full p-4 border-4 border-[#19191b] rounded-lg bg-white text-[#19191b]"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Add appropriate spacing for free recommendations */}
          {isFree && <div className="mb-8"></div>}

          <div className="flex gap-4">
            <Link href={`/${influencerSlug}/${recommendationSlug}`}>
              <button
                type="button"
                className="bg-white text-[#19191b] font-bold py-4 px-6 rounded-lg border-4 border-[#19191b] neobrutalist-shadow"
              >
                Back
              </button>
            </Link>
            <button
              type="submit"
              className={`flex-1 ${recommendation.color} text-[#19191b] font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow`}
            >
              {isFree ? "Get for Free" : "Buy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

