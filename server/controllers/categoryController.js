const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    const categories = await Category.find().populate('parent', 'name');
    res.json(categories);
};

exports.createCategory = async (req, res) => {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
};

exports.updateCategory = async (req, res) => {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa danh mục" });
};