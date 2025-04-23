'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from './ProductCard';

interface Gem {
  type: string;
  carat: number;
  color: string;
  clarity: string;
  _id: string;
}

interface ProductVariant {
  metalColor: string;
  images: string[];
  price: {
    default: number;
    [key: string]: number;
  };
  stock: number;
  _id: string;
}

interface DeliveryOption {
  type: string;
  duration: string;
  price: number;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  weight?: {
    value: number;
    unit: string;
  };
  materials?: string[];
  gems?: Gem[];
  materialType?: string;
  purity?: string;
  shape?: string;
  variants: ProductVariant[];
  deliveryOptions?: DeliveryOption[];
  isActive: boolean;
  tags?: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

interface CategoryGroup {
  _id: string;
  name: string;
  slug: string;
  products: Product[];
}

interface ProductGridProps {
  products: Product[];
}

const HomeProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<{ [key: string]: number }>({});
  const sliderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  useEffect(() => {
    // Group products by category
    const groupedProducts: { [key: string]: CategoryGroup } = {};
    
    products.forEach(product => {
      const categoryId = product.categoryId._id;
      
      if (!groupedProducts[categoryId]) {
        groupedProducts[categoryId] = {
          _id: product.categoryId._id,
          name: product.categoryId.name,
          slug: product.categoryId.slug,
          products: []
        };
      }
      
      groupedProducts[categoryId].products.push(product);
    });
    
    // Convert to array and sort categories alphabetically
    const sortedGroups = Object.values(groupedProducts).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    setCategoryGroups(sortedGroups);
    
    // Initialize visible products count for each category
    const initialVisibleProducts: { [key: string]: number } = {};
    sortedGroups.forEach(category => {
      initialVisibleProducts[category._id] = getVisibleProductsCount();
    });
    setVisibleProducts(initialVisibleProducts);
  }, [products]);

  // Function to determine how many products to show based on screen size
  const getVisibleProductsCount = () => {
    if (typeof window === 'undefined') return 2; // Default for SSR
    
    const width = window.innerWidth;
    if (width >= 1280) return 4; // xl
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 1; // sm
  };

  // Update visible products count on window resize
  useEffect(() => {
    const handleResize = () => {
      const count = getVisibleProductsCount();
      setVisibleProducts(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = count;
        });
        return updated;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide functions
  const slideLeft = (categoryId: string) => {
    if (!sliderRefs.current[categoryId]) return;
    
    const slider = sliderRefs.current[categoryId];
    if (slider) {
      slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
    }
  };

  const slideRight = (categoryId: string) => {
    if (!sliderRefs.current[categoryId]) return;
    
    const slider = sliderRefs.current[categoryId];
    if (slider) {
      slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {categoryGroups.map((category) => (
          <div key={category._id} className="mb-16">
            <div className="flex justify-between items-center mb-8 border-b border-pink-200 pb-2">
              <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
              <Link 
                href={`/category/${category.slug}`}
                className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            <div className="relative group">
              {/* Left Arrow */}
              <button 
                onClick={() => slideLeft(category._id)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous products"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              
              {/* Slider Container */}
              <div 
              //@ts-ignore
                ref={el => sliderRefs.current[category._id] = el}
                className="flex overflow-x-auto scrollbar-hide snap-x scroll-smooth gap-6 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {category.products.map((product) => (
                  <div key={product._id} className="flex-none w-full md:w-1/2 lg:w-1/3 xl:w-1/4 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={() => slideRight(category._id)}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next products"
              >
                <FaChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HomeProductGrid;