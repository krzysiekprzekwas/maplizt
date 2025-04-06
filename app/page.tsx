import { getInfluencers } from "@/lib/db";
import Link from "next/link"

export default async function HomePage() {
  const influencers = await getInfluencers()

  return (
    <div className="min-h-screen bg-[#f8f5ed] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold  mb-8">Choose an Influencer</h1>

      <div className="space-y-4 w-full max-w-md">
        {influencers.map((influencer) => (
          <Link
            key={influencer.slug}
            href={`/${influencer.slug}`}
            className="block bg-white rounded-lg border-4 border-[#19191b] p-6 text-center hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-bold ">{influencer.name}</h2>
            <p className="">{influencer.handle}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

