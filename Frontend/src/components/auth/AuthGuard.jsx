import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

const AuthGuard = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to home page with a state indicating login is needed
    return <Navigate to="/" state={{ from: location, requireAuth: true }} replace />
  }

  if (adminOnly && user?.userType !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AuthGuard