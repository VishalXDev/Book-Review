require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existing = await User.findOne({ username: 'vishal dwivedy' });
    if (existing) {
      console.log('⚠️ Admin user already exists.');
      process.exit();
    }

    const adminUser = new User({
      username: 'vishal dwivedy',
      password: '123456789',
      isAdmin: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin user:', err.message);
    process.exit(1);
  }
};

createAdmin();
