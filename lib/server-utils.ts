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