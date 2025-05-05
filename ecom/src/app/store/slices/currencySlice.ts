// src/app/store/slices/currencySlice.ts
import { API_URL } from "@/app/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Currency types
export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

// Exchange rates interface
interface ExchangeRates {
  [key: string]: number;
}

// Currency state interface
interface CurrencyState {
  selectedCurrency: CurrencyCode;
  exchangeRates: ExchangeRates;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Initial state
const initialState: CurrencyState = {
  selectedCurrency: "INR",
  exchangeRates: {
    INR: 1,
    USD: 0.012, // Fallback rates in case API fails
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

// Define the async thunk for fetching currency rates
export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, { rejectWithValue }) => {
    try {
      // Using open exchange rate API (you'll need to replace this with your API key)
      const response = await axios.get(`${API_URL}/currency/rates`);
      const data = response.data;

      // Extract just the rates we need
      const rates: ExchangeRates = {
        INR: 1,
        USD: data.rates.USD,
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        AED: data.rates.AED,
      };

      return rates;
    } catch (error) {
      return rejectWithValue("Failed to fetch exchange rates");
    }
  }
);

// Create the currency slice
const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    // Change the selected currency
    setCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.selectedCurrency = action.payload;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedCurrency", action.payload);
      }
    },

    // Load currency preferences from localStorage
    loadCurrencyFromStorage: (state) => {
      if (typeof window === "undefined") return;

      try {
        const savedCurrency = localStorage.getItem("selectedCurrency");
        if (savedCurrency) {
          state.selectedCurrency = savedCurrency as CurrencyCode;
        }
      } catch (error) {
        console.error("Failed to load currency from localStorage:", error);
      }
    },
    setExchangeRates: (state, action) => {
      state.exchangeRates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRates = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setCurrency, loadCurrencyFromStorage, setExchangeRates } =
  currencySlice.actions;

// Export reducer
export default currencySlice.reducer;

// Selectors
export const selectSelectedCurrency = (state: { currency: CurrencyState }) =>
  state.currency.selectedCurrency;

export const selectExchangeRates = (state: { currency: CurrencyState }) =>
  state.currency.exchangeRates;

// Utility function to convert price based on current exchange rates
export const convertPrice = (
  state: { currency: CurrencyState },
  priceInINR: number
): number => {
  const { selectedCurrency, exchangeRates } = state.currency;
  return priceInINR * (exchangeRates[selectedCurrency] || 1);
};

// Currency symbols
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};
