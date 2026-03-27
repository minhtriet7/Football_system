import React, { useState, useEffect } from "react";
import {
  getAllProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from "../../services/productService";
import {
  getServicesAPI,
  createServiceAPI,
  updateServiceAPI,
  deleteServiceAPI,
} from "../../services/serviceItemService";
import toast from "react-hot-toast";
import axios from "axios";
import {
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  X,
  UploadCloud,
  Loader2,
} from "lucide-react";

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Sản phẩm",
    price: "",
    description: "",
    imageUrl: "",
    countInStock: 0,
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [productsData, servicesData] = await Promise.all([
        getAllProductsAPI().catch(() => []),
        getServicesAPI().catch(() => []),
      ]);
      const products = Array.isArray(productsData) ? productsData : [];
      const services = Array.isArray(servicesData) ? servicesData : [];
      const combined = [
        ...products.map((p) => ({ ...p, type: "Sản phẩm" })),
        ...services.map((s) => ({ ...s, type: "Dịch vụ" })),
      ];
      setItems(combined);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm/dịch vụ!",error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 🚀 HÀM UPLOAD ẢNH CHUẨN BẢO MẬT (Đã điền sẵn thông tin của bạn)
  // 🚀 HÀM UPLOAD ẢNH QUA BACKEND (Bảo mật 100%)
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Vui lòng chỉ chọn file hình ảnh!");

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file); // Chữ "file" này phải khớp với upload.single('file') ở Backend

    try {
      // Đổi URL này thành URL Backend của bạn (Ví dụ: http://localhost:5000/api/upload)
      // Nếu bạn đã cấu hình axios instance có sẵn baseURL, thì dùng api.post('/upload', ...)
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Đính kèm token nếu API Backend của bạn bắt buộc phải là Admin mới được up ảnh
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

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
      type: "Sản phẩm",
      price: "",
      description: "",
      imageUrl: "",
      countInStock: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name || "",
      type: item.type,
      price: item.price || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      countInStock: item.countInStock || 0,
    });
    setIsModalOpen(true);
  };

  // 4. XỬ LÝ LƯU (SUBMIT FORM)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      return toast.error("Vui lòng nhập tên món và đơn giá!");
    }

    setIsSubmitting(true);
    try {
      // 🚀 Hàm tạo Slug tự động từ tên sản phẩm/dịch vụ
      const generateSlug = (str) => {
        return str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
          .replace(/[đĐ]/g, "d") // Chữ đ/Đ thành d
          .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt
          .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
          .replace(/-+/g, "-") // Xóa gạch ngang thừa
          .replace(/^-+|-+$/g, ""); // Cắt gạch ngang ở 2 đầu
      };

      // Gom dữ liệu và lén nhét thêm cái slug vào cho Database vui vẻ
      const payload = {
        name: formData.name,
        slug: generateSlug(formData.name), // ĐÂY LÀ CHÌA KHÓA FIX LỖI 🗝️
        price: Number(formData.price),
        description: formData.description,
        imageUrl: formData.imageUrl,
      };

      if (formData.type === "Sản phẩm") {
        payload.countInStock = Number(formData.countInStock);

        if (editId) await updateProductAPI(editId, payload);
        else await createProductAPI(payload);
      } else {
        // Dịch vụ thì không cần đếm số lượng tồn kho
        if (editId) await updateServiceAPI(editId, payload);
        else await createServiceAPI(payload);
      }

      toast.success(`${editId ? "Cập nhật" : "Thêm mới"} thành công!`);
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu thông tin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name, type) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa ${type.toLowerCase()} "${name}" không?`,
      )
    )
      return;
    try {
      if (type === "Sản phẩm") await deleteProductAPI(id);
      else await deleteServiceAPI(id);
      toast.success(`Đã xóa thành công!`);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa!");
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
            <ShoppingBag size={28} className="mr-3 text-rose-600" /> Dịch vụ &
            Đồ uống
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Quản lý kho nước uống, đồ ăn và các dịch vụ kèm theo
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-600 transition shadow-lg flex items-center"
        >
          <Plus size={20} className="mr-2" /> Thêm món mới
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100">
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
            Chưa có sản phẩm hoặc dịch vụ nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-gray-50 rounded-xl">
                <tr>
                  <th className="px-6 py-4">Hình ảnh</th>
                  <th className="px-6 py-4">Tên Sản phẩm / Dịch vụ</th>
                  <th className="px-6 py-4">Phân loại</th>
                  <th className="px-6 py-4">Tồn kho</th>
                  <th className="px-6 py-4">Đơn giá</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      {item.imageUrl ? (
                        <img
                          src={
                            Array.isArray(item.imageUrl)
                              ? item.imageUrl[0] ||
                                "https://via.placeholder.com/100" // Xử lý nếu là Dịch vụ (Mảng)
                              : item.imageUrl ||
                                "https://via.placeholder.com/100" // Xử lý nếu là Sản phẩm (Chuỗi)
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-200">
                          Ảnh
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === "Dịch vụ" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-600">
                      {item.type === "Sản phẩm" ? (
                        <span
                          className={
                            item.countInStock > 0
                              ? "text-gray-800"
                              : "text-red-500"
                          }
                        >
                          {item.countInStock} cái
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-rose-600">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item._id, item.name, item.type)
                          }
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
                <ShoppingBag className="mr-2 text-rose-500" />{" "}
                {editId ? "Cập nhật Thông tin" : "Thêm Sản phẩm/Dịch vụ mới"}
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
                  Loại danh mục
                </label>
                <div className="flex gap-4">
                  <label
                    className={`flex-1 flex items-center justify-center p-3 border rounded-xl cursor-pointer transition font-bold ${formData.type === "Sản phẩm" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"} ${editId ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="Sản phẩm"
                      className="hidden"
                      checked={formData.type === "Sản phẩm"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      disabled={!!editId}
                    />
                    Sản phẩm
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center p-3 border rounded-xl cursor-pointer transition font-bold ${formData.type === "Dịch vụ" ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"} ${editId ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="Dịch vụ"
                      className="hidden"
                      checked={formData.type === "Dịch vụ"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      disabled={!!editId}
                    />
                    Dịch vụ
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên {formData.type.toLowerCase()}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Nước khoáng Lavie"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Đơn giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="VD: 10000"
                  />
                </div>
                {formData.type === "Sản phẩm" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.countInStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countInStock: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="VD: 50"
                    />
                  </div>
                )}
              </div>

              {/* UPLOAD ẢNH UI */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Hình ảnh minh họa
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 shrink-0 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center relative">
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
