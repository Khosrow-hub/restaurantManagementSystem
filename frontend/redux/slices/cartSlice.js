import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  cartItems: [],
  restaurant: null,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartSuccess: (state, action) => {
      state.loading = false;
      const payload = action.payload || {};
      state.cartItems = payload.items || [];
      state.restaurant = payload.restaurant || null;
      state.error = null;
    },
    cartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
});

export const { cartRequest, cartSuccess, cartFail, clearCartError } =
  cartSlice.actions;

export default cartSlice.reducer;
