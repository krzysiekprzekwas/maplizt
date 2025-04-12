import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/lib/server-utils';
import { createServerClient } from '@supabase/ssr';

export async function PUT(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const body = await request.json();
      const { password } = body;

      if (!password?.trim()) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        );
      }

      // Create server-side Supabase client
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              // Not needed for this context
            },
            remove(name: string, options: any) {
              // Not needed for this context
            },
          },
        }
      );

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: 'Password updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update password' },
        { status: 500 }
      );
    }
  });
} 