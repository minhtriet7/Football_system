const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isAvailable: { type: Boolean, default: true },
    imageUrl: [{ 
        type: String 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);