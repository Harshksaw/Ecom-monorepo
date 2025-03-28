const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const { authenticate, isAdmin } = require('../middleware/authorization');

// Create a new order
router.post('/create/:id',  orderController.createOrder);

// Get all orders (admin only)
router.get('/', authenticate, isAdmin, orderController.getAllOrders);

// Get customer orders
router.get('/my-orders', authenticate, orderController.getCustomerOrders);

// Get order by ID
router.get('/:id', authenticate, orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);

// Cancel order
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router;
