// src/app/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: []
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.cartItems.find((p) => p.id === action.payload.id);
      if (item) {
        // If item exists, increase quantity
        item.quantity++;
        item.price = item.oneQuantityPrice * item.quantity;
      } else {
        // If item doesn't exist, add it to cart
        state.cartItems.push({...action.payload, quantity: 1});
      }
    },
    
    updateCart: (state, action) => {
      state.cartItems = state.cartItems.map((p) => {
        if (p.id === action.payload.id) {
          if (action.payload.key === "quantity") {
            p.price = p.oneQuantityPrice * action.payload.val;
          }
          return { ...p, [action.payload.key]: action.payload.val };
        }
        return p;
      });
    },
    
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((p) => p.id !== action.payload.id);
    },
    
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
});

export const { addToCart, updateCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;