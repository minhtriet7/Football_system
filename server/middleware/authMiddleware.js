const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select("-password");

      // THÊM DÒNG NÀY ĐỂ FIX LỖI CRASH KHI USER BỊ XÓA NHƯNG VẪN CÒN TOKEN
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Tài khoản không tồn tại hoặc đã bị xóa. Vui lòng đăng nhập lại!" });
      }

      return next(); 
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" }); 
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có quyền truy cập, vui lòng đăng nhập" }); 
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); 
  } else {
    return res
      .status(403)
      .json({ message: "Từ chối truy cập! Yêu cầu quyền Admin." }); 
  }
};

module.exports = { protect, admin };