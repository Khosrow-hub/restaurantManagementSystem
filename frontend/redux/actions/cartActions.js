import API from "../../utils/api";
import {
  cartRequest,
  cartSuccess,
  cartFail,
  clearCartError,
} from "../slices/cartSlice";

export const fetchCartItems = () => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.get("/v1/eats/cart/get-cart");
    dispatch(cartSuccess(data.data));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || "Unable to fetch cart"));
  }
};

export const addItemToCart =
  (foodItemId, restaurantId, quantity = 1) =>
  async (dispatch) => {
    try {
      dispatch(cartRequest());
      const { data } = await API.post("/v1/eats/cart/add-to-cart", {
        foodItemId,
        restaurantId,
        quantity,
      });
      dispatch(cartSuccess(data.cart));
    } catch (error) {
      dispatch(cartFail(error.response?.data?.message || "Unable to add item"));
    }
  };

export const updateCartQuantity = (foodItemId, quantity) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.post("/v1/eats/cart/update-cart-item", {
      foodItemId,
      quantity,
    });
    dispatch(cartSuccess(data.cart));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || "Unable to update item"));
  }
};

export const removeItemFromCart = (foodItemId) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await API.delete("/v1/eats/cart/delete-cart-item", {
      data: { foodItemId },
    });
    if (data.cart) {
      dispatch(cartSuccess(data.cart));
    } else {
      dispatch(cartSuccess({ items: [], restaurant: null }));
    }
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || "Unable to remove item"));
  }
};

export { clearCartError };
