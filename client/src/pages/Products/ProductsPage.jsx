// src/pages/Products/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProductsAPI } from "../../services/productService";
import { getServicesAPI } from "../../services/serviceItemService";
import toast from "react-hot-toast";
import { ShoppingBag, Sparkles, Check, ShoppingCart } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, servicesData] = await Promise.all([
          getAllProductsAPI(),
          getServicesAPI(),
        ]);
        setProducts(productsData);
        setServices(servicesData);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // HÀM QUAN TRỌNG: Tự động trích xuất ảnh đầu tiên nếu database lưu dạng mảng
  const getImageUrl = (urlData) => {
    if (Array.isArray(urlData) && urlData.length > 0) return urlData[0];
    return (
      urlData ||
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
    );
  };

  const handleAddToCartClick = () => {
    toast(
      "Vui lòng chọn sân trước. Bạn có thể thêm các dịch vụ này ở bước Thanh toán nhé!",
      { icon: "💡", duration: 4000 },
    );
    setTimeout(() => {
      navigate("/fields");
    }, 1500);
  };

  if (loading)
    return (
      <div className="text-center py-20 animate-pulse font-bold text-gray-500">
        Đang tải cửa hàng...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#003b73] py-16 text-center px-4">
        <h1 className="text-4xl font-black text-white mb-4">
          Cửa hàng & Dịch vụ
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Nạp năng lượng và tận hưởng trải nghiệm thi đấu chuyên nghiệp nhất.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 space-y-20">
        {/* KHU VỰC 1: SẢN PHẨM */}
        <section>
          <div className="flex items-center mb-8">
            <ShoppingBag className="text-rose-600 mr-3" size={32} />
            <h2 className="text-3xl font-black text-blue-900">
              Nước giải khát & Đồ ăn
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group flex flex-col"
              >
                <div className="h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {/* Sử dụng hàm getImageUrl */}
                  <img
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                  {product.description || "Thức uống tiếp năng lượng"}
                </p>
                <div className="flex justify-between items-center border-t pt-4 mb-4">
                  <span className="text-xl font-black text-rose-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                    Còn {product.countInStock}
                  </span>
                </div>
                <button
                  onClick={handleAddToCartClick}
                  className="w-full flex justify-center items-center bg-blue-50 text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
                >
                  <ShoppingCart size={18} className="mr-2" /> Đặt kèm khi thuê
                  sân
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* KHU VỰC 2: DỊCH VỤ */}
        <section>
          <div className="flex items-center mb-8">
            <Sparkles className="text-rose-600 mr-3" size={32} />
            <h2 className="text-3xl font-black text-blue-900">
              Dịch vụ đi kèm
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-blue-300 transition-colors flex flex-col h-full group"
              >
                <div className="h-48 overflow-hidden relative">
                  {/* Sử dụng hàm getImageUrl */}
                  <img
                    src={getImageUrl(service.imageUrl)}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 text-blue-700 font-black px-3 py-1 rounded-lg text-sm shadow-sm">
                    {formatPrice(service.price)}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl text-blue-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-500">
                      <Check size={16} className="text-green-500 mr-2" /> Hỗ trợ
                      tận sân
                    </li>
                    <li className="flex items-center text-sm text-gray-500">
                      <Check size={16} className="text-green-500 mr-2" /> Tiện
                      lợi, chuyên nghiệp
                    </li>
                  </ul>
                  <button
                    onClick={handleAddToCartClick}
                    className="w-full text-center text-sm text-rose-600 font-bold bg-rose-50 hover:bg-rose-600 hover:text-white transition py-3 rounded-lg flex justify-center items-center"
                  >
                    <ShoppingCart size={18} className="mr-2" /> Chọn thuê lúc
                    đặt sân
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
