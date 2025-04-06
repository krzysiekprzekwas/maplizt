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
      <div className="fixed bottom-6 right-4 w-40 h-40 opacity-80 z-10 grid grid-cols-2 grid-rows-2 gap-0">
        <div className="w-0 h-0 border-l-[40px] border-t-[40px] border-l-transparent border-t-[#ffdc9a]"></div>
        <div className="w-0 h-0 border-l-40 border-t-40 border-l-transparent border-t-[#ffdc9a]"></div>
        <div className="w-0 h-0 border-l-40 border-t-40 border-l-transparent border-t-[#ffdc9a]"></div>
        <div className="w-0 h-0 border-l-40 border-t-40 border-l-transparent border-t-[#ffdc9a]"></div>
      </div>
    </div>
    </div>
  )
}

