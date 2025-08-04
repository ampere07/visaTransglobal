import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign, FileText, Download, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { visaAPI } from '../utils/api'
import { formatCurrency } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import LoginModal from '../components/auth/LoginModal'

const VisaInformation = () => {
  const [searchData, setSearchData] = useState(null)
  const [visaTypes, setVisaTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState(null)
  const [requirements, setRequirements] = useState(null)
  const [activeTab, setActiveTab] = useState('tourism')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  
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
    } catch (error) {
      console.error('Error fetching requirements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVisasByCategory = (category) => {
    return visaTypes.filter(visa => visa.category === category)
  }

  const categories = [
    { id: 'tourism', name: 'Tourism', icon: MapPin },
    { id: 'business', name: 'Business', icon: FileText },
    { id: 'short-stay', name: 'Short Stay', icon: Clock },
    { id: 'long-stay', name: 'Long Stay', icon: DollarSign }
  ]

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visa Information & Requirements
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete visa requirements and application details for your destination
              </p>
              
              {searchData && (
                <div className="mt-6 flex justify-center">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg px-6 py-3">
                    <p className="text-primary-800">
                      <span className="font-medium">Destination:</span> {searchData.destination} • 
                      <span className="font-medium ml-2">Purpose:</span> {searchData.purpose}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visa Types List */}
            <div className="lg:col-span-2">
              {/* Category Tabs */}
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="border-b">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {categories.map((category) => {
                      const Icon = category.icon
                      const count = getVisasByCategory(category.id).length
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveTab(category.id)}
                          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                            activeTab === category.id
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
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

                {/* Visa Types for Active Category */}
                <div className="p-6">
                  {loading ? (
                    <LoadingSpinner size="md" text="Loading visa types..." />
                  ) : (
                    <div className="space-y-4">
                      {getVisasByCategory(activeTab).map((visa) => (
                        <div
                          key={visa._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                          onClick={() => fetchRequirements(visa._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {visa.visaType}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                {visa.category.replace('-', ' ')} • {visa.country}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                Click to view requirements
                              </div>
                              {!isAuthenticated && (
                                <div className="flex items-center text-xs text-amber-600 mt-1">
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border sticky top-24">
                {requirements ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Requirements
                      </h3>
                      {user?.userType === 'subscriber' && (
                        <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Download PDF
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {requirements.visaType}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {requirements.country} • {requirements.category.replace('-', ' ')}
                        </p>
                      </div>

                      {/* User Type Indicator */}
                      <div className={`p-3 rounded-lg ${
                        requirements.isSubscriber 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className={`text-sm ${
                          requirements.isSubscriber ? 'text-green-800' : 'text-amber-800'
                        }`}>
                          {requirements.isSubscriber 
                            ? '✓ Premium Access - Full Details Available'
                            : '⚠️ Basic Access - Limited Information'
                          }
                        </p>
                      </div>

                      {/* Requirements List */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          Required Documents:
                        </h5>
                        <ul className="space-y-2">
                          {requirements.isSubscriber ? (
                            requirements.requirements.detailedRequirements?.map((req, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  req.mandatory ? 'bg-red-500' : 'bg-gray-400'
                                }`} />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {req.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {req.description}
                                  </p>
                                </div>
                              </li>
                            ))
                          ) : (
                            requirements.requirements?.map((req, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-sm text-gray-700">{req}</p>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      {/* Subscriber Features */}
                      {requirements.isSubscriber && requirements.requirements.processingTime && (
                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Processing Time:</span>
                            <span className="font-medium text-gray-900">
                              {requirements.requirements.processingTime}
                            </span>
                          </div>
                          {requirements.requirements.fees && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Fee:</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(requirements.requirements.fees.totalFee)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upgrade Message */}
                      {!requirements.isSubscriber && (
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
                          <h6 className="font-medium text-primary-900 mb-2">
                            Upgrade for Full Access
                          </h6>
                          <p className="text-sm text-primary-700 mb-3">
                            {requirements.upgradeMessage}
                          </p>
                          <button className="btn-primary text-sm w-full">
                            Upgrade to Premium
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
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
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {}}
      />
    </>
  )
}

export default VisaInformation