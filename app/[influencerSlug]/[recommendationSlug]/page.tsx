import Image from "next/image"
import Link from "next/link"
import { getRecommendation } from "@/lib/data"
import { notFound } from "next/navigation"
import InfluencerHeader from "@/components/influencer-header"

export default async function RecommendationPage({
  params,
}: {
  params: {
    influencerSlug: string
    recommendationSlug: string
  }
}) {
  const { influencerSlug, recommendationSlug } = await params
  const data = getRecommendation(influencerSlug, recommendationSlug)

  if (!data) {
    notFound()
  }

  const { influencer, recommendation } = data

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={influencer} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-[#19191b] leading-tight">
            {recommendation.title.split(" ").slice(0, 2).join(" ")}
            <br />
            {recommendation.title.split(" ").slice(2).join(" ")}
          </h1>
          <div className={`${recommendation.color} text-[#19191b] font-semibold px-6 py-2 rounded-full`}>
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

        <div className="flex gap-4">
          <Link href={`/${influencer.slug}`}>
            <button className="bg-white text-[#19191b] font-bold py-4 px-6 rounded-lg border-4 border-[#19191b] neobrutalist-shadow">
              Back
            </button>
          </Link>
          <Link href={`/${influencer.slug}/${recommendation.slug}/checkout`} className="flex-1">
            <button
              className={`w-full ${recommendation.color} text-[#19191b] font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow`}
            >
              Get me
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

