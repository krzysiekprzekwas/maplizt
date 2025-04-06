import storeData from "@/data/store-data.json"

export type Recommendation = {
  slug: string
  title: string
  price: string
  numericPrice: number
  color: string
  description: string
  whatYouGet: string
  image: string
}

export type Influencer = {
  slug: string
  name: string
  handle: string
  profileImage: string
  recommendations: Recommendation[]
}

export function getInfluencers(): Influencer[] {
  return storeData.influencers
}

export function getInfluencer(slug: string): Influencer | undefined {
  return storeData.influencers.find((influencer) => influencer.slug === slug)
}

export function getRecommendation(
  influencerSlug: string,
  recommendationSlug: string,
): { influencer: Influencer; recommendation: Recommendation } | undefined {
  const influencer = getInfluencer(influencerSlug)
  if (!influencer) return undefined

  const recommendation = influencer.recommendations.find((rec) => rec.slug === recommendationSlug)
  if (!recommendation) return undefined

  return { influencer, recommendation }
}

