'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryService } from '@/app/lib/api';
import { FaChevronLeft, FaChevronRight, FaAngleDown } from 'react-icons/fa';

// Sample category descriptions
const CATEGORY_DESCRIPTIONS = {
  "rings": "Elegant rings for every occasion",
  "earrings": "Beautiful earrings to complement your style",
  "pendant": "Stunning pendants for a touch of elegance",
  "bracelet": "Exquisite bracelets for your wrist",
  "necklace": "Gorgeous necklaces to enhance your look",
  "gifts": "Perfect jewelry gifts for your loved ones",
  "watches": "Luxury watches for men and women",
};

// Function to get placeholder color based on category
const getCategoryColor = (category: string) => {
  const colors = {
    "rings": "bg-pink-100",
    "earrings": "bg-yellow-100",
    "pendant": "bg-blue-100",
    "bracelet": "bg-green-100",
    "necklace": "bg-purple-100",
    "gifts": "bg-red-100",
    "watches": "bg-gray-100",
  };
  
  return colors[category as keyof typeof colors] || "bg-pink-50";
};

interface CategoryTabsProps {
  activeCategory?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showMaterialOptions, setShowMaterialOptions] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await CategoryService.getAllCategories();
        setCategories(categories.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="w-full py-6 bg-white shadow-sm relative">
      <div className="container mx-auto px-4 relative">
        {/* Left scrolling button */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-pink-600"
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef} 
          className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div 
              key={category._id}
              className="relative flex-shrink-0"
              onMouseEnter={() => setHoveredCategory(category.slug)}
              onMouseLeave={() => {
                setHoveredCategory(null);
                setShowMaterialOptions(null);
              }}
            >
              <Link 
                href={`/category/${category.slug}`}
                className={`block rounded-lg overflow-hidden transition-all w-48 ${
                  activeCategory === category.slug 
                    ? 'ring-2 ring-pink-500 shadow-md' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="relative aspect-[4/3]">
                  {category.imageUrl ? (
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${getCategoryColor(category.slug)}`}>
                      <span className="text-2xl font-medium">{category.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  {/* Category name at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium">{category.name}</h3>
                  </div>
                  
                  {/* Hover description */}
                  {hoveredCategory === category.slug && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3 transition-opacity duration-300">
                      <p className="text-white text-xs text-center">
                        {CATEGORY_DESCRIPTIONS[category.slug as keyof typeof CATEGORY_DESCRIPTIONS] || `Shop our ${category.name} collection`}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Material options dropdown button */}
              {hoveredCategory === category.slug && (
                <button
                  className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 shadow-md text-pink-600 flex items-center justify-center transition-colors hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMaterialOptions(showMaterialOptions === category.slug ? null : category.slug);
                  }}
                >
                  <FaAngleDown className={`transform transition-transform ${showMaterialOptions === category.slug ? 'rotate-180' : ''}`} />
                </button>
              )}
              
              {/* Material options dropdown */}
              {showMaterialOptions === category.slug && (
                <div className="absolute top-12 right-2 z-30 bg-white rounded-md shadow-lg p-2 min-w-32 text-sm">
                  <div className="absolute top-0 right-3 -mt-2 w-4 h-4 bg-white transform rotate-45"></div>
                  <div className="relative z-10">
                    <Link 
                      href={`/category/${category.slug}?material=gold`}
                      className="block px-4 py-2 hover:bg-pink-50 rounded text-gray-800 hover:text-pink-600 transition-colors"
                    >
                      Gold
                    </Link>
                    <Link 
                      href={`/category/${category.slug}?material=silver`}
                      className="block px-4 py-2 hover:bg-pink-50 rounded text-gray-800 hover:text-pink-600 transition-colors"
                    >
                      Silver
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Right scrolling button */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-8 h-8 shadow-md flex items-center justify-center text-pink-600"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;