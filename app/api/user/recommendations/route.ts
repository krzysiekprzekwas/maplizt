import { getInfluencerByUserId } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Create server-side Supabase client to get the authenticated user
    const supabaseServer = createServerComponentClient({ cookies });
    const { data: { session } } = await supabaseServer.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
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
} 