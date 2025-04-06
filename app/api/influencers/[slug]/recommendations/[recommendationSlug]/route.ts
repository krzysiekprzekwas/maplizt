import { getInfluencer } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; recommendationSlug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug, recommendationSlug } = resolvedParams;
    
    // Get the influencer first
    const influencerData = await getInfluencer(slug);
    
    if (!influencerData) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }
    
    // Find the recommendation from the influencer's recommendations array
    const recommendation = influencerData.recommendations.find(
      (rec) => rec.slug === recommendationSlug
    );
    
    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }
    
    // Return both influencer and recommendation
    return NextResponse.json({
      influencer: {
        id: influencerData.id,
        slug: influencerData.slug,
        name: influencerData.name,
        handle: influencerData.handle,
        profile_image: influencerData.profile_image
      },
      recommendation
    });
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendation' },
      { status: 500 }
    );
  }
} 