import Image from "next/image"
import Link from "next/link"
import { Mail, CreditCard, } from "lucide-react"
import InfluencerHeader from "@/components/influencer-header"
import { getRecommendationTypeStyle } from "@/lib/utils"
import { getRecommendation } from "@/lib/db"

type Props = {
  params: Promise<{
    influencerSlug: string
    recommendationSlug: string
  }>
}

export default async function CheckoutPage({ params }: Props) {
  const { influencerSlug, recommendationSlug } = await params
  const recommendation = await getRecommendation(influencerSlug, recommendationSlug)

  if (!recommendation) {
    return null;
  }

  const isFree = recommendation.type === 'Free'
  const typeStyle = getRecommendationTypeStyle(recommendation.type);

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={recommendation.influencers} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <div className="w-[100px] h-[100px] rounded-lg overflow-hidden border-4 border-[#19191b]">
            <Image
              src={recommendation.image_url || "/placeholder.svg"}
              alt={recommendation.title}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold ">{recommendation.title}</h1>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="">Qty: 1</p>
                <p className=" font-bold">{isFree ? "Free" : `Total: ${recommendation.numeric_price} zł`}</p>
              </div>
              <div className={`text-base font-semibold px-4 py-1 rounded-full ${typeStyle}`}>
                {isFree ? "Free" : `${recommendation.numeric_price} zł`}
              </div>
            </div>
          </div>
        </div>

        <form>
          <h2 className="text-2xl font-bold  mb-4">Checkout:</h2>
          <p className=" mb-6">
            {isFree
              ? "Please enter your email to receive this free recommendation."
              : "Please enter your payment details to purchase this recommendation."}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
              <Mail className="w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>

            {!isFree && (
              <>
                <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="flex-1 bg-transparent outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="flex-1 bg-transparent outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 border-2 border-[#19191b] p-3 rounded-lg">
                    <input
                      type="text"
                      placeholder="CVC"
                      className="flex-1 bg-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <Link href={`/${influencerSlug}/${recommendationSlug}/confirmation`}>
            <button
              type="submit"
              className={`w-full font-bold text-base py-3 rounded-lg border-2 border-[#19191b] neobrutalist-shadow ${typeStyle}`}
            >
              {isFree ? "Get it for free" : "Pay now"}
            </button>
          </Link>
        </form>
      </div>
    </div>
  )
}

