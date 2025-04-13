import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createInfluencerProfile } from '@/utils/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, slug } = body;

    // Validate required fields
    if (!email || !password || !name || !slug) {
      return NextResponse.json(
        { error: 'Email, password, name, and slug are required' },
        { status: 400 }
      );
    }

    // Create server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
          }
        }
      }
    );

    // Sign up user with Supabase
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name,
          slug: slug
        },
      },
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      );
    }

    try {
      // Generate handle from name
      const handle = name.toLowerCase().replace(/\s+/g, '_');
      
      // Create influencer profile
      const influencer = await createInfluencerProfile(user.id, {
        name: name,
        slug: slug,
        handle: handle,
        profile_image: ''
      });

      return NextResponse.json({
        message: 'Registration successful! Please check your email to confirm your account.',
        user: {
          id: user.id,
          email: user.email
        },
        influencer
      });
    } catch (error: any) {
      console.error('Error creating influencer profile:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create influencer profile' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 