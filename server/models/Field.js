const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true }, // Thêm slug
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Dùng category thay cho type
    pricePerHour: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Field', fieldSchema);