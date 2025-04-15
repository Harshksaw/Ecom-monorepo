'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaShoppingCart, FaArrowRight } from 'react-icons/fa';


interface Gem {
  type: string;
  carat: number;
  color: string;
  clarity: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  weight?: number;
  materials?: string[];
  gems?: Gem[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
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
        
        {/* Materials categories as per sketch */}
        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">Gold Collection</h3>
            <p className="text-gray-700 mb-4">
              Discover our exquisite range of gold jewelry crafted with precision and elegance.
            </p>
            <Link 
              href="/category/gold"
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              Explore Gold
            </Link>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-700 mb-3">Silver Collection</h3>
            <p className="text-gray-700 mb-4">
              Browse our stunning silver jewelry collection with contemporary designs at affordable prices.
            </p>
            <Link 
              href="/category/silver"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Explore Silver
            </Link>
          </div>
        </div> */}
      </div>
    </section>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Determine the material type for card background
  const materialType = product.materials && product.materials.length > 0
    ? product.materials[0].toLowerCase()
    : 'other';
  
  const cardBgColor = 
    materialType.includes('gold') 
      ? 'bg-yellow-50' 
      : materialType.includes('silver') 
        ? 'bg-gray-50'
        : 'bg-white';
  
  // Calculate discount percentage if sale price exists
  const discountPercentage = product.salePrice && product.price 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group ${cardBgColor}`}>
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block relative">
        {discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs z-10">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="relative w-full pt-[100%]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="absolute top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Favorite Button Overlay */}
          <button 
            onClick={toggleFavorite}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center z-10 transition-colors hover:bg-white"
          >
            <FaHeart className={isFavorite ? "text-pink-600" : "text-gray-400"} />
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-medium mb-2 line-clamp-2 text-gray-800 hover:text-pink-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Materials & Gems */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.materials && product.materials.slice(0, 2).map((material, idx) => (
            <span 
              key={idx} 
              className={`inline-block rounded-full px-2 py-1 text-xs ${
                material.toLowerCase().includes('gold')
                  ? 'bg-yellow-100 text-yellow-800'
                  : material.toLowerCase().includes('silver')
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-pink-100 text-pink-800'
              }`}
            >
              {material}
            </span>
          ))}
          {product.gems && product.gems.slice(0, 1).map((gem, idx) => (
            <span key={idx} className="inline-block bg-purple-50 rounded-full px-2 py-1 text-xs text-purple-700">
              {gem.type} {gem.carat}ct
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-pink-600 font-bold mr-2">
                  ₹{product.salePrice.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-pink-700 font-bold">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className={
            product.stockQuantity > 5 
              ? 'text-xs font-medium text-green-600' 
              : product.stockQuantity > 0 
                ? 'text-xs font-medium text-yellow-600' 
                : 'text-xs font-medium text-red-600'
          }>
            {product.stockQuantity > 5 
              ? 'In Stock' 
              : product.stockQuantity > 0 
                ? `Only ${product.stockQuantity} left` 
                : 'Out of Stock'}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          className={
            product.stockQuantity > 0 
              ? 'w-full px-4 py-2 rounded-md flex items-center justify-center text-sm bg-pink-600 text-white hover:bg-pink-700 transition-colors' 
              : 'w-full px-4 py-2 rounded-md flex items-center justify-center text-sm bg-gray-300 text-gray-500 cursor-not-allowed'
          }
          disabled={product.stockQuantity === 0}
        >
          <FaShoppingCart className="mr-2" />
          {product.stockQuantity > 0 ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

export default HomeProductGrid;