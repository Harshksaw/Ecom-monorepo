// src/app/cart/components/OrderSummary.tsx
import React from 'react';
import { useCurrency } from '../../../hooks/useCurrency';
import { Address } from '../../cart/types';
import { FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  isProcessing: boolean;
  isCheckoutReady: () => boolean;
  handleCheckout: () => void;
  paymentMethod?: string;
  showAddressRequired: boolean;
  defaultShippingAddress: Address | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  total,
  isProcessing,
  isCheckoutReady,
  handleCheckout,
  paymentMethod,
  showAddressRequired,
  defaultShippingAddress
}) => {
  const { formatPrice } = useCurrency();
  
  // Get the payment method display name if provided
  const getPaymentMethodName = () => {
    if (!paymentMethod) return null;
    
    switch(paymentMethod) {
      case 'razorpay':
        return 'Razorpay';
      case 'payoneer':
        return 'Payoneer';
      case 'credit-card':
        return 'Credit Card';
      case 'bank-transfer':
        return 'Bank Transfer';
      default:
        return 'Selected payment method';
    }
  };

  return (
    <div>
      {/* Order Items Summary */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">{formatPrice(shipping)}</span>
        </div>
      </div>
      
      {/* Total */}
      <div className="flex justify-between mb-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold">{formatPrice(total)}</span>
      </div>
      
      {/* Payment Method Summary - Show only on checkout page */}
      {paymentMethod && (
        <div className="bg-gray-50 p-3 rounded mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">{getPaymentMethodName()}</span>
          </div>
        </div>
      )}
      
      {/* Warning if address is missing */}
      {showAddressRequired && !defaultShippingAddress && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm">
          Please add a shipping address to continue with your purchase.
        </div>
      )}
      
      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={!isCheckoutReady() || isProcessing}
        className={`w-full py-3 px-4 flex items-center justify-center rounded-lg ${
          isCheckoutReady() && !isProcessing
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } transition-colors duration-200`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <FaShoppingBag className="mr-2 h-5 w-5" />
            {paymentMethod ? 'Complete Purchase' : 'Proceed to Checkout'}
          </>
        )}
      </button>
      
      {/* Security Notice */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center mb-1">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Checkout
        </div>
        <p>Your payment information is processed securely.</p>
      </div>
    </div>
  );
};

export default OrderSummary;