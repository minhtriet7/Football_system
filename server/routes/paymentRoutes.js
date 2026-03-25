const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayIpn } = require('../controllers/vnpayController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-vnpay-url', protect, createPaymentUrl);
router.get('/vnpay-ipn', vnpayIpn);

module.exports = router;