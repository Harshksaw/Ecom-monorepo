
// src/services/currencyService.js
const CurrencyRate = require('../model/CurrencyRate');

// Default conversion rates
const DEFAULT_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044
};

/**
 * Create initial currency rates or update existing ones
 * @param {Object} rates - Currency conversion rates (e.g., {USD: 0.012, EUR: 0.011})
 * @param {String} baseCurrency - Base currency code (default: 'INR')
 */
async function createOrUpdateRates(rates = DEFAULT_RATES, baseCurrency = 'INR') {
  try {
    // Validate rates
    if (!rates || typeof rates !== 'object') {
      throw new Error('Rates must be a valid object');
    }
    
    // Ensure base currency has rate of 1
    const updatedRates = { ...rates };
    updatedRates[baseCurrency] = 1;
    
    // Update or create rates document
    const result = await CurrencyRate.findOneAndUpdate(
      { base: baseCurrency },
      { 
        rates: updatedRates,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    
    return result;
  } catch (error) {
    console.error('Error creating/updating currency rates:', error.message);
    throw error;
  }
}

/**
 * Get latest currency rates from database
 * @param {String} baseCurrency - Base currency code (default: 'INR')
 */
async function getRates(baseCurrency = 'INR') {
  try {
    const rateData = await CurrencyRate.findOne({ base: baseCurrency }).sort({ lastUpdated: -1 });
    
    // If rates exist, return them as a plain object
    if (rateData && rateData.rates) {
      return Object.fromEntries(rateData.rates);
    }
    
    // If no rates exist, create default rates and return them
    await createOrUpdateRates(DEFAULT_RATES, baseCurrency);
    return DEFAULT_RATES;
  } catch (error) {
    console.error('Error getting currency rates:', error.message);
    return DEFAULT_RATES;
  }
}

/**
 * Convert price from base currency to target currency
 * @param {Number} price - Price in base currency
 * @param {String} targetCurrency - Target currency code
 * @param {String} baseCurrency - Base currency code (default: 'INR')
 */
async function convertPrice(price, targetCurrency, baseCurrency = 'INR') {
  if (targetCurrency === baseCurrency) {
    return price;
  }
  
  const rates = await getRates(baseCurrency);
  
  if (!rates[targetCurrency]) {
    throw new Error(`Currency ${targetCurrency} not supported`);
  }
  
  return price * rates[targetCurrency];
}

module.exports = {
  createOrUpdateRates,
  getRates,
  convertPrice
};
