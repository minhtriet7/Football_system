const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const Booking = require("../models/Booking");

// Hàm sắp xếp tham số (Bắt buộc của VNPAY)
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

// 1. TẠO LINK THANH TOÁN
exports.createPaymentUrl = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt sân!" });
    }

    process.env.TZ = "Asia/Ho_Chi_Minh";
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURNURL;
    let orderId = booking._id.toString();
    let amount = booking.totalPrice;

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan dat san:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

    res.status(200).json({ paymentUrl: vnpUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. XỬ LÝ IPN (VNPAY gọi ngầm về Backend để cập nhật DB)
exports.vnpayIpn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.VNP_HASHSECRET;
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      let orderId = vnp_Params["vnp_TxnRef"];
      let rspCode = vnp_Params["vnp_ResponseCode"];

      const booking = await Booking.findById(orderId);
      if (!booking)
        return res
          .status(200)
          .json({ RspCode: "01", Message: "Order not found" });
      if (booking.isPaid === true)
        return res
          .status(200)
          .json({ RspCode: "02", Message: "Order already confirmed" });

      if (rspCode === "00") {
        // Thanh toán thành công -> Cập nhật DB
        booking.isPaid = true;
        booking.paidAt = Date.now();
        booking.status = "confirmed";
        booking.paymentResult = {
          status: "success",
          vnp_TransactionNo: vnp_Params["vnp_TransactionNo"],
        };
        await booking.save();
        res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
      } else {
        res.status(200).json({ RspCode: "00", Message: "Payment failed" });
      }
    } else {
      res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
    }
  } catch (error) {
    res.status(200).json({ RspCode: "99", Message: "Unknown error" });
  }
};
