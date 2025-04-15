'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Category data matching the sketch's structure
const CATEGORIES = [
  {
    id: 1,
    name: 'Rings',
    slug: 'rings',
    image: '/images/categories/rings.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  },
  {
    id: 2,
    name: 'Earrings',
    slug: 'earrings',
    image: '/images/categories/earrings.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  },
  {
    id: 3,
    name: 'Pendant',
    slug: 'pendant',
    image: '/images/categories/pendant.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  },
  {
    id: 4,
    name: 'Bracelet',
    slug: 'bracelet',
    image: '/images/categories/bracelet.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  },
  {
    id: 5,
    name: 'Necklace',
    slug: 'necklace',
    image: '/images/categories/necklace.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  },
  {
    id: 6,
    name: 'Gifts',
    slug: 'gifts',
    image: '/images/categories/gifts.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  },
  {
    id: 7,
    name: 'Watches',
    slug: 'watches',
    image: '/images/categories/watches.jpg', // Replace with actual image
    materials: ['Gold', 'Silver']
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 bg-pink-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-800 mb-8">
          Shop By Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
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