import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Order, Recommendation, Influencer } from "@/types/database"
import InfluencerHeader from "@/components/influencer-header"

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
 <div className="min-h-screen bg-[#f8f5ed]">
      <InfluencerHeader influencer={recommendation.influencers}/>

      <div className="max-w-2xl mx-auto px-4 py-6 z-2">
        <div className="max-w-lg mx-auto text-center py-12">
          <h1 className="text-5xl font-bold  mb-8">Amazing!</h1>
          <p className="text-lg mb-2">
            Link has been sent to your {orderData.email} email! Yet if you're very keen on checking that out you can use the link below. 
            Alternatively you can go back and see what other recommendations await you!
          </p>
          <p className="text-lg mb-4">Thank you for your purchase</p>

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

          <div className="space-y-4">
            <Link href="https://maps.google.com" target="_blank" className="block">
              <button
                className={`w-full font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow`}
              >
                Open in Google Maps
              </button>
            </Link>

            <Link href={`/${recommendation.influencers.slug}`} className="block">
              <button className="w-full bg-white  font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] neobrutalist-shadow">
                See other
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-40 h-40 opacity-80 z-1">
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-0 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
      </div>
    </div>
  );
} 