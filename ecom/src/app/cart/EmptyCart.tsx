// src/app/cart/EmptyCart.tsx
import React from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import Wrapper from '../components/Wrapper';

const EmptyCart = () => {
  return (
    <Wrapper>
      <div className="py-16 text-center">
        <div className="inline-block p-6 rounded-full bg-gray-100 text-gray-500 mb-8">
          <FaShoppingCart size={60} />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Looks like you haven't added any jewelry to your cart yet. 
          Explore our collections to find something you'll love!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Collections
          </Link>
          
          {/* <Link
            href="/category/rings"
            className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Popular Items <FaArrowRight className="ml-2" />
          </Link> */}
        </div>
        
        {/* Suggested Products */}
   
      </div>
    </Wrapper>
  );
};

export default EmptyCart;