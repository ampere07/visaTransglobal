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
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Your Visa Journey
                    <span className="block text-secondary-200">Starts Here</span>
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-secondary-300" />
                    <span>Lorem Ipsum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-secondary-300" />
                    <span>Lorem Ipsum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-secondary-300" />
                    <span>Lorem Ipsum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-secondary-300" />
                    <span>Lorem Ipsum</span>
                  </div>
                </div>
              </div>

              {/* Visa Search Form */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Your Visa Options
                  </h2>
                  <p className="text-gray-600">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Passport Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      My passport is from
                    </label>
                    <select
                      name="passportCountry"
                      value={formData.passportCountry}
                      onChange={handleInputChange}
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field"
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

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entry Date
                      </label>
                      <input
                        type="date"
                        name="entryDate"
                        value={formData.entryDate}
                        onChange={handleInputChange}
                        className="input-field"
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
                        className="input-field"
                        min={formData.entryDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full btn-secondary text-lg py-3 flex items-center justify-center group"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Get Visa Options
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full float-animation" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-400/20 rounded-full float-animation" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full float-animation" style={{ animationDelay: '4s' }} />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose VisaCentral?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lorem Ipsum</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors duration-300">
                  <Zap className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lorem Ipsum</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lorem Ipsum</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lorem Ipsum</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lorem Ipsum</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>

              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors duration-300">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lorem Ipsum</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-bg text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Visa Application?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    setAuthMode('register')
                    setIsAuthModalOpen(true)
                  }}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login')
                    setIsAuthModalOpen(true)
                  }}
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
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