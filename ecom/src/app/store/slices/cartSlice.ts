// src/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Cart item interface
export interface CartItem {
  productId: string;
  variantId: string;
  sizeId?: string;
  name: string;
  metalColor: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  stock: number;
  deliveryOptions?: any[]
}

// Cart state interface
interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  lastAdded?: string; // Track the last added item ID for animations
}

// Initial state
const initialState: CartState = {
  items: [],
  isCartOpen: false,
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        
        // Add quantities without stock check
        const newQuantity = existingItem.quantity + newItem.quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        
        console.log("🚀 ~ updatedItems:", updatedItems)
        state.items = updatedItems;
      }
      else {
        state.items.push(newItem); // <-- THIS LINE WAS MISSING
      }
      
      
      // Update lastAdded for animation
      state.lastAdded = newItem.variantId;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<{ productId: string; variantId: string }>) => {
      const { productId, variantId } = action.payload;
      
      state.items = state.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
    
    // Update item quantity
    updateCartItemQuantity: (
      state, 
      action: PayloadAction<{ productId: string; variantId: string; quantity: number }>
    ) => {
      const { productId, variantId, quantity } = action.payload;
      
      const itemIndex = state.items.findIndex(
        item => item.productId === productId && item.variantId === variantId
      );
      
      if (itemIndex >= 0) {
        // Make sure quantity is valid
        const updatedQuantity = Math.max(1, Math.min(quantity, state.items[itemIndex].stock));
        
        state.items[itemIndex].quantity = updatedQuantity;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cartState', JSON.stringify(state));
        }
      }
    },
    
    // Update cart (compatibility with older implementation)
    updateCart: (
      state,
      action: PayloadAction<{ id: string; key: string; val: any }>
    ) => {
      const { id, key, val } = action.payload;
      
      // Find the item by id (which might be productId-variantId)
      const item = state.items.find(item => 
        item.productId === id || `${item.productId}-${item.variantId}` === id
      );
      
      if (item) {
        // Update the specified key
        (item as any)[key] = val;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cartState', JSON.stringify(state));
        }
      }
    },
    
    // Clear cart
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },
    
    // Toggle cart open/closed
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    
    // Load cart from localStorage 
    loadCartFromStorage: (state) => {
      if (typeof window === 'undefined') return;
      
      try {
        const savedCart = localStorage.getItem('cartState');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart) as CartState;
          state.items = parsedCart.items;
          state.lastAdded = parsedCart.lastAdded;
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  },
});



// Export actions
export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity,
  updateCart,
  clearCart,
  toggleCart,
  loadCartFromStorage
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemsCount = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectIsCartOpen = (state: { cart: CartState }) => state.cart.isCartOpen;