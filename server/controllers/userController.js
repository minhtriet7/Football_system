const User = require('../models/User');

// [GET] Xem hồ sơ cá nhân (Dành cho User đã đăng nhập)
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({ _id: user._id, name: user.name, phone: user.phone, role: user.role });
    } else {
        res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
};

// [GET] Lấy tất cả người dùng (Chỉ Admin)
exports.getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// [DELETE] Xóa người dùng (Chỉ Admin)
exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: "Đã xóa người dùng thành công" });
    } else {
        res.status(404).json({ message: "Người dùng không tồn tại" });
    }
};