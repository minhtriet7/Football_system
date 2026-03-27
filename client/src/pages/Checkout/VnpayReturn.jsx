import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
// Đã gỡ bỏ axiosClient gọi API tạo đơn ở đây vì IPN Backend đã lo việc đó

export default function VnpayReturn() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    // VNPAY trả về rất nhiều tham số trên URL, ta chỉ quan tâm mã phản hồi
    const responseCode = searchParams.get("vnp_ResponseCode");

    // Thêm delay nhỏ để giao diện loading trông mượt mà hơn
    const timer = setTimeout(() => {
      if (responseCode === "00") {
        setStatus("success");
        // Ghi chú: Việc cập nhật DB thành "Đã thanh toán" đã được VNPAY báo ngầm
        // cho Backend thông qua IPN URL rồi. Ở đây ta chỉ hiện thông báo.
      } else {
        setStatus("failed");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              Đang xác nhận kết quả...
            </h2>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <CheckCircle className="w-24 h-24 text-emerald-500 mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Đặt sân thành công!
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Tiền sân đã được thanh toán. Chúc bạn có một trận đấu tuyệt vời!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link
                to="/my-bookings"
                className="flex-1 bg-emerald-50 text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Xem lịch đặt
              </Link>
              <Link
                to="/"
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2"
              >
                Về trang chủ <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center animate-fade-in-up">
            <XCircle className="w-24 h-24 text-red-500 mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Giao dịch thất bại!
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Bạn đã hủy giao dịch hoặc thẻ không đủ tiền. Vui lòng đặt lại sân.
            </p>
            <Link
              to="/fields"
              className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 shadow-md transition-colors"
            >
              Chọn lại giờ đá
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
