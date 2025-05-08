// src/controller/order.controller.js
const User = require('../model/User');
const Order = require('../model/Order');
const mongoose = require('mongoose');

/**
 * Generates a unique order ID
 * @returns {string} Unique order ID
 */
const generateOrderId = () => {
  // Create a timestamp-based prefix
  const timestamp = new Date().getTime().toString().slice(-6);
  // Add a random suffix
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  // Combine to create a unique order ID
  return `ORD-${timestamp}-${random}`;
};

/**
 * Create a new order
 * 
 * Required body parameters:
 * - userId: ID of the user placing the order
 * - items: Array of items in the order (product details)
 * - subtotal: Subtotal amount
 * - shippingCost: Shipping cost
 * - total: Total amount
 * - shippingAddress: Shipping address details
 * - paymentMethod: Payment method (e.g., 'payoneer')
 */
const createOrder = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const {
      subtotal,
      shippingCost,
      total,
      shippingAddress,
      items,
      paymentMethod = 'razorpay',
      status = 'pending'
    } = req.body;
    
    console.log("🚀 ~ createOrder ~ shippingAddress:", shippingAddress);
    console.log("🚀 ~ createOrder ~ items:", items);
    
    // Extract user ID from request params
    const { userId } = req.params;
    console.log("🚀 ~ createOrder ~ userId:", userId);
    
    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Create a unique order ID
    const orderId = generateOrderId();
    
    // Create new order
    const newOrder = new Order({
      orderId,
      userId,
      items: items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal,
      shippingCost,
      total,
      shippingAddress,
      status,
      payment: {
        gateway: paymentMethod,
        amount: total,
        status: 'pending'
      },
      orderDate: new Date()
    });
    
    // Save order to database
    await newOrder.save();
    
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: newOrder._id,
      orderNumber: newOrder.orderId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

/**
 * Get user's orders
 * 
 * Required path parameter:
 * - userId: ID of the user
 */
const getUserOrders = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Extract user ID from request params
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Find orders for user
    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 }) // Most recent first
      .lean();
    
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

/**
 * Get order by ID
 * 
 * Required path parameter:
 * - orderId: ID of the order
 */
const getOrderById = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Extract order ID from request params
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    // Find order
    const order = await Order.findById(orderId).lean();
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

/**
 * Update order status
 * 
 * Required path parameter:
 * - orderId: ID of the order
 * 
 * Required body parameter:
 * - status: New status for the order
 */
const updateOrderStatus = async (req, res) => {

  
  try {
    // Extract order ID from request params

    const { appOrderId , paymentId, status } = req.body;
    

    
    // Validate status
    // const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    // if (!validStatuses.includes(status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid status value'
    //   });
    // }
    
    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      appOrderId,
      { status : "processing", 


        payment:{
          status: status,
          paymentDate: new Date(),
          transactionId: paymentId
        }
       },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

/**
 * Cancel order
 * 
 * Required path parameter:
 * - orderId: ID of the order
 */
const cancelOrder = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Extract order ID from request params
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    // Find the order first
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Only allow admin or the order owner to cancel
    if (req.user && req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized' 
      });
    }
    
    // Check if order can be cancelled (only pending or processing orders)
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in ${order.status} status`
      });
    }
    
    // Start a database transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update order status
      order.status = 'cancelled';
      order.payment.status = 'cancelled';
      await order.save({ session });
      
      // If payment was already completed, initiate refund
      if (order.payment.status === 'completed') {
        // Here you'd integrate with Payoneer's refund API
        // For now, just mark as refund pending
        order.payment.status = 'refund_pending';
        await order.save({ session });
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
      });
    } catch (error) {
      // Abort transaction if error occurs
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};



const getAllAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).populate('userId', 'items productId').lean();
    
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

const editOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("🚀 ~ editOrder ~ orderId:", orderId)
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Export handlers for API routes
module.exports = {
  createOrder,
  getUserOrders,
  editOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllAdminOrders
};