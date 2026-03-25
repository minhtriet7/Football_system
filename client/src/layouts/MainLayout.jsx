import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"; // <-- Đã thêm useLocation
import { MapPin, Phone, Mail, ChevronDown, User, LogOut } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // <-- Lấy đường dẫn hiện tại
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/auth");
  };

  // HÀM KIỂM TRA ĐANG Ở TRANG NÀO ĐỂ BÔI ĐỎ MENU
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.includes(path); // Bao gồm cả các trang con (vd: /field/123)
  };

  // Tách class CSS ra cho gọn và dễ đổi màu
  const activeClass = "text-rose-600 border-b-2 border-rose-600 pb-1 font-bold";
  const inactiveClass =
    "text-gray-700 hover:text-blue-900 pb-1 transition-colors font-semibold";

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200 text-xs py-2 px-8 hidden md:flex justify-between items-center text-gray-600">
        <div className="flex space-x-4">
          <span className="flex items-center">
            <MapPin size={14} className="mr-1 text-rose-600" /> Nội ô TP. Cần
            Thơ
          </span>
          <span className="flex items-center">
            <Phone size={14} className="mr-1 text-rose-600" /> 0904 438 369
          </span>
        </div>
        <div>Nền tảng đặt sân thể thao số 1 Cần Thơ</div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-black text-blue-900 tracking-tight"
        >
          24h<span className="text-rose-600">Sports</span>
        </Link>

        {/* Menu Navigation (ĐÃ ÁP DỤNG HIỆU ỨNG ACTIVE) */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className={isActive("/") ? activeClass : inactiveClass}>
            Trang chủ
          </Link>

          {/* Dropdown Sân Bóng */}
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link
              to="/fields"
              className={`flex items-center ${isActive("/field") ? activeClass : inactiveClass}`}
            >
              Sân bóng <ChevronDown size={16} className="ml-1" />
            </Link>
            <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link
                to="/fields?category=Sân 5 người"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-t-lg"
              >
                Sân 5 người
              </Link>
              <Link
                to="/fields?category=Sân 7 người"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600"
              >
                Sân 7 người
              </Link>
            </div>
          </div>

          <Link
            to="/products-services"
            className={
              isActive("/products-services") ? activeClass : inactiveClass
            }
          >
            Sản phẩm & Dịch vụ
          </Link>
          <Link
            to="/news"
            className={isActive("/news") ? activeClass : inactiveClass}
          >
            Tin tức
          </Link>
          <Link
            to="/support"
            className={isActive("/support") ? activeClass : inactiveClass}
          >
            Hỗ trợ
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {userInfo ? (
            <div className="flex items-center space-x-4 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <Link
                to="/my-bookings"
                className="flex items-center text-blue-900 font-bold text-sm hover:text-rose-600 transition"
                title="Xem lịch sử đặt sân"
              >
                <User size={18} className="mr-2" />
                {userInfo.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition pl-3 border-l border-blue-200"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-blue-900 font-bold hover:text-rose-600 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth"
                className="bg-rose-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-rose-700 transition shadow-md hover:shadow-lg"
              >
                Đăng ký ngay
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#003b73] text-white pt-16 pb-8 px-8 mt-12 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-blue-800 pb-12">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-black mb-6">
              24h<span className="text-rose-500">Sports</span>
            </h2>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed max-w-md">
              Nền tảng kết nối cộng đồng thể thao, giúp bạn dễ dàng tìm kiếm sân
              tập, quản lý đội bóng và đặt dịch vụ tiện lợi nhất tại nội ô Thành
              phố Cần Thơ.
            </p>
            <div className="space-y-3 text-sm text-blue-100">
              <p className="flex items-center">
                <MapPin size={16} className="mr-3 text-rose-400" /> Trung tâm
                Quận Ninh Kiều, TP. Cần Thơ
              </p>
              <p className="flex items-center">
                <Phone size={16} className="mr-3 text-rose-400" /> 0904 438 369
              </p>
              <p className="flex items-center">
                <Mail size={16} className="mr-3 text-rose-400" />{" "}
                info@24hsports.vn
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white">
              Quy định & Chính sách
            </h3>
            <ul className="space-y-4 text-sm text-blue-200">
              <li>
                <a href="#" className="hover:text-rose-400 transition">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-400 transition">
                  Quy chế hoạt động ứng dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-400 transition">
                  Chính sách thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-rose-400 transition">
                  Bảo mật thông tin cá nhân
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white">
              Liên kết nhanh
            </h3>
            <ul className="space-y-4 text-sm text-blue-200">
              <li>
                <Link to="/" className="hover:text-rose-400 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/fields" className="hover:text-rose-400 transition">
                  Hệ thống sân tập
                </Link>
              </li>
              <li>
                <Link
                  to="/products-services"
                  className="hover:text-rose-400 transition"
                >
                  Cửa hàng tiện ích
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-rose-400 transition">
                  Tin tức thể thao
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center text-sm text-blue-300 mt-8">
          Copyright © 2026 - 24h Sports. All rights reserved. Designed by You.
        </div>
      </footer>
    </div>
  );
}
