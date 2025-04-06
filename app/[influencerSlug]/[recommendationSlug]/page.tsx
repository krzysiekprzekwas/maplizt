import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import InfluencerHeader from "@/components/influencer-header"
import { getRecommendationTypeStyle } from "@/lib/utils"
import { getRecommendation } from "@/lib/db"

type Props = {
  params: Promise<{
    influencerSlug: string
    recommendationSlug: string
  }>
}

export default async function RecommendationPage({ params }: Props) {
  const { influencerSlug, recommendationSlug } = await params
  const recommendation = await getRecommendation(influencerSlug, recommendationSlug)

  if (!recommendation) {
    notFound()
  }

  const typeStyle = getRecommendationTypeStyle(recommendation.type);

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={recommendation.influencers} />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-40">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold  leading-tight">
            {recommendation.title}
          </h1>
          <div className={`text-base font-semibold px-6 py-2 rounded-full ${typeStyle}`}>
            {recommendation.type} {recommendation.numeric_price} zł
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold  mb-2">What you get:</h2>
          <p className="">{recommendation.description}</p>
        </div>

        <div className="rounded-lg overflow-hidden border-4 border-[#19191b] mb-8 neobrutalist-shadow">
          <Image
            src={recommendation.image_url || "/placeholder.svg"}
            alt={recommendation.title}
            width={700}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold  mb-2">Description:</h2>
          <div className="space-y-4 ">
            {recommendation.description}
          </div>
        </div>

        {/* Fixed bottom CTA bar */}
<div className="fixed bottom-0 left-0 right-0 w-full px-4 py-4">
  <div className="max-w-2xl mx-auto flex gap-4">
    <Link href={`/${recommendation.influencers.slug}`}>
      <button className="bg-white font-bold text-base py-2 px-4 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
        Back
      </button>
    </Link>
    <Link href={`/${recommendation.influencers.slug}/${recommendation.slug}/checkout`} className="flex-1">
      <button
        className={`w-full font-bold text-base py-2 rounded-lg border-2 border-[#19191b] neobrutalist-shadow ${typeStyle}`}
      >
        Get me
      </button>
    </Link>
  </div>
</div>

      </div>
    </div>
  )
}

