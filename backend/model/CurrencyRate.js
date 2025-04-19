// src/models/currencyRate.js
const mongoose = require('mongoose');

const currencyRateSchema = new mongoose.Schema({
  base: {
    type: String,
    required: true,
    default: 'INR'
  },
  rates: {
    type: Map,
    of: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add an index for faster retrieval
currencyRateSchema.index({ base: 1 });

const CurrencyRate = mongoose.model('CurrencyRate', currencyRateSchema);

module.exports = CurrencyRate;