const Order = require('../model/Order');
const Product = require('../model/Products');
const Razorpay = require("razorpay");
// Generate a unique order number
const crypto = require('crypto');
const generateOrderNumber = () => {
  return 'JW-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};

// Retrieve these from environment variables or your secrets store:
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
   
      total,
      tax,
      subtotal,
      shippingAddress,
      items,



    } = req.body;
    console.log("🚀 ~ exports.createOrder= ~ req.body:", req.body)

    const userId = req.params.id;

    // 1) Create the Order in Mongo first (status = pending).
    let newOrder = new Order({
      orderNumber: generateOrderNumber(),

      userId,
      items,
      subtotal,
      tax,

      total,
      shippingAddress,


      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    // Save to DB so we get an _id we can reference
    newOrder = await newOrder.save();

    // 2) Create a Razorpay order
    const options = {
      amount: Math.round(total * 100),       // amount in paise (for INR)
      currency: "INR",
      receipt: `receipt_${newOrder._id}` // can be any unique reference
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3) Attach Razorpay order ID to our local Order doc
    newOrder.razorpayOrderId = razorpayOrder.id;  
    await newOrder.save();

    return res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order: newOrder // local Order doc
    });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ success: false, error });
  }
}


exports.capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    // 1) Recompute the expected signature using secret
    const shasum = crypto.createHmac('sha256', razorpayKeySecret);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');

    // 2) Compare with the signature from Razorpay
    if (digest !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // 3) If valid, find the local order in DB
    const existingOrder = await Order.findOne({ razorpayOrderId: orderId });
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // 4) Mark payment as completed (or processing)
    existingOrder.razorpayPaymentId = paymentId;
    existingOrder.razorpaySignature = signature;
    existingOrder.paymentStatus = 'completed';
    // existingOrder.orderStatus = 'processing'; // If you track shipping, etc.
    await existingOrder.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      orderId: existingOrder._id
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }

}
// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      status,
      startDate,
      endDate,
      search
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter
    const filter = {};
    
    if (status) filter.orderStatus = status;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'email firstName lastName')
      .populate('items.productId', 'name sku');
    
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get customer orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name sku images');
    
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'email firstName lastName')
      .populate('items.productId', 'name sku images price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow admin or the order owner to view
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, notes } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(trackingNumber && { trackingNumber }),
        ...(notes && { notes }),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order (customer or admin)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow admin or the order owner to cancel
    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.orderStatus}` 
      });
    }
    
    // Update order status
    order.orderStatus = 'cancelled';
    order.updatedAt = Date.now();
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } }
      );
    }
    
    await order.save();
    
    res.status(200).json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
