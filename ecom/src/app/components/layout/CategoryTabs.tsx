'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryService } from '@/app/lib/api';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaAngleDown, 
  FaGem, 
  FaRegGem 
} from 'react-icons/fa';

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
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
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

  // Handle scroll buttons
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
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMaterialOptions) {
        const dropdown = dropdownRefs.current[showMaterialOptions];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setShowMaterialOptions(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMaterialOptions]);
  
  return (
    <div className="w-full bg-white shadow-sm relative z-40">
      <div className="container mx-auto px-4 relative">
        {/* Left scrolling button */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-pink-600 transition-all hover:shadow-lg"
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef} 
          className="flex space-x-6 overflow-x-auto py-4 px-12 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div 
              key={category._id}
              id={`category-${category.slug}`}
              className="relative flex-shrink-0"
              onMouseEnter={() => setHoveredCategory(category.slug)}
              onMouseLeave={() => {
                setHoveredCategory(null);
              }}
            >
              <Link 
                href={`/category/${category.slug}`}
                className={`block rounded-full overflow-hidden transition-all h-28 w-28 transform hover:scale-105 ${
                  activeCategory === category.slug 
                    ? 'ring-2 ring-pink-500 shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="relative aspect-square">
                  {category.imageUrl ? (
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-transform duration-300"
                      sizes="112px"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${getCategoryColor(category.slug)} rounded-full`}>
                      <span className="text-2xl font-medium">{category.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-full"></div>
                  
                  {/* Category name at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium text-center">{category.name}</h3>
                  </div>
                  
                  {/* Hover description */}
                  {hoveredCategory === category.slug && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3 transition-opacity duration-300 rounded-full">
                      <p className="text-white text-xs text-center">
                        {CATEGORY_DESCRIPTIONS[category.slug as keyof typeof CATEGORY_DESCRIPTIONS] ||
                          `Shop our ${category.name} collection`}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Material options dropdown button */}
              <button
                className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-30 w-8 h-8 rounded-full bg-white shadow-md text-pink-600 flex items-center justify-center transition-all 
                  ${hoveredCategory === category.slug || showMaterialOptions === category.slug 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2 pointer-events-none'} 
                  hover:bg-pink-100 hover:text-pink-700 hover:shadow-lg`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMaterialOptions(
                    showMaterialOptions === category.slug ? null : category.slug
                  );
                }}
                aria-label="Show material options"
              >
                <FaAngleDown className={`transform transition-transform ${
                  showMaterialOptions === category.slug ? 'rotate-180' : ''
                }`} />
              </button>
              
              {/* Material options dropdown */}
              {showMaterialOptions === category.slug && (
                <div 
                  ref={(el) => dropdownRefs.current[category.slug] = el}
                  className="absolute z-50 bg-white rounded-lg shadow-xl p-1 w-48 mt-3 transform transition-all duration-200 ease-out origin-top"
                  style={{
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                  <div className="relative z-10 overflow-hidden rounded-lg">
                    <Link 
                      href={`/category/${category.slug}?material=gold`}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-50 text-yellow-800 hover:text-yellow-900 transition-colors group"
                    >
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 group-hover:bg-yellow-200">
                        <FaGem size={12} />
                      </div>
                      <span className="font-medium">Gold</span>
                    </Link>
                    <Link 
                      href={`/category/${category.slug}?material=silver`}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors group"
                    >
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-gray-200">
                        <FaRegGem size={12} />
                      </div>
                      <span className="font-medium">Silver</span>
                    </Link>
                    <Link 
                      href={`/category/${category.slug}?material=platinum`}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 text-blue-700 hover:text-blue-900 transition-colors group"
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200">
                        <FaRegGem size={12} />
                      </div>
                      <span className="font-medium">Platinum</span>
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-pink-600 transition-all hover:shadow-lg"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;