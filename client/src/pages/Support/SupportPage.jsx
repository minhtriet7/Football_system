// src/pages/Support/SupportPage.jsx
import React from 'react';
import { HelpCircle, PhoneCall, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-[#003b73] py-16 text-center px-4">
        <h1 className="text-4xl font-black text-white mb-4">Trung tâm hỗ trợ</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Giải đáp thắc mắc, hướng dẫn đặt sân và hỗ trợ xử lý các vấn đề phát sinh nhanh chóng.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT TRÁI: Liên hệ trực tiếp */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-xl text-blue-900 mb-6 border-b pb-3">Liên hệ trực tiếp</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4 text-blue-600"><PhoneCall size={20}/></div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Hotline đặt sân (24/7)</p>
                  <p className="text-lg font-black text-gray-900">0904 438 369</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-rose-50 p-3 rounded-full mr-4 text-rose-600"><Mail size={20}/></div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Email hỗ trợ</p>
                  <p className="text-base font-bold text-gray-900">hotro@24hsports.vn</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition">
              Chat với Nhân viên ngay
            </button>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-amber-900">
            <h3 className="font-bold text-lg mb-2 flex items-center"><AlertTriangle size={20} className="mr-2"/> Nội quy sân bóng</h3>
            <ul className="text-sm space-y-2 mt-4">
              <li className="flex items-start"><span className="mr-2">•</span> Không mang giày đinh sắt (đinh SG) vào sân cỏ nhân tạo.</li>
              <li className="flex items-start"><span className="mr-2">•</span> Không hút thuốc lá trực tiếp trên mặt cỏ.</li>
              <li className="flex items-start"><span className="mr-2">•</span> Vui lòng đến sớm 10 phút để nhận sân.</li>
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: Câu hỏi thường gặp (FAQ) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-black text-2xl text-blue-900 mb-8 flex items-center">
              <HelpCircle className="mr-3 text-rose-600" size={28}/> Câu hỏi thường gặp (FAQ)
            </h2>

            <div className="space-y-6">
              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                  <CheckCircle2 size={18} className="text-green-500 mr-2"/> Tôi có thể hủy sân và nhận lại tiền cọc không?
                </h4>
                <p className="text-gray-600 leading-relaxed pl-7">
                  Hệ thống cho phép bạn hủy sân miễn phí **trước 24 tiếng** so với giờ lăn bóng. Tiền cọc sẽ được hoàn tự động hoặc lưu vào ví để dùng cho lần sau. Hủy sát giờ sẽ mất cọc.
                </p>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                  <CheckCircle2 size={18} className="text-green-500 mr-2"/> Trời mưa lớn thì xử lý như thế nào?
                </h4>
                <p className="text-gray-600 leading-relaxed pl-7">
                  Mặt sân của chúng tôi có hệ thống thoát nước chuẩn. Nếu mưa nhỏ, trận đấu vẫn diễn ra bình thường. Nếu mưa bão hoặc ngập, quản lý sân sẽ chủ động gọi điện để hỗ trợ bạn dời lịch đá sang ngày khác mà không mất phí.
                </p>
              </div>

              <div className="pb-6 border-b border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                  <CheckCircle2 size={18} className="text-green-500 mr-2"/> Tôi muốn thuê áo Bib và đặt nước thì làm sao?
                </h4>
                <p className="text-gray-600 leading-relaxed pl-7">
                  Ở bước **Thanh toán**, hệ thống sẽ có mục "Thêm nước uống & Dịch vụ". Bạn chỉ cần bấm dấu cộng (+) để thêm áo Bib, bò húc, nước suối vào hóa đơn. Nhân viên sẽ chuẩn bị sẵn tại sân cho bạn.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}