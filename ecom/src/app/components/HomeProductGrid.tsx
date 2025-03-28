'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 py-8">
      {categoryGroups.map((category) => (
        <div key={category._id} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
            <Link 
              href={`/category/${category.slug}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
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
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // Calculate discount percentage if sale price exists
  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block relative">
        {/* {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs z-10">
            {discountPercentage}% OFF
          </div>
        )} */}
        <div className="relative w-full pt-[100%]">
          <Image 
            src={product.images[0]}
            alt={product.name}
            fill
            className="absolute top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link href={`/product/₹{product.sku.toLowerCase()}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Materials & Gems */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.materials && product.materials.slice(0, 2).map((material, idx) => (
            <span key={idx} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600">
              {material}
            </span>
          ))}
          {product.gems && product.gems.slice(0, 1).map((gem, idx) => (
            <span key={idx} className="inline-block bg-blue-50 rounded-full px-2 py-1 text-xs text-blue-600">
              {gem.type} {gem.carat}ct
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-bold mr-2">
                  ₹{product.salePrice.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-bold">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className={`text-xs font-medium ₹{
            product.stockQuantity > 5 
              ? 'text-green-600' 
              : product.stockQuantity > 0 
                ? 'text-yellow-600' 
                : 'text-red-600'
          }`}>
            {product.stockQuantity > 5 
              ? 'In Stock' 
              : product.stockQuantity > 0 
                ? `Only ${product.stockQuantity} left` 
                : 'Out of Stock'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button 
            className={`px-4 py-2 rounded flex items-center text-sm ₹{
              product.stockQuantity > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={product.stockQuantity === 0}
          >
            <FaShoppingCart className="mr-1" />
            {product.stockQuantity > 0 ? 'Add to Cart' : 'Sold Out'}
          </button>
          
          <button 
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Add to Wishlist"
          >
            <FaHeart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeProductGrid;