const Order = require('../model/Order');
const Product = require('../model/Products');

// Generate a unique order number
const generateOrderNumber = () => {
  return 'JW-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod
    } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    // Calculate order totals and validate items
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      
      if (!product.isActive) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }
      
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stockQuantity}`
        });
      }
      
      const itemPrice = product.salePrice || product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: itemPrice
      });
      
      // Reduce stock quantity
      product.stockQuantity -= item.quantity;
      await product.save();
    }
    
    // Calculate tax and shipping (simplified)
    const tax = subtotal * 0.07; // 7% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;
    
    // Create order
    const newOrder = new Order({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });
    
    await newOrder.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
