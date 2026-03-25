const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Nó sẽ lấy MONGO_URI từ file .env bạn vừa tạo
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;