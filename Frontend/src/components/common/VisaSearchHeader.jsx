import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

const VisaSearchHeader = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    destination: '',
    nationality: 'Philippines',
    travelDate: '',
    applicants: 1,
    visaType: 'tourist'
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch?.(searchData);
  };

  const popularDestinations = [
    'Japan', 'South Korea', 'Singapore', 'Thailand', 'United States', 'Canada', 'Australia', 'United Kingdom'
  ];

  return (
    <div className="search-header">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Find Your Visa</h1>
          <p className="text-visa-teal-100">Search and apply for visas to destinations worldwide</p>
        </div>
        <div className="text-white text-right">
          <div className="text-sm opacity-90">Tuesday, Apr 15 2025</div>
          <div className="text-xs opacity-75">VISA APPLICATIONS</div>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Destination */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Destination Country
            </label>
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="input-field"
              value={searchData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
            />
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Travel Date
            </label>
            <input
              type="date"
              className="input-field"
              value={searchData.travelDate}
              onChange={(e) => handleInputChange('travelDate', e.target.value)}
            />
          </div>

          {/* Applicants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Applicants
            </label>
            <select
              className="input-field"
              value={searchData.applicants}
              onChange={(e) => handleInputChange('applicants', parseInt(e.target.value))}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button 
              className="btn-apply-now w-full flex items-center justify-center gap-2"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Visa Type Selection */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Visa Type</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'tourist', label: 'Tourist' },
              { id: 'business', label: 'Business' },
              { id: 'student', label: 'Student' },
              { id: 'work', label: 'Work' },
              { id: 'transit', label: 'Transit' }
            ].map(type => (
              <button
                key={type.id}
                className={searchData.visaType === type.id ? 'filter-button-active' : 'filter-button'}
                onClick={() => handleInputChange('visaType', type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="mt-6">
        <h3 className="text-white font-semibold mb-3">Popular Destinations</h3>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.map(destination => (
            <button
              key={destination}
              className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-sm hover:bg-opacity-30 transition-all duration-200"
              onClick={() => handleInputChange('destination', destination)}
            >
              {destination}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisaSearchHeader;
