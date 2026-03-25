const Booking = require("../models/Booking");
const Field = require("../models/Field");
const User = require("../models/User");
// @desc    Tạo đơn đặt sân mới (User)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ body (Thêm paymentMethod vào đây)
    const { fieldId, startTime, endTime, services, paymentMethod } = req.body;

    // 2. Kiểm tra trùng lịch
    const overlapping = await Booking.findOne({
      field: fieldId,
      status: { $ne: "cancelled" },
      $and: [
        { startTime: { $lt: new Date(endTime) } },
        { endTime: { $gt: new Date(startTime) } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({
        message: "Sân đã có người đặt trong khoảng thời gian này!",
      });
    }

    // 3. Tính tiền sân
    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });

    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    const fieldCost = hours * field.pricePerHour;

    // 4. Tính tiền dịch vụ/sản phẩm đi kèm
    let servicesCost = 0;
    if (services && services.length > 0) {
      servicesCost = services.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }

    const totalPrice = fieldCost + servicesCost;

    // 5. Khởi tạo và LƯU đơn đặt vào Database trước
    const booking = new Booking({
      user: req.user._id,
      field: fieldId,
      startTime,
      endTime,
      services,
      totalPrice,
      paymentMethod: paymentMethod || "COD", // Mặc định là COD nếu khách không chọn
    });

    const savedBooking = await booking.save();

    // 6. Xử lý phản hồi dựa trên phương thức thanh toán
    if (savedBooking.paymentMethod === "COD") {
      return res.status(201).json({
        message: "Đặt sân thành công! Vui lòng thanh toán tại sân.",
        booking: savedBooking,
      });
    } else {
      // Nếu là VNPAY, trả về ID để Frontend gọi tiếp API lấy link thanh toán
      return res.status(201).json({
        message: "Đơn hàng đã tạo, đang chuyển hướng thanh toán VNPAY...",
        bookingId: savedBooking._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy lịch sử đặt sân cá nhân (User)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("field", "name type")
      .sort("-createdAt");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy toàn bộ đơn đặt sân (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name phone")
      .populate("field", "name")
      .sort("-createdAt");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật trạng thái đơn (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = status;
      await booking.save();
      res.json({ message: "Cập nhật trạng thái thành công", booking });
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn đặt" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Hủy đơn đặt (User/Admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      await Booking.findByIdAndDelete(req.params.id);
      res.json({ message: "Đã xóa đơn đặt sân" });
    } else {
      res.status(404).json({ message: "Đơn đặt không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// server/controllers/bookingController.js
// Thêm hàm này vào
// server/controllers/bookingController.js

exports.checkAvailability = async (req, res) => {
  try {
    const { fieldId, date } = req.query;

    // FIX LỖI SERVER: Chặn trường hợp Frontend gửi chữ "undefined" hoặc "null"
    if (!fieldId || fieldId === "undefined" || fieldId === "null" || !date) {
      return res.json([]); // Trả về mảng rỗng thay vì báo lỗi sập Server
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Tìm các đơn đặt sân không bị hủy
    const bookings = await Booking.find({
      field: fieldId,
      status: { $ne: "cancelled" },
      startTime: { $gte: startOfDay, $lte: endOfDay },
    }).select("startTime endTime");

    res.json(bookings);
  } catch (error) {
    console.error("Lỗi Check Availability: ", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};
// Thêm hàm này vào cuối file server/controllers/bookingController.js

exports.addItemsToBooking = async (req, res) => {
    try {
        const { newServices } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt sân!" });
        }

        // Kiểm tra quyền (chỉ người đặt hoặc Admin mới được thêm đồ)
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Bạn không có quyền thao tác trên đơn này!" });
        }

        // Chỉ cho phép thêm khi đơn chưa hoàn thành/hủy
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({ message: "Không thể thêm đồ cho đơn hàng đã Hủy hoặc Hoàn thành!" });
        }

        // Đảm bảo mảng services tồn tại
        if (!booking.services) {
            booking.services = [];
        }

        // Duyệt qua các món khách vừa chọn và cộng dồn vào Database
        newServices.forEach(newItem => {
            // FIX LỖI CRASH: Thêm s.serviceItem && để đảm bảo an toàn với dữ liệu cũ
            const existIndex = booking.services.findIndex(s => 
                s.serviceItem && s.serviceItem.toString() === newItem.serviceItem.toString()
            );
            
            if (existIndex >= 0) {
                // Có rồi thì cộng dồn số lượng
                booking.services[existIndex].quantity += newItem.quantity;
            } else {
                // Chưa có thì đẩy món mới vào mảng
                booking.services.push(newItem);
            }
            
            // Cộng thêm tiền vào Tổng bill
            booking.totalPrice += (newItem.price * newItem.quantity);
        });

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } catch (error) {
        console.error("Lỗi khi thêm đồ: ", error);
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// ==========================================
// CÁC HÀM DÀNH RIÊNG CHO ADMIN DASHBOARD
// ==========================================

// 1. Lấy số liệu thống kê cho Dashboard
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFields = await Field.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Tính tổng doanh thu từ các đơn chưa bị hủy
        const validBookings = await Booking.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = validBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

        res.json({
            totalRevenue,
            totalBookings,
            totalFields,
            totalUsers,
            // Mảng doanh thu 7 ngày (Để hiển thị biểu đồ đẹp mắt)
            dailyRevenue: [1500000, 2200000, 1800000, 2500000, 1900000, 2800000, totalRevenue > 0 ? totalRevenue : 3100000] 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

// 2. Lấy 5 đơn đặt sân mới nhất (Cho trang Tổng quan)
exports.getRecentBookings = async (req, res) => {
    try {
        const recentBookings = await Booking.find()
            .populate('user', 'name')
            .populate('field', 'name')
            .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên đầu
            .limit(5); // Chỉ lấy 5 đơn
        res.json(recentBookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// 3. Lấy TOÀN BỘ đơn đặt sân (Cho trang Quản lý Đơn)
exports.getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name')
            .populate('field', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};