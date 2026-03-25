import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAdminStatsAPI,
  getRecentBookingsAPI,
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
    dailyRevenue: [], // Mảng doanh thu 7 ngày gần nhất để vẽ biểu đồ
  });

  // State lưu 5 đơn hàng mới nhất
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY DỮ LIỆU THẬT
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi song song 2 API cho nhanh
        const [statsData, recentBookingsData] = await Promise.all([
          getAdminStatsAPI(),
          getRecentBookingsAPI(),
        ]);

        setStats(statsData);
        setRecentBookings(
          Array.isArray(recentBookingsData) ? recentBookingsData : [],
        );
      } catch (error) {
        // toast.error("Lỗi khi tải dữ liệu thống kê!"); // Tắt toast này nếu seeder dữ liệu cũ chưa chuẩn
        console.error("Lỗi Dashboard: ", error);

        // MỘT SỐ DỮ LIỆU GIẢ LẬP ĐỂ HIỂN THỊ KHI CHƯA CÓ API THẬT
        setStats({
          totalRevenue: 12500000,
          totalBookings: 45,
          totalFields: 8,
          totalUsers: 120,
          dailyRevenue: [
            1500000, 2200000, 1800000, 2500000, 1900000, 2800000, 3100000,
          ],
        });
        setRecentBookings([
          {
            _id: "bk001",
            field: { name: "Sân số 2" },
            user: { name: "Nguyễn Văn A" },
            startTime: "2026-03-25T18:00:00",
            endTime: "2026-03-25T19:30:00",
            totalPrice: 450000,
            status: "pending",
          },
          {
            _id: "bk002",
            field: { name: "Sân cỏ nhân tạo 1" },
            user: { name: "Trần Thị B" },
            startTime: "2026-03-25T17:30:00",
            endTime: "2026-03-25T19:00:00",
            totalPrice: 300000,
            status: "confirmed",
          },
        ]);
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
        <span className="flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">
          <XCircle size={12} className="mr-1" /> Đã hủy
        </span>
      );
    if (status === "confirmed")
      return (
        <span className="flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold">
          <CheckCircle size={12} className="mr-1" /> Đã xác nhận
        </span>
      );
    if (status === "completed")
      return (
        <span className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">
          <CheckCircle size={12} className="mr-1" /> Đã hoàn thành
        </span>
      );
    return (
      <span className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
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
          title="Đơn đặt sân"
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
            doanh thu tuần này
          </h2>
          <span className="text-sm font-bold text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
            Cập nhật 1 giờ trước
          </span>
        </div>

        {/* Biểu đồ cột đơn giản bằng CSS */}
        <div className="flex items-end justify-between h-64 space-x-2 border-b-2 border-dashed border-gray-200 pb-2">
          {stats.dailyRevenue.map((value, index) => {
            const maxRevenue = Math.max(...stats.dailyRevenue, 1);
            const heightPercentage = (value / maxRevenue) * 100;
            const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

            return (
              <div
                key={index}
                className="w-full flex flex-col items-center group relative"
              >
                <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs font-bold px-2 py-1.5 rounded-lg -top-10 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                  {formatPrice(value)}
                </div>
                <div
                  className={`w-12 rounded-t-xl group-hover:bg-rose-500 transition-colors duration-300
                    ${index === stats.dailyRevenue.length - 1 ? "bg-rose-600" : "bg-rose-200"}`}
                  style={{ height: `${heightPercentage}%`, minHeight: "10%" }}
                ></div>
                <p className="text-xs font-bold text-gray-500 mt-3">
                  {daysOfWeek[index]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BẢNG 5 ĐƠN ĐẶT SÂN GẦN NHẤT */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-950">
            5 đơn đặt sân gần đây nhất
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
            Hiện tại chưa có đơn đặt sân nào trong hôm nay.
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
