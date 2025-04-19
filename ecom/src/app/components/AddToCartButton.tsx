'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';

const AddToCartButton = ({ product }:any) => {
  // console.log("🚀 ~ AddToCartButton ~ product:", product)
  const [selectedSize, setSelectedSize] = useState(null);
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // if (!selectedSize) {
    //   setShowError(true);
    //   // Scroll to size selection
    //   document.getElementById('size-selection')?.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'center'
    //   });
    //   return;
    // }

    // Reset error state
    setShowError(false);

    // Create a payload for the cart
 

    // Dispatch the action to add item to cart
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      selectedSize: null,
      oneQuantityPrice: product.price,
      attributes: product.attributes,
      quantity: 1,                               // Add missing quantity
                     // Add missing price
    }));
    // Show success message
    toast.success(`${product.name} added to cart`);
  };

  return (
    <button
      className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;