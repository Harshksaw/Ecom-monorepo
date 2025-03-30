// src/app/cart/components/CartItemsList.tsx
'use client';

import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { updateCart, removeFromCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { CartItem } from '../types';
import { Dispatch } from 'redux';

interface CartItemsListProps {
  cartItems: CartItem[];
  dispatch: Dispatch;
}

const CartItemsList = ({ cartItems, dispatch }: CartItemsListProps) => {
  // Handle quantity change
  const updateQuantity = (id: string, quantity: number) => {
    // Get the item to update
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    
    // Calculate the new total price for this item
    const itemPrice = item.attributes?.salePrice || item.attributes?.price || item.oneQuantityPrice;
    const newPrice = itemPrice * quantity;

    // Update cart with both quantity and the new total price
    dispatch(updateCart({
      id,
      key: 'quantity',
      val: quantity
    }));
    
    dispatch(updateCart({
      id,
      key: 'price',
      val: newPrice
    }));
  };

  // Handle remove item
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart({ id }));
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
        {cartItems.map((item: CartItem) => {
          const displayPrice = item.price;
          const isOnSale = item.attributes?.salePrice && item.attributes.salePrice < (item.attributes.price || 0);
          
          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b pb-6">
              {/* Product Image & Name (Col 1-2) */}
              <div className="col-span-1 md:col-span-2 flex items-center space-x-4">
                {/* Image */}
                <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.attributes?.images?.[0] || '/placeholder.png'} 
                    alt={item.attributes?.name || 'Product'} 
                    fill 
                    className="object-cover"
                  />
                </div>
                
                {/* Name & Remove Button */}
                <div className="flex-grow">
                  <h3 className="text-md font-medium">{item.attributes?.name}</h3>
                  {item.attributes?.materials && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.attributes.materials.join(', ')}
                    </p>
                  )}
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
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
                  <span className={isOnSale ? "text-red-600 font-medium" : ""}>
                    ₹{displayPrice.toFixed(2)}
                  </span>
                  {isOnSale && item.attributes?.price && (
                    <span className="text-gray-400 line-through text-sm ml-2">
                      ₹{item.attributes.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Quantity (Col 4) */}
              <div className="md:text-center flex justify-between md:block">
                <span className="md:hidden text-gray-600">Quantity:</span>
                <div className="inline-block">
                  <select 
                    value={item.quantity || 1}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="border rounded p-1 w-16 text-center"
                  >
                    {[...Array(Math.min(10, item.attributes?.stockQuantity || 10))].map((_, i) => (
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
                  ₹{(displayPrice * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartItemsList;