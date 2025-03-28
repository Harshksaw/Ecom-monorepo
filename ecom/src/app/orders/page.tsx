'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowLeft, 
  FaBox, 
  FaMoneyBillWave, 
  FaTruck, 
  FaCheck, 
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCreditCard
} from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../lib/api';
import Wrapper from '../components/Wrapper';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/navigation';

// Define order status type for type safety
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Interface for order item
interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

// Interface for order
interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  subtotal: number;
  tax: number;
  shipping: number;
}

export default function OrderDetailPage({ params }:any) {
  const router = useRouter();
  const { token } = useAuth();
  const { id } = params;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || 'Failed to fetch order details');
        }
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        setError(error.response?.data?.message || 'An error occurred while fetching order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id, token]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status color and icon
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <FaCalendarAlt className="mr-1" /> 
        };
      case 'processing':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: <FaBox className="mr-1" /> 
        };
      case 'shipped':
        return { 
          color: 'bg-purple-100 text-purple-800', 
          icon: <FaTruck className="mr-1" /> 
        };
      case 'delivered':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: <FaCheck className="mr-1" /> 
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800', 
          icon: <FaTimes className="mr-1" /> 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          icon: null 
        };
    }
  };
  
  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Wrapper>
    );
  }
  
  if (error || !order) {
    return (
      <Wrapper>
        <div className="py-10">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.push('/orders')}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back to Orders
            </button>
          </div>
          
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Order not found'}
          </div>
        </div>
      </Wrapper>
    );
  }
  
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <Wrapper>
      <div className="py-10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.push('/orders')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </button>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Order #{order.orderNumber}</h1>
        <p className="text-gray-600 mb-8">Placed on {formatDate(order.createdAt)}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items and Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item._id} className="py-4 flex">
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
                        {item.productId.images && item.productId.images.length > 0 ? (
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaBox size={24} />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.productId.name}</h3>
                          <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                        
                        {/* Optional: Add product link */}
                        <Link href={`/product/${item.productId._id}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                          View Product
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center">
                      <FaCreditCard className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Payment Method</p>
                        <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-500' 
                          : order.paymentStatus === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}></div>
                      <p className="text-sm">
                        Payment Status: <span className="font-medium">{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Info */}
            {order.status === 'shipped' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  
                  <div className="space-y-4">
                    {order.trackingNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-medium">{order.trackingNumber}</p>
                      </div>
                    )}
                    
                    {order.estimatedDelivery && (
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                      </div>
                    )}
                    
                    {/* Optional: Add tracking button */}
                    {order.trackingNumber && (
                      <button className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Track Package
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Customer and Shipping Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaUser className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">John Doe</p> {/* Replace with actual customer name */}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">johndoe@example.com</p> {/* Replace with actual email */}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaPhone className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">+91 98765 43210</p> {/* Replace with actual phone */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <address className="not-italic text-gray-600 mt-1">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Billing Address (if different) */}
            {order.billingAddress && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Billing Address</h2>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Billing Address</p>
                      <address className="not-italic text-gray-600 mt-1">
                        {order.billingAddress.address}<br />
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}<br />
                        {order.billingAddress.country}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Need Help Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                If you have any questions or concerns about your order, our customer service team is here to help.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}