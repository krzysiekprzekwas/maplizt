import { NextRequest, NextResponse } from "next/server";
import { getInfluencerByUserId, getRecommendationById, updateRecommendation } from "@/lib/db";
import { handleApiAuth } from "@/lib/server-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recommendationId: string }> }
) {
  return handleApiAuth(request, async (userId) => {
    try {
      // Get the recommendation ID from the URL

      const { recommendationId } = await params;
      if (!recommendationId) {
        return NextResponse.json(
          { error: "Recommendation ID is required" },
          { status: 400 }
        );
      }
  
      // Get the influencer profile for the current user
      const influencer = await getInfluencerByUserId(userId);
      if (!influencer) {
        return NextResponse.json(
          { error: "Influencer profile not found" },
          { status: 404 }
        );
      }
  
      // Get the existing recommendation
      const existingRecommendation = await getRecommendationById(recommendationId);
      if (!existingRecommendation) {
        return NextResponse.json(
          { error: "Recommendation not found" },
          { status: 404 }
        );
      }
  
      // Check if the recommendation belongs to the influencer
      if (existingRecommendation.influencer_id !== influencer.id) {
        return NextResponse.json(
          { error: "You don't have permission to update this recommendation" },
          { status: 403 }
        );
      }
  
      // Parse the request body
      const body = await request.json();
      const {
        title,
        slug,
        description,
        type,
        numeric_price,
        images,
        googleMapsLink,
      } = body;
  
      // Validate required fields
      if (!title || !slug || !description || !type || !googleMapsLink) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
  
      // Validate price based on type
      if (type === "Paid" && numeric_price < 1) {
        return NextResponse.json(
          { error: "Paid recommendations must cost at least 1 PLN" },
          { status: 400 }
        );
      }
  
      if (type === "Premium" && numeric_price < 7) {
        return NextResponse.json(
          { error: "Premium recommendations must cost at least 7 PLN" },
          { status: 400 }
        );
      }
  
      // Update the recommendation
      const updatedRecommendation = await updateRecommendation({
        id: recommendationId,
        title,
        slug,
        description,
        type,
        numeric_price,
        images: images || [],
        googleMapsLink,
      });
  
      return NextResponse.json(updatedRecommendation);
    } catch (error) {
      console.error("Error updating recommendation:", error);
      return NextResponse.json(
        { error: "Failed to update recommendation" },
        { status: 500 }
      );
    }
  });
}