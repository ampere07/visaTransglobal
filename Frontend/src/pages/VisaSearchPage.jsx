import React, { useState } from 'react';
import { ArrowUpDown, Filter as FilterIcon, Grid, List } from 'lucide-react';
import VisaSearchHeader from '../components/common/VisaSearchHeader';
import VisaFilter from '../components/common/VisaFilter';
import VisaCard from '../components/common/VisaCard';
import MobileTabBar from '../components/common/MobileTabBar';

const VisaSearchPage = () => {
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      country: 'Japan',
      visaType: 'Tourist Visa',
      price: 18702.76,
      processingTime: '5-7 Business Days',
      validity: '90 Days',
      entries: 'Multiple Entry',
      requirements: 8,
      urgentAvailable: true,
      rating: 4.8
    },
    {
      id: 2,
      country: 'South Korea',
      visaType: 'Tourist Visa',
      price: 15200.50,
      processingTime: '3-5 Business Days',
      validity: '90 Days',
      entries: 'Multiple Entry',
      requirements: 6,
      urgentAvailable: true,
      rating: 4.7
    },
    {
      id: 3,
      country: 'United States',
      visaType: 'Tourist Visa (B1/B2)',
      price: 45300.25,
      processingTime: '15-21 Business Days',
      validity: '10 Years',
      entries: 'Multiple Entry',
      requirements: 12,
      urgentAvailable: false,
      rating: 4.5
    },
    {
      id: 4,
      country: 'Canada',
      visaType: 'Visitor Visa',
      price: 38750.00,
      processingTime: '10-14 Business Days',
      validity: '10 Years',
      entries: 'Multiple Entry',
      requirements: 10,
      urgentAvailable: true,
      rating: 4.6
    }
  ]);

  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData);
    // Implement search logic here
  };

  const handleFilterChange = (filters) => {
    console.log('Filters:', filters);
    // Implement filter logic here
  };

  const handleSort = (option) => {
    setSortBy(option);
    // Implement sorting logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Search Header */}
        <VisaSearchHeader onSearch={handleSearch} />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="w-80 flex-shrink-0">
              <VisaFilter onFilterChange={handleFilterChange} />
            </div>

            {/* Right Content - Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Search Results
                    </h2>
                    <p className="text-sm text-gray-600">
                      Found {searchResults.length} visa options
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <select 
                      className="sort-button text-sm"
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="price">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="processing">Processing Time</option>
                      <option value="rating">Rating</option>
                    </select>

                    {/* View Mode */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className={`p-2 ${viewMode === 'grid' ? 'bg-visa-teal-500 text-white' : 'bg-white text-gray-600'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-2 ${viewMode === 'list' ? 'bg-visa-teal-500 text-white' : 'bg-white text-gray-600'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                {searchResults.map(visa => (
                  <VisaCard 
                    key={visa.id}
                    {...visa}
                    onClick={() => console.log('Clicked visa:', visa.id)}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button className="btn-outline px-8">
                  Load More Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Search Header */}
        <div className="bg-visa-teal-500 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Search Results</h1>
            <div className="text-white text-right">
              <div className="text-sm">Tue, Apr 15 2025</div>
              <div className="text-xs opacity-75">VISAS</div>
            </div>
          </div>
          
          {/* Mobile Controls */}
          <div className="flex gap-2">
            <button 
              className="sort-button bg-white text-visa-teal-600 flex-1 justify-center"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Filter
            </button>
            <select className="sort-button bg-white text-visa-teal-600 flex-1">
              <option>Sort</option>
              <option>Price: Low to High</option>
              <option>Processing Time</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {showMobileFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white h-full overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  className="btn-primary px-4 py-2"
                  onClick={() => setShowMobileFilter(false)}
                >
                  Done
                </button>
              </div>
              <VisaFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}

        {/* Mobile Results */}
        <div className="p-4 pb-20">
          <div className="space-y-4">
            {searchResults.map(visa => (
              <VisaCard 
                key={visa.id}
                {...visa}
                onClick={() => console.log('Clicked visa:', visa.id)}
              />
            ))}
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <MobileTabBar activeTab="visas" />
      </div>
    </div>
  );
};

export default VisaSearchPage;
