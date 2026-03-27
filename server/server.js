const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// 👉 DỜI DÒNG NÀY LÊN TRÊN CÙNG (Ngay dưới require thư viện)
dotenv.config(); 

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// SAU ĐÓ MỚI IMPORT ROUTES (Lúc này các file route mới có biến process.env để xài)
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
connectDB();

const app = express();

// Middleware cơ bản
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// Khai báo các API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/payment", paymentRoutes);
// Middleware xử lý lỗi (Phải đặt dưới cùng của các Routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});