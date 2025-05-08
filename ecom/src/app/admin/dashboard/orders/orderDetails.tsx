"use client";

import React, { useState } from "react";
import { FaShippingFast, FaMoneyBill, FaUser, FaBox, FaListUl, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/lib/api";

const OrderDetailsPanel = ({ selectedOrder, refreshOrders }) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState("items");

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
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
  const getPaymentColor = (status) => {
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

  // Toggle section visibility
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Get selected size name from variant
  const getSelectedSizeName = (item) => {
    if (!item?.sizeId) return "";
    
    const variant = item?.productId?.variants?.find(v => v?._id === item.variantId);
    if (!variant?.size) return "";
    
    const selectedSize = variant.size.find(s => s?._id === item.sizeId);
    return selectedSize?.size || "";
  };

  // Get variant color display name
  const getVariantColor = (item) => {
    if (!item?.variantId) return "";
    
    const variant = item?.productId?.variants?.find(v => v?._id === item.variantId);
    if (!variant) return "";
    
    const colorNames = {
      "yellowgold": "Yellow Gold",
      "rosegold": "Rose Gold",
      "whitegold": "White Gold",
      "sterlingsilver": "Sterling Silver",
      "gold": "Gold",
      "silver": "Silver",
      "platinum": "Platinum",
      "titanium": "Titanium"
    };
    
    return colorNames[variant.metalColor] || variant.metalColor || "";
  };

  // Handle updating order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId) return;
    
    try {
      setUpdateLoading(true);
      
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, {
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
  const cancelOrder = async (orderId) => {
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
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-medium flex items-center">
          <FaListUl className="mr-2 text-gray-500" /> Order Details
        </h2>
      </div>

      <div className="p-4">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4 pb-4 border-b">
          <div>
            <h3 className="font-bold text-lg">{selectedOrder.orderId}</h3>
            <p className="text-sm text-gray-500 mt-1">
              <FaCalendarAlt className="inline mr-1 text-gray-400" />
              {formatDate(selectedOrder?.orderDate)}
            </p>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder?.status)}`}>
            {selectedOrder?.status?.charAt(0).toUpperCase() + selectedOrder?.status?.slice(1)}
          </span>
        </div>
        
        {/* Customer Info */}
        <div 
          className="mb-4 pb-2 cursor-pointer" 
          onClick={() => toggleSection("customer")}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FaUser className="mr-2 text-gray-500" /> Customer Information
            </h4>
            <span className="text-gray-400 text-xs">
              {expandedSection === "customer" ? "▼" : "▶"}
            </span>
          </div>
          
          {expandedSection === "customer" && (
            <div className="mt-2 pl-6 text-sm">
              <p className="font-medium">{selectedOrder?.userId?.email}</p>
              {selectedOrder?.userId?.firstName && (
                <p className="text-gray-600 mt-1">
                  {selectedOrder?.userId?.firstName} {selectedOrder?.userId?.lastName || ''}
                </p>
              )}
              {selectedOrder?.userId?.phone && (
                <p className="text-gray-600 mt-1">{selectedOrder?.userId?.phone}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Order Items */}
        <div 
          className="mb-4 pb-2 cursor-pointer" 
          onClick={() => toggleSection("items")}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FaBox className="mr-2 text-gray-500" /> Order Items
            </h4>
            <span className="text-gray-400 text-xs">
              {expandedSection === "items" ? "▼" : "▶"}
            </span>
          </div>
          
          {expandedSection === "items" && (
            <div className="mt-3">
              {selectedOrder?.items?.map(item => {
                const sizeName = getSelectedSizeName(item);
                const variantColor = getVariantColor(item);
                
                return (
                  <div key={item?._id} className="flex items-start gap-4 py-3 border-b last:border-b-0">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={item?.image} 
                        alt={item?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/80x80?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{item?.name}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        <div>Product ID: {item?.productId?._id}</div>
                        {item?.variantId && (
                          <div>Variant: {variantColor || item?.variantId}</div>
                        )}
                        {sizeName && <div>Size: {sizeName}</div>}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Quantity: {item?.quantity}
                        </div>
                        <div className="text-sm text-gray-600">
                          Price: ₹{item?.price?.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        Total: ₹{(item?.price * item?.quantity).toFixed(2)}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getStatusColor(item?.status)}`}>
                          {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div 
          className="mb-4 pb-2 cursor-pointer" 
          onClick={() => toggleSection("summary")}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FaMoneyBill className="mr-2 text-gray-500" /> Order Summary
            </h4>
            <span className="text-gray-400 text-xs">
              {expandedSection === "summary" ? "▼" : "▶"}
            </span>
          </div>
          
          {expandedSection === "summary" && (
            <div className="mt-3 pl-6 space-y-2">
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
          )}
        </div>
        
        {/* Payment Info */}
        <div 
          className="mb-4 pb-2 cursor-pointer" 
          onClick={() => toggleSection("payment")}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FaMoneyBill className="mr-2 text-gray-500" /> Payment Information
            </h4>
            <span className="text-gray-400 text-xs">
              {expandedSection === "payment" ? "▼" : "▶"}
            </span>
          </div>
          
          {expandedSection === "payment" && (
            <div className="mt-3 pl-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getPaymentColor(selectedOrder?.payment?.status)}`}>
                  {selectedOrder?.payment?.status?.charAt(0).toUpperCase() + selectedOrder?.payment?.status?.slice(1)}
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
          )}
        </div>

        {/* Shipping Info */}
        <div 
          className="mb-4 pb-2 cursor-pointer" 
          onClick={() => toggleSection("shipping")}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <FaShippingFast className="mr-2 text-gray-500" /> Shipping Information
            </h4>
            <span className="text-gray-400 text-xs">
              {expandedSection === "shipping" ? "▼" : "▶"}
            </span>
          </div>
          
          {expandedSection === "shipping" && (
            <div className="mt-3 pl-6">
              <div className="text-sm mb-3">
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
          )}
        </div>
        
        {/* Actions */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
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
                {['pending', 'processing'].includes(selectedOrder?.status) && (
                  <button
                    onClick={() => cancelOrder(selectedOrder?._id)}
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
    </div>
  );
};

export default OrderDetailsPanel;