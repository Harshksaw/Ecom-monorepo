"use client";

import React, { useState } from "react";
import { FaShippingFast, FaMoneyBill, FaUser, FaBox, FaListUl, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/lib/api";

const OrderDetailsPanel = ({ selectedOrder, refreshOrders }:any) => {
console.log("🚀 ~ OrderDetailsPanel ~ selectedOrder:", selectedOrder)

  const [updateLoading, setUpdateLoading] = useState(false);

  // Format date for display
  //@ts-ignore
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    //@ts-ignore
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  //@ts-ignore
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentColor = (status: any) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get selected size name from variant
  const getSelectedSizeName = (item: any) => {
    console.log("🚀 ~ getSelectedSizeName ~ item:", item)
    if (!item?.sizeId) return null;
    
    const variant = item?.productId?.variants?.find((v: { _id: any; }) => v?._id === item.variantId);
    console.log("🚀 ~ getSelectedSizeName ~ variant:", variant)
    if (!variant?.size) return null;
    
    const selectedSize = variant.size.find((s: { _id: any; }) => s?._id === item.sizeId);
    console.log("🚀 ~ getSelectedSizeName ~ selectedSize:", selectedSize)
    return selectedSize?.size || null;
  };

  // Get metal color display name
  const getMetalColorName = (item:any) => {
    if (!item?.variantId) return null;
    
    const variant = item?.productId?.variants?.find((v: { _id: any; }) => v?._id === item.variantId);
    if (!variant?.metalColor) return null;
    
    // Format the metalColor for display
    const colorMap = {
      "sterlingsilver": "Sterling Silver",
      "yellowgold": "Yellow Gold",
      "rosegold": "Rose Gold",
      "whitegold": "White Gold",
      "gold": "Gold",
      "silver": "Silver",
      "platinum": "Platinum",
      "titanium": "Titanium"
    };
    
    return colorMap[variant.metalColor as keyof typeof colorMap] || variant.metalColor;
  };


  const updateOrderStatus = async (orderId: any, newStatus: string) => {
    if (!orderId) return;
    
    try {
      setUpdateLoading(true);
      
      const response = await axios.post(`${API_URL}/orders/edit/${orderId}`, {
        status: newStatus
      });
      
      if (response.status === 200) {
        toast.success(`Order ${newStatus} successfully`);
        refreshOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle cancelling an order
  const cancelOrder = async (orderId: any) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await updateOrderStatus(orderId, "cancelled");
    }
  };

  if (!selectedOrder) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="p-4 border-b font-medium">Order Details</h2>
        <div className="p-6 text-center text-gray-500">
          Select an order to view details
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <h2 className="p-4 border-b font-medium">Order Details</h2>
      
      <div className="p-4">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{selectedOrder?.orderId}</h3>
            <p className="text-sm text-gray-500">{formatDate(selectedOrder?.orderDate)}</p>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder?.status)}`}>
            {selectedOrder?.status}
          </span>
        </div>
        
        {/* Customer Info */}
        <div className="mb-3 pb-3 border-b">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Customer</h4>
          <p>{selectedOrder?.userId?.email}</p>
          {selectedOrder?.userId?.firstName && (
            <p className="text-sm text-gray-500">Name: {selectedOrder.userId.firstName}</p>
          )}
          {selectedOrder?.userId?.phoneNumber && (
            <p className="text-sm text-gray-500">Phone: {selectedOrder.userId.phoneNumber}</p>
          )}
        </div>
        
        {/* Order Items */}
        <div className="mb-3 pb-3 border-b">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
          {selectedOrder?.items?.map((item: { _id: React.Key | null | undefined; image: string | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: number; status: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => {
            const sizeName = getSelectedSizeName(item);
            const metalColor = getMetalColorName(item);
            
            return (
              <div key={item?._id} className="flex items-start gap-4 py-3 border-b last:border-b-0">
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src={item?.image} 

                    className="w-full h-full object-cover rounded"
                  
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item?.name}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {metalColor && (
                      <div>Metal: {metalColor}</div>
                    )}
                    {sizeName && (
                      <div>Size: {sizeName}</div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Quantity: {item?.quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      Price: ₹{item?.price?.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    //@ts-ignore
                    Total: ₹{(typeof item?.price === 'number' && typeof item?.quantity === 'number' ? (item.price * item.quantity).toFixed(2) : 'N/A')}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getStatusColor(item?.status)}`}>
                      {item?.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="mb-3 pb-3 border-b">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{selectedOrder?.subtotal?.toFixed(2)}</span>
            </div>
            {selectedOrder?.shippingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">₹{selectedOrder?.shippingCost?.toFixed(2)}</span>
              </div>
            )}
            {selectedOrder?.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">₹{selectedOrder?.tax?.toFixed(2)}</span>
              </div>
            )}
            {selectedOrder?.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-red-600">-₹{selectedOrder?.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-medium pt-2 border-t">
              <span>Total</span>
              <span>₹{selectedOrder?.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Info */}
        <div className="mb-3 pb-3 border-b">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getPaymentColor(selectedOrder?.payment?.status)}`}>
                {selectedOrder?.payment?.status}
              </span>
            </div>
            {selectedOrder?.payment?.transactionId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium">{selectedOrder?.payment?.transactionId}</span>
              </div>
            )}
            {selectedOrder?.payment?.paymentDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Date</span>
                <span className="font-medium">{formatDate(selectedOrder?.payment?.paymentDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-3 pb-3 border-b">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
          <div className="text-sm">
            <p className="font-medium">{selectedOrder?.shippingAddress?.addressLine1}</p>
            {selectedOrder?.shippingAddress?.addressLine2 && (
              <p>{selectedOrder?.shippingAddress?.addressLine2}</p>
            )}
            <p>
              {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state}
            </p>
            <p>{selectedOrder?.shippingAddress?.postalCode}</p>
            <p>{selectedOrder?.shippingAddress?.country}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
          <div className="flex flex-wrap gap-2">
            {updateLoading ? (
              <div className="text-blue-500">Updating...</div>
            ) : (
              <>
                {selectedOrder?.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder?._id, 'processing')}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Process
                  </button>
                )}
                {selectedOrder?.status === 'processing' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder?._id, 'shipped')}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                  >
                    Ship
                  </button>
                )}
                {selectedOrder?.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder?._id, 'delivered')}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Deliver
                  </button>
                )}
                {selectedOrder?.status === 'delivered' && (
                  <button
                    // onClick={() => updateOrderStatus(selectedOrder?._id, 'delivered')}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Completed
                  </button>
                )}
                {['pending', 'processing'].includes(selectedOrder?.status) && (
                  <button
                    onClick={() => cancelOrder(selectedOrder?._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}

                <button
  onClick={refreshOrders}
  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 flex items-center gap-2"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
  Refresh
</button>                              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;