import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { applicationAPI, uploadAPI } from '../utils/api'
import { toast } from 'react-hot-toast'
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Plane, 
  FileText, 
  CreditCard, 
  CheckCircle,
  Calendar,
  MapPin,
  Download,
  Lock,
  Camera,
  ClipboardList,
  File
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SubscriptionModal from '../components/common/SubscriptionModal'

const ApplicationProcess = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({})
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()
  const { user, isAuthenticated } = useAuth()

  const steps = [
    { 
      id: 1, 
      title: 'Personal Information', 
      description: 'Basic personal details',
      icon: User,
      shortTitle: 'Personal'
    },
    { 
      id: 2, 
      title: 'Travel Information', 
      description: 'Travel plans and purpose',
      icon: Plane,
      shortTitle: 'Travel'
    },
    { 
      id: 3, 
      title: 'Documents', 
      description: 'Download required documents',
      icon: FileText,
      shortTitle: 'Documents'
    },
    { 
      id: 4, 
      title: 'Payment', 
      description: 'Payment and shipping details',
      icon: CreditCard,
      shortTitle: 'Payment'
    },
    { 
      id: 5, 
      title: 'Review', 
      description: 'Review and submit application',
      icon: CheckCircle,
      shortTitle: 'Review'
    }
  ]

  // Subscription and download handling
  const isDownloadEnabled = () => {
    return isAuthenticated && user?.userType === 'subscriber'
  }

  const getDownloadButtonStyle = () => {
    if (isDownloadEnabled()) {
      return 'inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95'
    }
    return 'inline-flex items-center justify-center w-full px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed opacity-60 transition-all duration-200'
  }

  const handleDownloadClick = async (filename, documentName = 'document') => {
    if (!isAuthenticated) {
      toast.error('Please login to download documents')
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

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await applicationAPI.submit({ ...formData, ...data })
      toast.success('Application submitted successfully!')
      // Redirect to dashboard or success page
    } catch (error) {
      toast.error('Failed to submit application')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentStepIcon = () => {
    const step = steps.find(s => s.id === currentStep)
    return step ? step.icon : User
  }

  return (
    <>
    <div className="min-h-screen">
      {/* Step Indicators Section - Blue Background */}
      <div className="py-4 sm:py-8" style={{backgroundColor: '#2596be'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Progress Header */}
        <div className="sm:hidden mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-semibold text-white">
                Visa Application
              </h1>
              <span className="text-sm text-white">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-white">
                {steps[currentStep - 1]?.title}
              </p>
              <p className="text-xs text-white opacity-90">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Progress Steps */}
        <div className="hidden sm:block mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? 'border-white text-white' 
                        : isCurrent
                        ? 'border-white text-white'
                        : 'border-white text-white'
                    }`} style={{backgroundColor: '#e1842d'}}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`mt-2 text-center ${
                      isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-white' : 'text-white opacity-70'
                    }`}>
                      <p className="text-sm font-medium hidden lg:block">{step.title}</p>
                      <p className="text-sm font-medium lg:hidden">{step.shortTitle}</p>
                      <p className="text-xs hidden lg:block">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-2 lg:mx-4 h-0.5 w-8 lg:w-16 transition-all duration-200 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Form Section - White Background */}
      <div className="bg-white py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4 sm:p-6 lg:p-8">
              {currentStep === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="hidden sm:block text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-gray-600 mb-6">Please provide your personal details as they appear on your passport.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('firstName', { required: 'First name is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('lastName', { required: 'Last name is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        {...register('dateOfBirth', { required: 'Date of birth is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality *
                      </label>
                      <select
                        {...register('nationality', { required: 'Nationality is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      >
                        <option value="">Select nationality</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        {/* Add more countries */}
                      </select>
                      {errors.nationality && (
                        <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number *
                      </label>
                      <input
                        type="text"
                        {...register('passportNumber', { required: 'Passport number is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="Enter passport number"
                      />
                      {errors.passportNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.passportNumber.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="hidden sm:block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel Information</h2>
                    <p className="text-gray-600 mb-6">Please provide details about your planned travel.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Destination Country *
                      </label>
                      <select
                        {...register('destinationCountry', { required: 'Destination is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      >
                        <option value="">Select destination</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                      {errors.destinationCountry && (
                        <p className="text-red-500 text-sm mt-1">{errors.destinationCountry.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose of Visit *
                      </label>
                      <select
                        {...register('purposeOfVisit', { required: 'Purpose is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      >
                        <option value="">Select purpose</option>
                        <option value="tourism">Tourism</option>
                        <option value="business">Business</option>
                        <option value="education">Education</option>
                        <option value="medical">Medical</option>
                      </select>
                      {errors.purposeOfVisit && (
                        <p className="text-red-500 text-sm mt-1">{errors.purposeOfVisit.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Planned Entry Date *
                      </label>
                      <input
                        type="date"
                        {...register('entryDate', { required: 'Entry date is required' })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                      {errors.entryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.entryDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Planned Exit Date *
                      </label>
                      <input
                        type="date"
                        {...register('exitDate', { required: 'Exit date is required' })}
                        min={watch('entryDate') || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                      {errors.exitDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.exitDate.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accommodation Details
                      </label>
                      <textarea
                        {...register('accommodation')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="Hotel name, address, or other accommodation details"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="hidden sm:block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Downloads</h2>
                    <p className="text-gray-600 mb-6">Download the required documents and templates for your visa application.</p>
                  </div>
                  
                  {/* Mobile: Flex Layout, Desktop: 2x2 Grid Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Document Download Areas */}
                    {[
                      { 
                        id: 'application-form', 
                        name: 'Visa Application Form', 
                        description: 'Official visa application form (PDF)',
                        fileSize: '2.4 MB',
                        fileType: 'PDF',
                        icon: File,
                        iconColor: 'text-gray-600'
                      },
                      { 
                        id: 'photo-requirements', 
                        name: 'Photo Requirements Guide', 
                        description: 'Passport photo specifications',
                        fileSize: '1.2 MB',
                        fileType: 'PDF',
                        icon: Camera,
                        iconColor: 'text-gray-600'
                      },
                      { 
                        id: 'itinerary-template', 
                        name: 'Flight Itinerary Template', 
                        description: 'Template for travel itinerary',
                        fileSize: '890 KB',
                        fileType: 'DOCX',
                        icon: Plane,
                        iconColor: 'text-gray-600'
                      },
                      { 
                        id: 'document-checklist', 
                        name: 'Document Checklist', 
                        description: 'Complete list of required documents',
                        fileSize: '650 KB',
                        fileType: 'PDF',
                        icon: ClipboardList,
                        iconColor: 'text-gray-600'
                      }
                    ].map((doc) => {
                      const IconComponent = doc.icon
                      return (
                      <div key={doc.id} className={`bg-gray-50 border-2 rounded-lg p-4 transition-all duration-200 group relative min-h-[280px] flex flex-col ${
                        isDownloadEnabled() 
                          ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/30' 
                          : 'border-gray-200 opacity-75'
                      }`}>
                        {/* Restriction overlay for non-subscribers */}
                        {!isDownloadEnabled() && (
                          <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </div>
                        )}
                        <div className="text-center flex-1 flex flex-col">
                          <div className="mb-4 flex justify-center">
                            <div className={`p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-200 ${
                              isDownloadEnabled() ? 'group-hover:shadow-md' : ''
                            }`}>
                              <IconComponent className={`w-8 h-8 ${doc.iconColor} transition-colors duration-200`} />
                            </div>
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200">
                            {doc.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 flex-1">
                            {doc.description}
                          </p>
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                              {doc.fileType}
                            </span>
                            <span className="text-xs text-gray-500">{doc.fileSize}</span>
                          </div>
                          <div className="mt-auto">
                            <button
                              type="button"
                              className={getDownloadButtonStyle()}
                              disabled={!isDownloadEnabled()}
                              onClick={() => handleDownloadClick(`${doc.id}.pdf`, doc.name)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                              {!isDownloadEnabled() && (
                                <Lock className="w-3 h-3 ml-1" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      )
                    })}
                  </div>
                  
                  {/* Subscription notice for non-subscribers */}
                  {!isDownloadEnabled() && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Lock className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">
                            Premium Feature Required
                          </h3>
                          <div className="mt-1 text-sm text-amber-700">
                            <p className="mb-2">
                              Document downloads are available to premium subscribers only. Upgrade now to access:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Downloadable visa forms and templates</li>
                              <li>Step-by-step requirement guides</li>
                              <li>Processing time information</li>
                              <li>Priority customer support</li>
                            </ul>
                            <button
                              onClick={() => setIsSubscriptionModalOpen(true)}
                              className="mt-3 inline-flex items-center px-3 py-2 border border-amber-300 shadow-sm text-sm font-medium rounded-md text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
                            >
                              Upgrade to Premium
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Important Notes
                        </h3>
                        <div className="mt-1 text-sm text-blue-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Download and complete all required forms before your appointment</li>
                            <li>Flight itinerary should match your visa application dates</li>
                            <li>Keep digital copies of all downloaded documents</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="hidden sm:block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Shipping</h2>
                    <p className="text-gray-600 mb-6">Choose your payment method and shipping preferences.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Consulate Fee:</span>
                          <span>$160.00</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Service Fee:</span>
                          <span>$50.00</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-2">
                          <span>Total:</span>
                          <span>$210.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'standard', name: 'Standard Shipping', price: 'Free', time: '5-7 business days' },
                          { id: 'express', name: 'Express Shipping', price: '$25', time: '2-3 business days' },
                          { id: 'pickup', name: 'Office Pickup', price: 'Free', time: 'Same day' }
                        ].map((option) => (
                          <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              {...register('shippingMethod', { required: 'Please select a shipping method' })}
                              value={option.id}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900">{option.name}</span>
                                <span className="text-gray-900">{option.price}</span>
                              </div>
                              <p className="text-sm text-gray-500">{option.time}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="hidden sm:block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
                    <p className="text-gray-600 mb-6">Please review your application before submitting.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">
                            Ready to Submit
                          </h3>
                          <p className="mt-1 text-sm text-amber-700">
                            Please review all information carefully. Once submitted, changes cannot be made without contacting support.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Application Review Complete
                      </h3>
                      <p className="text-gray-600">
                        Your application is ready for submission. Click submit to proceed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Back</span>
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <span className="hidden sm:inline">Next Step</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        <span className="hidden sm:inline">Submitting...</span>
                        <span className="sm:hidden">Sending...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Submit Application</span>
                        <span className="sm:hidden">Submit</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  )
}

export default ApplicationProcess