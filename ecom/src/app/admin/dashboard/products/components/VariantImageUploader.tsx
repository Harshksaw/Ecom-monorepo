// src/components/products/ui/VariantImageUploader.tsx
import React from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface VariantImageUploaderProps {
  variantIndex: number;
  metalColor: string;
  images: File[];
  imagePreviews: string[];
  onAddImages: (variantIndex: number, newImages: File[]) => void;
  onRemoveImage: (variantIndex: number, imageIndex: number) => void;
  maxImages?: number;
}

const VariantImageUploader: React.FC<VariantImageUploaderProps> = ({
  variantIndex,
  metalColor,
  images,
  imagePreviews,
  onAddImages,
  onRemoveImage,
  maxImages = 3
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
          toast.error(`Invalid file type for ${file.name}. Please upload JPEG, PNG, or GIF.`);
          return false;
        }

        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }

        return true;
      });

      if (images.length + validFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed per variant`);
        return;
      }

      onAddImages(variantIndex, validFiles);
    }
  };

  // Generate a unique ID for the input
  const inputId = `variant-image-upload-${variantIndex}`;

  // Color classes based on metal color for visual differentiation
  const getColorClass = () => {
    switch(metalColor.toLowerCase()) {
      case 'gold': return 'border-yellow-500 bg-yellow-50';
      case 'silver': return 'border-gray-400 bg-gray-50';
      case 'rosegold': return 'border-pink-300 bg-gray-50';
      case 'pinkgold': return 'border-pink-400 bg-gray-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };
  
  const colorClass = getColorClass();

  return (
    <div className={`border-2 border-dashed rounded-lg p-4 ${colorClass}`}>
      <div className="mb-2 font-medium text-gray-700 flex justify-between items-center">
        <span className="capitalize">{metalColor} Images</span>
        <span className="text-sm text-gray-500">{images.length}/{maxImages}</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {imagePreviews.map((preview, imgIndex) => (
          <div key={imgIndex} className="relative">
            <Image
              src={preview}
              alt={`${metalColor} variant image ${imgIndex + 1}`}
              width={100}
              height={100}
              className="rounded-lg object-cover h-24 w-24"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(variantIndex, imgIndex)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
            >
              <FaTimes />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-lg text-center capitalize">
              {metalColor}
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-24 w-24">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id={inputId}
            />
            <label
              htmlFor={inputId}
              className="cursor-pointer flex flex-col items-center"
            >
              <FaCloudUploadAlt className="text-2xl text-gray-400 mb-1" />
              <span className="text-gray-600 text-xs capitalize">{metalColor}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantImageUploader;