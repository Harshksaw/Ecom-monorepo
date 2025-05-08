'use client'
import { API_URL } from '@/app/lib/api';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import OrderDetailsPanel from './orderDetails';

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
  };
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface Payment {
  status: 'paid' | 'pending' | 'failed' | 'completed';
  paymentDate?: string;
  transactionId?: string;
  gateway?: string;
  amount?: number;
  currency?: string;
}

interface Order {
  _id: string;
  orderId: string;
  userId: User;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  payment: Payment;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  updatedAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  console.log("🚀 ~ OrdersAdmin ~ selectedOrder:", selectedOrder)
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/orders/admin/orders`);
      const data = res.data;
      
      if (data.orders) {
        setOrders(data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`);
      const data = await response.json();
      
      if (data.order) {
        setSelectedOrder(data.order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    console.log("🚀 ~ updateOrderStatus ~ id:", id)
    console.log("🚀 ~ updateOrderStatus ~ u:", status)
    try {
      setUpdateLoading(true);


      const response = await axios.post(`${API_URL}/orders/edit/${id}`, { status: status });
      
      const data = response.data;
      
      if (data.order) {
        setOrders(orders.map(order => 
          order._id === id ? { ...order, status: status } : order
        ));
        
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, status: status });
        }
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this order?')) return;
      
      setUpdateLoading(true);
      const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.order) {
        setOrders(orders.map(order => 
          order._id === id ? { ...order, status: 'cancelled' } : order
        ));
        
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
        }
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="p-4 border-b font-medium">Orders</h2>
            
            {loading ? (
              <div className="p-8 text-center">Loading orders...</div>
            ) : error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : orders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr 
                        key={order._id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedOrder && selectedOrder._id === order._id ? 'bg-blue-50' : ''}`}
                        onClick={() => fetchOrderDetails(order._id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-medium">{order.orderId}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{order.orderDate.slice(0,10)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm">{order.userId.firstName} {order.userId.lastName}</div>
                          <div className="text-xs text-gray-500">{order.userId.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium">₹{order.total.toFixed(2)}</div>
                          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${getPaymentColor(order.payment.status)}`}>
                            {order.payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button 
                            aria-label="View order details"
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchOrderDetails(order._id);
                            }}
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>


        <OrderDetailsPanel
//@ts-ignore
selectedOrder={selectedOrder}
 refreshOrders={fetchOrders}
        />
        
        {/* Order Details */}
     
      </div>
    </div>
  );
};

export default OrdersAdmin;