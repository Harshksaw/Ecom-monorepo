'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImage, ImageResponse } from '@/lib/image-api';

interface ImageUploaderProps {
  courseId?: string;
  onImageUploaded: (image: ImageResponse) => void;
  className?: string;
  label?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export default function ImageUploader({
  courseId,
  onImageUploaded,
  className = '',
  label = 'Upload Image',
  maxSizeInMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size: ${maxSizeInMB}MB`);
      return;
    }
    
    // Create and set preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Upload the file
    setIsUploading(true);
    try {
      const response = await uploadImage(file, courseId);
      
      if (!response.success || !response.image) {
        setError(response.message || 'Upload failed');
        setPreview(null);
        return;
      }
      
      // Pass the uploaded image data back to parent component
      onImageUploaded(response.image);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="mb-2 font-medium">{label}</div>
      
      {/* Preview area */}
      {preview && (
        <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
          <Image 
            src={preview} 
            alt="Preview" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      )}
      
      {/* Upload button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Select Image'}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {isUploading && (
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {/* File info */}
      <p className="mt-2 text-xs text-gray-500">
        Allowed types: {allowedTypes.map(type => type.split('/')[1]).join(', ')}. 
        Max size: {maxSizeInMB}MB
      </p>
    </div>
  );
}