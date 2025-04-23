// src/app/checkout/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Wrapper from '../components/Wrapper';
import Script from "next/script";
import { useAuth } from '../context/authcontext';
import { API_URL } from '../lib/api';
import { useCurrency } from '../../hooks/useCurrency';

// Import our components
import CartItemsList from '../cart/components/CartItemsList';
import ShippingAddressSection from '../cart/components/ShippingAddressSection';



// Types
import { UserProfile, Address } from '../cart/types';
import axios from 'axios';
import { clearCart, selectCartItems } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import OrderSummary from '../cart/components/OrderSummary';
import PaymentMethodSelector from './components/PaymentSelector';

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { token } = useAuth();
  const { selectedCurrency, formatPrice } = useCurrency();
  
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

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('payoneer');
  
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
                    (addr: Address) =>  addr.isDefault
                  );
                  
                  // If no default shipping found, use the first shipping address
                  const firstShipping = userData.user.addresses[0]
                  
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
      // Calculate subtotal
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

  // Handle checkout with Payoneer
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
  
    if (!isCheckoutReady()) {
      setUserState(prev => ({ ...prev, showAddressRequired: true }));
      toast.error('Please add your shipping address to continue');
      return;
    }
  
    setProcessingState({ isProcessing: true });
    const toastId = toast.loading('Creating your order...');
  
    try {
      const { subtotal, shipping, total } = orderState;
      const { userId, defaultShippingAddress, userProfile } = userState;

      const formattedItems = cartItems.map((item: any) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));
  
      // Step 1: Create order with "pending" status - This happens in a single transaction with payment processing
      const response = await fetch(`${API_URL}/orders/create/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total,
          receipt: `receipt_${Date.now()}`,
          subtotal,
          shippingCost: shipping,
          shippingAddress: defaultShippingAddress,
          items: formattedItems,
          paymentMethod: paymentMethod,
          status: 'pending'
        })
      });
  
      const orderData = await response.json();
  
      // Check response
      if (!orderData.orderId) {
        throw new Error(orderData.message || 'Failed to create order');
      }
  
      toast.success('Order created successfully!', { id: toastId });
  
      // Step 2: Redirect to Payoneer payment page
      if (paymentMethod === 'payoneer') {
        // Initialize Payoneer payment
        const paymentResponse = await fetch(`${API_URL}/payments/initiate-payoneer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: orderData.orderId,
            amount: total,
            currency: selectedCurrency,
            customerEmail: userProfile?.email,
            customerName: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '',
            description: `Order #${orderData.orderId}`
          })
        });
        
        const paymentData = await paymentResponse.json();
        
        if (paymentData.paymentUrl) {
          // Redirect to Payoneer payment page
          window.location.href = paymentData.paymentUrl;
        } else {
          throw new Error(paymentData.message || 'Failed to initialize payment');
        }
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to initiate checkout. Please try again.', { id: toastId });
    } finally {
      setProcessingState({ isProcessing: false });
    }
  };

  // Navigate to profile page to add address
  const handleAddAddress = () => {
    router.push('/profile');
  };

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  return (
    <>
      <Wrapper>
        <div className="py-10">
          <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Checkout</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Shipping Information and Payment Method */}
            <div className="flex-grow space-y-6">
              {/* Checkout Steps */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">1</div>
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                
                <ShippingAddressSection 
                  isAddressLoading={userState.isAddressLoading}
                  defaultShippingAddress={userState.defaultShippingAddress}
                  userProfile={userState.userProfile}
                  showAddressRequired={userState.showAddressRequired}
                  handleAddAddress={handleAddAddress}
                />
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">2</div>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <PaymentMethodSelector
                icon={null}
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                />
              </div>
              
              {/* Order Review */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">3</div>
                  <h2 className="text-xl font-semibold">Review Your Order</h2>
                </div>
                
                <CartItemsList 
                  cartItems={cartItems} 
                  dispatch={dispatch}
                  // readOnly={true}
                />
              </div>
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <OrderSummary
                  subtotal={orderState.subtotal}
                  shipping={orderState.shipping}
                  total={orderState.total}
                  isProcessing={processingState.isProcessing}
                  isCheckoutReady={isCheckoutReady}
                  handleCheckout={handleCheckout}
                  paymentMethod={paymentMethod}
                  showAddressRequired={userState.showAddressRequired}
                  defaultShippingAddress={userState.defaultShippingAddress}
                />
                
                <div className="mt-6 text-sm text-gray-500">
                  By placing your order, you agree to our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and acknowledge our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
      
      {/* Load Payoneer script if needed */}
      <Script
        src="https://www.payoneer.com/api/payoneer.js"
        strategy="beforeInteractive"
      />
    </>
  );
};

export default CheckoutPage;