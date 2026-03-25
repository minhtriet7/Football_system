const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

// 1. IMPORT ĐẦY ĐỦ CÁC HÀM TỪ CONTROLLER
const {
  createBooking,
  getMyBookings,
  checkAvailability,
  addItemsToBooking,
  getAdminStats, // <-- Đã bổ sung
  getRecentBookings, // <-- Đã bổ sung
  getAllBookingsAdmin, // <-- Đã bổ sung
  updateBookingStatus, // <-- Đã bổ sung
} = require("../controllers/bookingController");

// ==========================================
// 1. PUBLIC ROUTES (Không cần đăng nhập)
// ==========================================
router.get("/check-availability", checkAvailability);

// ==========================================
// 2. ADMIN ROUTES (Phải bọc thép 2 lớp)
// Lưu ý: Route Admin LUÔN PHẢI ĐẶT TRƯỚC các route chứa /:id
// ==========================================
router.get("/admin/stats", protect, admin, getAdminStats);
router.get("/admin/recent", protect, admin, getRecentBookings);
router.get("/admin", protect, admin, getAllBookingsAdmin);
router.put("/admin/:id/status", protect, admin, updateBookingStatus);

// ==========================================
// 3. USER ROUTES (Chỉ cần đăng nhập)
// ==========================================
router.post("/", protect, createBooking);
router.get("/mybookings", protect, getMyBookings);
router.put("/:id/add-items", protect, addItemsToBooking);

module.exports = router;
