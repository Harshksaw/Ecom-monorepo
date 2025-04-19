// src/app/hooks/useCurrency.ts
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { store } from '../app/store/store';
import {
  fetchExchangeRates, 
  setCurrency, 
  loadCurrencyFromStorage,
  selectSelectedCurrency,
  selectExchangeRates,
  CurrencyCode,
  CURRENCY_SYMBOLS
} from '../app/store/slices/currencySlice';


const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useCurrency = () => {
  const dispatch = useDispatch<any>();
  const selectedCurrency = useSelector(selectSelectedCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  
  // Initialize currency from localStorage and fetch exchange rates if needed
  useEffect(() => {
    // Load saved currency preference
    dispatch(loadCurrencyFromStorage());
    
    // Get last update timestamp from localStorage
    const lastUpdated = localStorage.getItem('currencyRatesLastUpdated');
    const lastUpdatedTime = lastUpdated ? parseInt(lastUpdated, 10) : null;
    
    // Check if rates need updating (more than a day old or never fetched)
    const needsUpdate = !lastUpdatedTime || (Date.now() - lastUpdatedTime > ONE_DAY_MS);
    
    if (needsUpdate) {
      dispatch(fetchExchangeRates())
        .then((action:any) => {
          if (fetchExchangeRates.fulfilled.match(action)) {
            // Save last updated timestamp
            localStorage.setItem('currencyRatesLastUpdated', Date.now().toString());
          }
        });
    }
  }, [dispatch]);
  
  // Function to change currency
  const changeCurrency = (currency: CurrencyCode) => {
    dispatch(setCurrency(currency));
  };
  
  // Function to format price based on selected currency
  const formatPrice = (priceInINR: number): string => {
    if (!priceInINR && priceInINR !== 0) return 'N/A';
    
    const exchangeRate = exchangeRates[selectedCurrency] || 1;
    const convertedPrice = priceInINR * exchangeRate;
    
    // Get currency symbol
    const symbol = CURRENCY_SYMBOLS[selectedCurrency];
    
    // Format based on currency
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };
  
  return {
    selectedCurrency,
    exchangeRates,
    changeCurrency,
    formatPrice,
    currencySymbol: CURRENCY_SYMBOLS[selectedCurrency],
  };
};