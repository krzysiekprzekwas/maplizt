import { createServerClient } from '@supabase/ssr';
import { NextResponse, NextRequest } from 'next/server';

/**
 * Helper function to create a Supabase client for server-side requests
 * This avoids the linter errors with cookies API in different contexts
 */
export async function handleApiAuth(request: NextRequest, handler: (userId: string) => Promise<NextResponse>) {
  // Get cookies from request headers
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, value];
    })
  );
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies[name];
        },
        set(name: string, value: string, options: any) {
          // This won't be used in this context
        },
        remove(name: string, options: any) {
          // This won't be used in this context
        }
      }
    }
  );
  
  try {
    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Call the handler with the user ID
    return await handler(session.user.id);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

/**
 * Checks if a slug is available for a specific influencer
 * @param supabase Supabase client
 * @param influencerId The influencer ID to check against
 * @param slug The slug to check
 * @returns Object with availability status and any error
 */
export async function checkSlugAvailability(
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