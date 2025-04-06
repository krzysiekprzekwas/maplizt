import Link from "next/link"
import type { Influencer } from "@/lib/data"

async function getInfluencers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/influencers`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch influencers');
  }
  
  const data = await res.json();
  return data.influencers as Influencer[];
}

export default async function HomePage() {
  const influencers = await getInfluencers()

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

