import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFieldByIdAPI } from "../../services/fieldService";
import { checkAvailabilityAPI } from "../../services/bookingService";
import toast from "react-hot-toast";
import { MapPin, Calendar, Clock, AlertCircle } from "lucide-react";

export default function FieldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [field, setField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [bookedSlots, setBookedSlots] = useState([]);

  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:30");

  useEffect(() => {
    const fetchField = async () => {
      try {
        const data = await getFieldByIdAPI(id);
        setField(data);
      } catch (error) {
        toast.error("Lỗi tải dữ liệu sân!");
      }
    };
    fetchField();
  }, [id]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await checkAvailabilityAPI(id, selectedDate);
        setBookedSlots(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy giờ bận", error);
      }
    };
    if (selectedDate) fetchAvailability();
  }, [id, selectedDate]);

  // 1. TẠO DANH SÁCH CÁC MỐC GIỜ DẠNG DROPDOWN
  const generateTimeOptions = () => {
    const times = [];
    for (let h = 5; h <= 23; h++) {
      const hour = h.toString().padStart(2, "0");
      times.push(`${hour}:00`);
      if (h !== 23) times.push(`${hour}:30`);
    }
    return times;
  };
  const timeOptions = generateTimeOptions();

  // 2. HÀM KIỂM TRA MỘT MỐC GIỜ ĐÃ CÓ AI ĐẶT CHƯA
  const isTimeDisabled = (timeStr) => {
    const timeObj = new Date(`${selectedDate}T${timeStr}`).getTime();
    return bookedSlots.some((booking) => {
      const bStart = new Date(booking.startTime).getTime();
      const bEnd = new Date(booking.endTime).getTime();
      // Khóa nếu giờ này nằm gọn trong khoảng đã có người thuê
      return timeObj >= bStart && timeObj < bEnd;
    });
  };

  // 3. HÀM BẮT LỖI KHI BẤM NÚT THANH TOÁN
  const checkTimeConflict = () => {
    if (!startTime || !endTime) return "Vui lòng chọn giờ!";

    const startObj = new Date(`${selectedDate}T${startTime}`);
    const endObj = new Date(`${selectedDate}T${endTime}`);

    if (startObj >= endObj) return "Giờ kết thúc phải lớn hơn giờ bắt đầu!";

    const diffInMinutes = (endObj - startObj) / (1000 * 60);
    if (diffInMinutes < 60) return "Thời gian thuê tối thiểu là 1 tiếng!";

    // Quét check đụng giờ thực tế
    const isConflict = bookedSlots.some((booking) => {
      const bStart = new Date(booking.startTime);
      const bEnd = new Date(booking.endTime);
      return startObj < bEnd && endObj > bStart;
    });

    if (isConflict) return "Khoảng thời gian này đã bị vướng lịch khách khác!";
    return null;
  };

  const conflictError = checkTimeConflict();

  const handleBooking = () => {
    if (conflictError) {
      toast.error(conflictError, { icon: "❌" });
      return;
    }
    navigate(`/checkout/${id}`, {
      state: { bookingDate: selectedDate, startTime, endTime },
    });
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (urlData) => {
    if (Array.isArray(urlData) && urlData.length > 0) return urlData[0];
    return (
      urlData || "https://images.unsplash.com/photo-1589487391730-58f20eb2c308"
    );
  };

  if (!field)
    return (
      <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* CỘT TRÁI */}
        <div>
          <img
            src={getImageUrl(field.imageUrl)}
            alt={field.name}
            className="w-full rounded-2xl shadow-lg object-cover h-[400px]"
          />
          <h1 className="text-3xl font-black text-blue-900 mt-6">
            {field.name}
          </h1>
          <p className="text-gray-500 font-semibold flex items-center mt-2">
            <MapPin size={18} className="mr-1 text-rose-600" /> Nội ô TP Cần Thơ
          </p>
          <div className="mt-4 bg-blue-50 text-blue-800 font-bold px-4 py-2 rounded-lg inline-block">
            Giá thuê:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(field.pricePerHour)}{" "}
            / giờ
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">
            {field.description}
          </p>
        </div>

        {/* CỘT PHẢI */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-4">
            Đặt lịch ngay
          </h3>

          <div className="mb-6">
            <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
              <Calendar size={16} className="mr-2 text-rose-600" /> Ngày đá
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 font-bold text-gray-700 outline-none"
            />
          </div>

          {/* ĐÂY LÀ ĐIỂM KHÁC BIỆT: DÙNG THẺ SELECT DROPDOWN XỔ XUỐNG */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                <Clock size={16} className="mr-2 text-rose-600" /> Giờ bắt đầu
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 font-bold text-gray-700 outline-none cursor-pointer"
              >
                {timeOptions.map((time) => {
                  const disabled = isTimeDisabled(time);
                  return (
                    <option
                      key={`start-${time}`}
                      value={time}
                      disabled={disabled}
                      className={
                        disabled ? "text-gray-300 font-normal bg-gray-100" : ""
                      }
                    >
                      {time} {disabled ? "(Đã đặt)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                <Clock size={16} className="mr-2 text-rose-600" /> Giờ kết thúc
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 font-bold text-gray-700 outline-none cursor-pointer"
              >
                {timeOptions.map((time) => {
                  return (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* HIỆN LỊCH ĐÃ ĐẶT */}
          <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-200 shadow-inner">
            <h4 className="text-sm font-black text-blue-900 mb-3 flex items-center">
              <AlertCircle size={18} className="mr-2 text-rose-600" /> Các khung
              giờ đã có khách đặt:
            </h4>
            {bookedSlots.length === 0 ? (
              <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                Hôm nay sân trống cả ngày. Thoải mái đặt!
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookedSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="bg-rose-100 text-rose-700 text-sm font-bold px-3 py-1.5 rounded-lg border border-rose-200 shadow-sm"
                  >
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* NÚT THANH TOÁN */}
          {conflictError ? (
            <button
              disabled
              className="w-full bg-rose-50 text-rose-600 font-bold text-lg py-4 rounded-xl cursor-not-allowed border-2 border-rose-200 flex justify-center items-center flex-col shadow-sm"
            >
              <span className="flex items-center">
                <AlertCircle size={20} className="mr-2" /> LỖI CHỌN GIỜ
              </span>
              <span className="text-xs font-medium mt-1">{conflictError}</span>
            </button>
          ) : (
            <button
              onClick={handleBooking}
              className="w-full bg-rose-600 text-white font-black text-lg py-4 rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-500/40"
            >
              Tiếp tục thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
