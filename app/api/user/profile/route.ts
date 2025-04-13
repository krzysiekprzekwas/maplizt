import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/utils/server-utils';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const body = await request.json();
      const { fullName } = body;

      if (!fullName?.trim()) {
        return NextResponse.json(
          { error: 'Full name is required' },
          { status: 400 }
        );
      }

      // Create server-side Supabase client
      const supabase = await createClient();

      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: 'Profile updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update profile' },
        { status: 500 }
      );
    }
  });
} 