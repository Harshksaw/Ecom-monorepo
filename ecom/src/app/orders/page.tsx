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
  FaCreditCard,
  FaSync
} from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../lib/api';
import Wrapper from '../components/Wrapper';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

// Define order status type for type safety
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'completed';

// Updated OrderItem interface to match the API response
interface OrderItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  status: string;
}

// Updated Order interface to match the API response
interface Order {
  _id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    status: PaymentStatus;
    paymentDate: string;
    transactionId: string;
  };
  status: OrderStatus;
  orderDate: string;
  updatedAt: string;
}

// Response interface to match the API response structure
interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const fetchOrderDetails = async () => {
    // Only proceed if we have a user ID
    if (!user?.id) {
      setIsLoading(false);
      setError("Please log in to view order details");
      return;
    }
    
    try {
      if (!isRefreshing) {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await axios.get<OrdersResponse>(`${API_URL}/orders/user/${user?.id}`);
      
      if (response?.data?.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to fetch order details');
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError(error?.response?.data?.message || 'An error occurred while fetching order details');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [user?.id]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrderDetails();
  };
  
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

  // Get payment status color and icon
  const getPaymentStatusInfo = (status?: PaymentStatus) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: <FaMoneyBillWave className="mr-1" /> 
        };
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <FaCreditCard className="mr-1" /> 
        };
      case 'failed':
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
  const orderStatusInfo = getStatusInfo(selectedOrder?.status);
  const paymentStatusInfo = getPaymentStatusInfo(selectedOrder?.payment?.status);
  
  // Capitalize first letter safely
  const capitalize = (text?: string) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  return (
    <Wrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <button 
            onClick={handleRefresh} 
            className="flex items-center text-blue-600 hover:text-blue-800"
            disabled={isRefreshing}
          >
            <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Orders'}
          </button>
        </div>
        
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
                        <p className="font-medium">{order.orderId}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'items'} • ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                        {getStatusInfo(order.status).icon}
                        {capitalize(order.status)}
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
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h2 className="text-xl font-bold">Order #{selectedOrder.orderId}</h2>
                  <div className="flex flex-wrap gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${orderStatusInfo.color}`}>
                      {orderStatusInfo.icon}
                      {capitalize(selectedOrder.status)}
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusInfo.color}`}>
                      {paymentStatusInfo.icon}
                      {capitalize(selectedOrder.payment.status)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">
                  Placed on {formatDate(selectedOrder.orderDate)}
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
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name || 'Product image'}
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
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="font-medium">
                            ₹{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center mt-2">
                          <div className={`h-2 w-2 rounded-full mr-2 ${
                            item.status === 'delivered' 
                              ? 'bg-green-500' 
                              : item.status === 'processing'
                                ? 'bg-blue-500'
                                : item.status === 'shipped'
                                  ? 'bg-purple-500'
                                  : 'bg-yellow-500'
                          }`}></div>
                          <p className="text-xs text-gray-500">
                            Status: {capitalize(item.status)}
                          </p>
                        </div>
                        
                        {item.productId && (
                          <Link href={`/product/${item.productId}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
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
                  
                  {selectedOrder.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>₹{selectedOrder.shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="mt-2 flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        selectedOrder.payment.status === 'paid' || selectedOrder.payment.status === 'completed'
                          ? 'bg-green-500' 
                          : selectedOrder.payment.status === 'pending'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}></div>
                      <p className="text-sm">
                        Payment Status: <span className="font-medium">{capitalize(selectedOrder.payment.status)}</span>
                      </p>
                    </div>
                    
                    {selectedOrder.payment.transactionId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Transaction ID: {selectedOrder.payment.transactionId}
                      </p>
                    )}
                    
                    {selectedOrder.payment.paymentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Payment Date: {formatDate(selectedOrder.payment.paymentDate)}
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