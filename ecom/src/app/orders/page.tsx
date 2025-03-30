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
import { useSelector } from 'react-redux';

// Define order status type for type safety
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Updated OrderItem interface
interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

// Updated Order interface
interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'completed';
  orderStatus: OrderStatus;
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export default function OrderDetailPage({ params }: any) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Only proceed if we have a user ID
      if (!user?.id) {
        setIsLoading(false);
        setError("Please log in to view order details");
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/orders/my-orders/${user?.id}`);
        
        if (response?.status === 200) {
          setOrders(response?.data?.orders);
        } else {
          setError(response?.data?.message || 'Failed to fetch order details');
        }
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        setError(error?.response?.data?.message || 'An error occurred while fetching order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [user?.id]);
  
  // Format date - with null safety
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get status color and icon - with default fallback
  const getStatusInfo = (status?: OrderStatus) => {
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
  
  // Calculate total items in an order
  const getTotalItems = (items?: OrderItem[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Wrapper>
    );
  }
  
  // Error or no order state
  if (error || !orders || orders.length === 0) {
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
            {error || 'No orders found'}
          </div>
        </div>
      </Wrapper>
    );
  }
  
  // Get the selected order
  const selectedOrder = orders[selectedOrderIndex] || orders[0];
  
  // Get status styling for selected order
  const statusInfo = getStatusInfo(selectedOrder?.orderStatus);
  
  // Capitalize first letter safely
  const capitalize = (text?: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  return (
    <Wrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium">Your Orders ({orders.length})</h2>
              </div>
              
              <div className="divide-y max-h-96 overflow-y-auto">
                {orders.map((order, index) => (
                  <div 
                    key={order._id} 
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${index === selectedOrderIndex ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedOrderIndex(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'items'} • ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(order.orderStatus).color}`}>
                        {getStatusInfo(order.orderStatus).icon}
                        {capitalize(order.orderStatus)}
                   
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Order #{selectedOrder.orderNumber}</h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.icon}
                    Order-
                    {capitalize(selectedOrder.orderStatus)}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-400 `}>
                    {statusInfo.icon}
                    Payment-
                 {selectedOrder.paymentStatus}
                  </div>
                </div>
                <p className="text-gray-600 mt-1">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              
              {/* Order Items */}
              <div className="p-6 border-b">
                <h3 className="font-medium mb-4">Items</h3>
                
                <div className="divide-y">
                  {selectedOrder.items.map(item => (
                    <div key={item._id} className="py-4 flex">
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
                        {item.productId.images && item.productId.images.length > 0 ? (
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name || 'Product image'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaBox size={20} />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.productId.name}</h4>
                          <p className="font-medium">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-1">
                          SKU: {item.productId.sku}
                        </p>
                        
                        {item.productId._id && (
                          <Link href={`/product/${item.productId._id}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                            View Product
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="p-6 border-b">
                <h3 className="font-medium mb-4">Order Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="mt-2 flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                     selectedOrder.paymentStatus === 'completed'
                          ? 'bg-green-500' 
                          : selectedOrder.paymentStatus === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}></div>
                      <p className="text-sm">
                        Payment Status: <span className="font-medium">{capitalize(selectedOrder.paymentStatus)}</span>
                      </p>
                    </div>
                    
                    {selectedOrder.razorpayOrderId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Razorpay Order ID: {selectedOrder.razorpayOrderId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="p-6">
                <h3 className="font-medium mb-4">Shipping Address</h3>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <address className="not-italic text-gray-600">
                      {selectedOrder.shippingAddress.addressLine1}<br />
                      {selectedOrder.shippingAddress.addressLine2 && `${selectedOrder.shippingAddress.addressLine2}<br />`}
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                      {selectedOrder.shippingAddress.country}
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}