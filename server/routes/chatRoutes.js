const express = require('express');
const router = express.Router();

// 1. CHÚ Ý DÒNG NÀY: Nhớ có cặp ngoặc nhọn { handleChatbot } 
// và đường dẫn '../controllers/chatController' phải đúng.
const { handleChatbot } = require('../controllers/chatController');

router.post('/', handleChatbot);

// 2. CHÚ Ý DÒNG NÀY: Tuyệt đối không được thiếu dòng chữ này ở cuối file
module.exports = router;