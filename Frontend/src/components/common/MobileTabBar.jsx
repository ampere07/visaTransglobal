import React from 'react';
import { Shield, Plane, Ship, Hotel, MapPin } from 'lucide-react';

const MobileTabBar = ({ activeTab = 'visas', onTabChange }) => {
  const tabs = [
    {
      id: 'visas',
      label: 'Visas',
      icon: Shield,
      color: 'text-visa-orange-500',
      available: true
    },
    {
      id: 'travel',
      label: 'Travel',
      icon: Plane,
      color: 'text-gray-400',
      available: false
    },
    {
      id: 'transport',
      label: 'Transport',
      icon: Ship,
      color: 'text-gray-400',
      available: false
    },
    {
      id: 'hotels',
      label: 'Hotels',
      icon: Hotel,
      color: 'text-gray-400',
      available: false
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: MapPin,
      color: 'text-gray-400',
      available: false
    }
  ];

  return (
    <div className="mobile-tab-bar">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const isAvailable = tab.available;
          
          return (
            <button
              key={tab.id}
              className={isActive ? 'mobile-tab-active' : 'mobile-tab-inactive'}
              onClick={() => isAvailable && onTabChange?.(tab.id)}
              disabled={!isAvailable}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${
                isActive && isAvailable ? tab.color : 'text-gray-400'
              }`} />
              <span className={`font-medium ${
                isActive && isAvailable ? tab.color : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
              {isActive && isAvailable && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-visa-orange-500 rounded-b-full"></div>
              )}
              {!isAvailable && (
                <div className="absolute top-2 right-2 text-xs text-gray-400">Soon</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;
