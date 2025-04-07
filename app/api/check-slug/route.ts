import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { handleApiAuth, checkSlugAvailability } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const { searchParams } = new URL(request.url);
      const slug = searchParams.get('slug');
      
      if (!slug) {
        return NextResponse.json(
          { error: 'Slug parameter is required' },
          { status: 400 }
        );
      }
      
      // Get the influencer profile associated with this user
      const { data: influencer, error: influencerError } = await supabase
        .from('influencers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (influencerError) {
        console.error('Error fetching influencer:', influencerError);
        return NextResponse.json(
          { error: 'Failed to check slug availability' },
          { status: 500 }
        );
      }
      
      if (!influencer) {
        return NextResponse.json(
          { error: 'Influencer profile not found' },
          { status: 404 }
        );
      }
      
      // Check slug availability using the utility function
      const { available, error } = await checkSlugAvailability(
        supabase,
        influencer.id,
        slug
      );
      
      if (error) {
        return NextResponse.json(
          { error },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ available });
    } catch (error) {
      console.error('Error checking slug:', error);
      return NextResponse.json(
        { error: 'Failed to check slug availability' },
        { status: 500 }
      );
    }
  });
} 