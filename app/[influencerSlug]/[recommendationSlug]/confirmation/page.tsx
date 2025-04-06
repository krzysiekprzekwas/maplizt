import Link from "next/link"
import InfluencerHeader from "@/components/influencer-header"
import { getRecommendation } from "@/lib/db"

type Props = {
  params: Promise<{
    influencerSlug: string
    recommendationSlug: string
  }>
}

export default async function ConfirmationPage({ params }: Props) {
  const { influencerSlug, recommendationSlug } = await params
  const recommendation = await getRecommendation(influencerSlug, recommendationSlug)

  if (!recommendation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={recommendation.influencers}/>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto text-center py-12">
          <h1 className="text-5xl font-bold  mb-8">Amazing!</h1>
          <p className=" text-lg mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed dui a massa laoreet imperdiet. Aenean
            venenatis tortor ut lorem elementum, et dignissim tellus rhoncus. Nullam porttitor et lectus a volutpat.
          </p>

          <div className="space-y-4">
            <Link href="https://maps.google.com" target="_blank" className="block">
              <button
                className={`w-full font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow`}
              >
                Open in Google Maps
              </button>
            </Link>

            <Link href={`/${recommendation.influencers.slug}`} className="block">
              <button className="w-full bg-white  font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow">
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

