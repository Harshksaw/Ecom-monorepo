// src/components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCurrency } from '../../hooks/useCurrency';

// Interfaces for the component props
interface ProductVariant {
  _id: string;
  metalColor: string;
  images: (string | null)[];
  price: { default: number; USD?: number };
  stock: number;
}

interface Gem {
  _id?: string;
  type: string;
  carat: number;
  color?: string;
  clarity?: string;
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
}

interface AddToCartButtonProps {
  product: Product;
  variant: ProductVariant;
}

export default function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the currency hook for price formatting
  const { formatPrice } = useCurrency();

  // Handle quantity increase/decrease
  const handleIncreaseQuantity = () => {
    if (variant.stock > quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle add to cart action
  const handleAddToCart = () => {
    if (!variant) return;
    
    setIsLoading(true);
    
    // Create cart item from product and variant
    const cartItem = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      metalColor: variant.metalColor,
      image: variant.images[0] || product.images[0] || '',
      price: variant.price.default,
      quantity: quantity,
      sku: product.sku,
      stock: variant.stock
    };
    
    console.log("🚀 Dispatching addToCart with:", cartItem);
    dispatch(addToCart(cartItem));
    
    // Show success feedback
    setIsAdded(true);
    setIsLoading(false);
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  // Determine if button should be disabled
  const isDisabled = !variant?.stock || variant.stock <= 0 || isLoading;

  return (
    <div className="w-full">
      {/* Quantity control and Add to Cart button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1 || isDisabled}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <span className="w-10 h-10 flex items-center justify-center bg-white text-gray-800 font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncreaseQuantity}
            disabled={quantity >= variant?.stock || isDisabled}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
        
        <button 
          className={`flex-grow px-4 py-3 flex items-center justify-center gap-2 font-medium rounded-xl transition-all ${
            isAdded 
              ? 'bg-green-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          } disabled:opacity-70 disabled:cursor-not-allowed shadow-sm`}
          onClick={() => handleAddToCart()}
          disabled={isDisabled}
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : isAdded ? (
            <>
              <FaCheck />
              Added to Cart
            </>
          ) : (
            <>
              <FaShoppingCart className="text-indigo-200" />
              <span>Add to Cart</span>
              {/* <span className="ml-1 text-indigo-200">{formatPrice(variant?.price?.default || 0)}</span> */}
            </>
          )}
        </button>
      </div>
      
      {/* Stock status message - uncomment if needed */}
      {/* {variant?.stock <= 5 && variant.stock > 0 && (
        <div className="text-xs text-amber-600 mt-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Only {variant.stock} left in stock - order soon
        </div>
      )}
      {variant?.stock <= 0 && (
        <div className="text-xs text-red-600 mt-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Out of stock - please check back later
        </div>
      )} */}
    </div>
  );
}