import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, Map, ShoppingBag, Users } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { title: "Tổng quan", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { title: "Quản lý Đơn sân", path: "/admin/bookings", icon: <CalendarCheck size={20} /> },
    { title: "Hệ thống Sân", path: "/admin/fields", icon: <Map size={20} /> },
    { title: "Dịch vụ & Nước", path: "/admin/products", icon: <ShoppingBag size={20} /> },
    { title: "Khách hàng", path: "/admin/users", icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50">
      {/* Logo Admin */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <Link to="/admin" className="text-2xl font-black text-white tracking-tight">
          24h<span className="text-rose-500">Admin</span>
        </Link>
      </div>

      {/* Menu Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item, index) => {
          // Check active chính xác
          const isActive = item.path === '/admin' 
            ? location.pathname === '/admin' 
            : location.pathname.includes(item.path);

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium
                ${isActive 
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold translate-x-1" 
                  : "hover:bg-slate-800 hover:text-white hover:translate-x-1"
                }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-center text-slate-500">
        © 2026 24h Sports
      </div>
    </div>
  );
}