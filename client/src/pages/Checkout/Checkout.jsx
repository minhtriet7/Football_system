import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getFieldByIdAPI } from "../../services/fieldService";
import { getAllProductsAPI } from "../../services/productService"; // <-- Thêm Import Product
import { getServicesAPI } from "../../services/serviceItemService";

import { createBookingAPI } from "../../services/bookingService";
import { createVnpayUrlAPI } from "../../services/paymentService";
import toast from "react-hot-toast";
import {
  CheckCircle,
  CreditCard,
  Plus,
  Minus,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShoppingBag,
} from "lucide-react";

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingDate, startTime, endTime } = location.state || {};

  // Lấy thông tin user từ LocalStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [field, setField] = useState(null);
  const [addonItems, setAddonItems] = useState([]); // <-- Gộp chung Nước uống & Dịch vụ
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. CHÈN DÒNG NÀY VÀO ĐÂY ĐỂ LÀM SẠCH GIỎ HÀNG MỖI LẦN VÀO TRANG MỚI
    setSelectedServices([]);

    if (!bookingDate) {
      toast.error("Vui lòng chọn giờ đá trước!");
      navigate(`/field/${id}`);
      return;
    }

    const fetchData = async () => {
      try {
        const fieldData = await getFieldByIdAPI(id);
        const [servicesData, productsData] = await Promise.all([
          getServicesAPI(),
          getAllProductsAPI()
        ]);
        
        setField(fieldData);
        setAddonItems([...servicesData, ...productsData]);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu thanh toán!");
      }
    };
    fetchData();
  }, [id, bookingDate, navigate]);

  const handleServiceChange = (service, action) => {
    const existing = selectedServices.find(
      (s) => s.serviceItem === service._id,
    );
    if (action === "add") {
      if (existing) {
        setSelectedServices(
          selectedServices.map((s) =>
            s.serviceItem === service._id
              ? { ...s, quantity: s.quantity + 1 }
              : s,
          ),
        );
      } else {
        setSelectedServices([
          ...selectedServices,
          {
            serviceItem: service._id,
            quantity: 1,
            price: service.price,
            name: service.name,
          },
        ]);
      }
    } else if (action === "remove" && existing) {
      if (existing.quantity === 1) {
        setSelectedServices(
          selectedServices.filter((s) => s.serviceItem !== service._id),
        );
      } else {
        setSelectedServices(
          selectedServices.map((s) =>
            s.serviceItem === service._id
              ? { ...s, quantity: s.quantity - 1 }
              : s,
          ),
        );
      }
    }
  };

  const calculateFieldCost = () => {
    if (!field) return 0;
    const start = new Date(`${bookingDate}T${startTime}`);
    const end = new Date(`${bookingDate}T${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return Math.max(hours * field.pricePerHour, 0);
  };

  const calculateServicesCost = () => {
    return selectedServices.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );
  };

  const fieldCost = calculateFieldCost();
  const servicesCost = calculateServicesCost();
  const totalPrice = fieldCost + servicesCost;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const startDateTime = new Date(
        `${bookingDate}T${startTime}`,
      ).toISOString();
      const endDateTime = new Date(`${bookingDate}T${endTime}`).toISOString();

      const bookingData = {
        fieldId: id,
        startTime: startDateTime,
        endTime: endDateTime,
        services: selectedServices,
        paymentMethod,
      };

      const res = await createBookingAPI(bookingData);

      if (paymentMethod === "VNPAY") {
        toast.success("Đang tạo link thanh toán VNPAY...");
        const vnpayRes = await createVnpayUrlAPI(
          res.bookingId || res.booking._id,
        );
        window.location.href = vnpayRes.paymentUrl;
      } else {
        toast.success("Đặt sân thành công! Vui lòng đến đúng giờ.");
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt sân!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!field)
    return (
      <div className="text-center py-20 text-gray-500">
        Đang chuẩn bị hóa đơn...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-blue-900">Hoàn tất đặt sân</h1>
        <p className="text-gray-500 mt-2">
          Vui lòng kiểm tra kỹ thông tin trước khi thanh toán
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center border-b pb-3">
              <User className="mr-2 text-rose-600" size={20} /> Thông tin khách
              hàng
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">
                  Họ và tên
                </label>
                <p className="font-medium text-gray-900 mt-1">
                  {userInfo.name || "Khách vãng lai"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold">
                  Số điện thoại
                </label>
                <p className="font-medium text-gray-900 mt-1">
                  {userInfo.phone || "Chưa cập nhật"}
                </p>
              </div>
            </div>
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mt-4 italic">
              * Hệ thống sẽ gửi mã xác nhận và thông tin sân qua số điện thoại
              này.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center border-b pb-3">
              <ShoppingBag className="mr-2 text-rose-600" size={20} /> Thêm nước
              uống & Dịch vụ
            </h2>
            {addonItems.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                Đang tải danh sách...
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {addonItems.map((item) => {
                  const selected = selectedServices.find(
                    (s) => s.serviceItem === item._id,
                  );
                  return (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-rose-600 font-medium text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button
                          onClick={() => handleServiceChange(item, "remove")}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-6 text-center text-sm">
                          {selected ? selected.quantity : 0}
                        </span>
                        <button
                          onClick={() => handleServiceChange(item, "add")}
                          className="p-1 hover:bg-rose-50 rounded text-rose-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-3">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "VNPAY" ? "border-rose-500 bg-rose-50 ring-1 ring-rose-500" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="VNPAY"
                  checked={paymentMethod === "VNPAY"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <CreditCard
                  className={`mr-4 ${paymentMethod === "VNPAY" ? "text-rose-600" : "text-gray-400"}`}
                />
                <div>
                  <span className="font-bold text-gray-800 block">
                    Thanh toán VNPAY (Khuyên dùng)
                  </span>
                  <span className="text-xs text-gray-500">
                    Giữ sân 100%, hỗ trợ quét mã QR, thẻ ATM, Visa.
                  </span>
                </div>
              </label>
              <label
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "COD" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <CheckCircle
                  className={`mr-4 ${paymentMethod === "COD" ? "text-blue-600" : "text-gray-400"}`}
                />
                <div>
                  <span className="font-bold text-gray-800 block">
                    Thanh toán tại sân (Tiền mặt)
                  </span>
                  <span className="text-xs text-rose-500">
                    Sân có thể bị hủy nếu có khách khác chuyển khoản trước.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-black text-blue-900 mb-6 border-b pb-4">
              Chi tiết hóa đơn
            </h2>
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 flex items-center text-sm">
                  <MapPin size={16} className="mr-1" /> Sân:
                </span>
                <span className="font-bold text-gray-800 text-right max-w-[60%]">
                  {field.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center text-sm">
                  <Calendar size={16} className="mr-1" /> Ngày đá:
                </span>
                <span className="font-bold text-gray-800">{bookingDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center text-sm">
                  <Clock size={16} className="mr-1" /> Thời gian:
                </span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                  {startTime} - {endTime}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Tiền thuê sân</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(fieldCost)}
                </span>
              </div>
              {selectedServices.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-500 ml-4">
                    - {item.name} (x{item.quantity})
                  </span>
                  <span className="font-medium text-gray-700">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 mt-2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-600 font-medium">Tổng tiền</span>
                <span className="text-2xl font-black text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between items-end mt-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-rose-800 font-bold">
                  Cần thanh toán ngay
                </span>
                <span className="text-2xl font-black text-rose-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                {paymentMethod === "VNPAY"
                  ? "Thanh toán 100% để đảm bảo giữ sân."
                  : "Vui lòng thanh toán toàn bộ tại quầy."}
              </p>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className={`w-full text-white font-black text-lg py-4 rounded-xl mt-6 transition shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:-translate-y-0.5"}`}
            >
              {loading
                ? "Đang xử lý..."
                : paymentMethod === "VNPAY"
                  ? "Thanh toán VNPAY ngay"
                  : "Xác nhận đặt sân"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
