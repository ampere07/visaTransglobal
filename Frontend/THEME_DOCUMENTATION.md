# Visa System Theme Implementation

## Overview
This theme implementation is based on modern travel booking interface design, adapted specifically for your visa application system. The theme uses a teal and orange color scheme with clean, modern components that provide a professional and user-friendly experience for visa applications.

## 🎨 Color Scheme

### Primary Colors
- **Visa Teal**: `#14b8a6` - Used for headers, primary buttons, and section dividers
- **Visa Orange**: `#fb923c` - Used for action buttons (Apply Now, Book, etc.)
- **Visa Red**: `#ef4444` - Used for prices and important information
- **Visa Dark**: `#207f95` - Custom dark theme background color

### Dark Theme Colors
- **Main Background**: `#207f95` (visa-dark-500)
- **Card Backgrounds**: Darker variations of the main color
- **Text Colors**: White for primary text, light grays for secondary text
- **Accent Colors**: Orange (#fb923c) for interactive elements

### Usage Examples
```jsx
// Light theme - Teal for headers and primary elements
<div className="bg-visa-teal-500 text-white">Header</div>

// Orange for action buttons
<button className="btn-apply-now">Apply Now</button>

// Red for prices
<span className="visa-price">₱18,702.76</span>

// Dark theme - Main container
<div className="visa-dark-container">
  <div className="visa-dark-card">
    <h1 className="visa-dark-text-primary">Title</h1>
    <p className="visa-dark-text-secondary">Description</p>
  </div>
</div>
```

## 🧩 New Components

### 1. VisaCard Component
Matches the flight result cards from the interface, adapted for visa information.

**Props:**
- `country`: Destination country
- `visaType`: Type of visa (Tourist, Business, etc.)
- `price`: Visa application cost
- `processingTime`: How long processing takes
- `validity`: How long the visa is valid
- `entries`: Single/Multiple entry
- `requirements`: Number of required documents
- `urgentAvailable`: Boolean for urgent processing
- `rating`: Service rating
- `onClick`: Click handler

**Usage:**
```jsx
<VisaCard 
  country="Japan"
  visaType="Tourist Visa"
  price={18702.76}
  processingTime="5-7 Business Days"
  validity="90 Days"
  entries="Multiple Entry"
  requirements={8}
  urgentAvailable={true}
  rating={4.8}
  onClick={() => handleVisaClick()}
/>
```

### 2. VisaFilter Component
Left sidebar filter matching the flight booking filter design.

**Features:**
- Visa type filtering (Tourist, Business, Student, Work, Transit)
- Price range slider
- Processing time filters
- Validity period options
- Urgent processing toggle
- Collapsible sections

**Usage:**
```jsx
<VisaFilter onFilterChange={(filters) => handleFilterChange(filters)} />
```

### 3. VisaSearchHeader Component
Top search section matching the flight booking search interface.

**Features:**
- Destination country input
- Travel date picker
- Number of applicants selector
- Visa type selection
- Popular destinations quick select

**Usage:**
```jsx
<VisaSearchHeader onSearch={(searchData) => handleSearch(searchData)} />
```

### 4. MobileTabBar Component
Bottom navigation for mobile, designed for visa-focused navigation.

**Features:**
- Visas tab (active and functional)
- Travel, Transport, Hotels, Packages tabs (disabled with "Soon" indicators)
- Clean mobile navigation experience

**Usage:**
```jsx
<MobileTabBar 
  activeTab="visas" 
  onTabChange={(tab) => handleTabChange(tab)} 
/>
```

### 5. PaymentForm Component
Reusable payment form component matching the payment interface design.

**Features:**
- Multiple payment methods (Deposit, Credit Card, Digital Wallet)
- Credit card form with validation
- Automatic fee calculation
- Payment method selection
- Responsive design

**Props:**
- `amount`: Payment amount
- `currency`: Currency symbol (default: '₱')
- `onPayment`: Payment completion callback
- `loading`: Loading state
- `merchantFee`: Credit card processing fee percentage

**Usage:**
```jsx
<PaymentForm 
  amount={18702.76}
  onPayment={(paymentData) => handlePayment(paymentData)}
  loading={isProcessing}
/>
```

### 6. StepIndicator Component
Step progress indicator for multi-step processes.

**Features:**
- Customizable steps
- Completed, active, and upcoming states
- Predefined step configurations
- Smooth transitions

**Usage:**
```jsx
import StepIndicator, { visaApplicationSteps } from '../components/common/StepIndicator';

<StepIndicator 
  steps={visaApplicationSteps} 
  currentStep={1}
/>
```

### 7. VisaPaymentPage Component
Complete payment page matching the interface design.

**Features:**
- Full payment flow
- Step indicator integration
- Visa application details header
- Payment method selection
- Credit card form
- Payment summary

### 8. VisaApplicationFlow Component
Complete application flow with traveler details and payment.

**Features:**
- Multi-step application process
- Traveler details form
- Payment integration
- Confirmation screen
- Progress tracking

### 9. VisaInformationDark Component
Dark-themed visa information page with custom #207f95 background.

**Features:**
- Dark teal background (#207f95)
- White text for optimal contrast
- Category-based visa filtering
- Requirements display panel
- Premium/subscription features
- Mobile-responsive design
- PDF download functionality

**Usage:**
```jsx
<VisaInformationDark 
  searchData={{
    destination: 'Japan',
    purpose: 'Tourism'
  }}
/>
```

## 🎯 CSS Classes

### Button Classes
- `.btn-apply-now` - Orange action button with hover effects
- `.btn-primary` - Teal primary button
- `.btn-secondary` - Orange secondary button
- `.btn-outline` - White button with teal border

### Card Classes
- `.visa-card` - Basic visa card with hover effects
- `.visa-result-card` - Result card with structured layout
- `.visa-header` - Teal header section
- `.visa-content` - White content section

### Text Classes
- `.visa-price` - Large red price text
- `.visa-country` - Country name styling
- `.visa-type` - Visa type description
- `.processing-time` - Small gray processing time text

### Status Classes
- `.status-approved` - Green badge for approved status
- `.status-pending` - Yellow badge for pending status
- `.status-rejected` - Red badge for rejected status
- `.visa-urgent` - Pulsing red badge for urgent processing

### Filter Classes
- `.filter-section` - White filter section container
- `.filter-header` - Teal filter section header
- `.filter-button` - Default filter button
- `.filter-button-active` - Active filter button (teal background)

### Payment Classes
- `.payment-form-container` - Main payment form wrapper
- `.payment-methods-section` - Payment method selection area
- `.payment-section-title` - Section titles in payment form
- `.payment-methods-grid` - Grid layout for payment methods
- `.payment-method-card` - Individual payment method card
- `.payment-method-default` - Default payment method styling
- `.payment-method-selected-visa-teal` - Selected teal payment method
- `.payment-method-selected-visa-orange` - Selected orange payment method
- `.payment-details-section` - Credit card details section
- `.payment-form` - Payment form styling
- `.form-group` - Form field grouping
- `.form-label` - Form field labels
- `.payment-summary` - Payment total summary section
- `.payment-total-section` - Total amount breakdown
- `.payment-button` - Main payment submission button
- `.payment-security-notice` - Security notice text

### Step Indicator Classes
- `.step-indicator` - Base step circle styling
- `.step-active` - Active step with orange background
- `.step-completed` - Completed step with green background
- `.step-inactive` - Inactive step with gray background

### Mobile Classes
- `.mobile-tab-bar` - Fixed bottom navigation bar
- `.mobile-tab` - Individual tab styling
- `.mobile-tab-active` - Active tab with orange color
- `.mobile-tab-inactive` - Inactive tab styling

### Dark Theme Classes
- `.visa-dark-container` - Main dark theme container with #207f95 background
- `.visa-dark-card` - Dark theme card component
- `.visa-dark-card-hover` - Dark card with hover effects
- `.visa-dark-text-primary` - Primary white text
- `.visa-dark-text-secondary` - Secondary gray-300 text
- `.visa-dark-text-muted` - Muted gray-400 text
- `.visa-dark-button-primary` - Primary orange button for dark theme
- `.visa-dark-button-secondary` - Secondary dark button
- `.visa-dark-input` - Dark theme input field
- `.visa-dark-tab-active` - Active tab styling for dark theme
- `.visa-dark-tab-inactive` - Inactive tab styling for dark theme

## 📱 Responsive Design

The theme includes full mobile responsiveness:

### Desktop (md and up)
- Left sidebar with filters
- Grid layout for visa cards
- Full search header

### Mobile (below md)
- Stacked layout
- Bottom tab navigation
- Overlay filters
- Compact search header

## 🚀 Usage Examples

### Complete Page Implementation
```jsx
import VisaSearchHeader from '../components/common/VisaSearchHeader';
import VisaFilter from '../components/common/VisaFilter';
import VisaCard from '../components/common/VisaCard';
import MobileTabBar from '../components/common/MobileTabBar';

const VisaSearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <VisaSearchHeader onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            <div className="w-80">
              <VisaFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="flex-1">
              {/* Visa results */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile content */}
        <MobileTabBar activeTab="visas" />
      </div>
    </div>
  );
};
```

### Individual Component Usage
```jsx
// Basic visa information display
<div className="visa-card">
  <h3 className="visa-country">Japan</h3>
  <p className="visa-type">Tourist Visa</p>
  <span className="visa-price">₱18,702.76</span>
  <button className="btn-apply-now">Apply Now</button>
</div>

// Status badges
<span className="status-approved">Approved</span>
<span className="status-pending">Under Review</span>
<span className="visa-urgent">Urgent Processing</span>

// Filter buttons
<button className="filter-button">All Visas</button>
<button className="filter-button-active">Tourist Only</button>
```

## 🔧 Customization

### Changing Colors
Update the color values in `tailwind.config.js`:

```javascript
'visa-teal': {
  500: '#your-color-here', // Change main teal color
},
'visa-orange': {
  400: '#your-color-here', // Change main orange color
}
```

### Adding New Components
Follow the same pattern:

1. Create component in `src/components/common/`
2. Use existing CSS classes for consistency
3. Follow mobile-first responsive design
4. Add proper TypeScript props if using TypeScript

## 📁 File Structure
```
Frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── VisaCard.jsx
│   │       ├── VisaFilter.jsx
│   │       ├── VisaSearchHeader.jsx
│   │       ├── MobileTabBar.jsx
│   │       ├── PaymentForm.jsx
│   │       └── StepIndicator.jsx
│   ├── pages/
│   │   ├── VisaSearchPage.jsx
│   │   ├── VisaPaymentPage.jsx
│   │   ├── VisaApplicationFlow.jsx
│   │   └── VisaInformationDark.jsx    [NEW - Dark Theme]
│   ├── index.css (updated with dark theme)
│   └── ...
├── tailwind.config.js (updated with visa-dark colors)
└── ...
```

## 🎨 Design Principles

1. **Consistency**: All components follow the same color scheme and styling patterns
2. **Accessibility**: Proper contrast ratios and semantic HTML
3. **Mobile-First**: Responsive design starting from mobile
4. **Performance**: Efficient CSS classes and minimal custom styles
5. **Maintainability**: Clear class names and component structure

## 🔄 Migration from Travel Booking Interface

The theme has been adapted from a general travel booking interface to visa applications:

- **Travel search** → **Visa search** (destination-focused search)
- **Service cards** → **Visa cards** (country and visa type information)
- **Service info** → **Visa requirements and processing info**
- **Processing times** → **Visa processing times**
- **Service prices** → **Visa application fees**

This ensures familiarity with modern travel booking interfaces while being specifically designed for visa applications.
