export const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validatePassportNumber = (passport) => {
  // Basic passport number validation (alphanumeric, 6-9 characters)
  const re = /^[A-Z0-9]{6,9}$/
  return re.test(passport.toUpperCase())
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateApplicationNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000000)
  return `VA${year}${random.toString().padStart(6, '0')}`
}

export const getStatusColor = (status) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-purple-100 text-purple-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getUserTypeDisplayName = (userType) => {
  const names = {
    'non-subscriber': 'Basic User',
    'subscriber': 'Premium User',
    'admin': 'Administrator'
  }
  return names[userType] || userType
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  // Basic US phone number formatting
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Travel Date Validation Functions
export const getMinimumTravelDate = () => {
  const today = new Date()
  const minimumDate = new Date(today)
  minimumDate.setDate(today.getDate() + 14) // Add 14 days (2 weeks)
  return minimumDate.toISOString().split('T')[0] // Return YYYY-MM-DD format
}

export const getTwoWeeksFromNow = () => {
  const today = new Date()
  const twoWeeksLater = new Date(today)
  twoWeeksLater.setDate(today.getDate() + 14)
  return twoWeeksLater
}

export const validateTravelDate = (date) => {
  if (!date) return { isValid: false, message: 'Date is required' }
  
  const selectedDate = new Date(date)
  const minimumDate = getTwoWeeksFromNow()
  
  if (selectedDate < minimumDate) {
    return {
      isValid: false,
      message: `Travel date must be at least 2 weeks from today (minimum: ${formatDate(minimumDate)})`
    }
  }
  
  return { isValid: true, message: '' }
}

export const getFormattedMinimumDateMessage = () => {
  const minimumDate = getTwoWeeksFromNow()
  return `Earliest available travel date: ${formatDate(minimumDate)}`
}

export const calculateDaysUntilTravel = (travelDate) => {
  if (!travelDate) return 0
  
  const today = new Date()
  const travel = new Date(travelDate)
  const timeDiff = travel.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  
  return daysDiff
}

export const getProcessingTimeWarning = (travelDate) => {
  const daysUntil = calculateDaysUntilTravel(travelDate)
  
  if (daysUntil < 14) {
    return {
      type: 'error',
      message: 'Travel date must be at least 2 weeks from today to allow processing time.',
      colors: {
        bg: 'bg-[#90d9fd]',        // Sky blue background
        border: 'border-[#0438ee]', // Royal blue border
        text: 'text-[#0438ee]',     // Royal blue text
        icon: 'text-[#0438ee]'      // Royal blue icon
      }
    }
  } else if (daysUntil < 21) {
    return {
      type: 'warning',
      message: 'Limited processing time available. Consider expedited service if needed.',
      colors: {
        bg: 'bg-[#7de3fe]',        // Light cyan background
        border: 'border-[#09a2e3]', // Ocean blue border
        text: 'text-[#0438ee]',     // Royal blue text
        icon: 'text-[#09a2e3]'      // Ocean blue icon
      }
    }
  } else if (daysUntil < 30) {
    return {
      type: 'info',
      message: 'Standard processing time available.',
      colors: {
        bg: 'bg-[#98befc]',        // Light purple background
        border: 'border-[#4ad3f1]', // Turquoise border
        text: 'text-[#0438ee]',     // Royal blue text
        icon: 'text-[#4ad3f1]'      // Turquoise icon
      }
    }
  }
  
  return {
    type: 'success',
    message: 'Ample processing time available.',
    colors: {
      bg: 'bg-[#c5f5dd]',        // Mint green background
      border: 'border-[#4ad3f1]', // Turquoise border
      text: 'text-[#0438ee]',     // Royal blue text
      icon: 'text-[#4ad3f1]'      // Turquoise icon
    }
  }
}