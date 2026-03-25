const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    
    // Đổi tên thành "items" (hoặc giữ nguyên "services") chứa cả Nước uống và Dịch vụ
    services: [
        {
            // Trỏ ID đến Product hoặc Service
            item_id: { type: mongoose.Schema.Types.ObjectId }, 
            
            // THÊM: Lưu lại tên món (Quan trọng: Lỡ sau này xóa sản phẩm, bill cũ vẫn còn tên)
            name: { type: String, required: true }, 
            
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // Giá tại thời điểm mua
        }
    ],
    
    totalPrice: { type: Number, required: true }, 
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, enum: ['COD', 'VNPAY'], required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentResult: { 
        id: String, 
        status: String, 
        update_time: String, 
        vnp_TransactionNo: String 
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);