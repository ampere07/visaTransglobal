import React, { useState, useEffect } from 'react'

const FloatingInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  onBlur,
  onFocus,
  error, 
  required = false, 
  options = [], 
  register = null,
  watch = null,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  // Get current value from either controlled value prop or react-hook-form watch
  const currentValue = watch ? watch(name) : value

  useEffect(() => {
    setHasValue(currentValue && currentValue.toString().trim() !== '')
  }, [currentValue])

  const handleFocus = (e) => {
    setIsFocused(true)
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setHasValue(value && value.trim() !== '')
    if (onChange) onChange(e)
  }

  const isLabelActive = isFocused || hasValue

  // For react-hook-form integration
  const inputProps = register ? register(name, { 
    required: required ? `${label} is required` : false,
    ...(type === 'email' && {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      }
    })
  }) : {
    name,
    value: currentValue || '',
    onChange: handleChange
  }

  if (type === 'select') {
    return (
      <div className={`select-group ${className}`}>
        <select
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`select-floating ${hasValue || isFocused ? 'has-value' : ''}`}
          {...props}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.value || option.code} value={option.value || option.code}>
              {option.label || option.name || option.flag + ' ' + option.name}
            </option>
          ))}
        </select>
        <label 
          className={`label-floating ${isLabelActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
        >
          {label} {required && '*'}
        </label>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className={`input-group ${className}`}>
        <textarea
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`textarea-floating ${hasValue || isFocused ? 'has-value' : ''}`}
          rows={3}
          placeholder=""
          {...props}
        />
        <label 
          className={`label-floating ${isLabelActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
        >
          {label} {required && '*'}
        </label>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }

  if (type === 'date') {
    return (
      <div className={`input-group ${className}`}>
        <input
          type="date"
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`date-floating ${hasValue || isFocused ? 'has-value' : ''}`}
          placeholder=""
          {...props}
        />
        <label 
          className={`label-floating ${isLabelActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
        >
          {label} {required && '*'}
        </label>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }

  // Default text/email/tel input
  return (
    <div className={`input-group ${className}`}>
      <input
        type={type}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`input-floating ${hasValue || isFocused ? 'has-value' : ''}`}
        placeholder=""
        {...props}
      />
      <label 
        className={`label-floating ${isLabelActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`}
      >
        {label} {required && '*'}
      </label>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default FloatingInput
