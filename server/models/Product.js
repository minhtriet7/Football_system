const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    countInStock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);