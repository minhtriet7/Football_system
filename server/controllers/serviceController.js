const Service = require('../models/Service');

// Public: Xem menu
exports.getServices = async (req, res) => {
    // SỬA CHỖ NÀY: inStock -> isAvailable
    const services = await Service.find({ isAvailable: true });
    res.json(services);
};

// Admin: Thêm món mới
exports.createService = async (req, res) => {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
};