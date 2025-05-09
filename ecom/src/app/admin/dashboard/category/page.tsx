'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';

// Simple interface for category data
interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
}

const CreateCategoryPage = () => {
  // Category list state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch all categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
  };
  
  // Clear form
  const clearForm = () => {
    setCategoryName('');
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (editingId) {
        // Update existing category name only

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('images', imageFile || ''); 
        const response = await axios.post(`${API_URL}/categories/${editingId}`, formData);
        
        if (response.status === 200) {
          toast.success('Category updated successfully');
          fetchCategories();
          clearForm();
        }
      } else {
        // Create new category
        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('slug', categoryName.toLowerCase().replace(/\s+/g, '-'));
        
        if (imageFile) {
          formData.append('images', imageFile);
        }
        
        const response = await axios.post(`${API_URL}/categories`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.status === 201) {
          toast.success('Category created successfully');
          fetchCategories();
          clearForm();
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a category
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit a category
  const handleEdit = (category: Category) => {
    setCategoryName(category.name);
    setEditingId(category._id);
    setImagePreview(category.imageUrl || null);
  };
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-3 items-start">
          {/* Image Preview/Upload */}
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" width={80} height={80} className="object-cover" />
              ) : (
                <FaPlus className="text-gray-400" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          
          {/* Name Input */}
          <div className="flex-grow">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white ${
              isLoading ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {isLoading && !categories.length ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No categories found
          </div>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Category Image */}
              <div className="relative aspect-square bg-gray-100">
                {category.imageUrl ? (
                  <Image 
                    src={category.imageUrl} 
                    alt={category.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-300">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-600"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category._id)}
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                
                {/* Status indicator */}
                <div className="absolute top-2 left-2">
                  <div className={`w-3 h-3 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
              </div>
              
              {/* Category Name */}
              <div className="px-3 py-2">
                <h3 className="font-medium truncate">{category.name}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreateCategoryPage;