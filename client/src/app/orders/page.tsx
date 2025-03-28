'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { toast } from 'react-hot-toast';
import { 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaBox, 
  FaMoneyBillWave, 
  FaTruck, 
  FaCheck, 
  FaTimes,
  FaEye,
  FaSearch
} from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';
import Wrapper from '@/app/components/Wrapper';
import { useAuth } from '../context/authcontext';

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
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const { user, token } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/orders/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        setError(error.response?.data?.message || 'An error occurred while fetching your orders');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [token]);
  
  // Filter orders when status filter or search query changes
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => 
          item.productId.name.toLowerCase().includes(query)
        )
      );
    }
    
    setFilteredOrders(result);
  }, [statusFilter, searchQuery, orders]);
  
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
  
  return (
    <Wrapper>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search by order # or product"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <FaSearch />
                  </div>
                </div>
                
                {/* Status filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Order List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-gray-50 p-8 text-center rounded-lg border">
                <FaShoppingBag className="mx-auto text-gray-400 text-5xl mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-4">
                  {orders.length === 0 
                    ? "You haven't placed any orders yet." 
                    : "No orders match your current filters."}
                </p>
                {orders.length === 0 && (
                  <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Start Shopping
                  </Link>
                )}
                {orders.length > 0 && (
                  <button 
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-b">
                      {/* Order Number */}
                      <div>
                        <p className="text-xs text-gray-500">ORDER #</p>
                        <p className="font-medium">{order.orderNumber}</p>
                      </div>
                      
                      {/* Date */}
                      <div>
                        <p className="text-xs text-gray-500">DATE</p>
                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                      </div>
                      
                      {/* Total */}
                      <div>
                        <p className="text-xs text-gray-500">TOTAL</p>
                        <p className="font-medium flex items-center">
                          <FaMoneyBillWave className="mr-1 text-green-600" />
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Status */}
                      <div>
                        <p className="text-xs text-gray-500">STATUS</p>
                        <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                          {getStatusInfo(order.status).icon}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-6">
                      <h3 className="font-medium mb-4">Items ({order.items.length})</h3>
                      <div className="space-y-4">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item._id} className="flex items-center">
                            {/* Product Image */}
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
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
                            
                            {/* Product Info */}
                            <div className="ml-4 flex-grow">
                              <h4 className="font-medium">{item.productId.name}</h4>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            
                            {/* Item Total */}
                            <div className="text-right">
                              <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Show more items indicator */}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500 italic">
                            + {order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                      {/* Delivery Address (shortened) */}
                      <div className="text-sm text-gray-500">
                        <p>Delivering to:</p>
                        <p className="truncate max-w-xs">
                          {order.shippingAddress.address}, {order.shippingAddress.city},
                          {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        </p>
                      </div>
                      
                      {/* Order Details Button */}
                      <Link 
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
}