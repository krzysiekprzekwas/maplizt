import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Order, Recommendation, Influencer } from "@/types/database"

type Props = {
  params: Promise<{
    orderId: string
  }>
}

async function getOrderDetails(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, recommendations(*, influencers(*))')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Order & {
    recommendations: Recommendation & {
      influencers: Influencer
    }
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const orderData = await getOrderDetails(orderId);

  if (!orderData) {
    notFound();
  }

  const { recommendations: recommendation } = orderData;
  const influencer = recommendation.influencers;

  return (
    <div className="min-h-screen bg-[#f8f5ed] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg border-4 border-[#19191b] p-8 neobrutalist-shadow">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span>{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Recommendation:</span>
              <span>{recommendation.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Influencer:</span>
              <span>{influencer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{orderData.email}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-4">
            We've sent a confirmation email to {orderData.email} with your order details.
          </p>
          <Link href="/">
            <button className="bg-[#97b5ec] text-white font-bold py-2 px-4 rounded-lg border-2 border-[#19191b] neobrutalist-shadow">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 