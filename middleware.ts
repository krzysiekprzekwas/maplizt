import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from './lib/supabase-server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create supabase client using the new ssr package
  const supabase = createMiddlewareSupabaseClient(req, res);
  
  // This refreshes the user's session and retrieves fresh session data
  await supabase.auth.getSession();
  
  // Add security headers
  // Content-Security-Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.amazonaws.com https://*.googleusercontent.com;
    font-src 'self';
    connect-src 'self' https://*.supabase.co;
    frame-ancestors 'none';
    base-uri 'self';
  `.replace(/\s{2,}/g, ' ').trim();
  
  // Set security headers
  res.headers.set('Content-Security-Policy', cspHeader);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  
  return res;
}

// Only run middleware on specific routes where auth is needed
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 