import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { applicationAPI, uploadAPI } from '../utils/api'
import { toast } from 'react-hot-toast'
import { COUNTRIES, PURPOSE_OF_VISIT } from '../utils/constants'
import FloatingInput from '../components/common/FloatingInput'
import DateRangePicker from '../components/common/DateRangePicker'
import DateRangeIndicator from '../components/common/DateRangeIndicator'
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
  File,
  Search,
  Globe,
  AlertCircle,
  Info
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import SubscriptionModal from '../components/common/SubscriptionModal'
import { 
  getMinimumTravelDate, 
  validateTravelDate, 
  getFormattedMinimumDateMessage,
  getProcessingTimeWarning,
  calculateDaysUntilTravel 
} from '../utils/helpers'

const ApplicationProcess = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({})
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [dateErrors, setDateErrors] = useState({})
  const [processingWarning, setProcessingWarning] = useState(null)
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm()
  const { user, isAuthenticated } = useAuth()

  // Pre-populate form with data from HomePage if available
  useEffect(() => {
    const savedVisaData = sessionStorage.getItem('visaSearchData')
    if (savedVisaData) {
      try {
        const parsedData = JSON.parse(savedVisaData)
        // Set form values for visa selection step
        setValue('passportCountry', parsedData.passportCountry || '')
        setValue('destinationVisa', parsedData.destination || '')
        setValue('purposeVisa', parsedData.purpose || '')
        setValue('entryDateVisa', parsedData.entryDate || '')
        setValue('exitDateVisa', parsedData.exitDate || '')
        // Clear the session storage after using it
        sessionStorage.removeItem('visaSearchData')
      } catch (error) {
        console.error('Error parsing visa search data:', error)
      }
    }
  }, [setValue])

  const steps = [
    { 
      id: 0, 
      title: 'Select Your Visa', 
      description: 'Choose your visa type and travel details',
      icon: Search,
      shortTitle: 'Selection'
    },
    { 
      id: 1, 
      title: 'Personal Information', 
      description: 'Please provide your personal details as they appear on your passport.',
      icon: User,
      shortTitle: 'Personal'
    },
    { 
      id: 2, 
      title: 'Required Documents', 
      description: 'Download the required documents and templates for your visa application.',
      icon: FileText,
      shortTitle: 'Documents'
    },
    { 
      id: 3, 
      title: 'Payment & Shipping', 
      description: 'Choose your payment method and shipping preferences.',
      icon: CreditCard,
      shortTitle: 'Payment'
    },
    { 
      id: 4, 
      title: 'Review', 
      description: 'Please review your application before submitting.',
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

  // Date range handlers for Step 0 (Visa Selection)
  const handleVisaEntryDateChange = (e) => {
    const value = e.target.value
    setValue('entryDateVisa', value)
    
    // Clear previous errors
    if (dateErrors.entryDateVisa) {
      setDateErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.entryDateVisa
        return newErrors
      })
    }
    
    // Validate entry date
    if (value) {
      const validation = validateTravelDate(value)
      if (!validation.isValid) {
        setDateErrors(prev => ({
          ...prev,
          entryDateVisa: validation.message
        }))
      } else {
        // Show processing time warning
        const warning = getProcessingTimeWarning(value)
        setProcessingWarning(warning)
      }
    }
  }

  const handleVisaExitDateChange = (e) => {
    const value = e.target.value
    setValue('exitDateVisa', value)
    
    // Clear previous errors
    if (dateErrors.exitDateVisa) {
      setDateErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.exitDateVisa
        return newErrors
      })
    }
    
    // Validate exit date
    if (value) {
      const validation = validateTravelDate(value)
      if (!validation.isValid) {
        setDateErrors(prev => ({
          ...prev,
          exitDateVisa: validation.message
        }))
      } else {
        // Check if exit date is after entry date
        const entryDate = watch('entryDateVisa')
        if (entryDate && new Date(value) <= new Date(entryDate)) {
          setDateErrors(prev => ({
            ...prev,
            exitDateVisa: 'Exit date must be after entry date'
          }))
        }
      }
    }
  }

  const onSubmit = async (data) => {
    // Validate travel dates before submission
    if (data.entryDateVisa || data.exitDateVisa) {
      const entryValidation = validateTravelDate(data.entryDateVisa)
      const exitValidation = validateTravelDate(data.exitDateVisa)
      
      const errors = {}
      if (!entryValidation.isValid) {
        errors.entryDateVisa = entryValidation.message
      }
      if (!exitValidation.isValid) {
        errors.exitDateVisa = exitValidation.message
      }
      
      // Check if exit date is after entry date
      if (data.entryDateVisa && data.exitDateVisa) {
        const entryDate = new Date(data.entryDateVisa)
        const exitDate = new Date(data.exitDateVisa)
        if (exitDate <= entryDate) {
          errors.exitDateVisa = 'Exit date must be after entry date'
        }
      }
      
      if (Object.keys(errors).length > 0) {
        setDateErrors(errors)
        toast.error('Please fix the travel date errors before submitting')
        return
      }
    }
    
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
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
      <div className="py-3 sm:py-6 md:py-8 lg:py-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Mobile Progress Header */}
        <div className="sm:hidden mb-4">
          <div className="px-3 py-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-base sm:text-lg font-semibold text-white truncate">
                Visa Application
              </h1>
              <span className="text-sm text-white flex-shrink-0">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-3">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">{steps[currentStep]?.title}</p>
              <p className="text-white/80 text-xs mt-1">{steps[currentStep]?.description}</p>
            </div>
          </div>
        </div>

        {/* Desktop Progress Steps */}
        <div className="hidden sm:block mb-8">
          <div className="flex justify-center w-full px-2">
            <div className="flex items-center justify-between w-full max-w-5xl">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className={`relative inline-flex items-center justify-center w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 rounded-full border-2 transition-all duration-500 ${
                      isCompleted
                        ? 'border-green-400 text-white shadow-lg shadow-green-500/30' 
                        : isCurrent
                        ? 'border-blue-300 text-white ring-2 ring-white/30 shadow-lg shadow-blue-600/30 transform scale-105'
                        : 'border-blue-200 text-white opacity-70 hover:opacity-100 hover:shadow-md hover:shadow-blue-400/20 hover:scale-105'
                    }`} style={{backgroundColor: '#5DADE2'}}>
                      {isCompleted ? (
                        <div className="relative">
                          <CheckCircle className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 flex-shrink-0" />
                          {/* Success ripple effect */}
                          <div className="absolute inset-0 w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 rounded-full border-2 border-green-400/60 animate-ping opacity-40"></div>
                        </div>
                      ) : (
                        <Icon className={`w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6 flex-shrink-0 transition-all duration-300 ${
                          isCurrent ? 'transform scale-110' : ''
                        }`} />
                      )}
                      
                      {/* Completion celebration sparkle */}
                      {isCompleted && (
                        <>
                          <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                          <div className="absolute -bottom-0.5 sm:-bottom-1 -left-0.5 sm:-left-1 w-0.5 sm:w-1 md:w-1.5 h-0.5 sm:h-1 md:h-1.5 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
                        </>
                      )}
                    </div>
                    
                    <div className={`mt-1 sm:mt-2 md:mt-3 text-center w-full transition-all duration-300 ${
                      isCurrent 
                        ? 'text-white font-semibold drop-shadow-sm' 
                        : isCompleted 
                        ? 'text-green-100 font-semibold drop-shadow-sm' 
                        : 'text-white/90 font-medium'
                    }`}>
                      <p className="text-xs sm:text-sm md:text-base font-medium hidden lg:block leading-tight px-1">{step.title}</p>
                      <p className="text-xs sm:text-sm font-medium lg:hidden leading-tight px-1">{step.shortTitle}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="relative flex-shrink-0 w-4 sm:w-8 md:w-12 lg:w-16 xl:w-20 h-0.5 sm:h-1 rounded-full overflow-hidden bg-blue-200/30 mx-1 sm:mx-2">
                      <div className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out ${
                        currentStep > step.id 
                          ? 'w-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm' 
                          : 'w-0 bg-blue-300/40'
                      }`} />
                      
                      {/* Animated shimmer effect when progressing */}
                      {currentStep > step.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/50 to-transparent animate-pulse"></div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              )
            })}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Form Section - White Background */}
      <div className="bg-white py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Step Header - Centered */}
          <div className="sm:hidden text-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2 px-2">
              {steps[currentStep]?.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-4">
              {steps[currentStep]?.description}
            </p>
          </div>
          
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
              {currentStep === 0 && (
                <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
                  <div className="hidden sm:block text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Select Your Visa</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Find the perfect visa solution for your travel needs.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                    {/* Passport Country */}
                    <FloatingInput
                      type="select"
                      name="passportCountry"
                      label="My passport is from"
                      options={COUNTRIES}
                      register={register}
                      watch={watch}
                      error={errors.passportCountry?.message}
                      required
                    />

                    {/* Destination */}
                    <FloatingInput
                      type="select"
                      name="destinationVisa"
                      label="I am going to"
                      options={COUNTRIES}
                      register={register}
                      watch={watch}
                      error={errors.destinationVisa?.message}
                      required
                    />

                    {/* Purpose */}
                    <FloatingInput
                      type="select"
                      name="purposeVisa"
                      label="My purpose of trip"
                      options={PURPOSE_OF_VISIT}
                      register={register}
                      watch={watch}
                      error={errors.purposeVisa?.message}
                      required
                    />

                    {/* Travel Dates with 2-week minimum restriction */}
                    <DateRangePicker
                      label="Travel Dates"
                      startDateName="entryDateVisa"
                      endDateName="exitDateVisa"
                      startDateValue={watch('entryDateVisa')}
                      endDateValue={watch('exitDateVisa')}
                      onStartDateChange={handleVisaEntryDateChange}
                      onEndDateChange={handleVisaExitDateChange}
                      register={register}
                      watch={watch}
                      error={errors.entryDateVisa?.message || errors.exitDateVisa?.message || dateErrors.entryDateVisa || dateErrors.exitDateVisa}
                      required
                      min={getMinimumTravelDate()}
                      className="mb-4"
                    />
                    

                    {/* Add DateRangeIndicator for better visual feedback */}
                    <DateRangeIndicator
                      startDate={watch('entryDateVisa')}
                      endDate={watch('exitDateVisa')}
                      startLabel="Entry Date"
                      endLabel="Exit Date"
                    />
                    
                    {/* Processing Time Information */}
                    <div className="bg-[#98befc] border border-[#4ad3f1] rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-[#0438ee] mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-[#0438ee]">
                            Travel Date Requirements
                          </h4>
                          <p className="text-sm text-[#0438ee]">
                            {getFormattedMinimumDateMessage()}
                          </p>
                          <p className="text-xs text-[#0438ee] opacity-90">
                            This 2-week buffer ensures our admin team has adequate time to process your visa application and supporting documents.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Processing Warning */}
                    {processingWarning && (
                      <div className={`border rounded-lg p-4 ${processingWarning.colors.bg} ${processingWarning.colors.border}`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${processingWarning.colors.icon}`} />
                          <div>
                            <p className={`text-sm font-medium ${processingWarning.colors.text}`}>
                              Processing Time Notice
                            </p>
                            <p className={`text-sm ${processingWarning.colors.text} opacity-90`}>
                              {processingWarning.message}
                            </p>
                            {watch('entryDateVisa') && (
                              <p className={`text-xs mt-1 ${processingWarning.colors.text} opacity-75`}>
                                Days until travel: {calculateDaysUntilTravel(watch('entryDateVisa'))}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visa Information Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Globe className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Visa Information
                          </h3>
                          <div className="mt-1 text-sm text-blue-700">
                            <p className="mb-2">
                              Based on your selection, we'll help you with the right visa type and requirements.
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Tourist visas typically take 5-10 business days</li>
                              <li>Business visas may require additional documentation</li>
                              <li>Processing times vary by destination country</li>
                              <li>We'll guide you through each step of the process</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                  <div className="hidden sm:block text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Please provide your personal details as they appear on your passport.</p>
                  </div>
                  
                  {/* Visa Selection Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Your Visa Selection</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="truncate">Passport: <span className="font-medium">{watch('passportCountry') ? COUNTRIES.find(c => c.code === watch('passportCountry'))?.name : 'Not selected'}</span></div>
                      <div className="truncate">Destination: <span className="font-medium">{watch('destinationVisa') ? COUNTRIES.find(c => c.code === watch('destinationVisa'))?.name : 'Not selected'}</span></div>
                      <div className="truncate">Purpose: <span className="font-medium">{watch('purposeVisa') ? PURPOSE_OF_VISIT.find(p => p.value === watch('purposeVisa'))?.label : 'Not selected'}</span></div>
                      <div className="truncate">Travel Dates: <span className="font-medium">{watch('entryDateVisa')} to {watch('exitDateVisa')}</span></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <FloatingInput
                        type="text"
                        name="firstName"
                        label="First Name"
                        register={register}
                        watch={watch}
                        error={errors.firstName?.message}
                        required
                      />

                      <FloatingInput
                        type="text"
                        name="lastName"
                        label="Last Name"
                        register={register}
                        watch={watch}
                        error={errors.lastName?.message}
                        required
                      />
                    </div>

                    <FloatingInput
                      type="email"
                      name="email"
                      label="Email Address"
                      register={register}
                      watch={watch}
                      error={errors.email?.message}
                      required
                    />

                    <FloatingInput
                      type="tel"
                      name="phone"
                      label="Phone Number"
                      register={register}
                      watch={watch}
                      error={errors.phone?.message}
                      required
                    />

                    <FloatingInput
                      type="date"
                      name="dateOfBirth"
                      label="Date of Birth"
                      register={register}
                      watch={watch}
                      error={errors.dateOfBirth?.message}
                      required
                    />

                    <FloatingInput
                      type="select"
                      name="nationality"
                      label="Nationality"
                      options={[
                        { value: 'US', label: 'United States' },
                        { value: 'CA', label: 'Canada' },
                        { value: 'UK', label: 'United Kingdom' },
                        { value: 'AU', label: 'Australia' }
                      ]}
                      register={register}
                      watch={watch}
                      error={errors.nationality?.message}
                      required
                    />

                    <div className="sm:col-span-2">
                      <FloatingInput
                        type="text"
                        name="passportNumber"
                        label="Passport Number"
                        register={register}
                        watch={watch}
                        error={errors.passportNumber?.message}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="hidden sm:block text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Required Documents</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Download the required documents and templates for your visa application.</p>
                  </div>
                  
                  {/* Responsive Document Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                      <div key={doc.id} className={`bg-gray-50 border-2 rounded-lg p-3 sm:p-4 transition-all duration-200 group relative min-h-[240px] sm:min-h-[280px] flex flex-col ${
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
                          <div className="mb-3 sm:mb-4 flex justify-center">
                            <div className={`p-2 sm:p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors duration-200 ${
                              isDownloadEnabled() ? 'group-hover:shadow-md' : ''
                            }`}>
                              <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${doc.iconColor} transition-colors duration-200`} />
                            </div>
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200 px-1">
                            {doc.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 flex-1 px-1">
                            {doc.description}
                          </p>
                          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                              {doc.fileType}
                            </span>
                            <span className="text-xs text-gray-500">{doc.fileSize}</span>
                          </div>
                          <div className="mt-auto px-1">
                            <button
                              type="button"
                              className={`${getDownloadButtonStyle()} text-xs sm:text-sm py-2 sm:py-2`}
                              disabled={!isDownloadEnabled()}
                              onClick={() => handleDownloadClick(`${doc.id}.pdf`, doc.name)}
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
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

              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="hidden sm:block text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Payment & Shipping</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Choose your payment method and shipping preferences.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Information</h3>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Consulate Fee:</span>
                          <span className="font-medium">$160.00</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Service Fee:</span>
                          <span className="font-medium">$50.00</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
                          <span>Total:</span>
                          <span className="text-blue-600">$210.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Shipping Method</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { id: 'standard', name: 'Standard Shipping', price: 'Free', time: '5-7 business days' },
                          { id: 'express', name: 'Express Shipping', price: '$25', time: '2-3 business days' },
                          { id: 'pickup', name: 'Office Pickup', price: 'Free', time: 'Same day' }
                        ].map((option) => (
                          <label key={option.id} className="flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                            <input
                              type="radio"
                              {...register('shippingMethod', { required: 'Please select a shipping method' })}
                              value={option.id}
                              className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                            />
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                                <span className="font-medium text-gray-900 text-sm sm:text-base">{option.name}</span>
                                <span className="text-gray-900 font-semibold text-sm sm:text-base">{option.price}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">{option.time}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="hidden sm:block text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Review & Submit</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">Please review your application before submitting.</p>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-amber-800">
                            Ready to Submit
                          </h3>
                          <p className="mt-1 text-sm text-amber-700">
                            Please review all information carefully. Once submitted, changes cannot be made without contacting support.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-6 sm:py-8">
                      <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        Application Review Complete
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                        Your application is ready for submission. Click submit to proceed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="border-t border-gray-200 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between max-w-2xl mx-auto">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`btn-base px-4 py-3 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  } order-2 sm:order-1`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Back</span>
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-base px-4 py-3 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md order-1 sm:order-2"
                  >
                    <span className="hidden sm:inline">Next Step</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-base px-6 py-3 sm:py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Submitting...</span>
                        <span className="sm:hidden">Sending...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
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