// src/app/cart/components/CartItemsList.tsx
'use client';

import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { updateCartItemQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../../../hooks/useCurrency';

// CartItem interface matching our Redux store
export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  metalColor: string;
  image: string;
  price: number; // Price in INR
  quantity: number;
  sku: string;
  stock: number;
}

interface CartItemsListProps {
  cartItems: CartItem[];
  dispatch: any; // Using any for simplicity, but could be typed as Dispatch
}

const CartItemsList = ({ cartItems, dispatch }: CartItemsListProps) => {
  // Use the currency hook for price formatting
  const { formatPrice } = useCurrency();
  
  // Handle quantity change
  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    // Get the item to update
    const item = cartItems.find(item => 
      item.productId === productId && item.variantId === variantId
    );
    
    if (!item) return;
    
    // Make sure quantity doesn't exceed stock
    const newQuantity = Math.min(quantity, item.stock);
    
    // Update cart with new quantity
    dispatch(updateCartItemQuantity({ 
      productId, 
      variantId, 
      quantity: newQuantity 
    }));
    
    toast.success('Cart updated');
  };

  // Handle remove item
  const handleRemoveItem = (productId: string, variantId: string) => {
    dispatch(removeFromCart({ productId, variantId }));
    toast.success('Item removed from cart');
  };

  return (
    <div>
      {/* Cart Header */}
      <div className="hidden md:grid grid-cols-5 border-b pb-4 mb-4">
        <div className="col-span-2 text-gray-700 font-medium">Product</div>
        <div className="text-center text-gray-700 font-medium">Price</div>
        <div className="text-center text-gray-700 font-medium">Quantity</div>
        <div className="text-center text-gray-700 font-medium">Total</div>
      </div>
      
      {/* Cart Items */}
      <div className="space-y-6">
        {cartItems.map((item) => {
          return (
            <div 
              key={`${item.productId}-${item.variantId}`} 
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b pb-6"
            >
              {/* Product Image & Name (Col 1-2) */}
              <div className="col-span-1 md:col-span-2 flex items-center space-x-4">
                {/* Image */}
                <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                
                {/* Name & Remove Button */}
                <div className="flex-grow">
                  <h3 className="text-md font-medium">{item.name}</h3>
                  {item.metalColor && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.metalColor.charAt(0).toUpperCase() + item.metalColor.slice(1)}
                    </p>
                  )}
                  <button 
                    onClick={() => handleRemoveItem(item.productId, item.variantId)}
                    className="text-sm text-red-500 mt-1 flex items-center gap-1 hover:text-red-700"
                  >
                    <FaTrash size={12} /> Remove
                  </button>
                </div>
              </div>
              
              {/* Unit Price (Col 3) */}
              <div className="md:text-center flex justify-between md:block">
                <span className="md:hidden text-gray-600">Price:</span>
                <div>
                  <span className="font-medium">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
              
              {/* Quantity (Col 4) */}
              <div className="md:text-center flex justify-between md:block">
                <span className="md:hidden text-gray-600">Quantity:</span>
                <div className="inline-block">
                  <select 
                    value={item.quantity}
                    onChange={(e) => updateQuantity(
                      item.productId, 
                      item.variantId, 
                      parseInt(e.target.value)
                    )}
                    className="border rounded p-1 w-16 text-center"
                  >
                    {Array.from({ length: Math.min(10, item.stock) }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Subtotal (Col 5) */}
              <div className="md:text-center flex justify-between md:block">
                <span className="md:hidden text-gray-600">Total:</span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty cart state */}
      {cartItems.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
            Continue Shopping
          </a>
        </div>
      )}
    </div>
  );
};

export default CartItemsList;