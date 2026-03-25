import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminHeader from "../components/Admin/AdminHeader";
import toast from "react-hot-toast";

export default function AdminLayout() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // BẢO VỆ ROUTE: Nếu chưa đăng nhập HOẶC không phải admin -> Đá về trang chủ
  if (!userInfo || userInfo.role !== "admin") {
    toast.error("Truy cập bị từ chối! Bạn không có quyền Admin.", { id: "admin-error" }); // Thêm id để tránh toast bị lặp
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar cố định bên trái (Rộng 64 = 256px) */}
      <AdminSidebar />

      {/* Cột nội dung bên phải (Margin left 256px để chừa chỗ cho Sidebar) */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <AdminHeader />
        
        {/* Nội dung các trang Admin sẽ thay đổi ở đây */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}