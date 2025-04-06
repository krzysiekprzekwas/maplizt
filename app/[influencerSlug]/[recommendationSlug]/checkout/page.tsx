"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, CreditCard, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import InfluencerHeader from "@/components/influencer-header"
import { Influencer, Recommendation } from "@/types/database"
import { getRecommendationTypeStyle } from "@/lib/utils"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const influencerSlug = params.influencerSlug as string
  const recommendationSlug = params.recommendationSlug as string

  const [data, setData] = useState<{ influencer: Influencer; recommendation: Recommendation } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    card_number: '',
    card_expiry: '',
    card_cvc: ''
  })

  // Calculate isFree from data instead of using a separate state
  const isFree = data?.recommendation?.numeric_price === 0

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
  const typeStyle = getRecommendationTypeStyle(isFree ? 'free' : 'paid');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        recommendation_id: recommendation.id,
        email: formData.email,
        price: recommendation.numeric_price,
        ...(isFree ? {} : {
          card_number: formData.card_number,
          card_expiry: formData.card_expiry,
          card_cvc: formData.card_cvc
        })
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to process order');
      }

      // Redirect to confirmation page
      router.push(result.redirect_url);
    } catch (error) {
      console.error('Error submitting order:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setSubmitting(false);
    }
  };

  // Use optional chaining for recommendation properties to prevent undefined errors
  const imageUrl = recommendation?.image_url || "/placeholder.svg";
  const recommendationTitle = recommendation?.title || "";
  const price = recommendation?.numeric_price || 0;

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={influencer} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <div className="w-[100px] h-[100px] rounded-lg overflow-hidden border-4 border-[#19191b]">
            <Image
              src={imageUrl}
              alt={recommendationTitle}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold ">{recommendationTitle}</h1>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="">Qty: 1</p>
                <p className=" font-bold">{isFree ? "Free" : `Total: $${price}`}</p>
              </div>
              <div className={`text-base font-semibold px-4 py-1 rounded-full ${typeStyle}`}>
                {isFree ? "Free" : `$${price}`}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold  mb-4">Checkout:</h2>
          <p className=" mb-6">
            {isFree
              ? "Please enter your email to receive this free recommendation."
              : "Please enter your payment details to purchase this recommendation."}
          </p>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
              <Mail className="w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="flex-1 bg-transparent outline-none"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {!isFree && (
              <>
                <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                  <input
                    type="text"
                    name="card_number"
                    placeholder="Card number"
                    className="flex-1 bg-transparent outline-none"
                    value={formData.card_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
                    <input
                      type="text"
                      name="card_expiry"
                      placeholder="MM/YY"
                      className="flex-1 bg-transparent outline-none"
                      value={formData.card_expiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
                    <input
                      type="text"
                      name="card_cvc"
                      placeholder="CVC"
                      className="flex-1 bg-transparent outline-none"
                      value={formData.card_cvc}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full font-bold text-base py-3 rounded-lg border-2 border-[#19191b] neobrutalist-shadow ${typeStyle} ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Processing...' : (isFree ? "Get it for free" : "Pay now")}
          </button>
        </form>
      </div>
    </div>
  )
}

