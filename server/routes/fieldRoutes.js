const express = require("express");
const router = express.Router();
const {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} = require("../controllers/fieldController");

// <-- THÊM DÒNG NÀY: Import middleware xác thực -->
const { protect, admin } = require("../middleware/authMiddleware"); 

router.get("/", getFields);
router.get("/:id", getFieldById);

// <-- THÊM middleware vào 3 route dưới đây -->
router.post("/", protect, admin, createField);
router.put("/:id", protect, admin, updateField);
router.delete("/:id", protect, admin, deleteField);

module.exports = router;