import { Order } from "@/types/database";
import { createOrder } from "@/utils/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  const body = await req.json();

  const {
    price,
    recommendation_id,
    influencer_stripe_account_id,
    email
  } = body;

  try {

    // Create order
    const orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
        recommendation_id: body.recommendation_id,
        email: body.email,
        status: 'pending'
        };
        
    var order = await createOrder(orderData);

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'pln',
              unit_amount: price * 100,
              product_data: {
                name: `Recommendation ${recommendation_id}`,
              },
            },
            quantity: 1,
          },
        ],
        customer_email: email,
        metadata: {
          recommendation_id,
          order_id: order.id
        },
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}/confirmation`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}/cancelation`,
      },
      {
        stripeAccount: influencer_stripe_account_id,
      }
    );



    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
