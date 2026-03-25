const express = require('express');
const router = express.Router();
const { handleChatbot } = require('../controllers/chatController');

// Route này để public cho ai vào web cũng chat được, không cần đăng nhập (protect)
router.post('/', handleChatbot);

module.exports = router;