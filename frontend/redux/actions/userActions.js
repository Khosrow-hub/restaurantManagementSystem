import API from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
} from "../slices/userSlice";

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (Array.isArray(data?.message)) return data.message.join(", ");
  return data?.message || data?.errMessage || error?.message || fallback;
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await API.post("/v1/users/login", { email, password });
    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(getErrorMessage(error, "Login failed")));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await API.post("/v1/users/signup", userData);
    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(getErrorMessage(error, "Registration failed")));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await API.get("/v1/users/me");
    dispatch(loginSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail(getErrorMessage(error, "Unable to load user")));
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await API.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(getErrorMessage(error, "Unable to update profile")));
  }
};

export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await API.put("/v1/users/password/update", passwords);
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(getErrorMessage(error, "Unable to update password")));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const { data } = await API.post("/v1/users/forgetPassword", { email });
    dispatch(forgotPasswordSuccess(data.message || "Token sent"));
  } catch (error) {
    dispatch(forgotPasswordFail(getErrorMessage(error, "Unable to send reset link")));
  }
};

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const { data } = await API.patch(`/v1/users/resetPassword/${token}`, passwords);
    dispatch(resetPasswordSuccess(data.success));
  } catch (error) {
    dispatch(resetPasswordFail(getErrorMessage(error, "Unable to reset password")));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await API.get("/v1/users/logout");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(getErrorMessage(error, "Logout failed")));
  }
};
