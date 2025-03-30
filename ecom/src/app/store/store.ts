import cartSlice from './slices/cartSlice'
import userSlice from './slices/userSlice'
import {configureStore} from '@reduxjs/toolkit'
export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice
  },
  devTools: true
})