const { GoogleGenerativeAI } = require("@google/generative-ai");
const Field = require("../models/Field");
const Product = require("../models/Product");
const Service = require("../models/Service");

exports.handleChatbot = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Vui lòng nhập tin nhắn" });

        // 1. Kéo dữ liệu từ Database lên (chỉ lấy các trường cần thiết cho nhẹ)
        const fields = await Field.find().select('name pricePerHour description');
        const products = await Product.find().select('name price countInStock');
        const services = await Service.find().select('name price description');

        // 2. Gom dữ liệu thành một đoạn văn bản Context (Ngữ cảnh)
        let contextData = "THÔNG TIN SÂN BÓNG:\n";
        fields.forEach(f => contextData += `- ${f.name}: Giá ${f.pricePerHour} VNĐ/giờ. Mô tả: ${f.description}\n`);
        
        contextData += "\nTHÔNG TIN SẢN PHẨM (NƯỚC/ĐỒ ĂN):\n";
        products.forEach(p => contextData += `- ${p.name}: Giá ${p.price} VNĐ (Còn ${p.countInStock} sản phẩm)\n`);
        
        contextData += "\nDỊCH VỤ ĐI KÈM:\n";
        services.forEach(s => contextData += `- ${s.name}: Giá ${s.price} VNĐ. Mô tả: ${s.description}\n`);

        // 3. Khởi tạo Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Dùng bản flash cho tốc độ phản hồi nhanh nhất
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 4. Nhồi "Não" cho AI (System Prompt)
        const prompt = `
            Bạn là nhân viên tư vấn nhiệt tình, chuyên nghiệp của hệ thống Đặt Sân Bóng Nhân Tạo. 
            Dưới đây là dữ liệu thực tế hiện có của hệ thống:
            
            ${contextData}
            
            NHIỆM VỤ CỦA BẠN:
            - Trả lời câu hỏi của khách hàng dựa TỰYỆT ĐỐI vào dữ liệu được cung cấp ở trên.
            - Trả lời ngắn gọn, thân thiện, có dạ thưa. 
            - Nếu khách hỏi những thông tin ngoài lề (không liên quan đến bóng đá, đặt sân, mua nước), hãy khéo léo từ chối và lái câu chuyện về dịch vụ sân bóng.
            
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
        res.status(500).json({ message: "Chatbot đang bận, vui lòng thử lại sau!" });
    }
};