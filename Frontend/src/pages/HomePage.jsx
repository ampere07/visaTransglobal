import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Globe, Clock, Shield, CheckCircle, ArrowRight, Users, Award, Zap } from 'lucide-react'
import { COUNTRIES, PURPOSE_OF_VISIT } from '../utils/constants'
import AuthModal from '../components/auth/AuthModal'

const HomePage = () => {
  const [formData, setFormData] = useState({
    passportCountry: '',
    destination: '',
    purpose: '',
    entryDate: '',
    exitDate: ''
  })
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const navigate = useNavigate()
  const location = useLocation()

  // Check if user was redirected here due to auth requirement
  useEffect(() => {
    if (location.state?.requireAuth) {
      setAuthMode('login')
      setIsAuthModalOpen(true)
    }
  }, [location.state])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Store form data and navigate to visa information page
    sessionStorage.setItem('visaSearchData', JSON.stringify(formData))
    navigate('/visa-information')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative gradient-bg hero-pattern text-white overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 via-transparent to-primary-800/20" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-6 sm:space-y-8 animate-fade-in text-center lg:text-left">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Your Visa Journey
                    <span className="block text-secondary-200 mt-1 sm:mt-2">Starts Here</span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
                    Expert visa services with guaranteed results for your international travel needs. Professional guidance every step of the way.
                  </p>
                </div>

                {/* Features - Mobile optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm max-w-md mx-auto lg:max-w-none lg:mx-0">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:bg-transparent sm:backdrop-blur-none sm:p-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-300 flex-shrink-0" />
                    <span className="text-center sm:text-left">Expert Guidance</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:bg-transparent sm:backdrop-blur-none sm:p-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-300 flex-shrink-0" />
                    <span className="text-center sm:text-left">Fast Processing</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:bg-transparent sm:backdrop-blur-none sm:p-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-300 flex-shrink-0" />
                    <span className="text-center sm:text-left">Secure Process</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:bg-transparent sm:backdrop-blur-none sm:p-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-300 flex-shrink-0" />
                    <span className="text-center sm:text-left">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Visa Search Form - Mobile optimized */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up mt-8 lg:mt-0">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center lg:text-left">
                    Get Your Visa Options
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base text-center lg:text-left">
                    Find the perfect visa solution for your travel needs.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Passport Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      My passport is from
                    </label>
                    <select
                      name="passportCountry"
                      value={formData.passportCountry}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      required
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am going to
                    </label>
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      required
                    >
                      <option value="">Select destination</option>
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      My purpose of trip
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="input-field text-base"
                      required
                    >
                      <option value="">Select purpose</option>
                      {PURPOSE_OF_VISIT.map(purpose => (
                        <option key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates - Mobile stacked */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entry Date
                      </label>
                      <input
                        type="date"
                        name="entryDate"
                        value={formData.entryDate}
                        onChange={handleInputChange}
                        className="input-field text-base"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exit Date
                      </label>
                      <input
                        type="date"
                        name="exitDate"
                        value={formData.exitDate}
                        onChange={handleInputChange}
                        className="input-field text-base"
                        min={formData.entryDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button - Mobile optimized */}
                  <button
                    type="submit"
                    className="w-full btn-secondary text-base sm:text-lg py-3 sm:py-4 flex items-center justify-center group rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Get Visa Options
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Floating Elements - Mobile optimized */}
          <div className="absolute top-16 left-4 sm:top-20 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-white/10 rounded-full float-animation" />
          <div className="absolute top-32 right-4 sm:top-40 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-secondary-400/20 rounded-full float-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-32 left-8 sm:bottom-20 sm:left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-white/10 rounded-full float-animation" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/2 right-2 sm:hidden w-6 h-6 bg-white/5 rounded-full float-animation" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-2 sm:hidden w-6 h-6 bg-secondary-400/10 rounded-full float-animation" style={{ animationDelay: '3s' }} />
        </section>

        {/* Features Section - Mobile optimized */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose VisaCentral?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="card text-center group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary-200 transition-colors duration-300 group-hover:scale-110">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Expert Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Professional guidance throughout your visa application process with dedicated support.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-secondary-200 transition-colors duration-300 group-hover:scale-110">
                  <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-secondary-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Fast Processing</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Quick and efficient visa processing with expedited options available for urgent travel.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Secure & Safe</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Your personal information and documents are protected with enterprise-grade security.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Round-the-clock customer support to assist you at every step of your journey.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-orange-200 transition-colors duration-300 group-hover:scale-110">
                  <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Global Coverage</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Comprehensive visa services for destinations worldwide with up-to-date requirements.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-indigo-200 transition-colors duration-300 group-hover:scale-110">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Proven Success</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  High success rate with thousands of approved visa applications and satisfied customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile optimized */}
        <section className="py-16 sm:py-20 gradient-bg text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Ready to Start Your Visa Application?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                Join thousands of satisfied customers who have successfully obtained their visas through our expert services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <button
                  onClick={() => {
                    setAuthMode('register')
                    setIsAuthModalOpen(true)
                  }}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 sm:py-3 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-base sm:text-lg"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login')
                    setIsAuthModalOpen(true)
                  }}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 font-semibold py-3 sm:py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 text-base sm:text-lg"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  )
}

export default HomePage