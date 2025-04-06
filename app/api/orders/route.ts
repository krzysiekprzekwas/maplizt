import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { Order } from '@/types/database';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.recommendation_id) {
      return NextResponse.json(
        { error: 'Email and recommendation ID are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if payment details are required (for paid recommendations)
    const isPaidRecommendation = body.price > 0;
    if (isPaidRecommendation) {
      if (!body.card_number || !body.card_expiry || !body.card_cvc) {
        return NextResponse.json(
          { error: 'Payment details are required for paid recommendations' },
          { status: 400 }
        );
      }
      
      // Basic card validation
      if (body.card_number.length < 16) {
        return NextResponse.json(
          { error: 'Invalid card number' },
          { status: 400 }
        );
      }
      
      if (!/^\d{2}\/\d{2}$/.test(body.card_expiry)) {
        return NextResponse.json(
          { error: 'Invalid card expiry date (use MM/YY format)' },
          { status: 400 }
        );
      }
      
      if (!/^\d{3,4}$/.test(body.card_cvc)) {
        return NextResponse.json(
          { error: 'Invalid CVC' },
          { status: 400 }
        );
      }
    }
    
    // Create order
    const orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
      recommendation_id: body.recommendation_id,
      email: body.email,
      card_number: body.card_number,
      card_expiry: body.card_expiry,
      card_cvc: body.card_cvc,
      status: 'completed' // In a real app, this would be set after payment processing
    };
    
    const order = await createOrder(orderData);

    resend.emails.send({
      from: 'order@maplizt.kristof.pro',
      to: body.email,
      subject: `Order confirmed ${order.id}`,
      html: '<p>To the moon we gooo!</p>'
    });
    
    return NextResponse.json({ 
      success: true, 
      order_id: order.id,
      redirect_url: `/orders/${order.id}/confirmation`
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
} 