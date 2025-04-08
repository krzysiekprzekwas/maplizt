import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/lib/server-utils';
import { getInfluencerByUserId, updateInfluencerProfile, createInfluencerProfile } from '@/lib/db';

export async function GET(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const influencer = await getInfluencerByUserId(userId);
      return NextResponse.json(influencer);
    } catch (error) {
      console.error('Error fetching influencer:', error);
      return NextResponse.json(
        { error: 'Failed to fetch influencer profile' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const body = await request.json();
      const { name, slug, handle, description, profile_image } = body;

      // Validate required fields
      if (!name || !slug || !handle) {
        return NextResponse.json(
          { error: 'Name, slug, and handle are required' },
          { status: 400 }
        );
      }

      // Get existing influencer profile
      const existingInfluencer = await getInfluencerByUserId(userId);

      let updatedProfile;
      if (existingInfluencer) {
        // Update existing profile
        updatedProfile = await updateInfluencerProfile(userId, {
          name: name.trim(),
          slug: slug.trim(),
          handle: handle.trim(),
          description: description?.trim(),
          profile_image: profile_image
        });
      } else {
        // Create new profile
        updatedProfile = await createInfluencerProfile(userId, {
          name: name.trim(),
          slug: slug.trim(),
          handle: handle.trim(),
          description: description?.trim() || '',
          profile_image: profile_image || ''
        });
      }

      return NextResponse.json(updatedProfile);
    } catch (error: any) {
      console.error('Error updating influencer profile:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update influencer profile' },
        { status: 500 }
      );
    }
  });
} 