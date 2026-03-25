import React, { useState, useEffect } from "react";
import { getAllProductsAPI } from "../../services/productService";
import { getServicesAPI } from "../../services/serviceItemService";
import { ShoppingBag, Plus, Edit, Trash2 } from "lucide-react";

export default function ManageProducts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [products, services] = await Promise.all([getAllProductsAPI(), getServicesAPI()]);
        // Gộp chung 2 mảng lại và thêm tag để phân biệt
        const combined = [
          ...products.map(p => ({ ...p, type: 'Sản phẩm' })),
          ...services.map(s => ({ ...s, type: 'Dịch vụ' }))
        ];
        setItems(combined);
      } catch (error) {
        // Mock data
        setItems([
          { _id: 'p1', name: 'Nước khoáng Lavie', price: 10000, type: 'Sản phẩm' },
          { _id: 's1', name: 'Thuê trọng tài bắt chính', price: 200000, type: 'Dịch vụ' },
        ]);
      }
    };
    fetchItems();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950 flex items-center"><ShoppingBag size={28} className="mr-3 text-rose-600"/> Dịch vụ & Đồ uống</h1>
          <p className="text-gray-500 mt-1 font-medium">Quản lý kho nước uống, đồ ăn và các dịch vụ kèm theo</p>
        </div>
        <button className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-600 transition shadow-lg flex items-center">
          <Plus size={20} className="mr-2"/> Thêm món
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-gray-50 rounded-xl">
              <tr>
                <th className="px-6 py-4">Tên Sản phẩm / Dịch vụ</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4">Đơn giá</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === 'Dịch vụ' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-rose-600">{formatPrice(item.price)}</td>
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