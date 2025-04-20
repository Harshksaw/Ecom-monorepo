'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/app/lib/api';

interface CurrencyRates {
  [key: string]: number;
}

export default function CurrencyRatesPage() {
  const [rates, setRates] = useState<CurrencyRates>({});
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(true);
  const [editableRates, setEditableRates] = useState<CurrencyRates>({});

  // Fetch rates on load
  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/currency/rates?base=${baseCurrency}`);
      if (response.data.success) {
        setRates(response.data.data.rates);
        setEditableRates(response.data.data.rates);
        toast.success('Rates loaded');
      } else {
        toast.error('Failed to load rates');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching rates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateChange = (currency: string, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setEditableRates(prev => ({ ...prev, [currency]: parsed }));
    }
  };

  const handleUpdateRates = async () => {
    try {
      const response = await axios.post(`${API_URL}/currency/rates/update`, {
        base: baseCurrency,
        rates: editableRates
      });

      if (response.data.success) {
        toast.success('Rates updated successfully');
        fetchRates();
      } else {
        toast.error(response.data.message || 'Failed to update');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating rates');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Currency Rates ({baseCurrency})</h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Base Currency:</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          {/* Add more currencies if needed */}
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Currency</th>
              <th className="p-2 border">Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(editableRates).map(([currency, rate]) => (
              <tr key={currency}>
                <td className="p-2 border font-medium">{currency}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => handleRateChange(currency, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                    step="0.0001"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpdateRates}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Rates
        </button>
      </div>
    </div>
  );
}
