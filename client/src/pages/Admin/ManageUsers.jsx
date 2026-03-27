import React, { useState, useEffect } from "react";
// Đảm bảo bạn có API này, nếu chưa thì UI sẽ dùng dữ liệu giả lập bên dưới
import  api  from "../../services/api"; 
import { Users, Shield, User } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users'); // Gọi API lấy list user
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        
        // Mock data
        setUsers([
          { _id: 'u1', name: 'Nguyễn Tấn Lộc', email: 'loc@gmail.com', phone: '0904438369', role: 'admin' },
          { _id: 'u2', name: 'Khách hàng A', email: 'khach@gmail.com', phone: '0988123456', role: 'user' },
        ]);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <h1 className="text-3xl font-black text-slate-950 flex items-center"><Users size={28} className="mr-3 text-rose-600"/> Quản lý Khách Hàng</h1>
        <p className="text-gray-500 mt-1 font-medium">Xem danh sách tài khoản đã đăng ký trên hệ thống</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-gray-50 rounded-xl">
              <tr>
                <th className="px-6 py-4">Họ và tên</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Phân quyền</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{user.phone || "Chưa cập nhật"}</td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' 
                      ? <span className="flex items-center w-fit px-3 py-1 bg-rose-50 text-rose-600 font-bold rounded-full text-xs"><Shield size={14} className="mr-1"/> Quản trị viên</span>
                      : <span className="flex items-center w-fit px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-full text-xs"><User size={14} className="mr-1"/> Khách hàng</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}