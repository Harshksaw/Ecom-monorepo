'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '../lib/api';
import { toast } from 'react-toastify';



const CategorySection = () => {
  const [categories, setCategories] = React.useState([]);

  const fetchCategories = async () => {

    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  });
  return (
    <section className="py-12 bg-pink-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-800 mb-8">
          Shop By Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    materials: string[];
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  console.log("🚀 ~ category:", category)
  // Fallback for image loading
  const [imageError, setImageError] = React.useState(false);
  
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative pt-[100%]">
          {!imageError ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-pink-100 flex items-center justify-center">
              <span className="text-xl font-medium text-pink-800">{category.name}</span>
            </div>
          )}
        </div>
        
      
      </div>
    </Link>
  );
};

export default CategorySection;