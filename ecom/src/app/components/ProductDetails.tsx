// src/components/ProductDetails.tsx
'use client';

import { useState } from 'react';
import { 
  FaRuler, 
  FaWeight, 
  FaShippingFast, 
  FaCheck, 
  FaGem, 
  FaDollarSign, 
  FaRupeeSign, 
  FaTags, 
  FaPalette, 
  FaCut, 
  FaBox
} from 'react-icons/fa';
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

interface Gem {
  _id?: string;
  type: string;
  carat: number;
  color?: string;
  clarity?: string;
}

interface DeliveryOption {
  _id?: string;
  type: string;
  duration: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  categoryId: { _id: string; name: string; slug: string };
  images: (string | null)[];
  weight?: { value: number; unit: string };
  materials?: string[];
  materialType: string;
  purity: string;
  shape?: string;
  gems?: Gem[];
  variants: ProductVariant[];
  dimensions?: Dimensions;
  deliveryOptions?: DeliveryOption[];
  tags?: string[];
}

type ProductDetailsProps = { product: Product };

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD'>('INR');
  
  const selectedVariant = product?.variants?.[selectedVariantIndex] || product?.variants?.[0];

  const displayImages = [
    ...(selectedVariant?.images || []),
    ...(product?.images || [])
  ].filter((img): img is string => img !== null);

  // Get the current price based on selected currency
  const getCurrentPrice = () => {
    if (!selectedVariant?.price) return 'N/A';
    
    if (selectedCurrency === 'USD' && selectedVariant.price?.USD) {
      return `$${selectedVariant.price.USD.toLocaleString()}`;
    } else {
      return `₹${selectedVariant.price.default.toLocaleString()}`;
    }
  };

  // Get clarity description
  const getClarityDescription = (clarity?: string) => {
    if (!clarity) return '';
    
    const clarityMap: Record<string, string> = {
      'IF': 'Internally Flawless',
      'VVS1': 'Very Very Slightly Included (1)',
      'VVS2': 'Very Very Slightly Included (2)',
      'VS1': 'Very Slightly Included (1)',
      'VS2': 'Very Slightly Included (2)',
      'SI1': 'Slightly Included (1)',
      'SI2': 'Slightly Included (2)',
    };
    
    return clarityMap[clarity] || clarity;
  };

  return (
    <div className="w-full py-8 px-20 md:py-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="text-sm mb-6 text-gray-500">
        <span>Home</span> / <span>{product?.categoryId?.name}</span> / <span className="text-pink-600">{product?.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left column with product images */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white p-4 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <ProductDetailsCarousel images={displayImages} />
          </div>

          {/* Thumbnail navigation */}
          {displayImages.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {displayImages.slice(0, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 relative rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-pink-300 transition-all"
                  style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ))}
              {displayImages.length > 5 && (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{displayImages.length - 5} more
                </div>
              )}
            </div>
          )}

          {/* Gem details section */}
          {product?.gems && product.gems.length > 0 && (
            <div className="mt-8 bg-white p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center text-gray-800">
                <FaGem className="mr-2 text-blue-500" />
                Gemstone Details
              </h3>
              
              <div className="space-y-4">
                {product.gems.map((gem, index) => (
                  <div key={`gem-${index}`} className="border border-gray-100 rounded-xl p-4 bg-blue-50/30">
                    <div className="flex  flex-row items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <FaGem />
                      </div>
                      <h4 className="font-medium">{gem.type}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">Carat:</span>
                        <span className="ml-1 text-gray-600">{gem.carat}</span>
                      </div>
                      
                      {gem.color && (
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700">Color:</span>
                          <span className="ml-1 text-gray-600">{gem.color}</span>
                        </div>
                      )}
                      
                      {gem.clarity && (
                        <div className="flex items-center col-span-2">
                          <span className="font-medium text-gray-700">Clarity:</span>
                          <span className="ml-1 text-gray-600">
                            {gem.clarity} {getClarityDescription(gem.clarity) && `(${getClarityDescription(gem.clarity)})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column with product details */}
        <div className="w-full lg:w-2/5">
          <div className="uppercase tracking-wider text-sm text-pink-600 mb-2">
            {product?.categoryId?.name}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
            {product?.name}
          </h1>

          {/* Materials and shape */}
          <div className="flex  flex-row flex-wrap gap-2 mb-4">
            <span className={` px-3 py-1 rounded-full text-xs font-medium flex  flex-row items-center ${
              product?.materialType?.toLowerCase().includes('gold')
                ? 'bg-yellow-100 text-yellow-800'
                : product?.materialType?.toLowerCase().includes('silver')
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-pink-100 text-pink-800'
            }`}>
              <FaPalette className="mr-1" />
              {product?.materialType} {product?.purity}
            </span>

            {product?.shape && (
              <span className="flex-row px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center">
                <FaCut className="mr-1" />
                {product.shape} cut
              </span>
            )}

            {product?.gems && product.gems.length > 0 && (
              <span className="flex-row px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
                <FaGem className="mr-1" />
                {product.gems[0].type} {product.gems[0].carat}ct
              </span>
            )}
          </div>

          {/* Currency selector */}
          <div className="mb-4 flex">
            <button
              onClick={() => setSelectedCurrency('INR')}
              className={`flex items-center justify-center px-3 py-1 rounded-l-md text-sm font-medium transition-colors border ${
                selectedCurrency === 'INR' 
                  ? 'bg-pink-600 text-white border-pink-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaRupeeSign className="mr-1" />
              INR
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`flex items-center justify-center px-3 py-1 rounded-r-md text-sm font-medium transition-colors border ${
                selectedCurrency === 'USD' 
                  ? 'bg-pink-600 text-white border-pink-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaDollarSign className="mr-1" />
              USD
            </button>
          </div>

          {/* Price information */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                {getCurrentPrice()}
              </span>
              <span className="text-sm text-gray-500 ml-2">incl. taxes</span>
            </div>
            <div className={`text-sm font-medium mt-1 ${
              selectedVariant?.stock > 5
                ? 'text-green-600'
                : selectedVariant?.stock > 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              {selectedVariant?.stock > 5
                ? 'In Stock'
                : selectedVariant?.stock > 0
                  ? `Only ${selectedVariant.stock} left in stock`
                  : 'Out of Stock'}
            </div>
          </div>

          {/* Shipping notice */}
        

          {/* Variant Selection */}
          {product?.variants?.length > 1 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <FaPalette className="mr-2 text-pink-600" />
                Select Metal Color
              </h3>
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

          {/* Add to cart button */}
       

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex-grow">
              <AddToCartButton product={product} variant={selectedVariant} />
            </div>
            <button 
              className="px-4 py-3 mx-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-4xl hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={!selectedVariant?.stock || selectedVariant.stock <= 0}
              onClick={() => {
                // This would typically navigate to checkout with the product
                alert('Proceeding to checkout with ' + product?.name);
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Product highlights */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mb-8 hover:shadow-sm transition-all">
            <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
              <FaBox className="mr-2 text-pink-600" />
              Highlights
            </h3>
            <p className="text-gray-700 mb-4">
              {product?.description?.split('.')?.[0] ? `${product.description.split('.')[0]}.` : ''}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Material:</span>
                <span className="ml-1 text-gray-600">{product?.materialType} {product?.purity}</span>
              </div>
              {product?.weight && (
                <div className="text-sm flex items-center">
                  <FaWeight className="mr-1 text-gray-500" size={12} />
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-1 text-gray-600">{product.weight.value} {product.weight.unit}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium text-gray-700">SKU:</span>
                <span className="ml-1 text-gray-600">{product?.sku}</span>
              </div>
              {product?.dimensions && (
                <div className="text-sm flex items-center">
                  <FaRuler className="mr-1 text-gray-500" size={12} />
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="ml-1 text-gray-600">
                    {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height || 0} mm
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery options */}
          {product?.deliveryOptions && product.deliveryOptions.length > 0 && (
            <div className="bg-white border border-gray-100 p-4 rounded-xl mb-8 shadow-sm">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                <FaShippingFast className="mr-2 text-pink-600" />
                Delivery Options
              </h3>
              
              <div className="space-y-3">
                {product.deliveryOptions.map((option, index) => (
                  <div key={`delivery-${option._id || index}`} className="flex justify-between items-center p-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-800">
                        {option.type.charAt(0).toUpperCase() + option.type.slice(1)} Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.duration}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {option.price > 0 ? `₹${option.price}` : 'Free'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant comparison */}
          {product?.variants?.length > 1 && (
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
                        <div className="font-medium text-gray-800">
                          {variant.metalColor.charAt(0).toUpperCase() + variant.metalColor.slice(1)}
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        variant.stock > 5
                          ? 'text-green-600'
                          : variant.stock > 0
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>
                        {variant.stock > 0 ? `In Stock (${variant.stock})` : 'Out of Stock'}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <div>
                        {selectedCurrency === 'INR' && (
                          <span>₹{variant.price.default.toLocaleString()}</span>
                        )}
                        {selectedCurrency === 'USD' && variant.price.USD !== undefined && (
                          <span>${variant.price.USD.toLocaleString()}</span>
                        )}
                      </div>
                      {idx === selectedVariantIndex && (
                        <span className="text-pink-600 font-medium">Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product description */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 border-b pb-2">Description</h3>
            <div className="text-sm text-gray-700 space-y-2">
              {product?.description?.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Materials list */}
          {product?.materials && product.materials.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 border-b pb-2 flex items-center">
                <FaGem className="mr-2 text-pink-600" />
                Materials Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material, index) => (
                  <span 
                    key={`material-${index}`} 
                    className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product?.tags && product.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center text-sm">
                <FaTags className="mr-2 text-pink-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}