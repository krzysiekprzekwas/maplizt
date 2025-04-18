import Link from "next/link"
import { notFound } from "next/navigation"
import InfluencerHeader from "@/components/influencer-header"
import { getOrderDetails } from "@/utils/db"

type Props = {
  params: Promise<{
    orderId: string
  }>
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
    <div className="min-h-screen bg-[#f8f5ed] relative">
      <InfluencerHeader influencer={recommendation.influencers}/>

      <div className="max-w-2xl mx-auto px-4 py-6 relative z-20">
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
            <Link href={recommendation.googleMapsLink} target="_blank" className="block">
              <button
                className={`w-full font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] bg-[#c5bdf7] brutal-shadow-all`}
              >
                Open in Google Maps
              </button>
            </Link>

            <Link href={`/${recommendation.influencers.slug}`} className="block">
              <button className="w-full bg-white  font-bold text-xl py-4 rounded-lg border-4 border-[#19191b] brutal-shadow-all">
                See other
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="fixed bottom-6 right-4 w-40 h-40 opacity-80 z-10">
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-0 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-0 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-[#e47a5e] rounded-full"></div>
      </div>
    </div>
  );
} 