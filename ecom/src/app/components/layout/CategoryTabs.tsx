'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Sample category images - replace with your actual images
const CATEGORY_IMAGES = {
  "rings": "https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
  "earrings": "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
  "pendant": "https://plus.unsplash.com/premium_photo-1709033404514-c3953af680b4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
  "bracelet": "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",
  "necklace": "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",

  "watches": "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D",

};

// Sample category descriptions
const CATEGORY_DESCRIPTIONS = {
  "rings": "Elegant rings for every occasion",
  "earrings": "Beautiful earrings to complement your style",
  "pendant": "Stunning pendants for a touch of elegance",
  "bracelet": "Exquisite bracelets for your wrist",
  "necklace": "Gorgeous necklaces to enhance your look",
  "gifts": "Perfect jewelry gifts for your loved ones",
  "watches": "Luxury watches for men and women",
  "new-arrivals": "Our latest collection of fine jewelry"
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
    "new-arrivals": "bg-orange-100"
  };
  
  return colors[category as keyof typeof colors] || "bg-pink-50";
};

interface CategoryTabsProps {
  activeCategory?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory }) => {
  // Add New Arrivals to the categories
  const categories = [
    { id: 0, name: "New Arrivals", slug: "new-arrivals" },
    { id: 1, name: "Rings", slug: "rings" },
    { id: 2, name: "Earrings", slug: "earrings" },
    { id: 3, name: "Pendant", slug: "pendant" },
    { id: 4, name: "Bracelet", slug: "bracelet" },
    { id: 5, name: "Necklace", slug: "necklace" },
    { id: 6, name: "Gifts", slug: "gifts" },
    { id: 7, name: "Watches", slug: "watches" },
  ];
  
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  return (
    <div className="w-full py-2 bg-white">
      <div className="container mx-auto px-2">
        {/* Scrollable tabs for mobile */}
        <div className="md:hidden overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className={`flex-shrink-0 inline-block rounded-lg p-2 transition-colors ${
                  activeCategory === category.slug 
                    ? 'bg-pink-100 text-pink-800 shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-pink-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden mb-1 ${getCategoryColor(category.slug)}`}>
                    {CATEGORY_IMAGES[category.slug as keyof typeof CATEGORY_IMAGES] ? (
                      <Image 
                        src={CATEGORY_IMAGES[category.slug as keyof typeof CATEGORY_IMAGES]} 
                        alt={category.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                        {category.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Tab cards for desktop */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-2">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className={`relative group rounded-lg overflow-hidden transition-all ${
                activeCategory === category.slug 
                  ? 'ring-2 ring-pink-500 shadow-md' 
                  : 'hover:shadow-md'
              }`}
              onMouseEnter={() => setHoveredCategory(category.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative aspect-[4/3]">
                {CATEGORY_IMAGES[category.slug as keyof typeof CATEGORY_IMAGES] ? (
                  <Image 
                    src={CATEGORY_IMAGES[category.slug as keyof typeof CATEGORY_IMAGES]} 
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
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="text-white text-sm font-medium">{category.name}</h3>
                </div>
                
                {/* Hover description */}
                {hoveredCategory === category.slug && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 transition-opacity duration-300">
                    <p className="text-white text-xs text-center">
                      {CATEGORY_DESCRIPTIONS[category.slug as keyof typeof CATEGORY_DESCRIPTIONS]}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Materials dropdown indication */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/80 text-pink-800 text-[8px] flex items-center justify-center">
                +
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;