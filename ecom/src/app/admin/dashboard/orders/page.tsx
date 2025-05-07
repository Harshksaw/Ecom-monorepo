'use client'
import { API_URL } from '@/app/lib/api';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';

// Define TypeScript interfaces for our data structures
interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProductId {
  _id: string;
  name: string;
  sku: string;
  images?: string[];
}

interface OrderItem {
  _id: string;
  productId: ProductId;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: User;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ApiResponse {
  orders: Order[];
  pagination: PaginationData;
}

interface OrderResponse {
  order: Order;
}

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      let url = `${API_URL}/orders?page=${currentPage}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      const response = await fetch(url);
      const data = await response.json() as ApiResponse;
      
      if (data.orders) {
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single order
  const fetchOrderDetails = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`);
      const data = await response.json() as OrderResponse;
      
      if (data.order) {
        setSelectedOrder(data.order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: Order['orderStatus']): Promise<void> => {
    try {
      setUpdateLoading(true);
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderStatus: status })
      });
      
      const data = await response.json() as OrderResponse;
      
      if (data.order) {
        // Update in orders list
        setOrders(orders.map(order => 
          order._id === id ? { ...order, orderStatus: status } : order
        ));
        
        // Update selected order if it's open
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, orderStatus: status });
        }
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (id: string): Promise<void> => {
    try {
      if (!window.confirm('Are you sure you want to cancel this order?')) return;
      
      setUpdateLoading(true);
      const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: 'POST'
      });
      
      const data = await response.json() as OrderResponse;
      
      if (data.order) {
        // Update in orders list
        setOrders(orders.map(order => 
          order._id === id ? { ...order, orderStatus: 'cancelled' } : order
        ));
        
        // Update selected order if it's open
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled' });
        }
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(term) ||
      (order.userId.firstName + ' ' + order.userId.lastName).toLowerCase().includes(term) ||
      order.userId.email.toLowerCase().includes(term)
    );
  });

  // Get status badge color
  const getStatusColor = (status: Order['orderStatus']): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status color
  const getPaymentColor = (status: Order['paymentStatus']): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded py-2 px-4"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
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
            ) : filteredOrders.length === 0 ? (
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
                    {filteredOrders.map(order => (
                      <tr 
                        key={order._id} 
                        className={`hover:bg-gray-50 ${selectedOrder && selectedOrder._id === order._id ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-medium">{order.orderNumber}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm">{order.userId.firstName} {order.userId.lastName}</div>
                          <div className="text-xs text-gray-500">{order.userId.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium">₹{order.total.toFixed(2)}</div>
                          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${getPaymentColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            onClick={() => fetchOrderDetails(order._id)}
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
            
            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="p-4 border-t flex justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Details */}
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="p-4 border-b font-medium">Order Details</h2>
            
            {!selectedOrder ? (
              <div className="p-6 text-center text-gray-500">
                Select an order to view details
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{selectedOrder.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                
                {/* Customer Info */}
                <div className="mb-3 pb-3 border-b">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Customer</h4>
                  <p>{selectedOrder.userId.firstName} {selectedOrder.userId.lastName}</p>
                  <p className="text-sm">{selectedOrder.userId.email}</p>
                </div>
                
                {/* Shipping Address */}
                <div className="mb-3 pb-3 border-b">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h4>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.addressLine1}<br />
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <>
                        {selectedOrder.shippingAddress.addressLine2}<br />
                      </>
                    )}
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
                
                {/* Order Items */}
                <div className="mb-3 pb-3 border-b">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Items</h4>
                  {selectedOrder.items.map(item => (
                    <div key={item._id} className="flex justify-between py-1 text-sm">
                      <div>
                        {item.productId.name} × {item.quantity}
                      </div>
                      <div>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="mb-3 pb-3 border-b">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Payment Info */}
                {selectedOrder.razorpayOrderId && (
                  <div className="mb-3 pb-3 border-b">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Info</h4>
                    <div className="text-sm">
                      <div>Razorpay Order: {selectedOrder.razorpayOrderId}</div>
                      {selectedOrder.razorpayPaymentId && (
                        <div>Payment ID: {selectedOrder.razorpayPaymentId}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {updateLoading ? (
                      <div className="text-blue-500">Updating...</div>
                    ) : (
                      <>
                        {selectedOrder.orderStatus === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          >
                            Process
                          </button>
                        )}
                        {selectedOrder.orderStatus === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                          >
                            Ship
                          </button>
                        )}
                        {selectedOrder.orderStatus === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                          >
                            Deliver
                          </button>
                        )}
                        {['pending', 'processing'].includes(selectedOrder.orderStatus) && (
                          <button
                            onClick={() => cancelOrder(selectedOrder._id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;