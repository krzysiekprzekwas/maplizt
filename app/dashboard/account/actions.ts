"use server";

import { getInfluencerByUserId, updateInfluencerProfile } from "@/utils/db";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export const handleUpdateProfile = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const supabase = await createClient();

    try {
        const { error } = await supabase.auth.updateUser({
            data: { full_name: name }
          });

      if (error) {
        return encodedRedirect(
            "error",
            "/dashboard/account",
            "Failed to update profile",
      );
      }

    } catch (error: any) {
      console.error("Error updating profile:", error);
    } finally {
        return encodedRedirect(
          "success",
          "/dashboard/account",
          "User profile updated successfully!.",
        );
    }
  };
  
export const handleUploadProfileImage = async (images: string[]) => {
    const supabase = await createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

    try {
        await updateInfluencerProfile(user!.id, {
          profile_image: images[0]
        });
    } catch (error: any) {
        console.error("Error updating profile image:", error);
        return encodedRedirect(
            "error",
            "/dashboard/account",
            "Failed to update influencer profile image");
    } finally {
        return encodedRedirect(
          "success",
          "/dashboard/account",
          "Influencer profile image updated successfully!.",
        );
    }
  };

export const handleUpdateInfluencer = async (formData: FormData) => {
    const name = formData.get("influencerName")?.toString();
    const slug = formData.get("influencerSlug")?.toString();
    const handle = formData.get("influencerHandle")?.toString();
    const supabase = await createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

    try {
        await updateInfluencerProfile(user!.id, {
          name: name!.trim(),
          slug: slug!.trim(),
          handle: handle!.trim(),
        });
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return encodedRedirect(
            "error",
            "/dashboard/account",
            "Failed to update influencer profile");
    } finally {
        return encodedRedirect(
          "success",
          "/dashboard/account",
          "Influencer profile updated successfully!.",
        );
    }
  };

export const handleStripeConnect = async () => {    
    try {
        const supabase = await createClient();

        const {
            data: { user },
          } = await supabase.auth.getUser();

        if(!user)
          return encodedRedirect(
            "error",
            "/dashboard/account",
            "An error occurred while connecting to Stripe"
          );
        
        const influencer = await getInfluencerByUserId(user!.id);

        if(!influencer)
          return encodedRedirect(
            "error",
            "/dashboard/account",
            "An error occurred while connecting to Stripe"
          );

        // If they already have a Stripe account, create a new account link
        if (influencer!.stripe_account_id) {
          const accountLink = await stripe.accountLinks.create({
            account: influencer!.stripe_account_id,
            refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?stripe_refresh=true`,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account?stripe_success=true`,
            type: 'account_onboarding',
          });

          return redirect(accountLink.url);
        }

        // Create a new Stripe Connect account
        const account = await stripe.accounts.create({
          type: 'express',
          country: 'PL', // Change this based on your target market
          email: user?.email || '', 
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: 'individual',
          metadata: {
            user_id: user?.id,
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
        await updateInfluencerProfile(user.id, {
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

        return redirect(accountLink.url);
    } catch (error: any) {
      console.error('Stripe Connect error:', error);
      return encodedRedirect(
        "error",
        "/dashboard/account",
        "An error occurred while connecting to Stripe"
      );
    }
  };

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();
  
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
  
    if (!password || !confirmPassword) {
      encodedRedirect(
        "error",
        "/dashboard/account/reset-password",
        "Password and confirm password are required",
      );
    }
  
    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/dashboard/account/reset-password",
        "Passwords do not match",
      );
    }
  
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
  
    if (error) {
      encodedRedirect(
        "error",
        "/dashboard/account/reset-password",
        "Password update failed",
      );
    }
  
    encodedRedirect("success", "/dashboard", "Password updated");
  };