'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaCloudUploadAlt, 
  FaTimes, 
  FaPlus, 
  FaTrash,
  FaGem
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';

// Interfaces for type safety
interface Category {
  _id: string;
  name: string;
}

interface Gem {
  type: string;
  carat: string;
  color: string;
  clarity: string;
}

interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export default function CreateProductPage() {
  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state fields based on schema
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: '',
    width: '',
    height: ''
  });
  const [materials, setMaterials] = useState<string[]>(['']);
  const [gems, setGems] = useState<Gem[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [tags, setTags] = useState<string[]>(['']);

  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = await response.data;
        setCategories(data.categories);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Generate SKU on name change
  useEffect(() => {
    if (name) {
      // Create SKU from name: first 3 letters + timestamp
      const prefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
      const timestamp = new Date().getTime().toString().slice(-6);
      setSku(`${prefix}${timestamp}`);
    }
  }, [name]);

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

  // Add/remove gem input fields
  const addGem = () => {
    setGems([...gems, { type: '', carat: '', color: '', clarity: '' }]);
  };

  const removeGem = (index: number) => {
    const newGems = gems.filter((_, i) => i !== index);
    setGems(newGems);
  };

  const updateGem = (index: number, field: keyof Gem, value: string) => {
    const newGems = [...gems];
    newGems[index] = { ...newGems[index], [field]: value };
    setGems(newGems);
  };

  // Add/remove tag input fields
  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
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
    formData.append('sku', sku);
    formData.append('description', description);
    formData.append('price', price);
    
    if (salePrice) {
      formData.append('salePrice', salePrice);
    }
    
    formData.append('categoryId', category);
    formData.append('stockQuantity', stock);
    formData.append('isActive', isActive.toString());
    formData.append('isFeatured', isFeatured.toString());
    
    // Add weight
    if (weight) {
      formData.append('weight', weight);
    }
    
    // Add dimensions
    if (dimensions.length || dimensions.width || dimensions.height) {
      formData.append('dimensions[length]', dimensions.length);
      formData.append('dimensions[width]', dimensions.width);
      formData.append('dimensions[height]', dimensions.height);
    }
    
    // Add materials
    materials.forEach((material, index) => {
      if (material.trim()) {
        formData.append(`materials[${index}]`, material);
      }
    });
    
    // Add gems
    gems.forEach((gem, index) => {
      if (gem.type.trim()) {
        formData.append(`gems[${index}][type]`, gem.type);
        formData.append(`gems[${index}][carat]`, gem.carat);
        formData.append(`gems[${index}][color]`, gem.color);
        formData.append(`gems[${index}][clarity]`, gem.clarity);
      }
    });
    
    // Add tags
    tags.forEach((tag, index) => {
      if (tag.trim()) {
        formData.append(`tags[${index}]`, tag);
      }
    });

    // Add images
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post(`${API_URL}/products`, formData);

      console.log("🚀 ~ handleSubmit ~ response:", response)


      if (response.status !== 201) {
        toast.error('Failed to create product');
        return;
      }

      toast.success('Product created successfully');
      router.push('/admin/dashboard/products');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      <form onSubmit={handleSubmit} className="mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-gray-700 font-bold mb-2">
              SKU*
            </label>
            <input
              type="text"
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              placeholder="Auto-generated SKU"
              readOnly
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
            rows={4}
            required
          />
        </div>

        {/* Pricing and Category */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
              Price*
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
              Category*
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

        {/* Stock, Status, and Featured */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">
              Stock Quantity*
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

          {/* Product Weight */}
          <div>
            <label htmlFor="weight" className="block text-gray-700 font-bold mb-2">
              Weight (g)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Weight in grams"
              min="0"
              step="0.01"
            />
          </div>

          {/* Status and Featured Toggles */}
          {/* <div className="flex flex-col justify-center">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-gray-700">
                Active Product
              </label>
            </div>
            <div className="flex items-center">
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
          </div> */}
        </div>

        {/* Dimensions */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Dimensions (cm)
          </label>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Length"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Width"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Height"
                min="0"
                step="0.1"
              />
            </div>
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

        {/* Gems */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Gems
          </label>
          {gems.map((gem, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium flex items-center">
                  <FaGem className="mr-2 text-purple-500" /> Gem {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeGem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    value={gem.type}
                    onChange={(e) => updateGem(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Diamond, Ruby, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Carat
                  </label>
                  <input
                    type="number"
                    value={gem.carat}
                    onChange={(e) => updateGem(index, 'carat', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Carat weight"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={gem.color}
                    onChange={(e) => updateGem(index, 'color', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gem color"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Clarity
                  </label>
                  <input
                    type="text"
                    value={gem.clarity}
                    onChange={(e) => updateGem(index, 'clarity', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VS1, SI2, etc."
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addGem}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Gem
          </button>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Tags
          </label>
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
          >
            <FaPlus className="mr-2" /> Add Tag
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