export const USER_TYPES = {
  NON_SUBSCRIBER: 'non-subscriber',
  SUBSCRIBER: 'subscriber',
  ADMIN: 'admin'
}

export const VISA_CATEGORIES = {
  TOURISM: 'tourism',
  BUSINESS: 'business',
  SHORT_STAY: 'short-stay',
  LONG_STAY: 'long-stay'
}

export const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
}

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  DOCUMENT_REVIEW: 'document_review',
  INTERVIEW: 'interview',
  BIOMETRICS: 'biometrics'
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

export const SHIPPING_METHODS = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  PICKUP: 'pickup'
}

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' }
]

export const PURPOSE_OF_VISIT = [
  { value: 'tourism', label: 'Tourism/Leisure' },
  { value: 'business', label: 'Business' },
  { value: 'short-stay', label: 'Short Stay' },
  { value: 'long-stay', label: 'Long Stay' },
  { value: 'family', label: 'Family Visit' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical Treatment' },
  { value: 'transit', label: 'Transit' }
]

export const DOCUMENT_TYPES = [
  'Passport',
  'Passport Photos',
  'Application Form',
  'Cover Letter',
  'Travel Itinerary',
  'Hotel Reservations',
  'Flight Tickets',
  'Bank Statements',
  'Employment Letter',
  'Business Registration',
  'Invitation Letter',
  'Travel Insurance',
  'Birth Certificate',
  'Marriage Certificate',
  'Other'
]

export const PROCESSING_TIMES = {
  STANDARD: '10-15 business days',
  EXPEDITED: '5-7 business days',
  RUSH: '2-3 business days',
  SAME_DAY: 'Same day'
}

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf']
}

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSPORT: /^[A-Z0-9]{6,9}$/,
  POSTAL_CODE: /^[\d\w\s\-]{3,10}$/
}

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  VISA: '/visa',
  APPLICATIONS: '/applications',
  ADMIN: '/admin',
  UPLOADS: '/uploads'
}