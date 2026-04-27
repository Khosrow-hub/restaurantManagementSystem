import API from "../../utils/api";
import {
  orderRequest,
  myOrdersSuccess,
  orderDetailsSuccess,
  orderCreateSuccess,
  orderFail,
} from "../slices/orderSlice";

export const payment = (items) => async (dispatch) => {
  try {
    dispatch(orderRequest());
    const { data } = await API.post("/v1/payment/process", { items });
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || "Payment failed"));
  }
};

export const createOrder = (session_id) => async (dispatch) => {
  try {
    dispatch(orderRequest());
    const { data } = await API.post("/v1/eats/orders/new", { session_id });
    dispatch(orderCreateSuccess(data.order));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || "Create order failed"));
  }
};

export const myOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());
    const { data } = await API.get("/v1/eats/orders/me/myOrders");
    dispatch(myOrdersSuccess(data.orders || []));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || "Unable to fetch orders"));
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderRequest());
    const { data } = await API.get(`/v1/eats/orders/${id}`);
    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || "Unable to fetch order"));
  }
};
