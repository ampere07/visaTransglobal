const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  visaType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisaType',
    required: true
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    nationality: String,
    passportNumber: String,
    passportExpiry: Date,
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  travelInfo: {
    destinationCountry: String,
    purposeOfVisit: String,
    plannedEntryDate: Date,
    plannedExitDate: Date,
    durationOfStay: Number,
    previousVisits: Boolean,
    previousVisitDetails: String
  },
  documents: [{
    documentType: String,
    fileName: String,
    filePath: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  shippingInfo: {
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    cost: {
      type: Number,
      default: 0
    }
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: String,
    transactionId: String,
    paymentDate: Date
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate application number before saving
applicationSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const count = await mongoose.model('Application').countDocuments();
    this.applicationNumber = `VA${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);