const mongoose = require('mongoose');

const visaTypeSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true
  },
  visaType: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['tourism', 'business', 'short-stay', 'long-stay'],
    required: true
  },
  requirements: {
    nonSubscriber: [{
      type: String,
      default: []
    }],
    subscriber: {
      description: {
        type: String,
        default: ''
      },
      detailedRequirements: [{
        title: String,
        description: String,
        mandatory: {
          type: Boolean,
          default: true
        }
      }],
      pdfFiles: [{
        filename: String,
        originalName: String,
        filePath: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      }],
      processingTime: {
        type: String,
        default: ''
      },
      fees: {
        consulateFee: {
          type: Number,
          default: 0
        },
        serviceFee: {
          type: Number,
          default: 0
        },
        totalFee: {
          type: Number,
          default: 0
        }
      },
      validityPeriod: {
        type: String,
        default: ''
      },
      maxStayDuration: {
        type: String,
        default: ''
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
visaTypeSchema.index({ country: 1, visaType: 1, category: 1 });

module.exports = mongoose.model('VisaType', visaTypeSchema);