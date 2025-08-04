import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Mail, Phone, MapPin, Globe, Clock } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ADOBO VISA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
                <Mail className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lorem Ipsum</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/visa-information" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Lorem Ipsum
                </Link>
              </li>
              <li>
                <Link to="/visa-information" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Lorem Ipsum
                </Link>
              </li>
              <li>
                <Link to="/visa-information" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Lorem Ipsum
                </Link>
              </li>
              <li>
                <Link to="/visa-information" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Lorem Ipsum
                </Link>
              </li>
              <li>
                <Link to="/application" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Lorem Ipsum
                </Link>
              </li>
              <li>
                <Link to="/application" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Lorem Ipsum
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Application Status
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">+63 Lorem Ipsum</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400">Lorem Ipsum@Lorem Ipsum.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                  <p>Lorem Ipsum</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} ADOBOVISA. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer