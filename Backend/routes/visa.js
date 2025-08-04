const express = require('express');
const VisaType = require('../models/VisaType');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await VisaType.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$country', countryCode: { $first: '$countryCode' } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(countries.map(c => ({ country: c._id, countryCode: c.countryCode })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visa types for a country
router.get('/types/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const visaTypes = await VisaType.find({ 
      country: new RegExp(country, 'i'), 
      isActive: true 
    }).select('visaType category');

    res.json(visaTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visa requirements (filtered by user type)
router.get('/requirements/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const visaType = await VisaType.findById(id);

    if (!visaType || !visaType.isActive) {
      return res.status(404).json({ message: 'Visa type not found' });
    }

    let requirements;
    if (req.user.userType === 'non-subscriber') {
      // Return placeholder requirements for non-subscribers
      requirements = {
        country: visaType.country,
        visaType: visaType.visaType,
        category: visaType.category,
        requirements: visaType.requirements.nonSubscriber.length > 0 
          ? visaType.requirements.nonSubscriber 
          : [
            'Valid passport (minimum 6 months validity)',
            'Completed application form',
            'Recent passport photos',
            'Proof of travel arrangements',
            'Financial documentation',
            'Additional requirements may apply - upgrade to view details'
          ],
        isSubscriber: false,
        upgradeMessage: 'Upgrade to subscriber to access detailed requirements, processing times, and downloadable PDFs'
      };
    } else {
      // Return full requirements for subscribers and admins
      requirements = {
        country: visaType.country,
        visaType: visaType.visaType,
        category: visaType.category,
        requirements: visaType.requirements.subscriber,
        isSubscriber: true
      };
    }

    res.json(requirements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search visa types
router.get('/search', async (req, res) => {
  try {
    const { country, destination, purpose } = req.query;
    let query = { isActive: true };

    if (country) {
      query.country = new RegExp(country, 'i');
    }
    if (purpose) {
      query.category = purpose;
    }

    const visaTypes = await VisaType.find(query)
      .select('country visaType category requirements.subscriber.fees requirements.subscriber.processingTime')
      .limit(20);

    res.json(visaTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visa matrix (comprehensive view for subscribers)
router.get('/matrix', auth, async (req, res) => {
  try {
    if (req.user.userType === 'non-subscriber') {
      return res.status(403).json({ message: 'Subscriber access required' });
    }

    const visaMatrix = await VisaType.find({ isActive: true })
      .select('country visaType category requirements.subscriber')
      .sort({ country: 1, category: 1 });

    res.json(visaMatrix);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;