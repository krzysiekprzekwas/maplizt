import { NextRequest, NextResponse } from 'next/server';

import { handleApiAuth, checkRecommendationSlugAvailability } from '@/utils/server-utils';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
export async function POST(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const body = await request.json();
      
      // Validate required fields
      if (!body.title || !body.slug || !body.description || !body.type) {
        return NextResponse.json(
          { error: 'Title, slug, description, and type are required' },
          { status: 400 }
        );
      }
      
      // Validate Google Maps link
      if (!body.googleMapsLink) {
        return NextResponse.json(
          { error: 'Google Maps link is required' },
          { status: 400 }
        );
      }
      
      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(body.slug)) {
        return NextResponse.json(
          { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
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
          { error: 'Failed to create recommendation' },
          { status: 500 }
        );
      }
      
      if (!influencer) {
        return NextResponse.json(
          { error: 'Influencer profile not found. Please create an influencer profile first.' },
          { status: 404 }
        );
      }
      
      // Check slug availability using the utility function
      const { available, error: slugError } = await checkRecommendationSlugAvailability(
        supabase,
        influencer.id,
        body.slug
      );
      
      if (!available) {
        return NextResponse.json(
          { error: slugError || 'A recommendation with this slug already exists' },
          { status: 409 }
        );
      }
      
      // Validate type
      const validTypes = ['Free', 'Paid', 'Premium'];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: Free, Paid, Premium' },
          { status: 400 }
        );
      }
      
      // Validate price based on type
      if (body.type === 'Free' && body.numeric_price !== 0) {
        return NextResponse.json(
          { error: 'Free recommendations must have a price of 0' },
          { status: 400 }
        );
      }
      
      if (body.type === 'Paid' && body.numeric_price < 1) {
        return NextResponse.json(
          { error: 'Paid recommendations must have a price of at least 1 PLN' },
          { status: 400 }
        );
      }
      
      if (body.type === 'Premium' && body.numeric_price < 7) {
        return NextResponse.json(
          { error: 'Premium recommendations must have a price of at least 7 PLN' },
          { status: 400 }
        );
      }
      
      // Create the recommendation
      const { data: recommendation, error: createError } = await supabase
        .from('recommendations')
        .insert({
          influencer_id: influencer.id,
          slug: body.slug,
          title: body.title,
          description: body.description,
          type: body.type,
          numeric_price: body.numeric_price,
          images: body.images,
          googleMapsLink: body.googleMapsLink
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating recommendation:', createError);
        return NextResponse.json(
          { error: 'Failed to create recommendation' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        recommendation 
      });
    } catch (error) {
      console.error('Error creating recommendation:', error);
      return NextResponse.json(
        { error: 'Failed to create recommendation' },
        { status: 500 }
      );
    }
  });
} 