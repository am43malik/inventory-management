const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/inventory_shop';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'cashier'], default: 'cashier' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', userSchema);

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('User already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const user = new User({
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await user.save();
    console.log('✓ Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
