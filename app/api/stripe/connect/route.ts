import { NextRequest, NextResponse } from 'next/server';
import { handleApiAuth } from '@/utils/server-utils';
import { getInfluencerByUserId, updateInfluencerProfile } from '@/utils/db';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: NextRequest) {
  return handleApiAuth(request, async (userId) => {
    try {
        const supabase = await createClient()
    
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const influencer = await getInfluencerByUserId(userId);

        if (!influencer) {
            return NextResponse.json(
            { error: 'Influencer profile not found' },
            { status: 404 }
            );
        }

        // If they already have a Stripe account, create a new account link
        if (influencer.stripe_account_id) {
            const accountLink = await stripe.accountLinks.create({
            account: influencer.stripe_account_id,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/account/payments?stripe_refresh=true`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/account/payments?stripe_success=true`,
            type: 'account_onboarding',
            });

            return NextResponse.json({ url: accountLink.url });
        }

        // Create a new Stripe Connect account
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'PL',
            email: user?.email, 
            capabilities: {
              card_payments: { requested: true },
              transfers: { requested: true },
            },
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

        const updatedInfluencer = {...influencer};
        // Just update the stripe_account_id field
        updatedInfluencer.stripe_account_id = account.id;

        // Update the influencer profile with the Stripe account ID
        await updateInfluencerProfile(userId, updatedInfluencer);

        // Create an account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/account/payments?stripe_refresh=true`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/account/payments?stripe_success=true`,
            type: 'account_onboarding',
        });

        return NextResponse.json({ url: accountLink.url });
    } catch (error: any) {
        console.error('Stripe Connect error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred while connecting to Stripe' },
            { status: 500 }
        );
    }
  });
} 