const express = require('express');
const User = require('../models/User');
const VisaType = require('../models/VisaType');
const Application = require('../models/Application');
const Appointment = require('../models/Appointment');
const { adminAuth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalApplications, pendingApplications, totalVisaTypes] = await Promise.all([
      User.countDocuments({ userType: { $ne: 'admin' } }),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      VisaType.countDocuments({ isActive: true })
    ]);

    const recentApplications = await Application.find()
      .populate('userId', 'firstName lastName email')
      .populate('visaType', 'country visaType')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      statistics: {
        totalUsers,
        totalApplications,
        pendingApplications,
        totalVisaTypes
      },
      recentApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, userType } = req.query;
    let query = { userType: { $ne: 'admin' } };

    if (userType) {
      query.userType = userType;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', [
  adminAuth,
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visas
router.get('/visa-types', adminAuth, async (req, res) => {
  try {
    const visaTypes = await VisaType.find()
      .populate('updatedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(visaTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create visa
router.post('/visa-types', [
  adminAuth,
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('visaType').trim().notEmpty().withMessage('Visa type is required'),
  body('category').isIn(['tourism', 'business', 'short-stay', 'long-stay']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const visaTypeData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const visaType = new VisaType(visaTypeData);
    await visaType.save();

    res.status(201).json({
      message: 'Visa type created successfully',
      visaType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update visa
router.put('/visa-types/:id', adminAuth, async (req, res) => {
  try {
    const visaType = await VisaType.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          ...req.body,
          updatedBy: req.user._id 
        }
      },
      { new: true, runValidators: true }
    );

    if (!visaType) {
      return res.status(404).json({ message: 'Visa type not found' });
    }

    res.json({
      message: 'Visa type updated successfully',
      visaType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments
router.get('/appointments', adminAuth, async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('applicationId', 'applicationNumber')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/appointments', [
  adminAuth,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('appointmentTime').notEmpty().withMessage('Time is required'),
  body('type').isIn(['consultation', 'document_review', 'interview', 'biometrics']).withMessage('Invalid appointment type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentData = {
      ...req.body,
      createdBy: req.user._id
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await appointment.populate('userId', 'firstName lastName email');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test accounts
router.post('/create-test-accounts', async (req, res) => {
  try {
    const results = {
      created: [],
      existing: [],
      errors: []
    };

    // Test accounts data
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
        username: 'admin',
        password: 'admin',
        userType: 'admin',
        isActive: true,
        phone: '+1234567892'
      }
    ];

    // Create each test account
    for (const accountData of testAccounts) {
      try {
        // Check if account already exists
        let existingUser;
        if (accountData.email) {
          existingUser = await User.findOne({ email: accountData.email });
        } else if (accountData.username) {
          existingUser = await User.findOne({ username: accountData.username });
        }

        if (existingUser) {
          results.existing.push({
            type: accountData.userType,
            identifier: accountData.email || accountData.username
          });
        } else {
          // Create new user
          const newUser = new User(accountData);
          await newUser.save();
          
          results.created.push({
            type: accountData.userType,
            identifier: accountData.email || accountData.username,
            name: `${accountData.firstName} ${accountData.lastName}`
          });
        }
      } catch (error) {
        results.errors.push({
          type: accountData.userType,
          identifier: accountData.email || accountData.username,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Test accounts setup completed',
      results,
      summary: {
        created: results.created.length,
        existing: results.existing.length,
        errors: results.errors.length
      },
      testAccounts: {
        nonSubscriber: 'testnonsubscribe@gmail.com / password123',
        subscriber: 'testsubscribe@gmail.com / password123',
        admin: 'admin / admin'
      }
    });

  } catch (error) {
    console.error('Error creating test accounts:', error);
    res.status(500).json({ 
      message: 'Server error while creating test accounts',
      error: error.message 
    });
  }
});

module.exports = router;