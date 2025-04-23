// src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');


// Create a new order
router.post('/create/:userId', orderController.createOrder);
router.post('/create/:userId',  orderController.createOrder);

// Get all orders for a user
router.get('/user/:userId', orderController.getUserOrders);
// router.post('/capturePayment',  orderController.capturePayment);

// Get all orders (admin only)
// router.get('/', orderController.getAllOrders);

// Get customer orders
// router.get('/my-orders/:id', orderController.getCustomerOrders);

// Get a specific order by ID
router.get('/:orderId', orderController.getOrderById);
// // Get order by ID
// router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:orderId/status', orderController.updateOrderStatus);
// // Update order status (admin only)
// router.put('/:id/status',  orderController.updateOrderStatus);

// Cancel an order
router.post('/:orderId/cancel', orderController.cancelOrder);
// // Cancel order
// router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;