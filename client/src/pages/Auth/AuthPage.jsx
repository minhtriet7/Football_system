import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginAPI, registerAPI } from '../../services/authService';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await loginAPI(formData.phone, formData.password);
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success(`Chào mừng ${data.name} trở lại!`);
        navigate('/'); // Chuyển về trang chủ
      } else {
        const data = await registerAPI(formData.name, formData.phone, formData.password);
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('Đăng ký tài khoản thành công!');
        navigate('/');
      }
    } catch (error) {
      // Hiển thị lỗi từ backend trả về (ví dụ: Sai mật khẩu, SĐT đã tồn tại)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">24h Sports</h1>
        <p className="text-gray-500 text-center mb-8">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Nhập họ và tên" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="09xx xxx xxx" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold hover:underline">
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  );
}