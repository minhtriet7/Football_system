import React, { useState, useEffect } from "react";
import { getAllFieldsAPI } from "../../services/fieldService";
import toast from "react-hot-toast";
import { Map, Plus, Edit, Trash2, Search } from "lucide-react";

export default function ManageFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const data = await getAllFieldsAPI();
        setFields(Array.isArray(data) ? data : []);
      } catch (error) {
        // Dữ liệu giả lập để test UI
        setFields([
          { _id: 'f1', name: 'Sân Cỏ Nhân Tạo Số 1', categoryName: 'Sân 5 người', pricePerHour: 150000, imageUrl: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=100' },
          { _id: 'f2', name: 'Sân Cỏ Nhân Tạo Số 2', categoryName: 'Sân 7 người', pricePerHour: 350000, imageUrl: 'https://images.unsplash.com/photo-1529900294039-ca8f43c40305?w=100' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950 flex items-center"><Map size={28} className="mr-3 text-rose-600"/> Quản lý Sân Bóng</h1>
          <p className="text-gray-500 mt-1 font-medium">Thêm, sửa, xóa các mặt sân trong hệ thống</p>
        </div>
        <button className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-600 transition shadow-lg flex items-center">
          <Plus size={20} className="mr-2"/> Thêm sân mới
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-gray-50 rounded-xl">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên Sân</th>
                <th className="px-6 py-4">Loại sân</th>
                <th className="px-6 py-4">Giá thuê/Giờ</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field._id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img src={Array.isArray(field.imageUrl) ? field.imageUrl[0] : field.imageUrl} alt={field.name} className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{field.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-600 bg-gray-50 rounded-lg">{field.category?.name || field.categoryName || "Sân bóng"}</td>
                  <td className="px-6 py-4 font-black text-rose-600">{formatPrice(field.pricePerHour)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Edit size={16} /></button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 size={16} /></button>
                    </div>
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