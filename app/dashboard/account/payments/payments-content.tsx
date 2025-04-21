"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { FormMessage } from "@/components/form-message";
import Link from "next/link";

interface InfluencerProfile {
  id?: string;
  stripe_account_id?: string;
  stripe_onboarding_complete?: boolean;
  stripe_charges_enabled?: boolean;
  stripe_payouts_enabled?: boolean;
  stripe_last_checked?: string;
  stripe_dashboard_link?: string;
}

export default function PaymentsContent() {
  const [influencer, setInfluencer] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    async function getInfluencer() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        router.push("/sign-in");
        return;
      }
      
      try {
        // Fetch influencer profile from the API
        const response = await fetch("/api/influencers/me");
        if (!response.ok) {
          throw new Error("Failed to fetch influencer profile");
        }
        
        const influencerData = await response.json();
        setInfluencer(influencerData);
      } catch (error) {
        console.error("Error fetching influencer profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    getInfluencer();
    
    // Check for Stripe success parameter
    const stripeSuccess = searchParams.get("stripe_success");
    const stripeRefresh = searchParams.get("stripe_refresh");
    
    if (stripeSuccess === "true") {
      setSuccess("Stripe account connected successfully!");
      
      // Refresh influencer data to get updated Stripe status
      getInfluencer();
      
      // Clear the URL parameters
      const params = new URLSearchParams(searchParams);
      params.delete("stripe_success");
      router.replace(`/dashboard/account/payments?${params.toString()}`);
    } else if (stripeRefresh === "true") {
      // Clear the URL parameters and reload
      const params = new URLSearchParams(searchParams);
      params.delete("stripe_refresh");
      router.replace(`/dashboard/account/payments?${params.toString()}`);
    }
    
    // Get message from URL if any
    const message = searchParams.get("message");
    const messageType = searchParams.get("type");
    
    if (message && messageType) {
      if (messageType === "error") {
        setError(message);
      } else if (messageType === "success") {
        setSuccess(message);
      }
      
      // Clear the URL parameters
      const params = new URLSearchParams(searchParams);
      params.delete("message");
      params.delete("type");
      router.replace(`/dashboard/account/payments?${params.toString()}`);
    }
  }, [router, searchParams]);
  
  const handleConnectStripe = async () => {
    try {
      setConnecting(true);
      
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to connect to Stripe");
      } else {
        // Redirect to Stripe onboarding
        window.location.href = data.url;
      }
    } catch (error) {
      setError("An error occurred while connecting to Stripe");
    } finally {
      setConnecting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return (
    <>
      {error && <FormMessage message={{ error }} />}
      {success && <FormMessage message={{ success }} />}

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
        
        <h3 className="text-lg font-medium mb-2">Stripe Connect Account</h3>
        <p className="text-gray-600 mb-4">
          {influencer?.stripe_account_id 
            ? "Your Stripe account is connected. You can receive payments for your recommendations."
            : "Connect your Stripe account to receive payments for your recommendations."}
        </p>
        
        {!influencer?.stripe_account_id && (
          <button
            onClick={handleConnectStripe}
            disabled={connecting}
            className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition ${connecting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {connecting ? "Connecting..." : "Connect Stripe Account"}
          </button>
        )}

        {influencer?.stripe_account_id && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border-2 ${
                influencer.stripe_onboarding_complete 
                  ? "bg-green-100 border-green-500" 
                  : "bg-red-100 border-red-500"
              }`}>
                <div className="font-medium">Onboarding</div>
                <div className="text-sm mt-1">
                  {influencer.stripe_onboarding_complete 
                    ? "Complete" 
                    : "Incomplete"}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                influencer.stripe_charges_enabled 
                  ? "bg-green-100 border-green-500" 
                  : "bg-red-100 border-red-500"
              }`}>
                <div className="font-medium">Charges</div>
                <div className="text-sm mt-1">
                  {influencer.stripe_charges_enabled 
                    ? "Enabled" 
                    : "Disabled"}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                influencer.stripe_payouts_enabled 
                  ? "bg-green-100 border-green-500" 
                  : "bg-red-100 border-red-500"
              }`}>
                <div className="font-medium">Payouts</div>
                <div className="text-sm mt-1">
                  {influencer.stripe_payouts_enabled 
                    ? "Enabled" 
                    : "Disabled"}
                </div>
              </div>
            </div>
            
            {(!influencer.stripe_onboarding_complete || !influencer.stripe_charges_enabled || !influencer.stripe_payouts_enabled) && (
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg mt-4">
                <p className="text-sm">
                  <strong>Some features of your Stripe account are not fully set up.</strong> This may prevent you from receiving payments.
                  Please complete your Stripe onboarding process to enable all features.
                </p>
                <button
                  onClick={handleConnectStripe}
                  className="mt-2 text-[#8d65e3] font-medium underline"
                >
                  Complete Stripe Setup
                </button>
              </div>
            )}

            {(influencer.stripe_onboarding_complete && influencer.stripe_charges_enabled && influencer.stripe_payouts_enabled) && (
              <div className="p-4 border rounded-lg mt-4">
                <Link href={influencer.stripe_dashboard_link!} passHref>
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-[#19191b] text-white px-8 py-4 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition text-lg"
                  >
                    See Stripe dashboard
                  </a>
                </Link>
              </div>
            )}
            
            {influencer.stripe_last_checked && (
              <p className="text-sm text-gray-500">
                Last updated: {new Date(influencer.stripe_last_checked).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
} 