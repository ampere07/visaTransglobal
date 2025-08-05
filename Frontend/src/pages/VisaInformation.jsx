import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign, FileText, Download, Lock, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { visaAPI, uploadAPI } from '../utils/api'
import { formatCurrency } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import AuthModal from '../components/auth/AuthModal'
import SubscriptionModal from '../components/common/SubscriptionModal'
import toast from 'react-hot-toast'

const VisaInformation = () => {
  const [searchData, setSearchData] = useState(null)
  const [visaTypes, setVisaTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState(null)
  const [requirements, setRequirements] = useState(null)
  const [activeTab, setActiveTab] = useState('tourism')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showRequirementsMobile, setShowRequirementsMobile] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Get search data from session storage
    const savedSearchData = sessionStorage.getItem('visaSearchData')
    if (savedSearchData) {
      const data = JSON.parse(savedSearchData)
      setSearchData(data)
      fetchVisaTypes(data.destination)
    }
  }, [])

  const fetchVisaTypes = async (country) => {
    if (!country) return
    
    setLoading(true)
    try {
      const response = await visaAPI.getVisaTypes(country)
      setVisaTypes(response.data)
    } catch (error) {
      console.error('Error fetching visa types:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRequirements = async (visaId) => {
    if (!isAuthenticated) {
      setIsLoginOpen(true)
      return
    }

    setLoading(true)
    try {
      const response = await visaAPI.getRequirements(visaId)
      setRequirements(response.data)
      setSelectedVisa(visaId)
      setShowRequirementsMobile(true) // Show requirements panel on mobile
    } catch (error) {
      console.error('Error fetching requirements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVisasByCategory = (category) => {
    return visaTypes.filter(visa => visa.category === category)
  }

  const isDownloadEnabled = () => {
    return isAuthenticated && user?.userType === 'subscriber'
  }

  const getDownloadButtonStyle = () => {
    if (isDownloadEnabled()) {
      return 'text-primary-600 hover:text-primary-700 cursor-pointer'
    }
    return 'text-gray-400 cursor-not-allowed opacity-60'
  }

  const handleDownloadClick = async (filename, documentName = 'document') => {
    if (!isAuthenticated) {
      toast.error('Please login to download documents')
      setIsLoginOpen(true)
      return
    }

    if (user?.userType === 'non-subscriber') {
      toast(
        'Upgrade to Premium to download documents',
        {
          icon: '🔒',
          style: {
            borderRadius: '10px',
            background: '#f59e0b',
            color: '#fff',
          },
        }
      )
      setIsSubscriptionModalOpen(true)
      return
    }

    // Handle actual download for subscribers
    try {
      toast.loading('Preparing download...', { id: 'download' })
      const response = await uploadAPI.downloadFile(filename)
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success(`${documentName} downloaded successfully!`, { id: 'download' })
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.', { id: 'download' })
    }
  }

  const handleUpgrade = () => {
    // Handle upgrade logic - could navigate to pricing page or open payment modal
    console.log('Upgrade to premium clicked')
    setIsSubscriptionModalOpen(false)
    // navigate('/pricing') or open payment modal
  }

  const categories = [
    { id: 'tourism', name: 'Tourism', icon: MapPin },
    { id: 'business', name: 'Business', icon: FileText },
    { id: 'short-stay', name: 'Short Stay', icon: Clock },
    { id: 'long-stay', name: 'Long Stay', icon: DollarSign }
  ]

  return (
    <>
      <div className="min-h-screen bg-white">
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
                className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">
                  {showRequirementsMobile ? 'Hide' : 'Show'} Requirements
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                  showRequirementsMobile ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Visa Types List */}
            <div className={`lg:col-span-2 ${showRequirementsMobile && requirements ? 'hidden lg:block' : ''}`}>
              {/* Category Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                {/* Desktop Tabs */}
                <div className="hidden sm:block border-b border-gray-200">
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
                              ? 'border-visa-orange-400 text-visa-orange-500'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="whitespace-nowrap">{category.name}</span>
                          {count > 0 && (
                            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                              {count}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Mobile Dropdown */}
                <div className="sm:hidden border-b border-gray-200">
                  <div className="relative">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const activeCategory = categories.find(cat => cat.id === activeTab)
                          const Icon = activeCategory?.icon
                          return (
                            <>
                              <Icon className="w-4 h-4 text-visa-orange-500" />
                              <span className="font-medium text-gray-900">
                                {activeCategory?.name}
                              </span>
                            </>
                          )
                        })()}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                        isMobileMenuOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {isMobileMenuOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 z-10 rounded-b-lg shadow-lg">
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
                              className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                                activeTab === category.id ? 'bg-visa-orange-50 text-visa-orange-600' : 'text-gray-600'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span>{category.name}</span>
                              </div>
                              {count > 0 && (
                                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
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
                          className="border border-gray-200 rounded-lg p-4 hover:border-visa-orange-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                          onClick={() => fetchRequirements(visa._id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {visa.visaType}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {visa.category.replace('-', ' ')} • {visa.country}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="text-sm text-gray-500 text-right">
                                Click to view requirements
                              </div>
                              {!isAuthenticated && (
                                <div className="flex items-center justify-end text-xs text-amber-600 mt-1">
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
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-24">
              {requirements ? (
              <div className="p-4 sm:p-6">
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
              Requirements
              </h3>
              <button
              onClick={() => setShowRequirementsMobile(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
              <X className="w-5 h-5 text-gray-600" />
              </button>
              </div>

              <div className="flex items-center justify-between mb-4 hidden lg:flex">
              <h3 className="text-lg font-semibold text-gray-900">
              Requirements
              </h3>
              <button 
              onClick={() => handleDownloadClick('requirements.pdf', 'Requirements PDF')}
              className={`text-sm flex items-center transition-all duration-200 ${
                isDownloadEnabled()
                    ? 'text-visa-orange-500 hover:text-visa-orange-600 hover:bg-orange-50 px-2 py-1 rounded cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed bg-gray-100 px-2 py-1 rounded'
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

      {/* Login Modal */}
      <AuthModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {}}
      />

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  )
}

export default VisaInformation