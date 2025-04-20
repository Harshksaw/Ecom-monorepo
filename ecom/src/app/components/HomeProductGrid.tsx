'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';
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
  console.log("🚀 ~ products:", products)
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  
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
  }, [products]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {categoryGroups.map((category) => (
          <div key={category._id} className="mb-16">
            <div className="flex justify-between items-center mb-8 border-b border-pink-200 pb-2">
              <h2 className="text-2xl font-bold text-pink-800">{category.name}</h2>
              <Link 
                href={`/category/${category.slug}`}
                className="flex items-center text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};



export default HomeProductGrid;