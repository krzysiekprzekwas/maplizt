import Image from "next/image"
import Link from "next/link"
import type { Influencer, Recommendation } from "@/lib/data"
import { notFound } from "next/navigation"
import InfluencerHeader from "@/components/influencer-header"

type Props = {
  params: Promise<{
    influencerSlug: string
    recommendationSlug: string
  }>
}

async function getRecommendation(influencerSlug: string, recommendationSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/influencers/${influencerSlug}/recommendations/${recommendationSlug}`,
    {
      cache: 'no-store'
    }
  );
  
  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch recommendation');
  }
  
  return await res.json() as { influencer: Influencer; recommendation: Recommendation };
}

export default async function RecommendationPage({ params }: Props) {
  const { influencerSlug, recommendationSlug } = await params
  const data = await getRecommendation(influencerSlug, recommendationSlug)

  if (!data) {
    notFound()
  }

  const { influencer, recommendation } = data

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={influencer} />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-40">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold  leading-tight">
            {recommendation.title}
          </h1>
          <div className={`${recommendation.color} text-base font-semibold px-6 py-2 rounded-full`}>
            {recommendation.price}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#19191b] mb-2">What you get:</h2>
          <p className="text-[#19191b]">{recommendation.whatYouGet}</p>
        </div>

        <div className="rounded-lg overflow-hidden border-4 border-[#19191b] mb-8 neobrutalist-shadow">
          <Image
            src={recommendation.image || "/placeholder.svg"}
            alt={recommendation.title}
            width={700}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#19191b] mb-2">Description:</h2>
          <div className="space-y-4 text-[#19191b]">
            {recommendation.description.split(". ").map((paragraph, index) => (
              <p key={index}>{paragraph}.</p>
            ))}
          </div>
        </div>

        {/* Fixed bottom CTA bar */}
<div className="fixed bottom-0 left-0 right-0 w-full px-4 py-4">
  <div className="max-w-2xl mx-auto flex gap-4">
    <Link href={`/${influencer.slug}`}>
      <button className="bg-white font-bold text-base py-2 px-4 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
        Back
      </button>
    </Link>
    <Link href={`/${influencer.slug}/${recommendation.slug}/checkout`} className="flex-1">
      <button
        className={`w-full ${recommendation.color} font-bold text-base py-2 rounded-lg border-2 border-[#19191b] neobrutalist-shadow`}
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

