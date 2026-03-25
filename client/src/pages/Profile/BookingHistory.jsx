import React, { useState, useEffect } from "react";
import {
  getMyBookingsAPI,
  addItemsToBookingAPI,
} from "../../services/bookingService";
import { getServicesAPI } from "../../services/serviceItemService";
import { getAllProductsAPI } from "../../services/productService";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal Mua thêm đồ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null); // Đơn đang được chọn để thêm đồ
  const [addonMenu, setAddonMenu] = useState([]); // Danh sách Menu (Nước + Dịch vụ)
  const [newSelectedItems, setNewSelectedItems] = useState([]); // Đồ khách chọn thêm trong modal
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. LOAD LỊCH SỬ VÀ MENU ĐỒ ĂN
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, servicesData, productsData] = await Promise.all([
        getMyBookingsAPI(),
        getServicesAPI(),
        getAllProductsAPI(),
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setAddonMenu([...servicesData, ...productsData]);
    } catch (error) {
      toast.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. MỞ / ĐÓNG MODAL
  const handleOpenModal = (booking) => {
    setCurrentBooking(booking);
    setNewSelectedItems([]); // Làm sạch giỏ đồ thêm mới
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBooking(null);
  };

  // 3. CHỌN SỐ LƯỢNG MÓN TRONG MODAL (Logic giống hệt trang Checkout)
  const handleItemChange = (item, action) => {
    const existing = newSelectedItems.find((s) => s.serviceItem === item._id);
    if (action === "add") {
      if (existing) {
        setNewSelectedItems(
          newSelectedItems.map((s) =>
            s.serviceItem === item._id ? { ...s, quantity: s.quantity + 1 } : s,
          ),
        );
      } else {
        setNewSelectedItems([
          ...newSelectedItems,
          {
            serviceItem: item._id,
            quantity: 1,
            price: item.price,
            name: item.name,
          },
        ]);
      }
    } else if (action === "remove" && existing) {
      if (existing.quantity === 1) {
        setNewSelectedItems(
          newSelectedItems.filter((s) => s.serviceItem !== item._id),
        );
      } else {
        setNewSelectedItems(
          newSelectedItems.map((s) =>
            s.serviceItem === item._id ? { ...s, quantity: s.quantity - 1 } : s,
          ),
        );
      }
    }
  };

  // 4. LƯU VÀ CẬP NHẬT LÊN SERVER
  const handleSaveAddons = async () => {
    if (newSelectedItems.length === 0) {
      return toast.error("Bạn chưa chọn thêm món nào!");
    }

    setIsUpdating(true);
    try {
      await addItemsToBookingAPI(currentBooking._id, newSelectedItems);
      toast.success("Đã cập nhật thêm đồ vào đơn hàng thành công!");
      handleCloseModal();
      fetchData(); // Tải lại danh sách lịch sử để cập nhật Tổng tiền mới
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật đơn hàng!");
    } finally {
      setIsUpdating(false);
    }
  };

  // Tính tiền các món CHUẨN BỊ thêm trong Modal
  const newItemsTotal = newSelectedItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );

  // --- CÁC HÀM FORMAT ---
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  const formatDate = (isoString) =>
    isoString ? new Date(isoString).toLocaleDateString("vi-VN") : "--/--/----";
  const formatTime = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const getStatusBadge = (status, isPaid) => {
    if (status === "cancelled")
      return (
        <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-bold">
          <XCircle size={14} className="mr-1" /> Đã hủy
        </span>
      );
    if (status === "confirmed" || isPaid)
      return (
        <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold">
          <CheckCircle size={14} className="mr-1" /> Đã xác nhận
        </span>
      );
    if (status === "completed")
      return (
        <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-bold">
          <CheckCircle size={14} className="mr-1" /> Đã hoàn thành
        </span>
      );
    return (
      <span className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-bold">
        <Clock size={14} className="mr-1" /> Chờ xác nhận
      </span>
    );
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
        Đang tải lịch sử...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 relative">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-blue-900">Lịch sử đặt sân</h1>
        <p className="text-gray-500 mt-2">
          Theo dõi các trận đấu sắp tới và mua thêm dịch vụ nếu cần
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700">
            Bạn chưa có lịch đặt sân nào
          </h3>
          <Link
            to="/"
            className="mt-6 inline-block bg-rose-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-700 transition"
          >
            Đặt sân ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Thông tin Giờ & Mã đơn */}
                <div className="bg-gray-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                  <span className="text-sm font-bold text-gray-500 mb-1 uppercase">
                    Mã: #{booking._id.slice(-6).toUpperCase()}
                  </span>
                  <div className="flex items-center text-rose-600 font-black text-xl mt-2 mb-1">
                    <Calendar className="mr-2" size={20} />{" "}
                    {formatDate(booking.startTime)}
                  </div>
                  <div className="flex items-center text-gray-700 font-bold text-lg">
                    <Clock className="mr-2 text-gray-400" size={20} />{" "}
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </div>
                </div>

                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 mb-1">
                        {booking.field?.name || "Sân đã bị xóa"}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin size={14} className="mr-1" /> Cần Thơ
                      </p>
                    </div>
                    {getStatusBadge(booking.status, booking.isPaid)}
                  </div>

                  <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-4 mt-4">
                    <div className="flex-grow">
                      <span className="text-xs text-gray-500 block mb-1">
                        Thanh toán:{" "}
                        <strong className="text-gray-700">
                          {booking.paymentMethod || "Không rõ"}
                        </strong>
                      </span>
                      {booking.services && booking.services.length > 0 && (
                        <details className="mt-1 group cursor-pointer w-fit">
                          <summary className="text-sm text-rose-600 font-medium list-none flex items-center outline-none">
                            + {booking.services.length} món đi kèm{" "}
                            <span className="ml-1 text-xs group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <div className="mt-2 pl-3 border-l-2 border-rose-200 space-y-1 absolute bg-white p-3 shadow-lg rounded-lg border z-10 w-64">
                            {booking.services.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-xs text-gray-600 w-full"
                              >
                                <span className="truncate pr-2">
                                  {item.name} (x{item.quantity})
                                </span>
                                <span className="font-semibold text-gray-900 shrink-0">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}

                      {/* NÚT MUA THÊM ĐỒ - CHỈ HIỆN KHI ĐƠN HỢP LỆ */}
                      {["pending", "confirmed"].includes(booking.status) && (
                        <button
                          onClick={() => handleOpenModal(booking)}
                          className="mt-3 flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                        >
                          <ShoppingCart size={16} className="mr-1.5" /> Thêm
                          Nước & Dịch vụ
                        </button>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-gray-500 block mb-1">
                        Tổng tiền hóa đơn
                      </span>
                      <span className="text-2xl font-black text-gray-900">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POPUP MODAL MUA THÊM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-blue-900 p-5 flex justify-between items-center text-white">
              <h3 className="font-black text-lg flex items-center">
                <ShoppingCart className="mr-2" /> Mua thêm đồ
              </h3>
              <button
                onClick={handleCloseModal}
                className="hover:bg-blue-800 p-1.5 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Danh sách món) */}
            <div className="p-6 overflow-y-auto bg-gray-50 flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                Áp dụng cho đơn:{" "}
                <strong className="text-blue-900">
                  #{currentBooking?._id.slice(-6).toUpperCase()}
                </strong>
              </p>

              <div className="space-y-3">
                {addonMenu.map((item) => {
                  const selected = newSelectedItems.find(
                    (s) => s.serviceItem === item._id,
                  );
                  return (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition"
                    >
                      <div className="w-1/2">
                        <p
                          className="font-bold text-gray-800 text-sm truncate"
                          title={item.name}
                        >
                          {item.name}
                        </p>
                        <p className="text-rose-600 font-semibold text-xs mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => handleItemChange(item, "remove")}
                          className="p-1.5 hover:bg-white rounded shadow-sm text-gray-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-black w-5 text-center text-sm">
                          {selected ? selected.quantity : 0}
                        </span>
                        <button
                          onClick={() => handleItemChange(item, "add")}
                          className="p-1.5 hover:bg-white rounded shadow-sm text-rose-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">
                  Tạm tính (Món thêm):
                </span>
                <span className="text-xl font-black text-rose-600">
                  +{formatPrice(newItemsTotal)}
                </span>
              </div>
              <button
                onClick={handleSaveAddons}
                disabled={isUpdating}
                className={`w-full font-black text-white py-3.5 rounded-xl transition ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"}`}
              >
                {isUpdating ? "Đang xử lý..." : "Cập nhật vào Hóa đơn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
