// src/app/cart/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Wrapper from '../components/Wrapper';
import EmptyCart from './EmptyCart';
import { useAuth } from '../context/authcontext';
import { API_URL } from '../lib/api';
import { useCurrency } from '../../hooks/useCurrency';

// Import our components
import CartItemsList from './components/CartItemsList';
import ShippingAddressSection from './components/ShippingAddressSection';
import OrderSummary from './components/OrderSummary';

// Types
import { UserProfile, Address } from './types';
import axios from 'axios';
import { selectCartItems } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  
  // State management
  const [orderState, setOrderState] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });
  
  const [userState, setUserState] = useState({
    userId: '',
    userProfile: null as UserProfile | null,
    defaultShippingAddress: null as Address | null,
    isInternationalCustomer: false,
    isAddressLoading: true,
    showAddressRequired: false
  });
  
  const [processingState, setProcessingState] = useState({
    isProcessing: false
  });
  
  // Calculate delivery cost based on delivery options and type
  const calculateDeliveryCost = useCallback((
    deliveryOptions: { type: string; price: number }[],
    selectedType: string
  ): number => {
    if (!Array.isArray(deliveryOptions) || deliveryOptions.length === 0) {
      return 0;
    }
  
    const selectedOption = deliveryOptions.find(
      (option) => option.type.toLowerCase() === selectedType.toLowerCase()
    );
  
    return selectedOption ? selectedOption.price : 0;
  }, []);

  // Calculate delivery cost whenever relevant state changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const deliveryType = userState.isInternationalCustomer ? 'International' : 'Standard';
      
      // Calculate shipping cost for each item in the cart
      const deliveryCost = cartItems.reduce((total, item) => {
        // Check if item has deliveryOptions and it's an array
        const deliveryOptions = item.deliveryOptions && 
                               Array.isArray(item.deliveryOptions) ? 
                               item.deliveryOptions : [];
        
        // Calculate per-item delivery cost and multiply by quantity
        const itemDeliveryCost = calculateDeliveryCost(deliveryOptions, deliveryType);
        const quantity = item.quantity || 1;
        
        // Add to total
        return total + (itemDeliveryCost * quantity);
      }, 0);
      
      // Update order state with new shipping cost
      setOrderState(prev => ({
        ...prev,
        shipping: deliveryCost
      }));
    } else {
      // Reset shipping cost if cart is empty
      setOrderState(prev => ({
        ...prev,
        shipping: 0
      }));
    }
  }, [cartItems, userState.isInternationalCustomer, calculateDeliveryCost]);

  // Load user profile and addresses
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setUserState(prev => ({ ...prev, isAddressLoading: true }));
        
        // Get user info from localStorage
        const userInfo = localStorage.getItem('user');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          if (parsedUser && parsedUser.id) {
            setUserState(prev => ({ ...prev, userId: parsedUser.id }));
            
            // Use your API to get user profile
            const response = await axios.get(`${API_URL}/auth/profile/${parsedUser.id}`);
            
            if (response.status === 200) {
              const userData = response.data;
              
              if (userData && userData.user) {
                // Find default addresses
                let defaultShipping = null;
                let isInternational = false;
                
                if (userData.user.addresses && userData.user.addresses.length > 0) {
                  defaultShipping = userData.user.addresses.find(
                    (addr: Address) => addr.isDefault
                  );
                  
                  // If no default shipping found, use the first shipping address
                  const firstShipping = userData.user.addresses[0];
                  
                  defaultShipping = defaultShipping || firstShipping || null;
                  isInternational = (defaultShipping?.country !== 'India');
                }
                
                setUserState(prev => ({
                  ...prev,
                  userProfile: userData.user,
                  defaultShippingAddress: defaultShipping,
                  isInternationalCustomer: isInternational
                }));
              }
            } else {
              console.error('Failed to fetch user profile');
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setUserState(prev => ({ ...prev, isAddressLoading: false }));
      }
    };
    
    loadUserProfile();
  }, [token]);

  // Calculate totals whenever cart items change
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Calculate subtotal - always in INR (base currency)
      const subtotalValue = cartItems.reduce((total, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0);
      
      // Update order state with new calculations
      setOrderState(prev => {
        return {
          ...prev,
          subtotal: subtotalValue,
          total: subtotalValue + prev.shipping
        };
      });
    } else {
      // Reset all values if cart is empty
      setOrderState({
        subtotal: 0,
        shipping: 0,
        total: 0
      });
    }
  }, [cartItems, orderState.shipping]);

  // Check if all required information is available for checkout
  const isCheckoutReady = useCallback((): boolean => {
    // Check if cart is not empty
    if (cartItems.length === 0) return false;
    
    const { userProfile, defaultShippingAddress } = userState;
    
    // Check if user profile exists with required fields
    if (!userProfile || !userProfile.firstName || !userProfile.email) return false;
    
    // Check if shipping address exists
    if (!defaultShippingAddress) return false;
    
    // Check if shipping address has all required fields
    if (
      !defaultShippingAddress.addressLine1 ||
      !defaultShippingAddress.city ||
      !defaultShippingAddress.state ||
      !defaultShippingAddress.postalCode
    ) return false;
    
    return true;
  }, [cartItems, userState]);

  // Navigate to checkout page
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
  
    if (!isCheckoutReady()) {
      setUserState(prev => ({ ...prev, showAddressRequired: true }));
      toast.error('Please add your shipping address to continue');
      return;
    }
  
    // Navigate to checkout page
    router.push('/checkout');
  };

  // Navigate to profile page to add address
  const handleAddAddress = () => {
    router.push('/profile');
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <Wrapper>
        <div className="py-10">
          <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Shopping Cart</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="flex-grow">
              <CartItemsList 
                cartItems={cartItems} 
                dispatch={dispatch} 
              />
              
              {/* Continue Shopping */}
              <div className="mt-8">
                <Link 
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-2">←</span>
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Right Column - Order Summary & Shipping Address */}
            <div className="lg:w-96 flex-shrink-0 space-y-6">
              {/* Shipping Address Section */}
              <ShippingAddressSection 
                isAddressLoading={userState.isAddressLoading}
                defaultShippingAddress={userState.defaultShippingAddress}
                userProfile={userState.userProfile}
                showAddressRequired={userState.showAddressRequired}
                handleAddAddress={handleAddAddress}
              />
              
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(orderState.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatPrice(orderState.shipping)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">{formatPrice(orderState.total)}</span>
                </div>
                
                {/* Proceed to Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!isCheckoutReady() || processingState.isProcessing}
                  className={`w-full py-3 px-4 flex items-center justify-center rounded-lg ${
                    isCheckoutReady() && !processingState.isProcessing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors duration-200`}
                >
                  {processingState.isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Proceed to Checkout</>
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
            </div>
          </div>

        </div>
      </Wrapper>
    </>
  );
}


export default CartPage;