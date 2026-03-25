const express = require('express');
const router = express.Router();
const { createReview, getFieldReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview); // Phải đăng nhập mới được đánh giá
router.get('/:fieldId', getFieldReviews); // Ai cũng xem được đánh giá

module.exports = router;