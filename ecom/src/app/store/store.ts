import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import currencySlice from "./slices/currencySlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    currency: currencySlice,
  },
  devTools: true,
});
export type AppDispatch = typeof store.dispatch;
