const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const visaRoutes = require('./routes/visa');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');

// Import models
const User = require('./models/User');

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'your-production-domain.com' : 'http://localhost:3000',
  credentials: true
}));

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Test accounts
const createTestAccounts = async () => {
  try {
    const testAccounts = [
      {
        firstName: 'Test',
        lastName: 'NonSubscriber',
        email: 'testnonsubscribe@gmail.com',
        password: 'password123',
        userType: 'non-subscriber',
        isActive: true,
        phone: '+1234567890',
        nationality: 'United States'
      },
      {
        firstName: 'Test',
        lastName: 'Subscriber',
        email: 'testsubscribe@gmail.com',
        password: 'password123',
        userType: 'subscriber',
        isActive: true,
        phone: '+1234567891',
        nationality: 'United States'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin@email.com',
        password: 'admin123',
        userType: 'admin',
        isActive: true,
        phone: '+1234567892'
      }
    ];

    for (const accountData of testAccounts) {
      let existingUser;
      if (accountData.email) {
        existingUser = await User.findOne({ email: accountData.email });
      } else if (accountData.username) {
        existingUser = await User.findOne({ username: accountData.username });
      }

      if (!existingUser) {
        const newUser = new User(accountData);
        await newUser.save();
      }
    }
  } catch (error) {
    console.error('Error creating test accounts:', error);
  }
};

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected successfully');
  await createTestAccounts();
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/visa', visaRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Visa Application System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});