const express = require('express');
const adminCurrencyController = require('../controllers/adminCurrencyController');
const { authenticate, isAdmin } = require('../../middlewares/auth');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(isAdmin);

router.get('/currency-rates', adminCurrencyController.getCurrencyRatesPage);
router.post('/currency-rates', adminCurrencyController.handleUpdateRates);

module.exports = router;