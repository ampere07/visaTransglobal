import React, { useState, useEffect } from 'react'
import { adminAPI } from '../utils/api'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar as CalendarIcon, 
  RefreshCw, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  FileText,
  Users,
  MapPin,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('calendar')
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { logout } = useAuth()
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 7)) // August 2024

  // Sample calendar events with appointments
  const sampleEvents = [
    {
      id: 1,
      title: 'System Maintenance',
      date: '2024-08-05',
      time: '02:00 AM',
      type: 'maintenance',
      description: 'Scheduled server maintenance and updates'
    },
    {
      id: 2,
      title: 'Client Meeting - Sarah Johnson',
      date: '2024-08-06',
      time: '10:00 AM',
      type: 'appointment',
      description: 'Visa consultation appointment'
    },
    {
      id: 3,
      title: 'Database Backup',
      date: '2024-08-07',
      time: '12:00 AM',
      type: 'backup',
      description: 'Automated database backup process'
    },
    {
      id: 4,
      title: 'Team Meeting',
      date: '2024-08-08',
      time: '03:00 PM',
      type: 'meeting',
      description: 'Weekly team coordination meeting'
    },
    {
      id: 5,
      title: 'Security Audit',
      date: '2024-08-09',
      time: '09:00 AM',
      type: 'security',
      description: 'Monthly security system audit'
    },
    {
      id: 6,
      title: 'Client Appointment - John Smith',
      date: '2024-08-12',
      time: '02:00 PM',
      type: 'appointment',
      description: 'Business visa application review'
    },
    {
      id: 7,
      title: 'System Update',
      date: '2024-08-15',
      time: '11:00 PM',
      type: 'maintenance',
      description: 'Scheduled system update deployment'
    },
    {
      id: 8,
      title: 'Client Call - Maria Garcia',
      date: '2024-08-18',
      time: '09:30 AM',
      type: 'appointment',
      description: 'Follow-up call for visa status'
    },
    {
      id: 9,
      title: 'Staff Training',
      date: '2024-08-20',
      time: '01:00 PM',
      type: 'training',
      description: 'New system features training'
    },
    {
      id: 10,
      title: 'Client Meeting - David Chen',
      date: '2024-08-22',
      time: '04:00 PM',
      type: 'appointment',
      description: 'Student visa consultation'
    },
    {
      id: 11,
      title: 'Monthly Review',
      date: '2024-08-25',
      time: '10:00 AM',
      type: 'meeting',
      description: 'Monthly performance review meeting'
    },
    {
      id: 12,
      title: 'Client Appointment - Ahmed Hassan',
      date: '2024-08-28',
      time: '03:30 PM',
      type: 'appointment',
      description: 'Tourist visa application meeting'
    }
  ]

  // Sample downloadable documents for visa applications
  const sampleDocuments = [
    {
      id: 1,
      title: 'Visa Application Form - Tourist Visa',
      category: 'Application Forms',
      fileType: 'PDF',
      fileSize: '2.3 MB',
      lastUpdated: '2024-08-01',
      downloads: 1247,
      description: 'Official tourist visa application form for all countries',
      countries: ['Philippines', 'Thailand', 'Vietnam', 'Malaysia'],
      status: 'active'
    },
    {
      id: 2,
      title: 'Business Visa Requirements Checklist',
      category: 'Checklists',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      lastUpdated: '2024-07-28',
      downloads: 892,
      description: 'Complete checklist of required documents for business visa',
      countries: ['Singapore', 'Japan', 'South Korea'],
      status: 'active'
    },
    {
      id: 3,
      title: 'Student Visa Application Guide',
      category: 'Guidelines',
      fileType: 'PDF',
      fileSize: '4.7 MB',
      lastUpdated: '2024-08-03',
      downloads: 634,
      description: 'Step-by-step guide for student visa application process',
      countries: ['Australia', 'Canada', 'New Zealand'],
      status: 'active'
    },
    {
      id: 4,
      title: 'Passport Photo Specifications',
      category: 'Requirements',
      fileType: 'PDF',
      fileSize: '875 KB',
      lastUpdated: '2024-07-15',
      downloads: 2156,
      description: 'Official passport photo size and quality requirements',
      countries: ['All Countries'],
      status: 'active'
    },
    {
      id: 5,
      title: 'Work Visa Document Template',
      category: 'Templates',
      fileType: 'DOCX',
      fileSize: '1.2 MB',
      lastUpdated: '2024-08-04',
      downloads: 445,
      description: 'Editable template for work visa supporting documents',
      countries: ['Canada', 'Australia', 'UK'],
      status: 'active'
    },
    {
      id: 6,
      title: 'Visa Fee Schedule 2024',
      category: 'Fee Information',
      fileType: 'PDF',
      fileSize: '956 KB',
      lastUpdated: '2024-07-01',
      downloads: 1789,
      description: 'Current visa processing fees for all visa types',
      countries: ['All Countries'],
      status: 'active'
    },
    {
      id: 7,
      title: 'Embassy Contact Directory',
      category: 'Contact Information',
      fileType: 'PDF',
      fileSize: '2.1 MB',
      lastUpdated: '2024-06-20',
      downloads: 723,
      description: 'Complete list of embassy contacts and addresses',
      countries: ['All Countries'],
      status: 'active'
    },
    {
      id: 8,
      title: 'Transit Visa Information Sheet',
      category: 'Guidelines',
      fileType: 'PDF',
      fileSize: '1.4 MB',
      lastUpdated: '2024-07-25',
      downloads: 312,
      description: 'Requirements and procedures for transit visas',
      countries: ['Singapore', 'UAE', 'Turkey'],
      status: 'active'
    },
    {
      id: 9,
      title: 'Bank Statement Requirements',
      category: 'Requirements',
      fileType: 'PDF',
      fileSize: '1.1 MB',
      lastUpdated: '2024-08-02',
      downloads: 1456,
      description: 'Financial documentation requirements for visa applications',
      countries: ['All Countries'],
      status: 'active'
    },
    {
      id: 10,
      title: 'Travel Insurance Guidelines',
      category: 'Requirements',
      fileType: 'PDF',
      fileSize: '2.8 MB',
      lastUpdated: '2024-07-30',
      downloads: 987,
      description: 'Travel insurance requirements and recommended providers',
      countries: ['Europe', 'Schengen Area'],
      status: 'draft'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return <Settings className="w-4 h-4" />
      case 'meeting': return <Users className="w-4 h-4" />
      case 'backup': return <RefreshCw className="w-4 h-4" />
      case 'training': return <FileText className="w-4 h-4" />
      case 'security': return <Bell className="w-4 h-4" />
      case 'appointment': return <UserCheck className="w-4 h-4" />
      default: return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'maintenance': return 'bg-red-100 text-red-800'
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'backup': return 'bg-green-100 text-green-800'
      case 'training': return 'bg-purple-100 text-purple-800'
      case 'security': return 'bg-orange-100 text-orange-800'
      case 'appointment': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0]
    return sampleEvents.filter(event => event.date === formattedDate)
  }

  const formatDateKey = (year, month, day) => {
    const monthStr = (month + 1).toString().padStart(2, '0')
    const dayStr = day.toString().padStart(2, '0')
    return `${year}-${monthStr}-${dayStr}`
  }

  const getSelectedDateEvents = () => {
    if (!selectedDate) return sampleEvents.slice(0, 5)
    const formattedDate = selectedDate.toISOString().split('T')[0]
    const dateEvents = sampleEvents.filter(event => event.date === formattedDate)
    return dateEvents.length > 0 ? dateEvents : []
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const getDocumentIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-600" />
      case 'DOCX': return <FileText className="w-5 h-5 text-blue-600" />
      case 'XLSX': return <FileText className="w-5 h-5 text-green-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Application Forms': return 'bg-blue-100 text-blue-800'
      case 'Checklists': return 'bg-green-100 text-green-800'
      case 'Guidelines': return 'bg-purple-100 text-purple-800'
      case 'Requirements': return 'bg-orange-100 text-orange-800'
      case 'Templates': return 'bg-teal-100 text-teal-800'
      case 'Fee Information': return 'bg-yellow-100 text-yellow-800'
      case 'Contact Information': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calendar grid component
  const CalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 md:h-24"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dayEvents = sampleEvents.filter(event => event.date === dateKey)
      const isSelected = selectedDate && selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() &&
                        selectedDate.getFullYear() === currentMonth.getFullYear()
      const isToday = new Date().toDateString() === date.toDateString()
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-20 md:h-24 border border-gray-200 p-1 md:p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isSelected ? 'bg-primary-50 border-primary-500' : ''
          } ${
            isToday ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {day}
          </div>
          <div className="flex flex-wrap gap-1">
            {dayEvents.slice(0, 3).map((event, index) => {
              return (
                <div
                  key={index}
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs ${
                    getEventTypeColor(event.type)
                  }`}
                  title={`${event.time} - ${event.title}`}
                >
                  {React.cloneElement(getEventTypeIcon(event.type), { className: "w-2 h-2 md:w-3 md:h-3" })}
                </div>
              )
            })}
            {dayEvents.length > 3 && (
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                +{dayEvents.length - 3}
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {dayNames.map(dayName => (
            <div key={dayName} className="bg-gray-100 p-2 md:p-3 text-center">
              <div className="text-xs md:text-sm font-medium text-gray-700">{dayName}</div>
            </div>
          ))}
          {days}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-2 h-2 text-teal-800" />
            </div>
            <span className="text-gray-600">Appointments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-2 h-2 text-blue-800" />
            </div>
            <span className="text-gray-600">Meetings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center">
              <Settings className="w-2 h-2 text-red-800" />
            </div>
            <span className="text-gray-600">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-2 h-2 text-green-800" />
            </div>
            <span className="text-gray-600">Backup</span>
          </div>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'update', name: 'Document Updates', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  if (loading && activeTab === 'calendar') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white shadow-lg transition-all duration-300 z-50
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-auto
        fixed left-0 top-0 h-full
        ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'}
        w-64 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Admin Panel</h2>
                <p className="text-xs md:text-sm text-gray-500">Management Dashboard</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              {/* Mobile close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              {/* Desktop collapse button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 group touch-manipulation ${
                      activeTab === item.id
                        ? 'bg-secondary-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                    title={sidebarCollapsed && !mobileMenuOpen ? item.name : ''}
                  >
                    <Icon className={`w-5 h-5 ${
                      sidebarCollapsed && !mobileMenuOpen ? 'mx-auto' : 'mr-3'
                    } ${
                      activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-primary-700'
                    }`} />
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <span className="font-medium text-sm md:text-base">{item.name}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200">
          {(!sidebarCollapsed || mobileMenuOpen) ? (
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 touch-manipulation"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700 touch-manipulation"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 capitalize">
              {activeTab === 'update' ? 'Document Updates' : activeTab.replace('-', ' ')}
            </h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Desktop Content Header */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'update' ? 'Document Updates' : activeTab.replace('-', ' ')}
              </h1>
              <p className="text-gray-600 text-sm mt-1 hidden md:block">
                {activeTab === 'calendar' && 'Manage scheduled events, meetings, and appointments'}
                {activeTab === 'update' && 'Manage and update visa application documents and resources'}
                {activeTab === 'settings' && 'System configuration and preferences'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {/* Calendar Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Calendar & Appointments</h2>
                  <p className="text-gray-600">Manage your scheduled events, meetings, and appointments</p>
                </div>
                <button className="btn-primary flex items-center justify-center md:justify-start px-4 py-2 text-sm touch-manipulation">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <UserCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleEvents.filter(e => e.type === 'appointment').length}</p>
                      <p className="text-xs text-gray-600">Appointments</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleEvents.filter(e => e.type === 'meeting').length}</p>
                      <p className="text-xs text-gray-600">Meetings</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Settings className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleEvents.filter(e => e.type === 'maintenance').length}</p>
                      <p className="text-xs text-gray-600">Maintenance</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleEvents.length}</p>
                      <p className="text-xs text-gray-600">Total Events</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <CalendarGrid />

              {/* Selected Date Events or Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedDate 
                      ? `Events for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                      : 'Upcoming Events'
                    }
                  </h3>
                  {selectedDate && (
                    <button 
                      onClick={() => setSelectedDate(null)}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      View All Events
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {getSelectedDateEvents().length > 0 ? (
                    getSelectedDateEvents().map((event) => (
                      <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.description}</p>
                              <div className="flex items-center mt-1 space-x-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{event.date}</p>
                              <p className="text-xs text-gray-500">{event.time}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded touch-manipulation">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded touch-manipulation">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {selectedDate ? 'No events scheduled for this date.' : 'No upcoming events.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'update' && (
            <div className="space-y-6">
              {/* Documents Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Document Updates</h2>
                  <p className="text-gray-600">Manage and update visa forms, guides, and resources</p>
                </div>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  <button className="btn-secondary flex items-center justify-center px-4 py-2 text-sm touch-manipulation">
                    <Search className="w-4 h-4 mr-2" />
                    Search Documents
                  </button>
                  <button className="btn-primary flex items-center justify-center px-4 py-2 text-sm touch-manipulation">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </button>
                </div>
              </div>

              {/* Document Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleDocuments.filter(d => d.status === 'active').length}</p>
                      <p className="text-xs text-gray-600">Active Documents</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleDocuments.reduce((sum, doc) => sum + doc.downloads, 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Total Downloads</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{new Set(sampleDocuments.flatMap(d => d.countries)).size}</p>
                      <p className="text-xs text-gray-600">Countries Covered</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-900">{sampleDocuments.filter(d => d.status === 'draft').length}</p>
                      <p className="text-xs text-gray-600">Pending Review</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Categories Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Document Library</h3>
                  <div className="flex flex-wrap gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm">
                      <option>All Categories</option>
                      <option>Application Forms</option>
                      <option>Checklists</option>
                      <option>Guidelines</option>
                      <option>Requirements</option>
                      <option>Templates</option>
                      <option>Fee Information</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm">
                      <option>All File Types</option>
                      <option>PDF</option>
                      <option>DOCX</option>
                      <option>XLSX</option>
                    </select>
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="grid gap-4 md:gap-6">
                  {sampleDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            {getDocumentIcon(doc.fileType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1">{doc.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.category)}`}>
                                {doc.category}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doc.status === 'active' ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <span>Countries: {doc.countries.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                          <div className="text-center md:text-right">
                            <p className="text-sm font-medium text-gray-900">{doc.downloads.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Downloads</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-sm font-medium text-gray-900">{doc.fileSize}</p>
                            <p className="text-xs text-gray-500">{doc.fileType}</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-sm font-medium text-gray-900">{doc.lastUpdated}</p>
                            <p className="text-xs text-gray-500">Updated</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg touch-manipulation" title="Preview">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg touch-manipulation" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg touch-manipulation" title="Update">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg touch-manipulation" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Update Document Section */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Update or Add Document</h4>
                    <p className="text-gray-600 mb-4">Upload new versions or add new documents here</p>
                    <button className="btn-primary px-6 py-2 text-sm">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">System Settings</h3>
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Maintenance Mode</p>
                        <p className="text-sm text-gray-500">Enable maintenance mode for system updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Auto-backup System</p>
                        <p className="text-sm text-gray-500">Automatically backup system data daily</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Send notifications for important events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg space-y-3 md:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">System Monitoring</p>
                        <p className="text-sm text-gray-500">Enable real-time system performance monitoring</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">System Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Backup Frequency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Log Retention (Days)</label>
                      <input 
                        type="number" 
                        defaultValue="30" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Session Timeout (Minutes)</label>
                      <input 
                        type="number" 
                        defaultValue="60" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Maximum File Size (MB)</label>
                      <input 
                        type="number" 
                        defaultValue="10" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    <button className="btn-primary flex items-center justify-center w-full md:w-auto px-6 py-3 touch-manipulation">
                      <Settings className="w-4 h-4 mr-2" />
                      Save Settings
                    </button>
                    <button className="btn-secondary flex items-center justify-center w-full md:w-auto px-6 py-3 touch-manipulation">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel