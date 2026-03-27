import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAdminStatsAPI,
  getAllBookingsAdminAPI,
} from "../../services/bookingService";
import toast from "react-hot-toast";
import {
  DollarSign,
  CalendarDays,
  MapPin,
  Users,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  // State lưu dữ liệu thống kê
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalFields: 0,
    totalUsers: 0,
    dailyRevenue: [0, 0, 0, 0, 0, 0, 0],
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API VÀ TÍNH TOÁN DỮ LIỆU THẬT
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Gọi API lấy thống kê cơ bản và TOÀN BỘ đơn hàng
        const [statsData, allBookingsData] = await Promise.all([
          getAdminStatsAPI().catch(() => ({})),
          getAllBookingsAdminAPI(),
        ]);

        const allBookings = Array.isArray(allBookingsData)
          ? allBookingsData
          : [];

        // ---------------------------------------------------------
        // 🚀 LOGIC 1: TÍNH DOANH THU THỰC TẾ (CHỈ LẤY ĐƠN "ĐÃ HOÀN THÀNH")
        // ---------------------------------------------------------
        // Đã sửa đổi theo yêu cầu: Chỉ cộng tiền khi đơn đã completed
        const completedBookings = allBookings.filter(
          (b) => b.status === "completed",
        );

        const realRevenue = completedBookings.reduce(
          (sum, booking) => sum + (booking.totalPrice || 0),
          0,
        );

        // ---------------------------------------------------------
        // 🚀 LOGIC 2: TỰ ĐỘNG VẼ BIỂU ĐỒ DOANH THU THEO THỨ (T2 -> CN)
        // ---------------------------------------------------------
        const calculatedDailyRevenue = [0, 0, 0, 0, 0, 0, 0];

        // Chỉ vẽ biểu đồ dựa trên các đơn đã completed
        completedBookings.forEach((booking) => {
          if (booking.startTime) {
            const date = new Date(booking.startTime);
            const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
            calculatedDailyRevenue[dayIndex] += booking.totalPrice || 0;
          }
        });

        // Đếm số lượng khách hàng duy nhất từ các đơn hàng
        const uniqueUsersCount = new Set(
          allBookings.filter((b) => b.user).map((b) => b.user._id),
        ).size;

        // Cập nhật State với dữ liệu đã tính toán
        setStats({
          totalRevenue: realRevenue,
          totalBookings: allBookings.length, // Đơn đặt sân vẫn đếm tất cả để biết lượng khách
          totalFields: statsData.totalFields || 10,
          totalUsers: statsData.totalUsers || uniqueUsersCount || 0,
          dailyRevenue: calculatedDailyRevenue,
        });

        // Lấy 5 đơn hàng mới nhất cho bảng bên dưới
        setRecentBookings(allBookings.slice(0, 5));
      } catch (error) {
        console.error("Lỗi Dashboard: ", error);
        toast.error("Không thể tải dữ liệu mới nhất!");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- CÁC HÀM FORMAT ---
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  const formatDateForTable = (isoString) =>
    isoString ? new Date(isoString).toLocaleDateString("vi-VN") : "--/--";
  const formatTimeForTable = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const getStatusBadge = (status) => {
    if (status === "cancelled")
      return (
        <span className="flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold w-fit">
          <XCircle size={12} className="mr-1" /> Đã hủy
        </span>
      );
    if (status === "confirmed")
      return (
        <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold w-fit">
          <CheckCircle size={12} className="mr-1" /> Đã xác nhận
        </span>
      );
    if (status === "completed")
      return (
        <span className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold w-fit">
          <CheckCircle size={12} className="mr-1" /> Đã hoàn thành
        </span>
      );
    return (
      <span className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold w-fit">
        <Clock size={12} className="mr-1" /> Chờ xác nhận
      </span>
    );
  };

  // component card thống kê
  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex items-start space-x-5 group hover:shadow-xl hover:translate-y-1 transition-all">
      <div className={`p-4 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="text-center py-20 font-bold animate-pulse text-gray-500">
        Đang tải dữ liệu tổng quan...
      </div>
    );

  return (
    <div className="space-y-10">
      {/* 1. HEADER CHÀO MỪNG */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Bảng điều khiển tổng quan
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Xin chào, Quản trị viên! Hôm nay kinh doanh thế nào?
          </p>
        </div>
        <Link
          to="/admin/bookings"
          className="flex items-center bg-rose-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-200"
        >
          Xử lý đơn đặt sân <ChevronRight size={20} className="ml-1.5" />
        </Link>
      </div>

      {/* 2. CÁC CARD THỐNG KÊ (4 con số vàng) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          icon={<DollarSign size={24} />}
          title="Tổng doanh thu"
          value={formatPrice(stats.totalRevenue)}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={<CalendarDays size={24} />}
          title="Tổng đơn sân"
          value={stats.totalBookings}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={<MapPin size={24} />}
          title="Hệ thống sân"
          value={stats.totalFields}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Khách hàng"
          value={stats.totalUsers}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      {/* 3. BIỂU ĐỒ DOANH THU 7 NGÀY GẦN NHẤT */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-950 flex items-center">
            <TrendingUp size={24} className="mr-2 text-rose-600" /> Biểu đồ
            doanh thu đã chốt tuần này
          </h2>
          <span className="text-sm font-bold text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
            Cập nhật theo thời gian thực
          </span>
        </div>

        {/* Biểu đồ cột đơn giản bằng CSS */}
        <div className="mt-4">
          <div className="flex items-end justify-between h-56 space-x-2 border-b-2 border-dashed border-gray-200 pb-1">
            {stats.dailyRevenue.map((value, index) => {
              const maxRevenue = Math.max(...stats.dailyRevenue, 1);
              const heightPercentage = (value / maxRevenue) * 100;

              return (
                <div
                  key={index}
                  className="w-full h-full flex flex-col justify-end items-center group relative"
                >
                  <div
                    className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity z-10 pointer-events-none whitespace-nowrap mb-2 shadow-lg"
                    style={{ bottom: `${heightPercentage}%` }}
                  >
                    {formatPrice(value)}
                  </div>
                  <div
                    className={`w-10 md:w-12 rounded-t-xl transition-all duration-700
                      ${value > 0 ? "bg-rose-500 group-hover:bg-rose-600 shadow-md shadow-rose-200" : "bg-gray-100"}`}
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: value === 0 ? "4px" : "15%",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 text-xs font-bold text-gray-500">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
              <div key={idx} className="w-full text-center">
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BẢNG 5 ĐƠN ĐẶT SÂN GẦN NHẤT */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-950">
            5 đơn đặt sân mới nhất
          </h2>
          <Link
            to="/admin/bookings"
            className="text-sm font-bold text-rose-600 hover:text-blue-900 transition flex items-center group"
          >
            Xem tất cả đơn hàng{" "}
            <ChevronRight
              size={16}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
            Hiện tại chưa có đơn đặt sân nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-gray-50 rounded-xl">
                <tr>
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Sân đá</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/admin/bookings`)}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">
                      #{booking._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {booking.user?.name || "Khách vãng lai"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {booking.field?.name || "Sân đã bị xóa"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {formatDateForTable(booking.startTime)}
                      <br />
                      <span className="text-xs font-medium text-gray-500">
                        {formatTimeForTable(booking.startTime)} -{" "}
                        {formatTimeForTable(booking.endTime)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-rose-600">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-blue-600 hover:text-rose-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg group w-fit">
                        Xử lý{" "}
                        <ChevronRight
                          size={14}
                          className="ml-1 group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
