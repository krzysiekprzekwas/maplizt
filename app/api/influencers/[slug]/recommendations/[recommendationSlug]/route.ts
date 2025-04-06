import { getRecommendation } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; recommendationSlug: string }> }
) {
  try {
    const { slug, recommendationSlug } = await params;
    const recommendation = getRecommendation(slug, recommendationSlug);
    
    if (!recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendation' },
      { status: 500 }
    );
  }
} 