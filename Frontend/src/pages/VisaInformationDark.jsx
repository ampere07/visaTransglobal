import React, { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  FileText, 
  Download, 
  Lock, 
  X,
  User,
  Building,
  Briefcase,
  GraduationCap,
  Plane,
  Heart
} from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

const VisaInformationDark = ({ searchData }) => {
  const [activeTab, setActiveTab] = useState('tourist')
  const [requirements, setRequirements] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showRequirementsMobile, setShowRequirementsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // You'll get this from your auth context
  const [isSubscriber, setIsSubscriber] = useState(false) // You'll get this from your user context

  const categories = [
    { id: 'tourist', name: 'Tourist', icon: User },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'work', name: 'Work', icon: Briefcase },
    { id: 'student', name: 'Student', icon: GraduationCap },
    { id: 'transit', name: 'Transit', icon: Plane },
    { id: 'family', name: 'Family', icon: Heart },
  ]

  // Mock visa data - replace with your actual data
  const visaTypes = [
    {
      _id: '1',
      visaType: 'Tourist Visa (Single Entry)',
      category: 'tourist',
      country: 'Japan',
    },
    {
      _id: '2', 
      visaType: 'Tourist Visa (Multiple Entry)',
      category: 'tourist',
      country: 'Japan',
    },
    {
      _id: '3',
      visaType: 'Business Visa',
      category: 'business', 
      country: 'Japan',
    },
    {
      _id: '4',
      visaType: 'Student Visa',
      category: 'student',
      country: 'Japan',
    },
  ]

  const getVisasByCategory = (category) => {
    return visaTypes.filter(visa => visa.category === category)
  }

  const fetchRequirements = async (visaId) => {
    setLoading(true)
    // Mock API call - replace with your actual API
    setTimeout(() => {
      const mockRequirements = {
        visaType: 'Tourist Visa (Single Entry)',
        country: 'Japan',
        category: 'tourist',
        isSubscriber: isSubscriber,
        requirements: isSubscriber ? {
          detailedRequirements: [
            {
              title: 'Valid Passport',
              description: 'Passport must be valid for at least 6 months from date of entry',
              mandatory: true
            },
            {
              title: 'Completed Application Form',
              description: 'Fill out the official visa application form completely',
              mandatory: true
            },
            {
              title: 'Passport Photos',
              description: '2 recent passport-sized photos (2x2 inches)',
              mandatory: true
            },
            {
              title: 'Flight Itinerary',
              description: 'Round-trip flight booking confirmation',
              mandatory: false
            },
          ],
          processingTime: '5-7 business days',
          fees: {
            totalFee: 3500
          },
          pdfFiles: [
            {
              filename: 'japan-tourist-requirements.pdf',
              originalName: 'Japan Tourist Visa Requirements'
            },
            {
              filename: 'application-form.pdf',
              originalName: 'Visa Application Form'
            }
          ]
        } : [
          'Valid passport',
          'Application form',
          'Passport photos',
          'Additional documents may be required'
        ],
        upgradeMessage: 'Get detailed requirements, processing times, fees, and downloadable forms with our premium subscription.'
      }
      setRequirements(mockRequirements)
      setShowRequirementsMobile(true)
      setLoading(false)
    }, 1000)
  }

  const isDownloadEnabled = () => {
    return isAuthenticated && isSubscriber
  }

  const getDownloadButtonStyle = () => {
    if (isDownloadEnabled()) {
      return 'text-visa-orange-400 hover:text-visa-orange-300 hover:bg-visa-dark-600 px-2 py-1 rounded cursor-pointer'
    }
    return 'text-gray-400 cursor-not-allowed bg-visa-dark-600 px-2 py-1 rounded'
  }

  const handleDownloadClick = (filename, displayName) => {
    if (!isDownloadEnabled()) {
      alert('Please login and upgrade to premium to download files.')
      return
    }
    // Handle actual download logic here
    console.log(`Downloading ${filename}`)
  }

  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-visa-dark-500">
      {/* Header */}
      <section className="bg-visa-dark-600 border-b border-visa-dark-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Visa Information & Requirements
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Complete visa requirements and application details for your destination
            </p>
            
            {searchData && (
              <div className="mt-4 sm:mt-6 flex justify-center">
                <div className="bg-visa-dark-400 border border-visa-dark-300 rounded-lg px-4 py-3 max-w-full">
                  <p className="text-sm sm:text-base text-white break-words">
                    <span className="font-medium">Destination:</span> {searchData.destination}
                    <span className="block sm:inline sm:ml-2">
                      <span className="font-medium">Purpose:</span> {searchData.purpose}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Requirements Toggle */}
        {requirements && (
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowRequirementsMobile(!showRequirementsMobile)}
              className="w-full bg-visa-dark-600 border border-visa-dark-400 rounded-lg p-4 flex items-center justify-between hover:bg-visa-dark-700 transition-colors"
            >
              <span className="font-medium text-white">
                {showRequirementsMobile ? 'Hide' : 'Show'} Requirements
              </span>
              <ChevronDown className={`w-5 h-5 text-white transform transition-transform duration-200 ${
                showRequirementsMobile ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Visa Types List */}
          <div className={`lg:col-span-2 ${showRequirementsMobile && requirements ? 'hidden lg:block' : ''}`}>
            {/* Category Tabs */}
            <div className="bg-visa-dark-600 rounded-lg shadow-sm border border-visa-dark-400 mb-6">
              {/* Desktop Tabs */}
              <div className="hidden sm:block border-b border-visa-dark-400">
                <nav className="flex flex-wrap px-4 sm:px-6" aria-label="Tabs">
                  {categories.map((category) => {
                    const Icon = category.icon
                    const count = getVisasByCategory(category.id).length
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`flex items-center space-x-2 py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
                          activeTab === category.id
                            ? 'border-visa-orange-400 text-visa-orange-400'
                            : 'border-transparent text-gray-300 hover:text-white hover:border-visa-dark-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="whitespace-nowrap">{category.name}</span>
                        {count > 0 && (
                          <span className="bg-visa-dark-400 text-gray-200 py-0.5 px-2 rounded-full text-xs">
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Mobile Dropdown */}
              <div className="sm:hidden border-b border-visa-dark-400">
                <div className="relative">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-visa-dark-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const activeCategory = categories.find(cat => cat.id === activeTab)
                        const Icon = activeCategory?.icon
                        return (
                          <>
                            <Icon className="w-4 h-4 text-visa-orange-400" />
                            <span className="font-medium text-white">
                              {activeCategory?.name}
                            </span>
                          </>
                        )
                      })()}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-white transform transition-transform duration-200 ${
                      isMobileMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-visa-dark-600 border-t border-visa-dark-400 z-10 rounded-b-lg">
                      {categories.map((category) => {
                        const Icon = category.icon
                        const count = getVisasByCategory(category.id).length
                        return (
                          <button
                            key={category.id}
                            onClick={() => {
                              setActiveTab(category.id)
                              setIsMobileMenuOpen(false)
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-visa-dark-700 transition-colors ${
                              activeTab === category.id ? 'bg-visa-dark-400 text-visa-orange-400' : 'text-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{category.name}</span>
                            </div>
                            {count > 0 && (
                              <span className="bg-visa-dark-400 text-gray-200 py-0.5 px-2 rounded-full text-xs">
                                {count}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Visa Types for Active Category */}
              <div className="p-4 sm:p-6">
                {loading ? (
                  <LoadingSpinner size="md" text="Loading visa types..." />
                ) : (
                  <div className="space-y-4">
                    {getVisasByCategory(activeTab).map((visa) => (
                      <div
                        key={visa._id}
                        className="border border-visa-dark-400 bg-visa-dark-600 rounded-lg p-4 hover:border-visa-orange-400 hover:bg-visa-dark-700 transition-all duration-200 cursor-pointer"
                        onClick={() => fetchRequirements(visa._id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              {visa.visaType}
                            </h3>
                            <p className="text-sm text-gray-300 capitalize">
                              {visa.category.replace('-', ' ')} • {visa.country}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-sm text-gray-400 text-right">
                              Click to view requirements
                            </div>
                            {!isAuthenticated && (
                              <div className="flex items-center justify-end text-xs text-amber-400 mt-1">
                                <Lock className="w-3 h-3 mr-1" />
                                Login required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {getVisasByCategory(activeTab).length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          No visa types available for {activeTab.replace('-', ' ')} category
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requirements Panel */}
          <div className={`lg:col-span-1 ${
            !showRequirementsMobile && requirements ? 'hidden lg:block' : ''
          }`}>
            <div className="bg-visa-dark-600 rounded-lg shadow-sm border border-visa-dark-400 lg:sticky lg:top-24">
              {requirements ? (
                <div className="p-4 sm:p-6">
                  {/* Mobile Close Button */}
                  <div className="lg:hidden flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Requirements
                    </h3>  
                    <button
                      onClick={() => setShowRequirementsMobile(false)}
                      className="p-1 hover:bg-visa-dark-700 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-300" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4 hidden lg:flex">
                    <h3 className="text-lg font-semibold text-white">
                      Requirements
                    </h3>
                    <button 
                      onClick={() => handleDownloadClick('requirements.pdf', 'Requirements PDF')}
                      className={`text-sm flex items-center transition-all duration-200 ${
                        isDownloadEnabled()
                          ? 'text-visa-orange-400 hover:text-visa-orange-300 hover:bg-visa-dark-700 px-2 py-1 rounded cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed bg-visa-dark-700 px-2 py-1 rounded'
                      }`}
                      disabled={!isDownloadEnabled()}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download PDF
                      {!isDownloadEnabled() && (
                        <Lock className="w-3 h-3 ml-1" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2 text-sm sm:text-base">
                        {requirements.visaType}
                      </h4>
                      <p className="text-sm text-gray-300 mb-4">
                        {requirements.country} • {requirements.category.replace('-', ' ')}
                      </p>
                    </div>

                    {/* User Type Indicator */}
                    <div className={`p-3 rounded-lg ${
                      requirements.isSubscriber 
                        ? 'bg-green-900 border border-green-700' 
                        : 'bg-amber-900 border border-amber-700'
                    }`}>
                      <p className={`text-sm ${
                        requirements.isSubscriber ? 'text-green-200' : 'text-amber-200'
                      }`}>
                        {requirements.isSubscriber 
                          ? '✓ Premium Access - Full Details Available'
                          : '⚠️ Basic Access - Limited Information'
                        }
                      </p>
                    </div>

                    {/* Requirements List */}
                    <div>
                      <h5 className="font-medium text-white mb-3 text-sm sm:text-base">
                        Required Documents:
                      </h5>
                      <ul className="space-y-2 sm:space-y-3">
                        {requirements.isSubscriber ? (
                          requirements.requirements.detailedRequirements?.map((req, index) => (
                            <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                req.mandatory ? 'bg-red-400' : 'bg-gray-400'
                              }`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {req.title}
                                </p>
                                <p className="text-xs text-gray-300 mt-1">
                                  {req.description}
                                </p>
                              </div>
                            </li>
                          ))
                        ) : (
                          requirements.requirements?.map((req, index) => (
                            <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-sm text-gray-300 flex-1">{req}</p>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* PDF Files Section */}
                    {requirements.isSubscriber && requirements.requirements.pdfFiles && requirements.requirements.pdfFiles.length > 0 && (
                      <div className="pt-4 border-t border-visa-dark-400">
                        <h6 className="font-medium text-white mb-3 text-sm">
                          Downloadable Documents:
                        </h6>
                        <div className="space-y-2">
                          {requirements.requirements.pdfFiles.map((pdf, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-visa-dark-700 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-red-400" />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {pdf.originalName || pdf.filename}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    PDF Document
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownloadClick(pdf.filename, pdf.originalName || 'PDF Document')}
                                className={`text-xs flex items-center px-2 py-1 rounded transition-all duration-200 ${
                                  isDownloadEnabled()
                                    ? 'text-visa-orange-400 hover:text-visa-orange-300 hover:bg-visa-dark-600 cursor-pointer'
                                    : 'text-gray-400 cursor-not-allowed bg-visa-dark-800'
                                }`}
                                disabled={!isDownloadEnabled()}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {isDownloadEnabled() ? 'Download' : 'Locked'}
                                {!isDownloadEnabled() && (
                                  <Lock className="w-3 h-3 ml-1" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subscriber Features */}
                    {requirements.isSubscriber && requirements.requirements.processingTime && (
                      <div className="space-y-3 pt-4 border-t border-visa-dark-400">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Processing Time:</span>
                          <span className="font-medium text-white text-right">
                            {requirements.requirements.processingTime}
                          </span>
                        </div>
                        {requirements.requirements.fees && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Total Fee:</span>
                            <span className="font-medium text-white">
                              {formatCurrency(requirements.requirements.fees.totalFee)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Download PDF Button for Mobile */}
                    <button 
                      onClick={() => handleDownloadClick('requirements.pdf', 'Requirements PDF')}
                      className={`lg:hidden w-full text-sm flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                        isDownloadEnabled()
                          ? 'bg-visa-dark-700 text-visa-orange-400 hover:bg-visa-dark-800 border border-visa-dark-400'
                          : 'bg-visa-dark-800 text-gray-400 cursor-not-allowed border border-visa-dark-700'
                      }`}
                      disabled={!isDownloadEnabled()}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                      {!isDownloadEnabled() && (
                        <Lock className="w-3 h-3 ml-1" />
                      )}
                    </button>

                    {/* Upgrade Message */}
                    {!requirements.isSubscriber && (
                      <div className="bg-visa-orange-900 border border-visa-orange-700 rounded-lg p-4 mt-4">
                        <h6 className="font-medium text-visa-orange-200 mb-2">
                          Upgrade for Full Access
                        </h6>
                        <p className="text-sm text-visa-orange-300 mb-3">
                          {requirements.upgradeMessage}
                        </p>
                        <button className="w-full bg-visa-orange-500 hover:bg-visa-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                          Upgrade to Premium
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">
                    Select a visa type to view requirements
                  </p>
                  <p className="text-xs text-gray-400">
                    {!isAuthenticated && 'Login required to access detailed requirements'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisaInformationDark
