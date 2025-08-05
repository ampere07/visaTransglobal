import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const DateRangePicker = ({
  label,
  startDateName = 'startDate',
  endDateName = 'endDate',
  startDateValue,
  endDateValue,
  onStartDateChange,
  onEndDateChange,
  onBlur,
  onFocus,
  error,
  required = false,
  register = null,
  watch = null,
  className = '',
  min,
  max,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [startDate, setStartDate] = useState(startDateValue ? new Date(startDateValue) : null)
  const [endDate, setEndDate] = useState(endDateValue ? new Date(endDateValue) : null)
  const [selectingStart, setSelectingStart] = useState(true) // Track which date we're selecting
  const [hoverDate, setHoverDate] = useState(null) // For preview highlighting
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const highlightColor = '#207f95' // Your specified hex color

  // Get current values from either controlled props or react-hook-form watch
  const currentStartValue = watch ? watch(startDateName) : startDateValue
  const currentEndValue = watch ? watch(endDateName) : endDateValue
  const hasStartValue = currentStartValue && currentStartValue.trim() !== ''
  const hasEndValue = currentEndValue && currentEndValue.trim() !== ''
  const hasValue = hasStartValue || hasEndValue

  useEffect(() => {
    if (currentStartValue) {
      setStartDate(new Date(currentStartValue))
    }
    if (currentEndValue) {
      setEndDate(new Date(currentEndValue))
    }
  }, [currentStartValue, currentEndValue])

  // Handle clicks outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
        if (onBlur) onBlur(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  const handleInputFocus = (e) => {
    setIsFocused(true)
    setIsOpen(true)
    if (onFocus) onFocus(e)
  }

  const handleInputBlur = (e) => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsFocused(false)
        setIsOpen(false)
        if (onBlur) onBlur(e)
      }
    }, 150)
  }

  const handleDateSelect = (date) => {
    if (selectingStart || !startDate) {
      // Selecting start date
      const dateString = date.toISOString().split('T')[0]
      setStartDate(date)
      setSelectingStart(false)
      
      // If end date is before start date, clear it
      if (endDate && date > endDate) {
        setEndDate(null)
        if (onEndDateChange) {
          const syntheticEvent = {
            target: { name: endDateName, value: '', type: 'date' }
          }
          onEndDateChange(syntheticEvent)
        }
      }
      
      if (onStartDateChange) {
        const syntheticEvent = {
          target: { name: startDateName, value: dateString, type: 'date' }
        }
        onStartDateChange(syntheticEvent)
      }
    } else {
      // Selecting end date
      if (date >= startDate) {
        const dateString = date.toISOString().split('T')[0]
        setEndDate(date)
        setSelectingStart(true) // Reset for next selection
        setIsOpen(false) // Close after selecting end date
        setIsFocused(false)
        
        if (onEndDateChange) {
          const syntheticEvent = {
            target: { name: endDateName, value: dateString, type: 'date' }
          }
          onEndDateChange(syntheticEvent)
        }
      }
    }
    
    setHoverDate(null)
  }

  const formatDisplayDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDisplayText = () => {
    if (hasStartValue && hasEndValue) {
      return `${formatDisplayDate(startDate)} → ${formatDisplayDate(endDate)}`
    } else if (hasStartValue) {
      return `${formatDisplayDate(startDate)} → Select end date`
    } else {
      return 'Select date range'
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const isDateDisabled = (date) => {
    if (!date) return false
    const dateString = date.toISOString().split('T')[0]
    if (min && dateString < min) return true
    if (max && dateString > max) return true
    return false
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isStartDate = (date) => {
    if (!date || !startDate) return false
    return date.toDateString() === startDate.toDateString()
  }

  const isEndDate = (date) => {
    if (!date || !endDate) return false
    return date.toDateString() === endDate.toDateString()
  }

  const isInRange = (date) => {
    if (!date || !startDate) return false
    
    let rangeEnd = endDate
    
    // If we're selecting end date and hovering, use hover date for preview
    if (!selectingStart && !endDate && hoverDate && hoverDate >= startDate) {
      rangeEnd = hoverDate
    }
    
    if (!rangeEnd) return false
    
    return date > startDate && date < rangeEnd
  }

  const isLabelActive = isFocused || hasValue

  const handleDateHover = (date) => {
    if (!selectingStart && startDate && !endDate) {
      setHoverDate(date)
    }
  }

  const clearDates = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectingStart(true)
    setHoverDate(null)
    
    if (onStartDateChange) {
      const syntheticEvent = {
        target: { name: startDateName, value: '', type: 'date' }
      }
      onStartDateChange(syntheticEvent)
    }
    
    if (onEndDateChange) {
      const syntheticEvent = {
        target: { name: endDateName, value: '', type: 'date' }
      }
      onEndDateChange(syntheticEvent)
    }
  }

  const days = getDaysInMonth(currentMonth)
  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className={`input-group ${className}`} ref={containerRef}>
      {/* Hidden inputs for form submission */}
      <input
        type="hidden"
        name={startDateName}
        value={currentStartValue || ''}
      />
      <input
        type="hidden"
        name={endDateName}
        value={currentEndValue || ''}
      />
      
      {/* Display input */}
      <div
        ref={inputRef}
        tabIndex={0}
        onClick={handleInputFocus}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={`input-floating ${hasValue || isFocused ? 'has-value' : ''} cursor-pointer flex items-center justify-between`}
        {...props}
      >
        <span className={hasValue ? 'text-gray-900' : 'text-transparent'}>
          {getDisplayText()}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* Floating Label */}
      <label className={`label-floating ${isLabelActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}>
        {label} {required && '*'}
      </label>
      
      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 w-80 animate-slide-up">
          {/* Instructions */}
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${highlightColor}15` }}>
            <p className="text-sm text-gray-700">
              {selectingStart ? 
                'Select your entry date' : 
                'Select your exit date'
              }
            </p>
            {startDate && !endDate && (
              <p className="text-xs text-gray-500 mt-1">
                Entry: {formatDisplayDate(startDate)}
              </p>
            )}
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2" />
              }
              
              const disabled = isDateDisabled(date)
              const today = isToday(date)
              const isStart = isStartDate(date)
              const isEnd = isEndDate(date)
              const inRange = isInRange(date)
              
              let buttonClasses = 'p-2 text-sm rounded-lg transition-all duration-200 relative'
              let buttonStyle = {}
              
              if (disabled) {
                buttonClasses += ' text-gray-300 cursor-not-allowed'
              } else {
                buttonClasses += ' cursor-pointer hover:bg-gray-100'
                
                if (isStart || isEnd) {
                  buttonClasses += ' text-white font-semibold shadow-sm'
                  buttonStyle.backgroundColor = highlightColor
                } else if (inRange) {
                  buttonClasses += ' text-gray-900'
                  buttonStyle.backgroundColor = `${highlightColor}30`
                } else if (today) {
                  buttonClasses += ' bg-gray-100 text-gray-900 font-semibold'
                } else {
                  buttonClasses += ' text-gray-700'
                }
              }
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(date)}
                  onMouseEnter={() => handleDateHover(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={disabled}
                  className={buttonClasses}
                  style={buttonStyle}
                >
                  {date.getDate()}
                  {isStart && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                  {isEnd && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></div>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Quick Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="text-sm font-medium hover:underline"
                style={{ color: highlightColor }}
              >
                Today
              </button>
              {hasValue && (
                <button
                  type="button"
                  onClick={clearDates}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default DateRangePicker