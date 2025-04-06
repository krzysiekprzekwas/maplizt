import { NextRequest, NextResponse } from 'next/server';
import { getRecommendation } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; recommendationSlug: string }> }
) {
  try {
    const { slug, recommendationSlug } = await params;
    const data = getRecommendation(slug, recommendationSlug);
    
    if (!data) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendation' },
      { status: 500 }
    );
  }
} 