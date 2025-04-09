import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }
    
    // Check if the slug is already taken by any influencer
    const { data: existingInfluencer, error: influencerError } = await supabase
      .from('influencers')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    
    if (influencerError) {
      console.error('Error checking influencer slug:', influencerError);
      return NextResponse.json(
        { error: 'Failed to check slug availability' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      available: !existingInfluencer,
      error: existingInfluencer ? 'This URL is already taken. Please choose another one.' : null
    });
  } catch (error) {
    console.error('Error checking influencer slug:', error);
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    );
  }
} 