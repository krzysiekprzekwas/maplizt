import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/utils/server-utils';
import { getInfluencerByUserId, updateInfluencerProfile, createInfluencerProfile } from '@/utils/db';
import { Stripe } from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export async function GET(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      const influencer = await getInfluencerByUserId(userId);

      if (!influencer) {
        return NextResponse.json(
          { error: 'Influencer profile not found' },
          { status: 404 }
        );
      }

      let stripeDashboardLink: string | null = null;
      if (influencer.stripe_account_id) {
        const loginLink = await stripe.accounts.createLoginLink(influencer.stripe_account_id);
        stripeDashboardLink = loginLink.url;
      }

      return NextResponse.json({
        ...influencer,
        stripe_dashboard_link: stripeDashboardLink
      });
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
          profile_image: profile_image
        });
      } else {
        // Create new profile
        updatedProfile = await createInfluencerProfile(userId, {
          name: name.trim(),
          slug: slug.trim(),
          handle: handle.trim(),
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