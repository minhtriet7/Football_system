import React, { useState, useEffect } from "react";
import {
  getAllFieldsAPI,
  createFieldAPI,
  updateFieldAPI,
  deleteFieldAPI,
} from "../../services/fieldService";
import toast from "react-hot-toast";
import axios from "axios";
import { Map, Plus, Edit, Trash2, X, UploadCloud, Loader2 } from "lucide-react";

export default function ManageFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryName: "Sân 5 người",
    pricePerHour: "",
    imageUrl: "",
    description: "",
  });

  const fetchFields = async () => {
    try {
      setLoading(true);
      const data = await getAllFieldsAPI();
      setFields(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu sân bóng từ máy chủ!");
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // 🚀 HÀM UPLOAD ẢNH QUA BACKEND (Bảo mật 100%)
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Vui lòng chỉ chọn file hình ảnh!");

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file); // Chữ "file" này phải khớp với upload.single('file') ở Backend

    try {
      // Đổi URL này thành URL Backend của bạn (Ví dụ: http://localhost:5000/api/upload)
      // Nếu bạn đã cấu hình axios instance có sẵn baseURL, thì dùng api.post('/upload', ...)
      const response = await axios.post("http://localhost:5000/api/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Đính kèm token nếu API Backend của bạn bắt buộc phải là Admin mới được up ảnh
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });
      
      // Lấy link ảnh từ Backend trả về và gán vào form
      setFormData({ ...formData, imageUrl: response.data.secure_url });
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      toast.error("Không thể tải ảnh lên máy chủ Backend!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({
      name: "",
      categoryName: "Sân 5 người",
      pricePerHour: "",
      imageUrl: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (field) => {
    setEditId(field._id);
    setFormData({
      name: field.name || "",
      categoryName: field.category?.name || field.categoryName || "Sân 5 người",
      pricePerHour: field.pricePerHour || "",
      imageUrl: Array.isArray(field.imageUrl)
        ? field.imageUrl[0]
        : field.imageUrl || "",
      description: field.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pricePerHour) return toast.error("Vui lòng nhập tên sân và giá thuê!");

    setIsSubmitting(true);
    try {
      // 1. Hàm xịn xò: Tự động xóa dấu tiếng Việt và khoảng trắng để tạo Slug
      const generateSlug = (str) => {
        return str.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
          .replace(/[đĐ]/g, "d") // Chữ đ/Đ thành d
          .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt
          .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
          .replace(/-+/g, "-") // Xóa gạch ngang thừa
          .replace(/^-+|-+$/g, ""); // Cắt gạch ngang ở 2 đầu
      };

      // 2. Gom dữ liệu form và nhét thêm cái slug vào để "chiều lòng" Database
      const payload = {
        ...formData,
        slug: generateSlug(formData.name) 
      };

      // 3. Gửi lên Backend
      if (editId) await updateFieldAPI(editId, payload);
      else await createFieldAPI(payload);
      
      toast.success(`${editId ? 'Cập nhật' : 'Thêm mới'} sân thành công!`);
      setIsModalOpen(false);
      fetchFields(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu thông tin sân!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sân "${name}" vĩnh viễn không?`))
      return;
    try {
      await deleteFieldAPI(id);
      toast.success("Đã xóa sân bóng thành công!");
      fetchFields();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa sân bóng!");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="space-y-8 relative">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950 flex items-center">
            <Map size={28} className="mr-3 text-rose-600" /> Quản lý Sân Bóng
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Thêm, sửa, xóa các mặt sân trong hệ thống
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-600 transition shadow-lg flex items-center"
        >
          <Plus size={20} className="mr-2" /> Thêm sân mới
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
            Đang tải dữ liệu sân bóng...
          </div>
        ) : fields.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
            Hệ thống hiện tại chưa có sân bóng nào.
          </div>
        ) : (
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
                  <tr
                    key={field._id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={
                          Array.isArray(field.imageUrl)
                            ? field.imageUrl[0]
                            : field.imageUrl ||
                              "https://via.placeholder.com/100"
                        }
                        alt={field.name}
                        className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {field.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-600">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg">
                        {field.category?.name ||
                          field.categoryName ||
                          "Sân bóng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-rose-600">
                      {formatPrice(field.pricePerHour)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(field)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(field._id, field.name)}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
              <h3 className="font-black text-lg flex items-center">
                <Map className="mr-2 text-rose-500" />{" "}
                {editId ? "Cập nhật thông tin Sân" : "Thêm Sân Bóng Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-slate-700 p-1.5 rounded-full transition text-gray-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên sân bóng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Sân Cỏ Nhân Tạo Số 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Loại sân
                  </label>
                  <select
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Sân 5 người">Sân 5 người</option>
                    <option value="Sân 7 người">Sân 7 người</option>
                    <option value="Sân 11 người">Sân 11 người</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Giá thuê (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.pricePerHour}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerHour: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: 150000"
                  />
                </div>
              </div>

              {/* UPLOAD ẢNH UI CHO SÂN BÓNG */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Ảnh mặt sân
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 shrink-0 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center relative">
                    {isUploading ? (
                      <Loader2
                        className="animate-spin text-blue-500"
                        size={24}
                      />
                    ) : formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">
                        Chưa có ảnh
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition font-bold">
                      <UploadCloud size={20} />
                      {isUploading
                        ? "Đang tải ảnh lên..."
                        : "Tải ảnh từ máy tính"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadImage}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mô tả thêm
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Nhập mô tả về mặt sân, hệ thống đèn chiếu sáng..."
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className={`px-6 py-2.5 font-bold text-white rounded-xl transition shadow-md flex items-center ${isSubmitting || isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-200"}`}
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
