import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/utils/server-utils';
import { getInfluencerByUserId, updateInfluencerProfile } from '@/utils/db';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
      // Get the influencer profile
      const influencer = await getInfluencerByUserId(userId);
      
      if (!influencer) {
        return NextResponse.json(
          { error: 'Influencer profile not found' },
          { status: 404 }
        );
      }

      // Get the request URL and extract the origin
      const requestUrl = new URL(request.url);
      const origin = requestUrl.origin;

      // If they already have a Stripe account, create a new account link
      if (influencer.stripe_account_id) {
        const accountLink = await stripe.accountLinks.create({
          account: influencer.stripe_account_id,
          refresh_url: `${origin}/dashboard/account?stripe_refresh=true`,
          return_url: `${origin}/dashboard/account?stripe_success=true`,
          type: 'account_onboarding',
        });

        return NextResponse.json({ url: accountLink.url });
      }

      // Create a new Stripe Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'PL', // Change this based on your target market
        email: request.headers.get('user-email') || '', // Get email from headers
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          user_id: userId,
        },
        settings: {
          payouts: {
            schedule: {
              interval: 'manual',
            },
          },
        },
      });

      // Update the influencer profile with the Stripe account ID
      await updateInfluencerProfile(userId, {
        name: influencer.name,
        slug: influencer.slug,
        handle: influencer.handle,
        profile_image: influencer.profile_image,
        stripe_account_id: account.id,
      });

      // Create an account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?stripe_refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?stripe_success=true`,
        type: 'account_onboarding',
      });

      return NextResponse.json({ url: accountLink.url });
    } catch (error: any) {
      console.error('Stripe Connect error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create Stripe Connect account' },
        { status: 500 }
      );
    }
  });
} 