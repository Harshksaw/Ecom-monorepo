// src/models/Order.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Order Schema
const orderSchema = new Schema({
  // Order reference ID (for customer-facing communication)
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  // User who placed the order
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // Multiple items in the order
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Products", 
      required: true 
    },
    variantId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String },
    // Individual item status
    status: { 
      type: String, 
      enum: ["processing", "shipped", "delivered", "cancelled", "returned"], 
      default: "processing" 
    },
    // Item-specific shipping details if needed
    trackingInfo: {
      carrier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      shippedDate: { type: Date }
    }
  }],
  
  // Order summary
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  // Shipping details
  shippingAddress: {

    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: false }
  },
  
  // Selected delivery option
  deliveryOption: {
    type: { type: String },
    duration: { type: String },
    price: { type: Number }
  },
  
  // Payment information
  payment: {
    gateway: { 
      type: String, 
      enum: ["payoneer", "credit_card", "bank_transfer", "other"], 
      default: "payoneer" 
    },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded", "partially_refunded", "cancelled", "refund_pending"], 
      default: "pending" 
    },
    paymentDate: { type: Date },
    payoneerReference: { type: String },
    paymentDetails: { type: Map, of: String }
  },
  
  // Overall order status
  status: { 
    type: String, 
    enum: ["pending", "processing", "partially_shipped", "shipped", "partially_delivered", "delivered", "cancelled", "refunded"], 
    default: "pending" 
  },
  
  // Customer and internal notes
  customerNotes: { type: String },
  internalNotes: { type: String },
  
  // Timestamps
  orderDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update the updatedAt field
orderSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for frequently queried fields
orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: 1 });

// Create a virtual for calculating total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Order model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;