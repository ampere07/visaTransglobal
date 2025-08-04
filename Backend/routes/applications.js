const express = require('express');
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Submit new application
router.post('/', [
  auth,
  body('visaType').notEmpty().withMessage('Visa type is required'),
  body('personalInfo.firstName').trim().notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('personalInfo.passportNumber').trim().notEmpty().withMessage('Passport number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const applicationData = {
      userId: req.user._id,
      ...req.body
    };

    const application = new Application(applicationData);
    await application.save();

    // Add initial status to history
    application.statusHistory.push({
      status: 'submitted',
      date: new Date(),
      notes: 'Application submitted successfully',
      updatedBy: req.user._id
    });

    application.status = 'submitted';
    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationNumber: application.applicationNumber,
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applications
router.get('/user', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('visaType', 'country visaType category')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific application
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('visaType', 'country visaType category');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Add status to history
    application.statusHistory.push({
      status,
      date: new Date(),
      notes,
      updatedBy: req.user._id
    });

    application.status = status;
    await application.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;