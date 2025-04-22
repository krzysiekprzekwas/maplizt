import { getInfluencerByUserId, updateInfluencerProfile } from "@/utils/db";
import { handleApiAuth } from "@/utils/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    return handleApiAuth(request, async (userId) => {
      try {
        const body = await request.json();
        const { avatar_url } = body;
  
        if (!avatar_url) {
          return NextResponse.json(
            { error: 'Missing avatar url' },
            { status: 400 }
          );
        }
  
        const existingInfluencer = await getInfluencerByUserId(userId);
  
        let updatedProfile;
        if (existingInfluencer) {
          updatedProfile = await updateInfluencerProfile(userId, {
            profile_image: avatar_url
          });
        }
  
        return NextResponse.json(updatedProfile);
      } catch (error: any) {
        console.error('Error updating influencer avatar:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to update influencer avatar' },
          { status: 500 }
        );
      }
    });
  } 