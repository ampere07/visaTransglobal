import React from 'react'
import { X, Crown, CheckCircle, Download, FileText, Clock, Shield } from 'lucide-react'

const SubscriptionModal = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null

  const features = [
    {
      icon: FileText,
      title: 'Detailed Requirements',
      description: 'Complete visa requirements with step-by-step guidance'
    },
    {
      icon: Download,
      title: 'PDF Downloads',
      description: 'Download comprehensive requirement documents and forms'
    },
    {
      icon: Clock,
      title: 'Processing Times',
      description: 'Accurate processing timeframes for all visa types'
    },
    {
      icon: Shield,
      title: 'Premium Support',
      description: '24/7 priority customer support and consultation'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity modal-backdrop" onClick={onClose} />

        {/* Modal Container */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl relative border border-gray-100">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-gray-600 text-lg">
                Unlock full access to detailed visa requirements and downloadable documents
              </p>
            </div>

            {/* Restricted Feature Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Download className="w-5 h-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    Document Download Restricted
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This feature is available to premium subscribers only. Upgrade now to download detailed visa requirement documents.
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Premium Features Include:
              </h4>
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {feature.title}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600">
                  Full access to all premium features
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
              >
                Maybe Later
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">30-day money-back guarantee</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal