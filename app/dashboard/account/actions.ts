"use server";

import { updateInfluencerProfile } from "@/utils/db";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

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

        const response = await fetch('/api/stripe/connect', {
         method: 'POST',
         headers: {
          'user-email': user?.email || '',
            },
        });
      
        if (!response.ok) {
          throw new Error('Failed to create Stripe Connect account');
        }

        const { url } = await response.json();
        window.location.href = url;
    } catch (error: any) {
      console.error('Stripe Connect error:', error);
    } finally {

    }
  };

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();
  
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
  
    if (!password || !confirmPassword) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Password and confirm password are required",
      );
    }
  
    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Passwords do not match",
      );
    }
  
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
  
    if (error) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Password update failed",
      );
    }
  
    encodedRedirect("success", "/protected/reset-password", "Password updated");
  };