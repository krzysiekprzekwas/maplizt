import { NextResponse } from 'next/server';
import { getInfluencers } from '@/lib/db';

export async function GET() {
  try {
    const influencers = await getInfluencers();
    return NextResponse.json(influencers);
  } catch (error) {
    console.error('Error fetching influencers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch influencers' },
      { status: 500 }
    );
  }
} 