import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    myOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  orderRequest,
  myOrdersSuccess,
  orderDetailsSuccess,
  orderCreateSuccess,
  orderFail,
  clearErrors,
} = orderSlice.actions;

export default orderSlice.reducer;
