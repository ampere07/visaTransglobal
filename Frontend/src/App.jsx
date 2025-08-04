import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import VisaInformation from './pages/VisaInformation'
import ApplicationProcess from './pages/ApplicationProcess'
import UserDashboard from './pages/UserDashboard'
import AdminPanel from './pages/AdminPanel'
import AuthGuard from './components/auth/AuthGuard'

function AppLayout() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visa-information" element={<VisaInformation />} />
          <Route 
            path="/application" 
            element={
              <AuthGuard>
                <ApplicationProcess />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <UserDashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AuthGuard adminOnly>
                <AdminPanel />
              </AuthGuard>
            } 
          />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

export default App