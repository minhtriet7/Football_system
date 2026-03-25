import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search, ShieldCheck } from "lucide-react";

export default function AdminHeader() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/auth");
  };

  return (
    <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      {/* Ô tìm kiếm ảo cho đẹp */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Tìm kiếm mã đơn, tên khách hàng..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
        />
      </div>

      {/* Thông tin Admin */}
      <div className="flex items-center space-x-6 ml-auto">
        <button className="relative text-gray-400 hover:text-blue-900 transition">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-700">
            <ShieldCheck size={20} />
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">{userInfo.name || "Quản trị viên"}</p>
            <p className="text-xs text-rose-600 font-semibold mt-1">Super Admin</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-xl transition ml-2"
          title="Đăng xuất"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}