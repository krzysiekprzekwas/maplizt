import { NextRequest, NextResponse } from "next/server";
import { deleteRecommendationById, deleteStoredImageByPath, getInfluencerById, getInfluencerByUserId, getRecommendationById, updateRecommendation } from "@/utils/db";
import { handleApiAuth } from "@/utils/server-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleApiAuth(request, async (userId) => {
    try {
      // Get the recommendation ID from the URL

      const { id } = await params;
      if (!id) {
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
      const existingRecommendation = await getRecommendationById(id);
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
        id: id,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleApiAuth(request, async (userId) => {
    try {

      const { id } = await params;
      // Get the existing recommendation
      const recommendation = await getRecommendationById(id);
      if (!recommendation) {
        return NextResponse.json(
          { error: "Recommendation not found" },
          { status: 404 }
        );
      }

      // Get the owner influencer 
      const influencer = await getInfluencerById(recommendation.influencer_id);
      if (!influencer) {
        return NextResponse.json(
          { error: "Issue with recommendation" },
          { status: 404 }
        );
      }

      // Verify ownership
      if (influencer.user_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to view this recommendation' },
          { status: 403 }
        );
      }

      // Delete images from storage if they're not the placeholder
      if (recommendation.images && recommendation.images.length > 0) {
        for (const imageUrl of recommendation.images) {
          if (imageUrl && !imageUrl.includes('recommendation_image_placeholder.jpg')) {
            // Extract the path from the URL
            const urlParts = imageUrl.split('/storage/v1/object/public/recommendation-images/');
            if (urlParts.length > 1) {
              const filePath = urlParts[1];
              await deleteStoredImageByPath(filePath);
            }
          }
        }
      }

      // Delete the recommendation
      const deleteError = await deleteRecommendationById(id);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to delete recommendation' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleApiAuth(request, async (userId) => {
    try {

      const { id } = await params;
      // Get the existing recommendation
      const recommendation = await getRecommendationById(id);
      if (!recommendation) {
        return NextResponse.json(
          { error: "Recommendation not found" },
          { status: 404 }
        );
      }

      // Get the owner influencer 
      const influencer = await getInfluencerById(recommendation.influencer_id);
      if (!influencer) {
        return NextResponse.json(
          { error: "Issue with recommendation" },
          { status: 404 }
        );
      }

      // Verify ownership
      if (influencer.user_id !== userId) {
        return NextResponse.json(
          { error: 'You do not have permission to view this recommendation' },
          { status: 403 }
        );
      }

      return NextResponse.json(recommendation);
    } catch (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}