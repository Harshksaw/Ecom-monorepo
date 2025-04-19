const currencyService = require('../services/currencyService');


async function getCurrencyRatesPage(req, res) {
    try {
      const rates = await currencyService.getRates();
      res.render('admin/currency-rates', { 
        title: 'Manage Currency Rates',
        rates: rates,
        base: 'INR'
      });
    } catch (error) {
      console.error('Error loading currency rates page:', error);
      res.status(500).render('error', { 
        message: 'Failed to load currency rates page',
        error: error
      });
    }
  }
  
  async function handleUpdateRates(req, res) {
    try {
      const { rates } = req.body;
      
      // Convert string inputs to numbers
      const processedRates = {};
      for (const [currency, rate] of Object.entries(rates)) {
        processedRates[currency] = parseFloat(rate);
      }
      
      await currencyService.createOrUpdateRates(processedRates, 'INR');
      
      req.flash('success', 'Currency rates updated successfully');
      res.redirect('/admin/currency-rates');
    } catch (error) {
      console.error('Error updating currency rates:', error);
      req.flash('error', `Failed to update currency rates: ${error.message}`);
      res.redirect('/admin/currency-rates');
    }
  }
  
  module.exports = {
    getCurrencyRatesPage,
    handleUpdateRates
  };