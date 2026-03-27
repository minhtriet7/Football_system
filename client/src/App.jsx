import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // <-- Bạn đã import BrowserRouter ở đây
import { Toaster } from "react-hot-toast";
import ProductsPage from "./pages/Products/ProductsPage";
import MainLayout from "./layouts/MainLayout";
import FieldsPage from "./pages/Fields/FieldsPage";
import SupportPage from "./pages/Support/SupportPage";
import HomePage from "./pages/Home/HomePage";
import AuthPage from "./pages/Auth/AuthPage";
import FieldDetail from "./pages/FieldDetail/FieldDetail";
import Checkout from "./pages/Checkout/Checkout";
import BookingHistory from "./pages/Profile/BookingHistory"; 
import Chatbot from "./components/ui/Chatbot";
import NewsPage from "./pages/News/NewsPage"; 
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ManageBookings from "./pages/Admin/ManageBookings";
import ManageFields from "./pages/Admin/ManageFields";
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageUsers from "./pages/Admin/ManageUsers";
import Profile from './pages/Profile/Profile';
import VnpayReturn from './pages/Checkout/VnpayReturn'; // Đường dẫn import tùy thuộc vào nơi bạn lưu file này
function App() {
  return (
    // THAY THẺ <> BẰNG BROWSER_ROUTER ĐỂ BỌC TOÀN BỘ ỨNG DỤNG
    <BrowserRouter> 
      <Toaster position="top-center" /> 
      
      <Routes>
        {/* ================================== */}
        {/* 1. KHU VỰC KHÁCH HÀNG (Dùng MainLayout) */}
        {/* ================================== */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="fields" element={<FieldsPage />} />
          <Route path="field/:id" element={<FieldDetail />} />
          <Route path="checkout/:id" element={<Checkout />} />
          <Route path="my-bookings" element={<BookingHistory />} />
          <Route path="products-services" element={<ProductsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vnpay-return" element={<VnpayReturn />} />
        </Route>

        {/* ================================== */}
        {/* 2. KHU VỰC ADMIN (Dùng AdminLayout) */}
        {/* ================================== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="fields" element={<ManageFields />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Trang Đăng nhập/Đăng ký đứng riêng */}
        <Route path="/auth" element={<AuthPage />} />

      </Routes>
      
      <Chatbot /> {/* Nếu bạn có dùng Chatbot chung cho toàn web thì để ở đây */}
    </BrowserRouter> // ĐÓNG THẺ BROWSER_ROUTER Ở ĐÂY
  );
}

export default App;