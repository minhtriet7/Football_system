const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    // Trỏ đến ID của một Category khác (Category Cha)
    parent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        default: null 
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);