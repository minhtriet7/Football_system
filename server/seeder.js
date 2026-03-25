const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Models
const User = require('./models/User');
const Field = require('./models/Field');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Service = require('./models/Service'); 
const Booking = require('./models/Booking');
const Review = require('./models/Review');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Xóa sạch dữ liệu cũ
    await Promise.all([
        User.deleteMany(),
        Field.deleteMany(),
        Category.deleteMany(),
        Product.deleteMany(),
        Service.deleteMany(),
        Booking.deleteMany(),
        Review.deleteMany()
    ]);

    console.log('⏳ 1. Đang nạp Users...');
    const users = require('./data/users.json');
    for (const u of users) { await User.create(u); }

    console.log('⏳ 2. Đang nạp Danh mục (Cha & Con)...');
    const categoriesData = require('./data/categories.json');
    // Nạp Cha trước
    const parents = categoriesData.filter(c => !c.parentName);
    const createdParents = await Category.insertMany(parents);
    // Nạp Con sau
    const children = categoriesData.filter(c => c.parentName);
    for (const child of children) {
        const parentDoc = createdParents.find(p => p.name === child.parentName);
        if (parentDoc) await Category.create({ ...child, parent: parentDoc._id });
    }
    const allCategories = await Category.find();

   console.log('⏳ 3. Đang nạp Sân bóng...');
    const fields = require('./data/fields.json');
    for (const f of fields) {
        // Tìm ID của danh mục "Sân 5 người" / "Sân 7 người" để gắn vào
        const cat = allCategories.find(c => c.name === f.categoryName);
        if (cat) f.category = cat._id;
        await Field.create(f);
    }

    console.log('⏳ 4. Đang nạp Sản phẩm & Dịch vụ...');
    const products = require('./data/products.json');
    const services = require('./data/services.json');

    // Nạp Product và nối ID Category
    for (const p of products) {
        const cat = allCategories.find(c => c.name === p.categoryName);
        if (cat) p.category = cat._id;
        await Product.create(p);
    }

    // Nạp Service và nối ID Category
    for (const s of services) {
        const cat = allCategories.find(c => c.name === s.categoryName);
        if (cat) s.category = cat._id;
        await Service.create(s);
    }

    console.log('✅ TOÀN BỘ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ!');
    process.exit();
  } catch (error) {
    console.error(`❌ Lỗi nạp dữ liệu: ${error.message}`);
    process.exit(1);
  }
};

importData();