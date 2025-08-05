import React from 'react'
import { Calendar, ArrowRight } from 'lucide-react'

const DateRangeIndicator = ({ 
  startDate, 
  endDate, 
  startLabel = "Entry Date", 
  endLabel = "Exit Date",
  className = ""
}) => {
  // Don't render if no dates are selected
  if (!startDate && !endDate) {
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Same day"
    if (diffDays === 1) return "1 day"
    return `${diffDays} days`
  }

  const duration = calculateDuration()
  const hasRange = startDate && endDate

  return (
    <div className={`mt-4 ${className}`}>
      {/* Date Range Display */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Travel Period
          </h4>
          {duration && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700">
              {duration}
            </span>
          )}
        </div>
        
        {/* Date Range Visual */}
        <div className="flex items-center gap-3">
          {/* Start Date */}
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">{startLabel}</div>
            <div className={`
              p-3 rounded-lg text-sm font-medium transition-all duration-200
              ${startDate 
                ? 'text-white shadow-sm' 
                : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
              }
            `} style={startDate ? { backgroundColor: '#207f95' } : {}}>
              {startDate ? formatDate(startDate) : 'Select date'}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex-shrink-0 mt-5">
            <ArrowRight 
              className={`w-5 h-5 transition-colors duration-200 ${
                hasRange ? 'text-[#207f95]' : 'text-gray-300'
              }`} 
            />
          </div>
          
          {/* End Date */}
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">{endLabel}</div>
            <div className={`
              p-3 rounded-lg text-sm font-medium transition-all duration-200
              ${endDate 
                ? 'text-white shadow-sm' 
                : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
              }
            `} style={endDate ? { backgroundColor: '#207f95' } : {}}>
              {endDate ? formatDate(endDate) : 'Select date'}
            </div>
          </div>
        </div>
        
        {/* Range Progress Bar */}
        {hasRange && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  backgroundColor: '#207f95',
                  width: '100%'
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Trip Duration</span>
              <span className="text-xs font-medium" style={{ color: '#207f95' }}>
                {duration}
              </span>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default DateRangeIndicator