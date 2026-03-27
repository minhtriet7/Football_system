const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const router = express.Router();

// 1. Cấu hình Cloudinary lấy từ file .env của Backend
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// 2. Cấu hình Multer để đọc file từ Frontend gửi lên (lưu tạm vào RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. Viết API nhận file và up lên Cloudinary
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không tìm thấy file ảnh' });
    }

    // Chuyển đổi file từ Buffer (RAM) sang định dạng Base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Up lên Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "24hsports", // Tên thư mục trên Cloudinary
    });

    // Trả link ảnh về cho Frontend
    res.status(200).json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("Lỗi upload backend:", error);
    res.status(500).json({ message: 'Lỗi server khi upload ảnh' });
  }
});

module.exports = router;