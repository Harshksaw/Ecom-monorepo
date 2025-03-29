'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaCloudUploadAlt, 
  FaTimes, 
  FaPlus, 
  FaTrash 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Interfaces for type safety
interface Category {
  _id: string;
  name: string;
}

export default function CreateProductPage() {
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [materials, setMaterials] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
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

      if (images.length + validFiles.length > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }

      const newImageFiles = [...images, ...validFiles];
      const newImagePreviews = newImageFiles.map(file => URL.createObjectURL(file));

      setImages(newImageFiles);
      setImagePreviews(newImagePreviews);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Add/remove material input fields
  const addMaterial = () => {
    setMaterials([...materials, '']);
  };

  const removeMaterial = (index: number) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
  };

  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = value;
    setMaterials(newMaterials);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate inputs
    if (!name.trim()) {
      toast.error('Product name is required');
      setIsLoading(false);
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      setIsLoading(false);
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    
    if (salePrice) {
      formData.append('salePrice', salePrice);
    }
    
    formData.append('category', category);
    formData.append('stock', stock);
    
    if (brand) {
      formData.append('brand', brand);
    }
    
    formData.append('isFeatured', isFeatured.toString());
    
    // Add materials
    materials.forEach((material, index) => {
      if (material.trim()) {
        formData.append(`materials[${index}]`, material);
      }
    });

    // Add images
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product');
      }

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <form onSubmit={handleSubmit} className=" mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Basic Information (previous section remains the same) */}
        
        {/* Description (continued from previous code) */}
        <div className="mt-6">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
            rows={4}
          />
        </div>

        {/* Pricing and Category */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Sale Price */}
          <div>
            <label htmlFor="salePrice" className="block text-gray-700 font-bold mb-2">
              Sale Price (Optional)
            </label>
            <input
              type="number"
              id="salePrice"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter sale price"
              min="0"
              step="0.01"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock and Featured */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter stock quantity"
              min="0"
              required
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="text-gray-700">
              Featured Product
            </label>
          </div>
        </div>

        {/* Materials */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Materials
          </label>
          {materials.map((material, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={material}
                onChange={(e) => updateMaterial(index, e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter material"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMaterial}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Material
          </button>
        </div>

        {/* Image Upload */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {/* Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image 
                    src={preview} 
                    alt={`Product preview ${index + 1}`} 
                    width={150} 
                    height={150} 
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {images.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-36">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label 
                    htmlFor="imageUpload" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                    <span className="text-gray-600">Upload</span>
                  </label>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Upload up to 5 images (JPEG, PNG, GIF)
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? 'Creating Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}