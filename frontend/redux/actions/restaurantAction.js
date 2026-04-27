import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getRestaurants = createAsyncThunk(
  "restaurants/getRestaurants",
  async (keyword = "", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/v1/eats/stores?keyword=${keyword}`);
      return {
        restaurants: data.restaurants || [],
        count: data.count || 0,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createRestaurant = createAsyncThunk(
  "restaurants/createRestaurant",
  async (restaurantData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/eats/stores", restaurantData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  "restaurants/deleteRestaurant",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/v1/eats/stores/${id}`);
      return { id, message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const analyzeReviews = createAsyncThunk(
  "restaurants/analyzeReviews",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/v1/ai/admin/restaurants/${id}/analyze`);
      return {
        restaurantId: id,
        aiData: data.aiData,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "AI failed");
    }
  }
);
