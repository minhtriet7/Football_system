const Booking = require('../models/Booking');
const User = require('../models/User');

// [GET] Lấy thống kê tổng quan (Chỉ Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Đếm tổng số lượng khách hàng
        const totalUsers = await User.countDocuments({ role: 'user' });

        // 2. Đếm tổng số đơn đặt sân
        const totalBookings = await Booking.countDocuments();

        // 3. Tính tổng doanh thu (Cộng dồn tất cả totalPrice của các đơn đặt sân)
        const bookings = await Booking.find();
        const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

        res.json({
            totalUsers,
            totalBookings,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};