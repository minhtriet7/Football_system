const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
    const { name, phone, password } = req.body;
    const userExists = await User.findOne({ phone });
    if (userExists) return res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });

    const user = await User.create({ name, phone, password });
    res.status(201).json({ _id: user._id, name: user.name, phone: user.phone, role: user.role, token: generateToken(user._id) });
};

exports.login = async (req, res) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (user && (await user.matchPassword(password))) {
        res.json({ _id: user._id, name: user.name, phone: user.phone, role: user.role, token: generateToken(user._id) });
    } else {
        res.status(401).json({ message: 'Sai số điện thoại hoặc mật khẩu' });
    }
};