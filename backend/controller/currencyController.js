
// src/controllers/currencyController.js
const currencyService = require('../services/currencyService');

/**
 * Get all available currency rates
 */
async function getRates(req, res) {
  try {
    const baseCurrency = req.query.base || 'INR';
    const rates = await currencyService.getRates(baseCurrency);
    
    res.json({
      success: true,
      data: {
        base: baseCurrency,
        rates: rates,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get currency rates',
      error: error.message
    });
  }
}

/**
 * Create or update currency rates
 */
async function updateRates(req, res) {
  try {
    const { rates, base } = req.body;
    
    if (!rates || typeof rates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Valid rates object is required'
      });
    }
    
    const result = await currencyService.createOrUpdateRates(rates, base || 'INR');
    
    res.json({
      success: true,
      message: 'Currency rates updated successfully',
      data: {
        base: result.base,
        lastUpdated: result.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update currency rates',
      error: error.message
    });
  }
}

/**
 * Convert a price from base currency to target currency
 */
async function convertPrice(req, res) {
  try {
    const { price, targetCurrency, baseCurrency } = req.body;
    
    if (price === undefined || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }
    
    if (!targetCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Target currency is required'
      });
    }
    
    const convertedPrice = await currencyService.convertPrice(
      parseFloat(price),
      targetCurrency,
      baseCurrency || 'INR'
    );
    
    res.json({
      success: true,
      data: {
        originalPrice: parseFloat(price),
        originalCurrency: baseCurrency || 'INR',
        convertedPrice,
        targetCurrency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to convert price',
      error: error.message
    });
  }
}

module.exports = {
  getRates,
  updateRates,
  convertPrice
};
