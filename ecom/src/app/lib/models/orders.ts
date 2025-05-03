import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Order item interface with tracking info
export interface IOrderItem {
  productId: Types.ObjectId;
  variantId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  status?: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedDate?: Date;
  };
}

// Shipping address interface
export interface IShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
}

// Delivery option interface
export interface IDeliveryOption {
  type?: string;
  duration?: string;
  price?: number;
}

// Payment information interface
export interface IPayment {
  gateway: 'payoneer' | 'credit_card' | 'bank_transfer' | 'other';
  transactionId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled' | 'refund_pending';
  paymentDate?: Date;
  payoneerReference?: string;
  paymentDetails?: Map<string, string>;
}

// Order interface
export interface IOrder extends Document {
  orderId: string;
  userId: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax?: number;
  discount?: number;
  total: number;
  shippingAddress: IShippingAddress;
  deliveryOption?: IDeliveryOption;
  payment: IPayment;
  status: 'pending' | 'processing' | 'partially_shipped' | 'shipped' | 'partially_delivered' | 'delivered' | 'cancelled' | 'refunded';
  customerNotes?: string;
  internalNotes?: string;
  orderDate: Date;
  updatedAt: Date;
}

// Create schemas for nested objects
const TrackingInfoSchema = new Schema({
  carrier: String,
  trackingNumber: String,
  trackingUrl: String,
  shippedDate: Date
});

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variantId: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  image: String,
  status: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'], 
    default: 'processing' 
  },
  trackingInfo: TrackingInfoSchema
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  addressLine1: { 
    type: String, 
    required: true 
  },
  addressLine2: String,
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  phone: String
});

const DeliveryOptionSchema = new Schema<IDeliveryOption>({
  type: String,
  duration: String,
  price: Number
});

const PaymentSchema = new Schema<IPayment>({
  gateway: { 
    type: String, 
    enum: ['payoneer', 'credit_card', 'bank_transfer', 'other'], 
    default: 'payoneer' 
  },
  transactionId: String,
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    required: true, 
    default: 'USD' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled', 'refund_pending'], 
    default: 'pending' 
  },
  paymentDate: Date,
  payoneerReference: String,
  paymentDetails: {
    type: Map,
    of: String
  }
});

// Create the main Order schema
const OrderSchema = new Schema<IOrder>({
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [OrderItemSchema],
  subtotal: { 
    type: Number, 
    required: true 
  },
  shippingCost: { 
    type: Number,