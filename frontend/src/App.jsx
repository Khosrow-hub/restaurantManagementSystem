import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Components/layout/Header";
import Home from "../Components/Home";
import Menu from "../Components/Menu";
import Login from "../Components/user/Login";
import Register from "../Components/user/Register";
import ForgotPassword from "../Components/user/ForgotPassword";
import NewPassword from "../Components/user/NewPassword";
import Profile from "../Components/user/Profile";
import UpdateProfile from "../Components/user/UpdateProfile";
import Cart from "../cart/Cart";
import OrderSuccess from "../Components/cart/OrderSuccess";
import ListOrders from "../Components/order/ListOrders";
import OrderDetails from "../Components/order/OrderDetails";
import Footer from "../Components/layout/Footer";

function App() {
  return (
    <>
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eats/stores/search/:keyword" element={<Home />} />
          <Route path="/eats/stores/:id/menus" element={<Menu />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/signup" element={<Register />} />
          <Route path="/users/forgetPassword" element={<ForgotPassword />} />
          <Route path="/users/resetPassword/:token" element={<NewPassword />} />
          <Route path="/users/me" element={<Profile />} />
          <Route path="/users/me/update" element={<UpdateProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/eats/orders/me/myOrders" element={<ListOrders />} />
          <Route path="/eats/orders/:id" element={<OrderDetails />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
