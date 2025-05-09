import { getInfluencerByUserId } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/utils/server-utils';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export async function GET(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      // Get the influencer profile associated with this user
      const influencer = await getInfluencerByUserId(userId);
      
      if (!influencer) {
        return NextResponse.json({ recommendations: [] });
      }
      
      // Fetch recommendations for this influencer
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('influencer_id', influencer.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json(
          { error: 'Failed to fetch recommendations' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ recommendations: data || [] });
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }
  });
} 