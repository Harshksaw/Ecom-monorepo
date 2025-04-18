// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Wrapper from '../components/Wrapper';
import EmptyCart from './EmptyCart';

import Script from "next/script";
import { useAuth } from '../context/authcontext';
import { API_URL } from '../lib/api';
import { useCurrency } from '../../hooks/useCurrency';

// Import our new components
import CartItemsList from './components/CartItemsList';
import ShippingAddressSection from './components/ShippingAddressSection';
import OrderSummary from './components/OrderSummary';
import { loadRazorpay } from '../utils/razorpay';

// Types
import { CartItem, UserProfile, Address } from './types';
import axios from 'axios';
import { clearCart, selectCartItems } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { token } = useAuth();
  const { selectedCurrency, formatPrice } = useCurrency();
  
  // Core INR values (base currency)
  const [subtotal, setSubtotal] = useState(0);

  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState('');
  
  // User profile and address states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState<Address | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [showAddressRequired, setShowAddressRequired] = useState(false);

  // Load user profile and addresses
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsAddressLoading(true);
        // Get user info from localStorage
        const userInfo = localStorage.getItem('user');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          if (parsedUser && parsedUser.id) {
            setUserId(parsedUser.id);
            
            // Use your API to get user profile
            const response = await axios.get(`${API_URL}/auth/profile/${parsedUser.id}`);
            
            if (response.status === 200) {
              const userData = response.data;
              
              if (userData && userData.user) {
                setUserProfile(userData.user);
                
                // Find default addresses
                if (userData.user.addresses && userData.user.addresses.length > 0) {
                  const defaultShipping = userData.user.addresses.find(
                    (addr: Address) => addr.type === 'shipping' && addr.isDefault
                  );
                  
                  // If no default shipping found, use the first shipping address
                  const firstShipping = userData.user.addresses.find(
                    (addr: Address) => addr.type === 'shipping'
                  );
                  
                  setDefaultShippingAddress(defaultShipping || firstShipping || null);
                }
              }
            } else {
              console.error('Failed to fetch user profile');
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsAddressLoading(false);
      }
    };
    
    loadUserProfile();
  }, [token]);

  // Calculate totals whenever cart items change
  useEffect(() => {
    // Calculate subtotal - always in INR (base currency)
    const subtotalValue = cartItems.reduce((total: number, item: any) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
    

    const shippingValue = subtotalValue > 2000 ? 0 : 150; // Free shipping over ₹2000
    const totalValue = subtotalValue  + shippingValue;
    
    setSubtotal(subtotalValue);

    setShipping(shippingValue);
    setTotal(totalValue);
  }, [cartItems]);

  // Check if all required information is available for checkout
  const isCheckoutReady = (): boolean => {
    // Check if cart is not empty
    if (cartItems.length === 0) return false;
    
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
  };

  // Handle checkout - this now uses our loadRazorpay utility
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
  
    if (!isCheckoutReady()) {
      setShowAddressRequired(true);
      toast.error('Please add your shipping address to continue');
      return;
    }
  
    setIsProcessing(true);
    const toastId = toast.loading('Creating your order...');
  
    try {

      const formattedItems = cartItems.map((item: any) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        quantity: item.quantity,
        price: item.price, // Always use INR price in the backend
        image: item.image,
      }));
  
      // Create order on backend (always using INR price)
      const response = await fetch(`${API_URL}/orders/create/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total, // Always in INR
          receipt: `receipt_${Date.now()}`,

          subtotal, // Always in INR
          shippingCost: shipping, // Always in INR
          shippingAddress: defaultShippingAddress,
          items: formattedItems,
        })
      });
  
      const orderData = await response.json();
  
      // Check response
      if (!orderData.orderId) {
        throw new Error(orderData.message || 'Failed to create order');
      }
  
      toast.success('Order created successfully!', { id: toastId });
  
      // Load Razorpay
      const Razorpay = await loadRazorpay();
      
      // Add currency conversion notice for international customers
      if (selectedCurrency !== 'INR') {
        toast.success(`Your card will be charged in INR (${formatPrice(total)} converts to approximately ₹${total.toLocaleString()}).`, {
          duration: 6000,
        });
      }
      
      // Initialize Razorpay options (always in INR)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: Math.round(total * 100), // in paisa (INR)
        currency: 'INR', // Razorpay requires INR for Indian merchants
        name: 'Jewelry Store',
        description: 'Purchase of fine jewelry',
        order_id: orderData.orderId,
        image: '/logo.PNG',
        handler: (response: any) => handlePaymentSuccess(response),
        prefill: {
          name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '',
          email: userProfile?.email || '',
          contact: userProfile?.phoneNumber || ''
        },
        notes: { 
          address: 'Jewelry Store Corporate Office',
          order_id: orderData.orderId 
        },
        theme: { color: '#3B82F6' }
      };
  
      // Create Razorpay instance and open checkout
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to initiate checkout. Please try again.', { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (response: any) => {
    const verifyToastId = toast.loading('Verifying your payment...');
    
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      
      const verifyResponse = await axios.post(`${API_URL}/orders/capturePayment`, {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature
      });
      
      const verifyData = verifyResponse.data;
      
      if (verifyResponse.status === 200) {
        toast.success('Payment successful! Order confirmed.');
        // Clear the cart after successful payment
        dispatch(clearCart());
        
        // Redirect to order confirmation page
        router.push(`/orders`);
      } else {
        toast.error(`Payment verification failed: ${verifyData.message || 'Please contact support.'}`, { id: verifyToastId });
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error('An error occurred while verifying your payment.', { id: verifyToastId });
    }
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
                isAddressLoading={isAddressLoading}
                defaultShippingAddress={defaultShippingAddress}
                userProfile={userProfile}
                showAddressRequired={showAddressRequired}
                handleAddAddress={handleAddAddress}
              />
              
              {/* Order Summary */}
              <OrderSummary 
                subtotal={subtotal}

                shipping={shipping}
                total={total}
                isProcessing={isProcessing}
                isCheckoutReady={isCheckoutReady}
                handleCheckout={handleCheckout}
                showAddressRequired={showAddressRequired}
                defaultShippingAddress={defaultShippingAddress}
              />
            </div>
          </div>
        </div>
      </Wrapper>
      
      {/* Load Razorpay script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
    </>
  );
};

export default CartPage;