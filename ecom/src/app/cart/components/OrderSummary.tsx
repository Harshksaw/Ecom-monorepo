// src/app/cart/components/OrderSummary.tsx
'use client';

import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Address } from '../types';
import { useCurrency } from '../../../hooks/useCurrency';

interface OrderSummaryProps {
  subtotal: number;

  shipping: number;
  total: number;
  isProcessing: boolean;
  isCheckoutReady: () => boolean;
  handleCheckout: () => void;
  showAddressRequired: boolean;
  defaultShippingAddress: Address | null;
}

const OrderSummary = ({
  subtotal,

  shipping,
  total,
  isProcessing,
  isCheckoutReady,
  handleCheckout,
  showAddressRequired,
  defaultShippingAddress
}: OrderSummaryProps) => {
  // Use the currency hook for price formatting
  const { formatPrice, selectedCurrency } = useCurrency();
  
  // Calculate free shipping threshold based on currency
  const freeShippingThreshold = 2000; // In INR
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      
      {/* Summary Details */}
      <div className="space-y-3 border-b pb-4 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
   
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
      </div>
      
      {/* Total */}
      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      
      {/* Special Offers */}
      {shipping > 0 && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded mb-6 text-sm">
          Add {formatPrice(remainingForFreeShipping)} more to qualify for free shipping!
        </div>
      )}
      
      {/* Address required warning */}
      {showAddressRequired && !defaultShippingAddress && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm flex items-start">
          <FaExclamationTriangle className="flex-shrink-0 mr-2 mt-1" />
          <p>Please add a shipping address before proceeding to checkout</p>
        </div>
      )}
      
      {/* Payment notice for international customers */}
      {selectedCurrency !== 'INR' && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-6 text-sm">
          Your payment will be processed in INR. Your bank may apply currency conversion fees.
        </div>
      )}
      
      {/* Checkout Button */}
      <button 
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
          isProcessing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : isCheckoutReady()
              ? 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
              : 'bg-gray-300 text-gray-700 cursor-not-allowed'
        }`}
        onClick={handleCheckout}
        disabled={isProcessing || !isCheckoutReady()}
      >
        <FaShieldAlt className="mr-2" />
        {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
      </button>
      
      {/* Secure Payments */}
      <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center">
        <FaShieldAlt className="mr-1" />
        <p>100% Secure Payments | All major cards accepted</p>
      </div>
    </div>
  );
};

export default OrderSummary;