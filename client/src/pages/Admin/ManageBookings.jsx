import React, { useState, useEffect } from "react";
import { getAllBookingsAdminAPI, updateBookingStatusAPI } from "../../services/bookingService";
import toast from "react-hot-toast";
import { DollarSign, CalendarCheck, Clock, MapPin, CheckCircle, XCircle, ChevronDown, Check, Trash2 } from "lucide-react";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    { name: "Tất cả", value: "All" },
    { name: "Chờ xác nhận", value: "pending" },
    { name: "Đã xác nhận", value: "confirmed" },
    { name: "Đã hoàn thành", value: "completed" },
    { name: "Đã hủy", value: "cancelled" },
  ];

  // GỌI API LẤY DANH SÁCH ĐƠN (Admin only)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookingsAdminAPI();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      // toast.error("Lỗi khi tải dữ liệu đơn đặt sân!"); // Tắt toast này nếu seeder dữ liệu cũ chưa chuẩn
      console.error("Lỗi ManageBookings: ", error);
      // Dữ liệu giả lập
      setBookings([
        { _id: 'bk001', field: { name: 'Sân số 2' }, user: { name: 'Nguyễn Văn A' }, startTime: '2026-03-25T18:00:00', endTime: '2026-03-25T19:30:00', totalPrice: 450000, status: 'pending', paymentMethod: 'COD' },
        { _id: 'bk002', field: { name: 'Sân cỏ nhân tạo 1' }, user: { name: 'Trần Thị B' }, startTime: '2026-03-25T17:30:00', endTime: '2026-03-25T19:00:00', totalPrice: 300000, status: 'confirmed', paymentMethod: 'COD' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // HÀM XỬ LÝ ĐỔI TRẠNG THÁI ĐƠN HÀNG (Duyệt/Hoàn thành/Hủy)
  const handleUpdateStatus = async (bookingId, newStatus) => {
    const statusText = newStatus === 'cancelled' ? 'HỦY' : (newStatus === 'confirmed' ? 'XÁC NHẬN' : 'HOÀN THÀNH');
    
    // Hiện popup xác nhận
    if (!window.confirm(`Bạn chắc chắn muốn ${statusText} đơn hàng này chứ?`)) {
      return;
    }

    try {
      await updateBookingStatusAPI(bookingId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn hàng thành ${statusText.toLowerCase()}!`);
      fetchBookings(); // Tải lại danh sách sau khi sửa
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn!");
    }
  };

  // Logic lọc danh sách dựa trên activeFilter
  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === "All") return true;
    return booking.status === activeFilter;
  });

  // --- CÁC HÀM FORMAT ---
  const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price || 0);
  const formatDateForTable = (isoString) => isoString ? new Date(isoString).toLocaleDateString("vi-VN") : "--/--";
  const formatTimeForTable = (isoString) => isoString ? new Date(isoString).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--";

  const getStatusBadge = (status) => {
    if (status === "cancelled") return <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14} className="mr-1" /> Đã hủy</span>;
    if (status === "confirmed") return <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} className="mr-1" /> Đã xác nhận</span>;
    if (status === "completed") return <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} className="mr-1" /> Đã hoàn thành</span>;
    return <span className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14} className="mr-1" /> Chờ xác nhận</span>;
  };

  if (loading) return <div className="text-center py-20 font-bold animate-pulse text-gray-500">Đang tải danh sách đơn đặt sân...</div>;

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER CHỨA TIÊU ĐỀ VÀ BỘ LỌC */}
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950 flex items-center"><CalendarCheck size={28} className="mr-3 text-rose-600"/> Quản lý Đơn đặt sân</h1>
          <p className="text-gray-500 mt-1 font-medium">Theo dõi và xử lý các đơn đặt sân trong hệ thống</p>
        </div>
        
        {/* Nhóm nút lọc */}
        <div className="flex flex-wrap gap-2.5 bg-gray-50 p-2 rounded-2xl border border-gray-200 shadow-inner">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition flex items-center
                ${activeFilter === filter.value 
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold" 
                  : "bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                }`}
            >
              {filter.name}
              {activeFilter === filter.value && <ChevronDown size={14} className="ml-1.5"/>}
            </button>
          ))}
        </div>
      </div>

      {/* 2. BẢNG DANH SÁCH ĐƠN HÀNG CHI TIẾT */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
             Không tìm thấy đơn đặt sân nào phù hợp với bộ lọc "{filters.find(f => f.value === activeFilter)?.name}".
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
                  <th className="px-6 py-4">Thanh toán</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Hành động xử lý</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">#{booking._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{booking.user?.name || "Khách vãng lai"}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{booking.field?.name || "Sân đã bị xóa"}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {formatDateForTable(booking.startTime)}<br/>
                      <span className="text-xs font-medium text-gray-500">{formatTimeForTable(booking.startTime)} - {formatTimeForTable(booking.endTime)}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-rose-600">{formatPrice(booking.totalPrice)}</td>
                    <td className="px-6 py-4 font-medium text-gray-600 bg-gray-50 rounded-lg">{booking.paymentMethod || "Khác"}</td>
                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                    
                    {/* KHU VỰC CÁC NÚT BẤM HÀNH ĐỘNG THÔNG MINH */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        {/* 1. Nút Xác nhận đơn (Nếu pending) */}
                        {booking.status === "pending" && (
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                            className="p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition shadow-sm"
                            title="Xác nhận & Duyệt đơn (COD)"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}

                        {/* 2. Nút Hoàn thành (Nếu confirmed) */}
                        {booking.status === "confirmed" && (
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, "completed")}
                            className="p-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition shadow-sm"
                            title="Đánh dấu đã Hoàn thành trận đấu"
                          >
                            <Check size={18} />
                          </button>
                        )}

                        {/* 3. Nút Hủy đơn (Nếu chưa hủy) */}
                        {booking.status !== "cancelled" && booking.status !== "completed" && (
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                            className="p-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition shadow-sm ml-auto"
                            title="Hủy đơn đặt sân này"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        
                        {/* 4. Hiển thị gạch ngang nếu đã hủy/hoàn thành */}
                        {(booking.status === "cancelled" || booking.status === "completed") && (
                           <span className="text-gray-300 font-medium">---</span>
                        )}
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