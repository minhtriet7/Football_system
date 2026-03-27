import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { User, Phone, Lock, Save, Shield } from "lucide-react";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  // Lấy data từ LocalStorage khi load trang
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      setUserInfo(data);
      setFormData({
        ...formData,
        name: data.name || "",
        phone: data.phone || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Ở ĐÂY BẠN SẼ GỌI API CẬP NHẬT USER (updateProfileAPI)
    // Ví dụ: await updateProfileAPI(formData);

    setTimeout(() => {
      // Giả lập lưu thành công cập nhật lại LocalStorage
      const updatedUser = {
        ...userInfo,
        name: formData.name,
        phone: formData.phone,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUserInfo(updatedUser);

      toast.success("Cập nhật thông tin thành công!");
      setIsSaving(false);
      setFormData({ ...formData, currentPassword: "", newPassword: "" }); // Xóa trắng ô pass
    }, 1000);
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-black text-blue-900">Cài đặt tài khoản</h1>
        <p className="text-gray-500 mt-2">
          Quản lý thông tin cá nhân và bảo mật của bạn
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-700 relative">
          <div className="absolute -bottom-12 left-8 border-4 border-white bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-lg text-4xl font-black text-rose-600">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="pt-16 pb-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Cột 1: Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center mb-4">
                <User size={18} className="mr-2 text-blue-600" /> Thông tin cơ
                bản
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition cursor-not-allowed text-gray-500"
                  readOnly // Thường sđt dùng để login nên không cho sửa, nếu muốn sửa thì bỏ readOnly
                  title="Không thể thay đổi số điện thoại đăng nhập"
                />
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  <Shield size={14} className="mr-1" /> Vai trò:{" "}
                  {userInfo.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                </span>
              </div>
            </div>

            {/* Cột 2: Đổi mật khẩu */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center mb-4">
                <Lock size={18} className="mr-2 text-rose-600" /> Đổi mật khẩu
                (Tùy chọn)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Nhập nếu muốn đổi MK"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Mật khẩu mới"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center font-bold px-8 py-3 rounded-xl transition-all shadow-md ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-900 hover:bg-rose-600 text-white hover:shadow-lg"
              }`}
            >
              <Save size={18} className="mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
