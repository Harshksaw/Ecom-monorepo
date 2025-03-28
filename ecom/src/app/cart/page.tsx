// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaArrowLeft, FaShieldAlt, FaMapMarkerAlt, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import { updateCart, removeFromCart } from '../store/slices/cartSlice';

import Wrapper from '../components/Wrapper';
import EmptyCart from './EmptyCart';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authcontext';
import { API_URL, User } from '../lib/api';
import axios from 'axios';

// Address interface
interface Address {
  _id?: string;
  type: 'billing' | 'shipping';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// User profile interface
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  addresses?: Address[];
}

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.cart);
  const { token } = useAuth();
  
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [userId, setUserId] = useState('')
  
  // User profile and address states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState<Address | null>(null);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState<Address | null>(null);
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
            setUserId(parsedUser.id)
            // Use the User.getUserProfile API
            const response = await User.getUserProfile(parsedUser.id);
            
            if (response && response.status === 200) {
              const userData = response.data.user;
              
              if (userData) {
                setUserProfile(userData);
                
                // Find default addresses
                if (userData.addresses && userData.addresses.length > 0) {
                  const defaultShipping = userData.addresses.find(
                    (addr: Address) => addr.type === 'shipping' && addr.isDefault
                  );
                  
                  const defaultBilling = userData.addresses.find(
                    (addr: Address) => addr.type === 'billing' && addr.isDefault
                  );
                  
                  // If no default shipping found, use the first shipping address
                  const firstShipping = userData.addresses.find(
                    (addr: Address) => addr.type === 'shipping'
                  );
                  
                  // If no default billing found, use the first billing address
                  const firstBilling = userData.addresses.find(
                    (addr: Address) => addr.type === 'billing'
                  );
                  
                  setDefaultShippingAddress(defaultShipping || firstShipping || null);
                  setDefaultBillingAddress(defaultBilling || firstBilling || null);
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
  }, []);

  // Calculate totals whenever cart items change
  useEffect(() => {
    // Calculate subtotal by summing up (oneQuantityPrice * quantity) for each item
    const subtotalValue = cartItems.reduce((total: number, item:any) => {
      // Use salePrice if available, otherwise use regular price
      const itemPrice = item.attributes?.salePrice || item.attributes?.price || item.oneQuantityPrice;
      return total + (itemPrice * (item.quantity || 1));
    }, 0);
    
    const gstValue = subtotalValue * 0.18; // 18% GST (CGST + SGST)
    const shippingValue = subtotalValue > 2000 ? 0 : 150; // Free shipping over ₹2000
    const totalValue = subtotalValue + gstValue + shippingValue;
    
    setSubtotal(subtotalValue);
    setGst(gstValue);
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

  // Handle quantity change
  const updateQuantity = (id: string, quantity: number) => {
    // Get the item to update
    const item = cartItems.find((item:any) => item.id === id);
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

  // Get the appropriate price for display (sale price if available, otherwise regular price)
  const getDisplayPrice = (item:any) => {
    return item.attributes?.salePrice || item.attributes?.price || item.oneQuantityPrice;
  };

  // Handle Razorpay checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate if we have all required information
    if (!isCheckoutReady()) {
      // Show address required warning
      setShowAddressRequired(true);
      toast.error('Please add your shipping address to continue');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on your backend

      toast.loading('payement Processing')
      const response = await axios.post(`${API_URL}/orders/create/${userId}`, {
    

          total:  total, 
          receipt: `receipt_${Date.now()}`,
          tax:gst,
          subtotal,
          shippingAddress: defaultShippingAddress,
          billingAddress: defaultBillingAddress || defaultShippingAddress,
          items: cartItems.map((item:any) => ({
            productId: item.id,
            name: item.attributes?.name,
            quantity: item.quantity,
            price: getDisplayPrice(item)
      }))

      });

      const orderData = response.data

      if (response.status != 201) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Jewelry Store',
        description: 'Purchase of fine jewelry',
        order_id: orderData.orderId,
        image: '/logo.png', // Your company logo
        handler: function (response: any) {
          // Handle successful payment
          handlePaymentSuccess(response);
        },
        prefill: {
          name: userProfile ? `${userProfile.firstName} ${userProfile.lastName || ''}` : '',
          email: userProfile?.email || '',
          contact: userProfile?.phoneNumber || ''
        },
        notes: {
          address: 'Jewelry Store Corporate Office'
        },
        theme: {
          color: '#3B82F6'
        }
      };

      // @ts-ignore - Razorpay is loaded via script in _document.tsx or layout.tsx
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (response: any) => {
    try {
      // Verify payment on your backend
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // Clear cart after successful payment
        // dispatch(clearCart());
        
        // Redirect to success page or show success message
        toast.success('Payment successful! Order confirmed.');
        
        // Optional: Redirect to order confirmation page
        // router.push(`/order/confirmation/${verifyData.orderId}`);
      } else {
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('An error occurred while verifying your payment.');
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
    <Wrapper>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="flex-grow">
            {/* Cart Header */}
            <div className="hidden md:grid grid-cols-5 border-b pb-4 mb-4">
              <div className="col-span-2 text-gray-700 font-medium">Product</div>
              <div className="text-center text-gray-700 font-medium">Price</div>
              <div className="text-center text-gray-700 font-medium">Quantity</div>
              <div className="text-center text-gray-700 font-medium">Total</div>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item:any) => {
                const displayPrice = getDisplayPrice(item);
                const isOnSale = item.attributes?.salePrice && item.attributes.salePrice < item.attributes.price;
                
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
                        {isOnSale && (
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
            
            {/* Continue Shopping */}
            <div className="mt-8">
              <Link 
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Right Column - Order Summary & Shipping Address */}
          <div className="lg:w-96 flex-shrink-0 space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-600" /> 
                  Shipping Address
                </h2>
                
                <button 
                  onClick={handleAddAddress}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {defaultShippingAddress ? 'Change' : 'Add'}
                </button>
              </div>
              
              {isAddressLoading ? (
                <div className="py-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading address...</p>
                </div>
              ) : defaultShippingAddress ? (
                <div className="bg-white p-3 rounded border">
                  <div className="text-sm">
                    <p className="font-medium">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </p>
                    <p>{defaultShippingAddress.addressLine1}</p>
                    {defaultShippingAddress.addressLine2 && <p>{defaultShippingAddress.addressLine2}</p>}
                    <p>
                      {defaultShippingAddress.city}, {defaultShippingAddress.state} {defaultShippingAddress.postalCode}
                    </p>
                    <p>{defaultShippingAddress.country}</p>
                    {userProfile?.phoneNumber && <p className="mt-1">Phone: {userProfile.phoneNumber}</p>}
                  </div>
                </div>
              ) : (
                <div className={`bg-white p-4 rounded border ${showAddressRequired ? 'border-red-500' : 'border-gray-200'}`}>
                  <div className="text-center py-2">
                    <FaExclamationTriangle className={`mx-auto mb-2 ${showAddressRequired ? 'text-red-500' : 'text-gray-400'}`} size={24} />
                    <p className={`font-medium ${showAddressRequired ? 'text-red-500' : 'text-gray-500'}`}>
                      Please add a shipping address
                    </p>
                    <button
                      onClick={handleAddAddress}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              )}
              
              {/* User Information */}
              {userProfile ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <FaUser className="text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{userProfile.firstName} {userProfile.lastName}</p>
                      <p className="text-gray-600">{userProfile.email}</p>
                      {userProfile.phoneNumber && <p className="text-gray-600">{userProfile.phoneNumber}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Please <Link href="/login" className="text-blue-600 hover:underline">log in</Link> to continue
                  </p>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              
              {/* Special Offers */}
              {shipping > 0 && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded mb-6 text-sm">
                  Add ₹{(2000 - subtotal).toFixed(2)} more to qualify for free shipping!
                </div>
              )}
              
              {/* Address required warning */}
              {showAddressRequired && !defaultShippingAddress && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-6 text-sm flex items-start">
                  <FaExclamationTriangle className="flex-shrink-0 mr-2 mt-1" />
                  <p>Please add a shipping address before proceeding to checkout</p>
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
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CartPage;