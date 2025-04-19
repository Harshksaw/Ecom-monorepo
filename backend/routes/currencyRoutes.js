const express = require('express');
const currencyController = require('../controller/currencyController');

const router = express.Router();

// Public routes
router.get('/rates', currencyController.getRates);
router.post('/convert', currencyController.convertPrice);

// Protected routes (require admin authentication to update rates)
router.post('/rates/update', currencyController.updateRates);

module.exports = router;