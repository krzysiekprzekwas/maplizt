import Link from "next/link"
import { getInfluencers } from "@/lib/data"

export default function HomePage() {
  const influencers = getInfluencers()

  return (
    <div className="min-h-screen bg-[#f8f5ed] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-[#19191b] mb-8">Choose an Influencer</h1>

      <div className="space-y-4 w-full max-w-md">
        {influencers.map((influencer) => (
          <Link
            key={influencer.slug}
            href={`/${influencer.slug}`}
            className="block bg-white rounded-lg border-4 border-[#19191b] p-6 text-center hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-2xl font-bold text-[#19191b]">{influencer.name}</h2>
            <p className="text-[#19191b]">{influencer.handle}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

