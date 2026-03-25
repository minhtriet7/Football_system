import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllFieldsAPI } from "../../services/fieldService";
import toast from "react-hot-toast";
import {
  MapPin,
  Search,
  Star,
  ChevronRight,
  Users,
  Zap,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State cho Slider tự động
  const [currentSlide, setCurrentSlide] = useState(0);

  // State cho Form tìm kiếm
  const [searchCategory, setSearchCategory] = useState("All");

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1529900294039-ca8f43c40305?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Nền tảng kết nối",
      highlight: "thể thao lớn nhất",
      desc: "Tìm kiếm sân tập, đặt lịch nhanh chóng và trải nghiệm dịch vụ trọn gói ngay trong nội ô thành phố.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1518605368461-1ee7e53f05f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Trải nghiệm mặt cỏ",
      highlight: "chuẩn FIFA",
      desc: "Hệ thống sân bãi được bảo trì liên tục, mang lại cảm giác bóng tốt nhất cho những pha xử lý đỉnh cao.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1551280857-2b9bbe5240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Tổ chức giải đấu",
      highlight: "chuyên nghiệp",
      desc: "Hỗ trợ trọng tài, quay phim highlight và đầy đủ vật dụng y tế, nước uống phục vụ tận sân.",
    },
  ];

  // Danh mục Premium dùng Icon Lucide thay vì Emoji
  const categories = [
    {
      name: "Sân 5 người",
      type: "Sân bóng",
      desc: "Sân nhỏ mini phù hợp cho đội ít người, không gian thân mật.",
      icon: <Users size={40} className="text-rose-500 mb-4" />,
      link: "/fields?category=Sân 5 người",
    },
    {
      name: "Sân 7 người",
      type: "Sân bóng",
      desc: "Sân thi đấu bán chuyên rộng rãi, chiến thuật đa dạng.",
      icon: <Zap size={40} className="text-blue-500 mb-4" />,
      link: "/fields?category=Sân 7 người",
    },
    {
      name: "Nước & Đồ ăn",
      type: "Sản phẩm",
      desc: "Bò húc, Lavie, Mì tôm, Xúc xích tiếp sức tại chỗ.",
      icon: <ShoppingBag size={40} className="text-amber-500 mb-4" />,
      link: "/products-services",
    },
    {
      name: "Tiện ích & Hỗ trợ",
      type: "Dịch vụ",
      desc: "Thuê áo Bib, Trọng tài, Trà đá, Quay phim Highlight.",
      icon: <ShieldCheck size={40} className="text-emerald-500 mb-4" />,
      link: "/products-services",
    },
  ];

  // Auto chuyển Slider mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Gọi API Sân nổi bật
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await getAllFieldsAPI();
        // Chỉ lấy 3 sân đầu tiên làm "Sân nổi bật" hiển thị ở trang chủ
        setFields(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (error) {
        toast.error("Không thể tải danh sách sân!");
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getImageUrl = (urlData) => {
    if (Array.isArray(urlData) && urlData.length > 0) return urlData[0];
    return (
      urlData || "https://images.unsplash.com/photo-1589487391730-58f20eb2c308"
    );
  };

  // Hàm xử lý tìm kiếm: Chuyển hướng sang trang FieldsPage kèm tham số
  const handleSearch = () => {
    if (searchCategory === "All") {
      navigate("/fields");
    } else {
      navigate(`/fields?category=${searchCategory}`);
    }
  };

  return (
    <div className="w-full pb-16 bg-gray-50">
      {/* 1. HERO SLIDER SECTION (Tự động chuyển ảnh) */}
      <div className="relative h-[550px] w-full overflow-hidden bg-gray-900">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-transparent"></div>
            <div className="relative z-20 flex flex-col justify-center h-full px-8 md:px-20 max-w-7xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight transform transition-transform duration-700 translate-y-0">
                24h Sports - {slide.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-50 font-medium max-w-2xl leading-relaxed">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Nút chấm tròn chuyển slide (Dots) */}
        <div className="absolute bottom-28 left-0 right-0 z-20 flex justify-center space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-rose-500 w-8" : "bg-white/50 hover:bg-white"}`}
            ></button>
          ))}
        </div>
      </div>

      {/* 2. FORM TÌM KIẾM HOẠT ĐỘNG THẬT */}
      <div className="relative z-30 max-w-5xl mx-auto -mt-16 bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 mx-4 md:mx-auto">
        <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center">
          <Search className="mr-2 text-rose-600" /> Tìm sân nhanh chóng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none font-bold cursor-pointer"
            >
              <option value="All">Tất cả loại sân</option>
              <option value="Sân 5 người">Sân 5 người</option>
              <option value="Sân 7 người">Sân 7 người</option>
              <option value="Sân 11 người">Sân 11 người</option>
            </select>
          </div>
          <div>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-rose-500 outline-none font-bold cursor-pointer">
              <option value="ninh_kieu">Quận Ninh Kiều</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="w-full bg-rose-600 text-white font-black text-lg py-4 rounded-xl hover:bg-rose-700 transition shadow-lg hover:shadow-rose-500/30 flex items-center justify-center"
          >
            Tìm kiếm ngay
          </button>
        </div>
      </div>

      {/* 3. DANH MỤC DỊCH VỤ PREMIUM */}
      <div className="max-w-7xl mx-auto mt-24 px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-4">
            Dịch vụ tại 24h Sports
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Tất cả những gì bạn cần cho một trận đấu hoàn hảo
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="block bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col items-center text-center hover:-translate-y-2 outline-none"
            >
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                {item.type}
              </span>
              <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. SÂN BÓNG NỔI BẬT (Đồng bộ UI với FieldsPage) */}
      <div className="max-w-7xl mx-auto mt-24 px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-4">
              Sân bóng nổi bật
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Các mặt sân được yêu thích nhất tuần qua
            </p>
          </div>
          <Link
            to="/fields"
            className="text-rose-600 font-bold hover:text-blue-900 transition flex items-center group"
          >
            Xem tất cả hệ thống sân{" "}
            <ChevronRight
              size={20}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-blue-900 font-bold animate-pulse text-lg">
            Đang tải dữ liệu hệ thống sân...
          </div>
        ) : fields.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl text-gray-500">
            Hiện tại chưa có sân bóng nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fields.map((field) => (
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
                    {field.categoryName || field.category?.name || "Sân bóng"}
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-yellow-400 flex items-center">
                    <Star size={14} className="mr-1 fill-yellow-400" /> 5.0
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow relative">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-900 transition-colors line-clamp-1">
                    {field.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center mb-4 font-medium">
                    <MapPin size={16} className="mr-1.5 text-rose-500" /> Trung
                    tâm Cần Thơ
                  </p>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                    {field.description}
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

      {/* 5. TIN TỨC THỂ THAO */}
      {/* Giữ nguyên phần UI Tin tức cũ của bạn vì nó đã ổn, hoặc tùy chỉnh thêm padding */}
      <div className="max-w-7xl mx-auto mt-24 px-6 md:px-8 border-t border-gray-200 pt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-blue-900 mb-2">
              Tin tức thể thao mới nhất
            </h2>
            <p className="text-gray-500">
              Tin tức được cập nhật liên tục cho người chơi
            </p>
          </div>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 font-bold hover:text-rose-600 transition flex items-center"
          >
            Xem tất cả{" "}
            <span className="ml-1 bg-blue-900 text-white rounded-full p-1 text-xs leading-none">
              ›
            </span>
          </a>
        </div>

        {/* Layout Grid Bài Viết */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <a
            href="#"
            className="lg:col-span-2 group cursor-pointer relative rounded-3xl overflow-hidden h-[400px] shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src="https://res.cloudinary.com/dg0qiq4zd/image/upload/v1774372461/1121212_a0o8ly.jpg"
              alt="News 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg">
              Bóng đá
            </div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <span className="text-gray-300 text-sm mb-3 block font-medium">
                25 Tháng 3, 2026
              </span>
              <h3 className="text-white text-3xl font-black leading-tight group-hover:text-rose-400 transition-colors">
                BƯỚC CHUYỂN MÌNH CỦA BÓNG ĐÁ TRẺ TP.HCM: KHỞI ĐẦU CHO NHỮNG GIẤC
                MƠ LỚN
              </h3>
            </div>
          </a>
          <a
            href="#"
            className="lg:col-span-1 group cursor-pointer flex flex-col"
          >
            <div className="relative rounded-3xl overflow-hidden h-[240px] mb-5 shadow-sm">
              <img
                src="https://res.cloudinary.com/dg0qiq4zd/image/upload/v1774372461/12121212_kg1l06.jpg"
                alt="News 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Bóng đá
              </div>
            </div>
            <span className="text-gray-400 text-sm mb-2 font-medium">
              20 Tháng 3, 2026
            </span>
            <h3 className="text-gray-900 text-xl font-bold leading-snug group-hover:text-rose-600 transition-colors">
              Buổi tập giữ thăng bằng cho đôi chân bổ trợ sự linh hoạt và nhịp
              nhàng
            </h3>
          </a>
          <a
            href="#"
            className="lg:col-span-1 group cursor-pointer flex flex-col"
          >
            <div className="relative rounded-3xl overflow-hidden h-[240px] mb-5 shadow-sm">
              <img
                src="https://res.cloudinary.com/dg0qiq4zd/image/upload/v1774372461/31231_seojef.jpg"
                alt="News 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Bóng đá
              </div>
            </div>
            <span className="text-gray-400 text-sm mb-2 font-medium">
              19 Tháng 3, 2026
            </span>
            <h3 className="text-gray-900 text-xl font-bold leading-snug group-hover:text-rose-600 transition-colors">
              Trưởng đoàn Đội Proup Hồ Sỹ Thơ ra sân cổ vũ toàn đội trong giải
              đấu lớn
            </h3>
          </a>
        </div>
      </div>
    </div>
  );
}
