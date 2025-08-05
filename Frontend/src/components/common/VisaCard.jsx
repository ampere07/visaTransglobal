import React from 'react';
import { MapPin, Clock, Users, Star, AlertCircle, Eye, ArrowRight, CreditCard } from 'lucide-react';

const VisaCard = ({ 
  country, 
  visaType, 
  price, 
  processingTime, 
  validity, 
  entries, 
  requirements, 
  urgentAvailable = false,
  rating = 4.5,
  onClick 
}) => {
  return (
    <div className="visa-result-card" onClick={onClick}>
      {/* Header Section - matches flight booking teal header */}
      <div className="visa-header">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <span className="font-semibold text-sm">VISA APPLICATION</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-current text-yellow-300" />
          <span className="text-sm">{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="visa-content">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="visa-country">{country}</h3>
            <p className="visa-type">{visaType}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Clock className="btn-icon-sm text-gray-500" />
                <span className="processing-time">{processingTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="btn-icon-sm text-gray-500" />
                <span className="processing-time">{entries}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="visa-price">₱{price.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Per Person</p>
          </div>
        </div>

        {/* Requirements and Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-teal">Valid {validity}</span>
          {urgentAvailable && (
            <span className="visa-urgent inline-flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Urgent Available</span>
            </span>
          )}
          <span className="visa-tag">{requirements} Documents</span>
        </div>

        {/* Action Buttons with Perfect Icon Alignment */}
        <div className="flex gap-3">
          <button className="btn-outline flex-1">
            <Eye className="btn-icon-sm" />
            <span>View Details</span>
          </button>
          <button className="btn-apply-now group">
            <CreditCard className="btn-icon-sm" />
            <span>Apply Now</span>
            <ArrowRight className="btn-icon-sm group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
