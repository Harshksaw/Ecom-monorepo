
// src/components/ProductDetails.tsx
'use client';

import { useState } from 'react';
import { FaRuler, FaWeight, FaShippingFast, FaCheck } from 'react-icons/fa';
import ProductDetailsCarousel from './ProductDetailsCarousel';
import AddToCartButton from './AddToCartButton';

// Interfaces (can be moved to a shared types file)
interface ProductVariant {
  _id: string;
  metalColor: string;
  images: (string | null)[];
  price: { default: number; USD?: number };
  stock: number;
}

interface Dimensions {
  length: number;
  width: number;
  height?: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  categoryId: { _id: string; name: string; slug: string };
  images: (string | null)[];
  weight?: { value: number; unit: string };
  materialType: string;
  purity: string;
  gems?: { type: string; carat: number }[];
  variants: ProductVariant[];
  dimensions?: Dimensions;
  tags?: string[];
}

type ProductDetailsProps = { product: Product };

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex];

  const displayImages = [
    ...(selectedVariant.images || []),
    ...(product.images || [])
  ].filter((img): img is string => img !== null);

  return (
    <div className="w-full py-8 md:py-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="text-sm mb-6 text-gray-500">
        <span>Home</span> / <span>{product.categoryId.name}</span> / <span className="text-pink-600">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-3/5">
          <div className="bg-white p-4 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <ProductDetailsCarousel images={displayImages} />
          </div>

          {displayImages.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {displayImages.slice(0, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 relative rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-pink-300 transition-all"
                  style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  onClick={() => {/* optionally sync with main carousel */}}
                />
              ))}
              {displayImages.length > 5 && (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{displayImages.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/5">
          <div className="uppercase tracking-wider text-sm text-pink-600 mb-2">
            {product.categoryId.name}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
            {product.name}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              product.materialType.toLowerCase().includes('gold')
                ? 'bg-yellow-100 text-yellow-800'
                : product.materialType.toLowerCase().includes('silver')
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-pink-100 text-pink-800'
            }`}>
              {product.materialType} {product.purity}
            </span>

            {product.gems && product.gems.length > 0 && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.gems[0].type} {product.gems[0].carat}ct
              </span>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                ₹{selectedVariant.price.default.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-2">incl. taxes</span>
            </div>
            <div className={`text-sm font-medium mt-1 ${
              selectedVariant.stock > 5
                ? 'text-green-600'
                : selectedVariant.stock > 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              {selectedVariant.stock > 5
                ? 'In Stock'
                : selectedVariant.stock > 0
                  ? `Only ${selectedVariant.stock} left in stock`
                  : 'Out of Stock'}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-6">
            <FaShippingFast className="mr-2 text-pink-600" />
            Free shipping on orders above ₹5,000
          </div>

          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Metal Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      idx === selectedVariantIndex
                        ? 'bg-pink-600 text-white ring-2 ring-pink-300 ring-offset-2'
                        : 'bg-gray-100 text-gray-800 hover:bg-pink-50'
                    }`}
                  >
                    {variant.metalColor.charAt(0).toUpperCase() + variant.metalColor.slice(1)}
                    {idx === selectedVariantIndex && <FaCheck className="inline-block ml-1 text-xs" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <div className="flex-grow">
              <AddToCartButton product={product} variant={selectedVariant} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mb-8 hover:shadow-sm transition-all">
            <h3 className="font-semibold mb-3 text-gray-800">Highlights</h3>
            <p className="text-gray-700 mb-4">{product.description.split('.')[0]}.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Material:</span>
                <span className="ml-1 text-gray-600">{product.materialType} {product.purity}</span>
              </div>
              {product.weight && (
                <div className="text-sm flex items-center">
                  <FaWeight className="mr-1 text-gray-500" size={12} />
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-1 text-gray-600">{product.weight.value} {product.weight.unit}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium text-gray-700">SKU:</span>
                <span className="ml-1 text-gray-600">{product.sku}</span>
              </div>
              {product.dimensions && (
                <div className="text-sm flex items-center">
                  <FaRuler className="mr-1 text-gray-500" size={12} />
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="ml-1 text-gray-600">{product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height || 0} mm</span>
                </div>
              )}
            </div>
          </div>

          {product.variants.length > 1 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 border-b pb-2">Available Variants</h3>
              <div className="space-y-3">
                {product.variants.map((variant, idx) => (
                  <div
                    key={variant._id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`bg-white border cursor-pointer transition-all ${
                      idx === selectedVariantIndex
                        ? 'border-pink-500 bg-pink-50/50 shadow-md'
                        : 'border-gray-200 hover:border-pink-300'
                    } p-3 rounded-xl`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {variant.images[0] && (
                          <div
                            className="w-10 h-10 rounded-lg mr-3 bg-center bg-cover"
                            style={{ backgroundImage: `url(${variant.images[0]})` }}
                          />
                        )}
                        <div className="font-medium text-gray-800">{variant.metalColor.charAt(0).toUpperCase() + variant.metalColor.slice(1)}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        variant.stock > 5
                          ? 'text-green-600'
                          : variant.stock > 0
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>{variant.stock > 0 ? `In Stock (${variant.stock})` : 'Out of Stock'}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Price: ₹{variant.price.default.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="font-semibold mb-3 border-b pb-2">Description</h3>
            <div className="text-sm text-gray-700 space-y-2">
              {product.description.split('\n').map((para, i) => (<p key={i}>{para}</p>))}
            </div>
          </div>

          {product.tags && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (<span key={tag} className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors">#{tag}</span>))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
