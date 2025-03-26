'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function CreateCategoryPage() {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPEG, PNG, or GIF.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      setIsLoading(false);
      return;
    }

    // Create form data for file upload
    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('description', description);
    formData.append('isActive', isActive.toString());
    
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create category');
      }

      toast.success('Category created successfully');
      router.push('/admin/categories');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Category</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Category Name */}
        <div className="mb-6">
          <label 
            htmlFor="categoryName" 
            className="block text-gray-700 font-bold mb-2"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label 
            htmlFor="description" 
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category description"
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Category Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {imagePreview ? (
              <div className="relative mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }}>
                <Image 
                  src={imagePreview} 
                  alt="Category Preview" 
                  layout="responsive"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <FaCloudUploadAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop an image or click to select
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label 
                  htmlFor="imageUpload" 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Choose Image
                </label>
              </>
            )}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label 
            htmlFor="isActive" 
            className="text-gray-700"
          >
            Active Category
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}