import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { handleStripeConnect, handleUpdateInfluencer, handleUpdateProfile } from "./actions";
import { signOutAction } from "@/app/auth/actions";
import { FormMessage, Message } from "@/components/form-message";
import { getInfluencerByUserId } from "@/utils/db";
import AvatarUpload from "./avatar-upload";

export default async function AccountPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const influencer = await getInfluencerByUserId(user.id);
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5ed" }}>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
      
        <div className="bg-white rounded-lg border-4 border-[#19191b] p-8 brutal-shadow-hover">

          <FormMessage message={searchParams} />

          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <form>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50 bg-gray-100"
                  value={user.email || ""}
                  disabled
                />
                <p className="mt-2 text-sm text-gray-500">
                  Your email cannot be changed
                </p>
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  defaultValue={user.user_metadata["full_name"] || ""}
                  placeholder="Your full name"
                />
              </div>
              
              <button
                type="submit"
                formAction={handleUpdateProfile}
                className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition`}
              >
                Update Profile
              </button>
            </form>
          </div>
          
          
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Influencer Profile</h2>
            
            <form>
              <div className="mb-6">
                <label className="block text-[#19191b] font-medium mb-2">
                  Profile Image
                </label>
                <AvatarUpload 
                  currentImage={influencer?.profile_image || null}
                  userId={user.id}
                />
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="influencerName"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Influencer Name
                </label>
                <input
                  id="influencerName"
                  name="influencerName"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                  defaultValue={influencer?.name}
                  placeholder="Your public influencer name"
                />
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="influencerSlug"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">maplizt.com/</span>
                  <input
                    id="influencerSlug"
                    name="influencerSlug"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    defaultValue={influencer?.slug}
                    placeholder="your-profile-url"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be your public profile URL
                </p>
              </div>
              
              <div className="mb-6">
                <label
                  htmlFor="influencerHandle"
                  className="block text-[#19191b] font-medium mb-2"
                >
                  Handle
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">@</span>
                  <input
                    id="influencerHandle"
                    name="influencerHandle"
                    type="text"
                    className="flex-grow px-4 py-3 rounded-lg border-2 border-[#19191b] focus:outline-none focus:ring-2 focus:ring-[#8d65e3]/50"
                    defaultValue={influencer?.handle}
                    placeholder="your_handle"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This will be your public handle
                </p>
              </div>
              
              <button
                type="submit"
                formAction={handleUpdateInfluencer}
                className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition`}
              >
                Update Influencer Profile
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-[#19191b] mb-6">
              <h3 className="text-lg font-medium mb-2">Stripe Connect Account</h3>
              <p className="text-gray-600 mb-4">
                {influencer?.stripe_account_id 
                  ? "Your Stripe account is connected. You can receive payments for your recommendations."
                  : "Connect your Stripe account to receive payments for your recommendations."}
              </p>
              
              <form>
                <button
                  formAction={handleStripeConnect}
                  className={`bg-[#8d65e3] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition`}
                >
                  Connect Stripe Account
                </button>
              </form>
            </div>
          </div>
  
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Sign out</h2>
            <form>
              <button
                formAction={signOutAction}
                className="bg-[#19191b] text-white px-6 py-3 rounded-lg border-2 border-[#19191b] font-medium hover:bg-opacity-90 transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}