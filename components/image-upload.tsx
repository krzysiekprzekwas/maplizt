import { useState } from 'react';
import { uploadImage } from '@/lib/storage';

interface ImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
  maxImages?: number;
  singleImage?: boolean;
  imageClassName?: string;
}

export default function ImageUpload({ 
  images, 
  setImages, 
  maxImages = 3,
  singleImage = false,
  imageClassName = "w-32 h-32 object-cover rounded-lg border-2 border-[#19191b]"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Add file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if we've reached the maximum number of images
    if (!singleImage && images.length + files.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      if (singleImage) {
        // Only upload the first file for single image mode
        const uploadedUrl = await uploadImage(files[0]);
        setImages([uploadedUrl]);
      } else {
        // Upload all files for multiple image mode
        const uploadPromises = Array.from(files).map(file => 
          uploadImage(file)
        );

        const uploadedUrls = await Promise.all(uploadPromises);
        setImages([...images, ...uploadedUrls]);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Add image removal handler
  const handleRemoveImage = (index: number) => {
    if (singleImage) {
      setImages([]);
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      {/* Image preview */}
      {images.length > 0 && (
        <div className={`flex ${singleImage ? '' : 'flex-wrap'} gap-4`}>
          {images.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className={imageClassName}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {(!singleImage && images.length < maxImages) || (singleImage && images.length === 0) ? (
        <div>
          <input
            type="file"
            id="images"
            accept=".jpg,.jpeg,.png,.webp"
            multiple={!singleImage}
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <label
            htmlFor="images"
            className={`inline-block px-4 py-2 bg-[#19191b] text-white rounded-lg cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Uploading...' : singleImage ? (images.length > 0 ? 'Change Image' : 'Upload Image') : 'Upload Images'}
          </label>
        </div>
      ) : null}

      {uploadError && (
        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
      )}
      
      <p className="text-sm text-gray-500">
        Supported formats: JPG, PNG, WebP. Maximum size: 5MB per image.
      </p>
    </div>
  );
} 