import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getMenus = createAsyncThunk(
  "menus/getMenus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/eats/stores/${id}/menus`);
      let menuData = [];
      let menuDocId = null;

      if (response.data.data && response.data.data.length > 0) {
        menuDocId = response.data.data[0]._id;
        menuData = response.data.data[0].menu || [];
      }

      return { menu: menuData, menuId: menuDocId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createMenu = createAsyncThunk(
  "menus/createMenu",
  async ({ restaurantId, category }, { rejectWithValue }) => {
    try {
      const body = {
        restaurant: restaurantId,
        menu: [{ category, items: [] }],
      };

      const { data } = await api.post(`/v1/eats/stores/${restaurantId}/menus`, body);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addItemToMenu = createAsyncThunk(
  "menus/addItemToMenu",
  async ({ menuId, category, foodItemId, restaurantId }, { rejectWithValue }) => {
    try {
      const body = { category, foodItemId };
      const { data } = await api.patch(
        `/v1/eats/stores/${restaurantId}/menus/${menuId}/addItem`,
        body
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
