import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

const VisaFilter = ({ onFilterChange }) => {
  const [openSections, setOpenSections] = useState({
    visaType: true,
    price: true,
    processing: true,
    validity: true
  });

  const [filters, setFilters] = useState({
    visaType: [],
    priceRange: [0, 100000],
    processingTime: [],
    validity: [],
    urgentOnly: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category, value, checked) => {
    const newFilters = { ...filters };
    
    if (category === 'urgentOnly') {
      newFilters[category] = checked;
    } else if (Array.isArray(newFilters[category])) {
      if (checked) {
        newFilters[category].push(value);
      } else {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      }
    }
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="filter-section">
      <div 
        className="filter-header cursor-pointer"
        onClick={() => toggleSection(section)}
      >
        <div className="flex items-center justify-between">
          <span>{title}</span>
          {openSections[section] ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
          }
        </div>
      </div>
      {openSections[section] && (
        <div className="p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxFilter = ({ category, value, label, count }) => (
    <label className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-visa-teal-500 focus:ring-visa-teal-500"
          onChange={(e) => handleFilterChange(category, value, e.target.checked)}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      {count && <span className="text-xs text-gray-500">({count})</span>}
    </label>
  );

  return (
    <div className="w-full max-w-xs">
      {/* Filter Header */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-visa-teal-600" />
          <h2 className="font-semibold text-gray-900">Filter Your Search</h2>
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button className="filter-button">Best Deals</button>
          <button className="filter-button">Fastest</button>
          <button className="filter-button">Low Price</button>
        </div>
      </div>

      {/* Visa Type Filter */}
      <FilterSection title="Visa Type" section="visaType">
        <CheckboxFilter category="visaType" value="tourist" label="Tourist Visa" count={24} />
        <CheckboxFilter category="visaType" value="business" label="Business Visa" count={18} />
        <CheckboxFilter category="visaType" value="student" label="Student Visa" count={12} />
        <CheckboxFilter category="visaType" value="work" label="Work Visa" count={8} />
        <CheckboxFilter category="visaType" value="transit" label="Transit Visa" count={6} />
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>₱{filters.priceRange[0].toLocaleString()}</span>
            <span>₱{filters.priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(filters.priceRange[1] / 100000) * 100}%, #e5e7eb ${(filters.priceRange[1] / 100000) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <CheckboxFilter category="priceRange" value="0-10000" label="Under ₱10K" count={15} />
            <CheckboxFilter category="priceRange" value="10000-25000" label="₱10K-25K" count={22} />
            <CheckboxFilter category="priceRange" value="25000-50000" label="₱25K-50K" count={18} />
            <CheckboxFilter category="priceRange" value="50000+" label="Above ₱50K" count={8} />
          </div>
        </div>
      </FilterSection>

      {/* Processing Time Filter */}
      <FilterSection title="Processing Time" section="processing">
        <CheckboxFilter category="processingTime" value="1-3" label="1-3 Business Days" count={8} />
        <CheckboxFilter category="processingTime" value="4-7" label="4-7 Business Days" count={25} />
        <CheckboxFilter category="processingTime" value="8-15" label="1-2 Weeks" count={32} />
        <CheckboxFilter category="processingTime" value="16-30" label="2-4 Weeks" count={18} />
      </FilterSection>

      {/* Validity Period Filter */}
      <FilterSection title="Validity Period" section="validity">
        <CheckboxFilter category="validity" value="30" label="30 Days" count={12} />
        <CheckboxFilter category="validity" value="90" label="90 Days" count={28} />
        <CheckboxFilter category="validity" value="180" label="6 Months" count={22} />
        <CheckboxFilter category="validity" value="365" label="1 Year" count={15} />
      </FilterSection>

      {/* Special Options */}
      <div className="filter-section">
        <div className="p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-visa-orange-500 focus:ring-visa-orange-500"
              onChange={(e) => handleFilterChange('urgentOnly', null, e.target.checked)}
            />
            <span className="text-sm text-gray-700">Urgent Processing Available</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <button className="w-full btn-outline mt-4">
        Clear All Filters
      </button>
    </div>
  );
};

export default VisaFilter;
