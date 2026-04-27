import { configureStore } from "@reduxjs/toolkit";
import restaurants from "./slices/restaurantSlice";
import menus from "./slices/menuSlice";
import user from "./slices/userSlice";
import cart from "./slices/cartSlice";
import order from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    restaurants,
    menus,
    user,
    cart,
    order,
  },
});

export default store;
