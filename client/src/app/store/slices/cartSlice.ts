// src/app/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define interfaces for type safety
interface CartItem {
  id: string;
  quantity: number;
  price: number;
  oneQuantityPrice: number;
  [key: string]: any; // For other properties
}

interface CartState {
  cartItems: CartItem[];
}

interface UpdateCartPayload {
  id: string;
  key: string;
  val: any;
}

interface RemoveFromCartPayload {
  id: string;
}

// Initial state
const initialState: CartState = {
  cartItems: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.cartItems.find(p => p.id === action.payload.id);
      if (item) {
        // If item exists, increase quantity
        item.quantity++;
        item.price = item.oneQuantityPrice * item.quantity;
      } else {
        // If item doesn't exist, add it to cart
        state.cartItems.push({...action.payload, quantity: 1});
      }
    },
    
    updateCart: (state, action: PayloadAction<UpdateCartPayload>) => {
      state.cartItems = state.cartItems.map(p => {
        if (p.id === action.payload.id) {
          if (action.payload.key === "quantity") {
            p.price = p.oneQuantityPrice * action.payload.val;
          }
          return { ...p, [action.payload.key]: action.payload.val };
        }
        return p;
      });
    },
    
    removeFromCart: (state, action: PayloadAction<RemoveFromCartPayload>) => {
      state.cartItems = state.cartItems.filter(p => p.id !== action.payload.id);
    },
    
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
});

export const { addToCart, updateCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;