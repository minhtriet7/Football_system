const { GoogleGenerativeAI } = require("@google/generative-ai");
const Field = require("../models/Field");
const Product = require("../models/Product");
const Service = require("../models/Service");

// ĐÂY LÀ CHỖ QUAN TRỌNG NHẤT: Bắt buộc phải có chữ "exports." ở đầu
exports.handleChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Vui lòng nhập tin nhắn" });
    }

    // 1. Kéo dữ liệu từ Database
    const fields = await Field.find().select("name pricePerHour description");
    const products = await Product.find().select("name price countInStock");
    const services = await Service.find().select("name price description");

    // 2. Gom dữ liệu thành Context (Ngữ cảnh)
    let contextData = "THÔNG TIN SÂN BÓNG:\n";
    fields.forEach((f) => {
      contextData += `- ${f.name}: Giá ${f.pricePerHour} VNĐ/giờ. Mô tả: ${f.description}\n`;
    });

    contextData += "\nTHÔNG TIN SẢN PHẨM (NƯỚC/ĐỒ ĂN):\n";
    products.forEach((p) => {
      contextData += `- ${p.name}: Giá ${p.price} VNĐ (Còn ${p.countInStock} sản phẩm)\n`;
    });

    contextData += "\nDỊCH VỤ ĐI KÈM:\n";
    services.forEach((s) => {
      contextData += `- ${s.name}: Giá ${s.price} VNĐ. Mô tả: ${s.description}\n`;
    });

    // 3. Khởi tạo AI (Lấy API Key từ file .env)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Prompt nâng cao ép trả về Markdown
    const prompt = `
            Bạn là "Trợ lý 24h Sports" - nhân viên tư vấn nhiệt tình của hệ thống Đặt Sân Bóng Nhân Tạo. 
            Dưới đây là bảng giá và dữ liệu thực tế hiện có của hệ thống:
            
            ${contextData}
            
            QUY TẮC BẮT BUỘC:
            1. TƯ VẤN CHÍNH XÁC: Chỉ báo giá dựa trên dữ liệu cung cấp. Nếu Sản phẩm có countInStock = 0, hãy báo là tạm hết hàng.
            2. HƯỚNG DẪN CHỐT ĐƠN: Luôn khuyên khách vào mục "Hệ thống sân" trên web để chọn giờ đá.
            3. ĐỊNH DẠNG: Trả lời bằng Markdown. Dùng in đậm (**tên**) cho Tên Sân, Tên Dịch vụ, **Giá tiền**. Dùng gạch đầu dòng (-) để liệt kê.
            4. THÁI ĐỘ: Năng động, xưng "em" và gọi khách là "anh/chị" hoặc "bạn". Dùng icon thể thao (⚽, 🏃‍♂️).
            5. TỪ CHỐI KHÉO: Nếu khách hỏi ngoài lề (làm toán, viết code...), hãy lịch sự từ chối và lái về dịch vụ sân bóng.
            
            Câu hỏi của khách hàng: "${message}"
        `;

    // 5. Gọi AI sinh câu trả lời
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Trả về cho Frontend
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Lỗi Chatbot:", error);
    res
      .status(500)
      .json({
        message:
          "Dạ hiện tại hệ thống AI đang bảo trì, anh/chị vui lòng đợi chút hoặc liên hệ hotline nhé!",
      });
  }
};
