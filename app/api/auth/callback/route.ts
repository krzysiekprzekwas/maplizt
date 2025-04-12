import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { createInfluencerProfile } from '@/utils/db';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // Get cookies from request headers
    const cookieHeader = req.headers.get('cookie') || '';
    const cookieMap: Record<string, string> = {};
    
    // Parse cookies from header
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      if (name) {
        cookieMap[name.trim()] = rest.join('=').trim();
      }
    });
    
    // Create a response to store cookies
    const res = NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieMap[name];
          },
          set(name: string, value: string, options: any) {
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            res.cookies.set({ name, value: '', ...options });
          }
        }
      }
    );
    
    // Exchange the code for a session
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (user) {
      // Get user metadata
      const { full_name, slug } = user.user_metadata;
      
      if (full_name && slug) {
        try {
          // Generate handle from name (lowercase, replace spaces with underscores)
          const handle = full_name.toLowerCase().replace(/\s+/g, '_');
          
          // Create influencer profile
          await createInfluencerProfile(user.id, {
            name: full_name,
            slug: slug,
            handle: handle,
            profile_image: ''
          });
        } catch (error) {
          console.error('Error creating influencer profile:', error);
          // Continue with redirect even if profile creation fails
          // The user can create their profile later from the dashboard
        }
      }
    }
    
    return res;
  }

  // If no code, redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
} 