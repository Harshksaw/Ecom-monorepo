import React, { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency'
import { FaGlobeAmericas, FaChevronDown } from 'react-icons/fa';
import { CurrencyCode, CURRENCY_SYMBOLS } from '../store/slices/currencySlice';

const CurrencySelector = () => {
  const { selectedCurrency, changeCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  
  const currencies: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaGlobeAmericas className="text-gray-500 mr-1" />
        <span>{selectedCurrency}</span>
        <span className="text-lg">{CURRENCY_SYMBOLS[selectedCurrency]}</span>
        <FaChevronDown className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          onBlur={() => setIsOpen(false)}
        >
          <ul className="py-1">
            {currencies.map((currency) => (
              <li key={currency}>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${
                    selectedCurrency === currency 
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    changeCurrency(currency);
                    setIsOpen(false);
                  }}
                >
                  <span className="mr-2">{CURRENCY_SYMBOLS[currency]}</span>
                  {currency}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;