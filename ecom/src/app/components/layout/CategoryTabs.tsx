'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryService } from '@/app/lib/api';
import { FaChevronLeft, FaChevronRight, FaGem, FaRegGem } from 'react-icons/fa';

// Placeholder color by category
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    rings: 'bg-gray-100',
    earrings: 'bg-yellow-100',
    pendant: 'bg-blue-100',
    bracelet: 'bg-green-100',
    necklace: 'bg-purple-100',
    gifts: 'bg-red-100',
    watches: 'bg-gray-100',
  };
  return colors[category] || 'bg-gray-50';
};

interface CategoryTabsProps {
  activeCategory?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryService.getAllCategories();
        setCategories(res.categories);
      } catch (e) {
        console.error('Error fetching categories', e);
      }
    })();
  }, []);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -250, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 250, behavior: 'smooth' });

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-40 overflow-visible">
      <div className="container mx-auto px-4 relative overflow-visible">
        <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow flex items-center justify-center">
          <FaChevronLeft className="text-pink-600" />
        </button>

        <div ref={scrollRef} className="flex space-x-6 overflow-x-auto overflow-y-visible py-4 px-12 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <div
              key={cat._id}
              className="relative flex-shrink-0"
              onMouseEnter={() => setHoveredCategory(cat.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link href={`/category/${cat.slug}`} className={`block h-28 w-28 rounded-full overflow-hidden transform transition hover:scale-105 ${activeCategory === cat.slug ? 'ring-2 ring-pink-500' : ''}`}>                
                <div className="relative aspect-square">
                  {cat.imageUrl ? (
                    <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" sizes="112px" />
                  ) : (
                    <div className={`${getCategoryColor(cat.slug)} w-full h-full flex items-center justify-center rounded-full`}>
                      <span className="text-2xl font-medium">{cat.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 rounded-full" />
                  <div className="absolute bottom-0 w-full p-2 text-center">
                    <h3 className="text-white text-sm font-medium truncate">{cat.name}</h3>
                  </div>

                  {/* On hover: show gold and silver icons */}
                  {hoveredCategory === cat.slug && cat.slug !== 'Gemstone' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-3 rounded-full">
                      <Link
                        href={`/category/${cat.slug}?material=gold`}
                        className="flex flex-col items-center p-2 bg-yellow-100 rounded-md hover:scale-110 transition"
                      >
                        <FaGem className="text-yellow-600 text-xl" />
                        <span className="text-xs mt-1 text-yellow-800">Gold</span>
                      </Link>
                      <Link
                        href={`/category/${cat.slug}?material=silver`}
                        className="flex flex-col items-center p-2 bg-gray-100 rounded-md hover:scale-110 transition"
                      >
                        <FaRegGem className="text-gray-600 text-xl" />
                        <span className="text-xs mt-1 text-gray-800">Silver</span>
                      </Link>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full w-10 h-10 shadow flex items-center justify-center">
          <FaChevronRight className="text-pink-600" />
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;
