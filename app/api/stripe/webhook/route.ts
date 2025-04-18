import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getInfluencerById, getRecommendationById, updateInfluencerProfile, updateOrder } from '@/utils/db';
import { Resend } from 'resend';
import path from 'path';
import fs from 'fs';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'account.updated':
        const account = event.data.object as Stripe.Account;
        if (!account.metadata?.user_id) {
          console.error('No user_id found in account metadata');
          return NextResponse.json(
            { error: 'No user_id found in account metadata' },
            { status: 400 }
          );
        }

        const updatedStatus = {
          stripe_account_id: account.id,
          stripe_onboarding_complete: account.details_submitted,
          stripe_charges_enabled: account.charges_enabled,
          stripe_payouts_enabled: account.payouts_enabled,
          stripe_last_checked: new Date().toISOString(),
        };

        await updateInfluencerProfile(account.metadata.user_id, updatedStatus);
        break;
      case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session;
          const recommendationId = session.metadata?.recommendation_id;
          const orderId = session.metadata?.order_id;
          const customerEmail = session.customer_email;

          if (orderId && recommendationId && customerEmail)
          {
            const orderData = {
              status: 'completed'
            };
            
            await updateOrder(orderId, orderData);

            const recommendation = await getRecommendationById(recommendationId);

            const influencer = await getInfluencerById(recommendation.influencer_id);

            // Read the email template
            const templatePath = path.join(process.cwd(), 'email-templates', 'order-confirmation.html');
            let emailHtml = fs.readFileSync(templatePath, 'utf8');
            
            // Get the first image from the recommendation or use a default
            const recommendationImage = recommendation.images && recommendation.images.length > 0 
              ? recommendation.images[0] 
              : 'https://maplizt.com/default-recommendation.jpg';
            
            // Format the date
            const orderDate = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            emailHtml = emailHtml
            .replace(/{{name}}/g, 'there')
            .replace(/{{email}}/g, customerEmail)
            .replace(/{{recommendationTitle}}/g, recommendation.title)
            .replace(/{{recommendationImage}}/g, recommendationImage)
            .replace(/{{recommendationDescription}}/g, recommendation.description)
            .replace(/{{googleMapsLink}}/g, recommendation.googleMapsLink)
            .replace(/{{orderId}}/g, orderId)
            .replace(/{{orderDate}}/g, orderDate)
            .replace(/{{orderAmount}}/g, recommendation.numeric_price.toString())
            .replace(/{{creatorName}}/g, influencer ? influencer.name : 'Maplizt Creator');

            await resend.emails.send({
              from: 'order@maplizt.kristof.pro',
              to: customerEmail,
              subject: `Your Maplizt Purchase: ${recommendation.title}`,
              html: emailHtml
            });
          }
          else{
            throw new Error('Data missing in webhook call');
          }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 