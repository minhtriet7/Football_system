const moment = require('moment');
const crypto = require('crypto');
const Booking = require('../models/Booking');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.createPaymentUrl = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('field');

        // <-- THÊM ĐOẠN NÀY: Chống crash server nếu truyền sai ID -->
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân!' });
        }
        // <------------------------------------------------------->

        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let tmnCode = process.env.VNP_TMNCODE;
        let secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        let returnUrl = process.env.VNP_RETURNURL;

        let orderId = booking._id.toString();
        let amount = booking.totalPrice;
        let bankCode = ''; // Để trống để khách tự chọn ngân hàng
        
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan dat san:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100; // VNPAY tính theo đơn vị xu
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = '127.0.0.1';
        vnp_Params['vnp_CreateDate'] = createDate;

        vnp_Params = sortObject(vnp_Params);

        let signData = require('qs').stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + require('qs').stringify(vnp_Params, { encode: false });

        res.status(200).json({ paymentUrl: vnpUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xử lý sau khi thanh toán xong (VNPAY gọi về)
exports.vnpayIpn = async (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.VNP_HASHSECRET;
    let signData = require('qs').stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];

        if (rspCode === '00') {
            // Thanh toán thành công
            await Booking.findByIdAndUpdate(orderId, {
                isPaid: true,
                paidAt: Date.now(),
                status: 'confirmed',
                paymentResult: {
                    status: 'success',
                    vnp_TransactionNo: vnp_Params['vnp_TransactionNo']
                }
            });
            res.status(200).json({ RspCode: '00', Message: 'Success' });
        } else {
            res.status(200).json({ RspCode: '01', Message: 'Fail' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
};