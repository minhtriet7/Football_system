const Review = require('../models/Review');
const Booking = require('../models/Booking');

// [POST] Khách hàng thêm đánh giá
exports.createReview = async (req, res) => {
    try {
        const { fieldId, rating, comment } = req.body;

        const review = new Review({
            user: req.user._id, // req.user có được là nhờ hàm protect ở middleware
            field: fieldId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({ message: 'Cảm ơn bạn đã đánh giá!', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// [GET] Lấy tất cả đánh giá của 1 sân cụ thể
exports.getFieldReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ field: req.params.fieldId }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};