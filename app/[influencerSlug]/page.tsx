import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import InfluencerHeader from "@/components/influencer-header"
import Head from "next/head"
import { getInfluencer } from "@/lib/db"
import { getRecommendationTypeStyle } from "@/lib/utils"

type Props = {
  params: Promise<{ 
    influencerSlug: string,
  }>
}

export default async function InfluencerPage({ params }: Props) {
  const { influencerSlug } = await params
  const influencer = await getInfluencer(influencerSlug)

  if (!influencer) {
    redirect('/notFound');
  }

  return (
<div>
    <Head>
      <title>Maplizt | {influencer.name}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <InfluencerHeader influencer={influencer} />
    
    <div className="min-h-screen bg-[#f8f5ed] pb-20 relative">
      <div className="max-w-2xl mx-auto px-4 pt-16 relative z-20">

          <div className="space-y-6">
            {influencer.recommendations.map((recommendation) => {
              const typeStyle = getRecommendationTypeStyle(recommendation.type);
              
              return (
                <Link key={recommendation.slug} href={`/${influencer.slug}/${recommendation.slug}`} className="block">
                    <div className="bg-white rounded-lg border-2 border-[#19191b] p-6 flex justify-between items-center neobrutalist-shadow">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2">{recommendation.title}</h4>
                        <p className="text-sm pr-4">{recommendation.description.substring(0, 100)}...</p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <div className={`font-semibold px-6 py-2 rounded-full ${typeStyle}`}>
                          <p className="text-sm">{recommendation.type} {recommendation.numeric_price} zł</p>
                        </div>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                </Link>
              );
            })}
        </div>
      </div>

      {/* Decorative triangles */}
      <div className="fixed bottom-0 right-0 w-32 h-32 opacity-50 z-10">
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#ffdc9a]"></div>
        <div className="absolute bottom-16 right-0 w-16 h-16 bg-[#ffdc9a]"></div>
        <div className="absolute bottom-0 right-16 w-16 h-16 bg-[#ffdc9a]"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 bg-[#ffdc9a]"></div>
      </div>
    </div>
    </div>
  )
}

