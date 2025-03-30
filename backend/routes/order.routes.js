const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const { authenticate, isAdmin } = require('../middleware/authorization');

// Create a new order
router.post('/create/:id',  orderController.createOrder);

router.post('/capturePayment',  orderController.capturePayment);

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);

// Get customer orders
router.get('/my-orders/:id', orderController.getCustomerOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status',  orderController.updateOrderStatus);

// Cancel order
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
