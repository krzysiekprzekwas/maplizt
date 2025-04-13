import { NextResponse, NextRequest } from 'next/server';
import { createClient } from './supabase/server';

/**
 * Helper function to create a Supabase client for server-side requests
 * This avoids the linter errors with cookies API in different contexts
 */
export async function handleApiAuth(request: NextRequest, handler: (userId: string) => Promise<NextResponse>) {
  // Create Supabase client
  const supabase = await createClient()
  
  try {
    // Get authenticated user data
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    // Call the handler with the user ID
    return await handler(user.id);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

/**
 * Checks if a recommendation slug is available for a specific influencer
 * @param supabase Supabase client
 * @param influencerId The influencer ID to check against
 * @param slug The slug to check
 * @returns Object with availability status and any error
 */
export async function checkRecommendationSlugAvailability(
  supabase: any,
  influencerId: string,
  slug: string
) {
  try {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return {
        available: false,
        error: 'Slug can only contain lowercase letters, numbers, and hyphens'
      };
    }
    
    // Check if the slug is already taken by this influencer
    const { data: existingRecommendation, error: slugCheckError } = await supabase
      .from('recommendations')
      .select('id')
      .eq('influencer_id', influencerId)
      .eq('slug', slug)
      .maybeSingle();
    
    if (slugCheckError) {
      console.error('Error checking slug:', slugCheckError);
      return {
        available: false,
        error: 'Failed to check slug availability'
      };
    }
    
    return {
      available: !existingRecommendation,
      error: existingRecommendation ? 'A recommendation with this slug already exists' : null
    };
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return {
      available: false,
      error: 'Failed to check slug availability'
    };
  }
} 