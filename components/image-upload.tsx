import { useState } from 'react';
import { uploadImage } from '@/lib/storage';

interface ImageUploadProps {
  images: string[];
  setImages: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  images, 
  setImages, 
  maxImages = 3 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Add file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check if we've reached the maximum number of images
    if (images.length + files.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadImage(file)
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Add image removal handler
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Image preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg border-2 border-[#19191b]"
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
      {images.length < maxImages && (
        <div>
          <input
            type="file"
            id="images"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
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
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </label>
        </div>
      )}

      {uploadError && (
        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
      )}
      
      <p className="text-sm text-gray-500">
        Supported formats: JPG, PNG, WebP. Maximum size: 5MB per image.
      </p>
    </div>
  );
} 