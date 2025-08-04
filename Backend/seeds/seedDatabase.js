const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const VisaType = require('../models/VisaType');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await VisaType.deleteMany({});

    console.log('Cleared existing data');

    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin', 10);

    // Create test users
    const testUsers = [
      {
        firstName: 'Test',
        lastName: 'NonSubscriber',
        email: 'testnonsubscribe@gmail.com',
        password: hashedPassword,
        userType: 'non-subscriber',
        isActive: true
      },
      {
        firstName: 'Test',
        lastName: 'Subscriber',
        email: 'testsubscribe@gmail.com',
        password: hashedPassword,
        userType: 'subscriber',
        isActive: true
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@system.com',
        username: 'admin',
        password: hashedAdminPassword,
        userType: 'admin',
        isActive: true
      }
    ];

    await User.insertMany(testUsers);
    console.log('Created test users');

    // Create sample visa types
    const visaTypes = [
      {
        country: 'United States',
        countryCode: 'US',
        visaType: 'Tourist Visa (B-2)',
        category: 'tourism',
        requirements: {
          nonSubscriber: [
            'Valid passport (minimum 6 months validity)',
            'Completed DS-160 form',
            'Recent passport photos',
            'Proof of ties to home country',
            'Financial documentation',
            'Travel itinerary',
            'Upgrade to view detailed requirements and processing times'
          ],
          subscriber: {
            description: 'The B-2 tourist visa allows temporary visits to the United States for pleasure, tourism, or visiting family and friends.',
            detailedRequirements: [
              {
                title: 'Valid Passport',
                description: 'Passport must be valid for at least 6 months beyond the intended period of stay',
                mandatory: true
              },
              {
                title: 'DS-160 Form',
                description: 'Complete and submit the Online Nonimmigrant Visa Application (DS-160)',
                mandatory: true
              },
              {
                title: 'Passport Photos',
                description: '2x2 inch color photographs taken within the last 6 months',
                mandatory: true
              },
              {
                title: 'Proof of Ties',
                description: 'Evidence of strong ties to your home country (employment letter, property ownership, family ties)',
                mandatory: true
              },
              {
                title: 'Financial Evidence',
                description: 'Bank statements, pay stubs, or other proof of financial ability to support your trip',
                mandatory: true
              }
            ],
            processingTime: '3-5 business days',
            fees: {
              consulateFee: 160,
              serviceFee: 50,
              totalFee: 210
            },
            validityPeriod: '10 years (multiple entry)',
            maxStayDuration: '6 months per visit'
          }
        },
        isActive: true
      },
      {
        country: 'United Kingdom',
        countryCode: 'GB',
        visaType: 'Standard Visitor Visa',
        category: 'tourism',
        requirements: {
          nonSubscriber: [
            'Valid passport',
            'Completed online application',
            'Biometric information',
            'Financial evidence',
            'Travel plans',
            'Upgrade for complete requirements'
          ],
          subscriber: {
            description: 'The Standard Visitor visa allows you to visit the UK for tourism, business, or to see family and friends.',
            detailedRequirements: [
              {
                title: 'Valid Passport',
                description: 'Your passport must be valid for the whole of your stay',
                mandatory: true
              },
              {
                title: 'Online Application',
                description: 'Complete the online application form on the UK government website',
                mandatory: true
              },
              {
                title: 'Biometrics',
                description: 'Provide biometric information (fingerprints and photo) at a visa application center',
                mandatory: true
              }
            ],
            processingTime: '15-20 business days',
            fees: {
              consulateFee: 95,
              serviceFee: 40,
              totalFee: 135
            },
            validityPeriod: '6 months, 2 years, 5 years, or 10 years',
            maxStayDuration: '6 months per visit'
          }
        },
        isActive: true
      },
      {
        country: 'Germany',
        countryCode: 'DE',
        visaType: 'Schengen Visa',
        category: 'tourism',
        requirements: {
          nonSubscriber: [
            'Valid passport',
            'Application form',
            'Travel insurance',
            'Accommodation proof',
            'Financial means',
            'Upgrade for detailed requirements'
          ],
          subscriber: {
            description: 'The Schengen visa allows travel within the Schengen Area for tourism, business, or visiting purposes.',
            detailedRequirements: [
              {
                title: 'Valid Passport',
                description: 'Passport valid for at least 3 months beyond intended departure from Schengen area',
                mandatory: true
              },
              {
                title: 'Application Form',
                description: 'Completed and signed Schengen visa application form',
                mandatory: true
              },
              {
                title: 'Travel Insurance',
                description: 'Medical insurance coverage of at least €30,000 valid for entire Schengen area',
                mandatory: true
              }
            ],
            processingTime: '10-15 business days',
            fees: {
              consulateFee: 80,
              serviceFee: 35,
              totalFee: 115
            },
            validityPeriod: 'Up to 90 days within 180-day period',
            maxStayDuration: '90 days within 180-day period'
          }
        },
        isActive: true
      },
      {
        country: 'United States',
        countryCode: 'US',
        visaType: 'Business Visa (B-1)',
        category: 'business',
        requirements: {
          nonSubscriber: [
            'Valid passport',
            'Business invitation letter',
            'Company documents',
            'Financial proof',
            'Upgrade for complete business visa requirements'
          ],
          subscriber: {
            description: 'The B-1 business visa allows temporary visits to the United States for business purposes.',
            detailedRequirements: [
              {
                title: 'Business Invitation',
                description: 'Letter from US company detailing the purpose and duration of visit',
                mandatory: true
              },
              {
                title: 'Company Registration',
                description: 'Proof of company registration and business activities',
                mandatory: true
              }
            ],
            processingTime: '3-5 business days',
            fees: {
              consulateFee: 160,
              serviceFee: 50,
              totalFee: 210
            },
            validityPeriod: '10 years (multiple entry)',
            maxStayDuration: '6 months per visit'
          }
        },
        isActive: true
      }
    ];

    await VisaType.insertMany(visaTypes);
    console.log('Created sample visa types');

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('\nTest Accounts Created:');
    console.log('1. Non-Subscriber:');
    console.log('   Email: testnonsubscribe@gmail.com');
    console.log('   Password: password123');
    console.log('\n2. Subscriber:');
    console.log('   Email: testsubscribe@gmail.com');
    console.log('   Password: password123');
    console.log('\n3. Admin:');
    console.log('   Username: admin');
    console.log('   Password: admin');
    console.log('\nDatabase seeded with sample visa types for US, UK, and Germany');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();