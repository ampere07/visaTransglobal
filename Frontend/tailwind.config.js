/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Color Palette - User Specified
        'custom': {
          'light-purple': '#98befc',    // Light blue/purple for info backgrounds
          'mint': '#c5f5dd',           // Light green/mint for success states
          'sky': '#90d9fd',            // Light blue for primary backgrounds
          'royal': '#0438ee',          // Dark blue for text and strong elements
          'ocean': '#09a2e3',          // Medium blue for buttons and accents
          'turquoise': '#4ad3f1',      // Cyan/turquoise for secondary elements
          'cyan': '#7de3fe',           // Light cyan for highlights and hover
        },
        
        // Updated primary theme colors using custom palette
        primary: {
          50: '#7de3fe',   // Light cyan for very light backgrounds
          100: '#4ad3f1',  // Turquoise for light backgrounds
          200: '#90d9fd',  // Sky for lighter elements
          300: '#09a2e3',  // Ocean for medium elements
          400: '#09a2e3',  // Ocean for interactive elements
          500: '#0438ee',  // Royal for primary buttons and main elements
          600: '#0438ee',  // Royal for hover states
          700: '#0438ee',  // Royal for pressed states
          800: '#0438ee',  // Royal for dark elements
          900: '#0438ee',  // Royal for very dark elements
        },
        secondary: {
          50: '#c5f5dd',   // Mint for very light backgrounds
          100: '#c5f5dd',  // Mint for light backgrounds
          200: '#c5f5dd',  // Mint for lighter elements
          300: '#4ad3f1',  // Turquoise for medium elements
          400: '#4ad3f1',  // Turquoise for interactive elements
          500: '#09a2e3',  // Ocean for secondary buttons
          600: '#09a2e3',  // Ocean for hover states
          700: '#0438ee',  // Royal for pressed states
          800: '#0438ee',  // Royal for dark elements
          900: '#0438ee',  // Royal for very dark elements
        },
        accent: {
          50: '#7de3fe',   // Light cyan for very light backgrounds
          100: '#90d9fd',  // Sky for light backgrounds
          200: '#98befc',  // Light purple for accent backgrounds
          300: '#4ad3f1',  // Turquoise for medium accents
          400: '#09a2e3',  // Ocean for strong accents
          500: '#0438ee',  // Royal for primary accents
          600: '#0438ee',  // Royal for hover states
          700: '#0438ee',  // Royal for pressed states
          800: '#0438ee',  // Royal for dark accents
          900: '#0438ee',  // Royal for very dark accents
        },
        
        // Status colors using the custom palette
        'status': {
          'info': {
            'bg': '#98befc',     // Light purple background
            'border': '#4ad3f1', // Turquoise border
            'text': '#0438ee',   // Royal text
          },
          'success': {
            'bg': '#c5f5dd',     // Mint background
            'border': '#4ad3f1', // Turquoise border
            'text': '#0438ee',   // Royal text
          },
          'warning': {
            'bg': '#7de3fe',     // Light cyan background
            'border': '#09a2e3', // Ocean border
            'text': '#0438ee',   // Royal text
          },
          'error': {
            'bg': '#90d9fd',     // Sky background
            'border': '#0438ee', // Royal border
            'text': '#0438ee',   // Royal text
          },
        },
        
        // Legacy color compatibility (updated to use new palette)
        teal: {
          50: '#7de3fe',
          100: '#4ad3f1',
          200: '#90d9fd',
          300: '#09a2e3',
          400: '#09a2e3',
          500: '#0438ee',
          600: '#0438ee',
          700: '#0438ee',
          800: '#0438ee',
          900: '#0438ee',
        },
        coral: {
          50: '#c5f5dd',
          100: '#c5f5dd',
          200: '#4ad3f1',
          300: '#4ad3f1',
          400: '#09a2e3',
          500: '#09a2e3',
          600: '#0438ee',
          700: '#0438ee',
          800: '#0438ee',
          900: '#0438ee',
        },
        
        // Visa-specific theme colors (updated)
        'visa-primary': {
          50: '#7de3fe',
          100: '#4ad3f1',
          200: '#90d9fd',
          300: '#09a2e3',
          400: '#09a2e3',
          500: '#0438ee',
          600: '#0438ee',
          700: '#0438ee',
          800: '#0438ee',
          900: '#0438ee',
        },
        'visa-secondary': {
          50: '#c5f5dd',
          100: '#c5f5dd',
          200: '#98befc',
          300: '#4ad3f1',
          400: '#4ad3f1',
          500: '#09a2e3',
          600: '#09a2e3',
          700: '#0438ee',
          800: '#0438ee',
          900: '#0438ee',
        },
        
        // Keep some original colors for compatibility
        'visa-teal': {
          50: '#7de3fe',
          100: '#4ad3f1',
          200: '#90d9fd',
          300: '#09a2e3',
          400: '#09a2e3',
          500: '#0438ee',
          600: '#0438ee',
          700: '#0438ee',
          800: '#0438ee',
          900: '#0438ee',
        },
        'visa-orange': {
          50: '#c5f5dd',
          100: '#c5f5dd',
          200: '#98befc',
          300: '#4ad3f1',
          400: '#09a2e3',
          500: '#09a2e3',
          600: '#0438ee',
          700: '#0438ee',
          800: '#0438ee',
          900: '#0438ee',
        },
        'visa-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(4, 56, 238, 0.1), 0 1px 2px 0 rgba(4, 56, 238, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(4, 56, 238, 0.1), 0 4px 6px -2px rgba(4, 56, 238, 0.05)',
        'button': '0 4px 6px -1px rgba(4, 56, 238, 0.1), 0 2px 4px -1px rgba(4, 56, 238, 0.06)',
        'custom': '0 4px 12px -2px rgba(74, 211, 241, 0.15), 0 2px 6px -1px rgba(9, 162, 227, 0.1)',
      }
    },
  },
  plugins: [],
}