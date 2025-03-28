'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaBox, 
  FaMoneyBillWave, 
  FaTruck, 
  FaCheck, 
  FaTimes,
  FaCreditCard,
  FaMapMarkerAlt,
  FaDownload,
  FaPrint
} from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';
import Wrapper from '@/app/components/Wrapper';
import { useAuth } from '@/app/context/authcontext';

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
  shippingCost?: number;
  tax?: number;
  subtotal?: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
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