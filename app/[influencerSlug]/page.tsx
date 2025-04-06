import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getInfluencer } from "@/lib/data"
import { notFound } from "next/navigation"
import InfluencerHeader from "@/components/influencer-header"
import BrutalShadow from "@/components/brutal-shadow"

export default function InfluencerPage({ params }: { params: { influencerSlug: string } }) {
  const influencer = getInfluencer(params.influencerSlug)

  if (!influencer) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#f8f5ed] pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-16">

        <InfluencerHeader influencer={influencer} />


        <div className="border-t-2 border-[#19191b] pt-8">

          <div className="space-y-6">
            {influencer.recommendations.map((recommendation) => (
              <Link key={recommendation.slug} href={`/${influencer.slug}/${recommendation.slug}`} className="block">
                <BrutalShadow>
                  <div className="bg-white rounded-lg border-4 border-[#19191b] p-6 flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-[#19191b] mb-2">{recommendation.title}</h4>
                      <p className="text-[#19191b] pr-4">{recommendation.description.substring(0, 100)}...</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`${recommendation.color} text-[#19191b] font-semibold px-6 py-2 rounded-full`}>
                        {recommendation.price}
                      </div>
                      <ArrowRight className="text-[#19191b] w-6 h-6" />
                    </div>
                  </div>
                </BrutalShadow>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative triangles */}
      <div className="fixed bottom-0 right-0 w-32 h-32 opacity-50">
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#ffdc9a]"></div>
        <div className="absolute bottom-16 right-0 w-16 h-16 bg-[#ffdc9a]"></div>
        <div className="absolute bottom-0 right-16 w-16 h-16 bg-[#ffdc9a]"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 bg-[#ffdc9a]"></div>
      </div>
    </div>
  )
}

