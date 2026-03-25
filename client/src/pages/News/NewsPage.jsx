import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function NewsPage() {
  // Danh sách các bài viết (Bạn có thể thay hình ảnh và link sau)
  const newsList = [
    {
      title: "BƯỚC CHUYỂN MÌNH CỦA BÓNG ĐÁ TRẺ TP.HCM: KHỞI ĐẦU CHO NHỮNG GIẤC MƠ LỚN",
      date: "03/23/2026",
      category: "Bóng đá",
      imageUrl: "https://res.cloudinary.com/dg0qiq4zd/image/upload/v1774430346/u23-viet-nam-1769510666495393926-697982194c059_xiiwbm.jpg"
    },
    {
      title: "Buổi tập giữ thăng bằng cho đôi chân bổ trợ sự linh hoạt và nhịp nhàng",
      date: "03/20/2026",
      category: "Kỹ thuật",
      imageUrl: "https://res.cloudinary.com/dg0qiq4zd/image/upload/v1774430346/adaqdqqdddddeeddddddd-2-69c1fe459094f_ayh34a.jpg",
      link: "https://thethao247.vn/"
    },
    {
      title: "Trưởng đoàn Đội Proup Hồ Sỹ Thơ ra sân cổ vũ toàn đội trong giải đấu lớn",
      date: "03/19/2026",
      category: "Sự kiện",
      imageUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80",
      link: "https://thethao247.vn/"
    },
    {
      title: "Top 5 đôi giày đinh TF tốt nhất cho dân đá phủi sân cỏ nhân tạo năm nay",
      date: "03/15/2026",
      category: "Trang bị",
      imageUrl: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80",
      link: "https://thanhhungfutsal.com/blogs/tin-tuc/top-5-giay-da-bong-co-nhan-tao-ngon-nhat-danh-cho-chan-be?gad_source=1&gad_campaignid=22210434912&gbraid=0AAAAAC8x93SuCWUTkt0c3UKAeYNnoW7qq&gclid=Cj0KCQjwj47OBhCmARIsAF5wUEG0DaS6cE-qb5woNGGjxoUNJoBEYoU0rHxsJx0f5N8daT2jawqBz9saAn6QEALw_wcB"
    },
    {
      title: "Hướng dẫn sơ cứu chấn thương lật cổ chân đúng cách ngay tại sân",
      date: "03/10/2026",
      category: "Y tế",
      imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
      link: "https://www.vinmec.com/vie/bai-viet/lat-co-chan-va-cach-dieu-tri-vi"
    },
    {
      title: "Giải bóng đá phong trào Cúp 24h Sports chính thức khởi tranh vòng bảng",
      date: "03/05/2026",
      category: "Giải đấu",
      imageUrl: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=800&q=80",
      link: "https://thethao247.vn/"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#003b73] py-16 text-center px-4">
        <h1 className="text-4xl font-black text-white mb-4">Tin tức & Sự kiện</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">Cập nhật những thông tin mới nhất về thể thao phong trào và các giải đấu.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsList.map((news, index) => (
          <a key={index} href={news.link} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
            <div className="h-56 overflow-hidden relative">
              <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">{news.category}</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-gray-400 text-sm mb-2 font-medium">{news.date}</span>
              <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-rose-600 transition-colors flex-grow">{news.title}</h3>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">
                Đọc tiếp tại trang báo <ExternalLink size={14} className="ml-1" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}