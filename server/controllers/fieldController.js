const Field = require('../models/Field');

// [GET] Lấy danh sách tất cả các sân
exports.getFields = async (req, res) => {
    try {
        const fields = await Field.find();
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sân", error: error.message });
    }
};

// [GET] Lấy thông tin 1 sân cụ thể theo ID
exports.getFieldById = async (req, res) => {
    try {
        const field = await Field.findById(req.params.id);
        if (!field) return res.status(404).json({ message: "Không tìm thấy sân" });
        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin sân", error: error.message });
    }
};

// [POST] Thêm sân mới
exports.createField = async (req, res) => {
    try {
        const newField = new Field(req.body);
        await newField.save();
        res.status(201).json({ message: "Thêm sân thành công", field: newField });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo sân", error: error.message });
    }
};

// [PUT] Cập nhật thông tin sân (đổi giá, đổi tên...)
exports.updateField = async (req, res) => {
    try {
        const updatedField = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedField) return res.status(404).json({ message: "Không tìm thấy sân để cập nhật" });
        res.status(200).json({ message: "Cập nhật thành công", field: updatedField });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sân", error: error.message });
    }
};

// [DELETE] Xóa sân
exports.deleteField = async (req, res) => {
    try {
        const deletedField = await Field.findByIdAndDelete(req.params.id);
        if (!deletedField) return res.status(404).json({ message: "Không tìm thấy sân để xóa" });
        res.status(200).json({ message: "Xóa sân thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sân", error: error.message });
    }
};