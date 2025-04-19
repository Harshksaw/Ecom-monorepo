// src/components/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';

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
    
    // Dispatch the addToCart action
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
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1 || isDisabled}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="w-10 h-10 flex items-center justify-center bg-white text-gray-800 font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncreaseQuantity}
            disabled={quantity >= variant?.stock || isDisabled}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        
        <button 
          className={`flex-grow px-4 py-3 flex items-center justify-center gap-2 font-medium rounded-xl transition-all ${
            isAdded 
              ? 'bg-green-600 text-white' 
              : 'bg-pink-600 hover:bg-pink-700 text-white'
          } disabled:opacity-70 disabled:cursor-not-allowed`}
          onClick={handleAddToCart}
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
              <FaShoppingCart />
              Add to Cart
            </>
          )}
        </button>
      </div>
      
      {/* Stock status message */}
      {variant?.stock <= 5 && variant.stock > 0 && (
        <div className="text-xs text-yellow-600 mt-2">
          Only {variant.stock} left in stock - order soon
        </div>
      )}
      {variant?.stock <= 0 && (
        <div className="text-xs text-red-600 mt-2">
          Out of stock - please check back later
        </div>
      )}
    </div>
  );
}