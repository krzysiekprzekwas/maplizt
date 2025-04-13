"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadAvatar } from "@/utils/storage";
import { updateInfluencerAvatar } from "@/utils/db";

interface AvatarUploadProps {
  currentImage: string | null;
  userId: string;
}

export default function AvatarUpload({ currentImage, userId }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload the image
      const imageUrl = await uploadAvatar(file);

      // Update the influencer profile with the new image URL
      await updateInfluencerAvatar(userId, imageUrl);

      // Refresh the page to show the new image
      window.location.reload();
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[#19191b] brutal-shadow-all relative cursor-pointer group"
        onClick={handleImageClick}
      >
        <Image
          src={currentImage || "/avatar_placeholder.jpeg"}
          alt="Profile image"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <input
          ref={fileInputRef}
          type="file"
          name="profileImage"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        {isUploading && (
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        {!isUploading && !error && (
          <p className="mt-2 text-sm text-gray-500">
            Upload a JPG, PNG, or WebP image (max 5MB)
          </p>
        )}
      </div>
    </div>
  );
} 