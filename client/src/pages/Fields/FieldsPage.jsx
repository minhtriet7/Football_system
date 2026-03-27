import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getAllFieldsAPI } from "../../services/fieldService";
import toast from "react-hot-toast";
import {
  Search,
  MapPin,
  Filter,
  AlertTriangle,
  Star,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function FieldsPage() {
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get("category");
  const navigate = useNavigate();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);

  // State cho bộ lọc tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(categoryQuery || "All");

  // Cập nhật filter nếu người dùng click từ Menu Navbar
  useEffect(() => {
    setFilterType(categoryQuery || "All");
  }, [categoryQuery]);

  // Lấy dữ liệu sân từ Backend
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        setErrorStatus(false);
        const data = await getAllFieldsAPI();
        if (Array.isArray(data)) {
          setFields(data);
        } else {
          setFields([]);
        }
      } catch (error) {
        // Nếu lỗi 401 là do token hết hạn, vẫn có thể bỏ qua để xem sân (vì đây là trang public)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userInfo"); // Dọn dẹp token rác
          // Có thể gọi lại hàm fetchFields ở đây nếu API của bạn cho phép public,
          // hoặc đơn giản là set báo lỗi nhẹ.
        } else {
          toast.error("Không thể kết nối tới Server lấy dữ liệu sân!");
          setErrorStatus(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  // Format tiền tệ
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Xử lý ảnh (nếu mảng thì lấy ảnh đầu tiên)
  const getImageUrl = (urlData) => {
    if (Array.isArray(urlData) && urlData.length > 0) return urlData[0];
    return (
      urlData || "https://images.unsplash.com/photo-1589487391730-58f20eb2c308"
    );
  };

  // LOGIC TÌM KIẾM VÀ LỌC SÂN (Đã đồng bộ chuẩn 100% với Database)
  const filteredFields = fields.filter((field) => {
    // 1. Lọc theo tên sân
    const matchSearch = field.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // 2. Lọc theo Loại sân (Lấy chính xác trường name từ Category đã populate)
    const categoryName = field.category?.name || "";

    // 3. So sánh chính xác 100% chữ "Sân 5 người", "Sân 7 người"
    const matchFilter = filterType === "All" || categoryName === filterType;

    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 1. HERO BANNER */}
      <div className="relative bg-[#003b73] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#003b73] to-transparent"></div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-blue-800/50 text-blue-200 text-sm font-semibold mb-4 border border-blue-700 backdrop-blur-sm">
            <ShieldCheck size={16} className="text-rose-400" /> Sân bóng đạt
            chuẩn FIFA
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            ĐẶT SÂN BÓNG <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
              TRẢI NGHIỆM ĐỈNH CAO
            </span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Hệ thống mặt cỏ nhân tạo chất lượng cao, dàn đèn LED chiếu sáng hiện
            đại nhất nội ô TP Cần Thơ.
          </p>
        </div>
      </div>

      {/* 2. THANH TÌM KIẾM NỔI */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-8 z-20 mb-12">
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative w-full flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="text"
              placeholder="Nhập tên sân bạn muốn tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-medium text-gray-700"
            />
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
              size={20}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-rose-50 border border-rose-100 text-rose-900 rounded-xl py-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer font-bold appearance-none"
            >
              <option value="All">Tất cả loại sân</option>
              <option value="Sân 5 người">Sân 5 người</option>
              <option value="Sân 7 người">Sân 7 người</option>
              <option value="Sân 11 người">Sân 11 người</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-rose-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KHU VỰC HIỂN THỊ DANH SÁCH SÂN */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-900">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-rose-600 rounded-full animate-spin mb-4"></div>
            <p className="font-bold animate-pulse text-lg">
              Đang tải danh sách sân...
            </p>
          </div>
        ) : errorStatus ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-100 text-red-500 flex flex-col items-center">
            <AlertTriangle size={56} className="mb-4 opacity-50" />
            <h3 className="font-black text-2xl mb-2 text-gray-800">
              Không thể tải dữ liệu!
            </h3>
            <p className="text-gray-500">
              Bạn vui lòng đăng xuất và đăng nhập lại, hoặc nhấn F5.
            </p>
          </div>
        ) : filteredFields.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500">
              Rất tiếc, không có sân nào khớp với từ khóa "{searchTerm}".
              <br />
              Vui lòng thử từ khóa khác hoặc chọn "Tất cả loại sân".
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("All");
              }}
              className="mt-6 bg-rose-50 text-rose-600 font-bold px-6 py-2.5 rounded-xl hover:bg-rose-100 transition"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFields.map((field) => (
              <div
                key={field._id}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(225,29,72,0.1)] transition-all duration-300 border border-gray-100 group flex flex-col"
              >
                <div
                  className="h-60 overflow-hidden relative cursor-pointer"
                  onClick={() => navigate(`/field/${field._id}`)}
                >
                  <img
                    src={getImageUrl(field.imageUrl)}
                    alt={field.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-xl text-sm font-bold text-blue-900 shadow-sm flex items-center">
                    {field.categoryName ||
                      field.category?.name ||
                      field.type ||
                      "Sân bóng"}
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-yellow-400 flex items-center">
                    <Star size={14} className="mr-1 fill-yellow-400" /> 5.0
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow relative">
                  <h3
                    className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-900 transition-colors line-clamp-1"
                    title={field.name}
                  >
                    {field.name}
                  </h3>

                  <p className="text-sm text-gray-500 flex items-center mb-4 font-medium">
                    <MapPin size={16} className="mr-1.5 text-rose-500" /> Trung
                    tâm Cần Thơ
                  </p>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                    {field.description ||
                      "Sân bóng cỏ nhân tạo chất lượng cao, trang bị hệ thống đèn chiếu sáng tiêu chuẩn, bãi đậu xe rộng rãi."}
                  </p>

                  <div className="flex justify-between items-end pt-5 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1 font-semibold uppercase tracking-wider">
                        Giá thuê từ
                      </span>
                      <span className="text-2xl font-black text-rose-600">
                        {formatPrice(field.pricePerHour)}
                        <span className="text-sm font-medium text-gray-500 ml-1">
                          /h
                        </span>
                      </span>
                    </div>

                    <Link
                      to={`/field/${field._id}`}
                      className="bg-blue-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors shadow-md flex items-center group-hover:pr-4"
                    >
                      Đặt ngay{" "}
                      <ChevronRight
                        size={18}
                        className="ml-1 opacity-0 group-hover:opacity-100 -mr-4 group-hover:mr-0 transition-all"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
