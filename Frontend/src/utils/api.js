import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const visaAPI = {
  getCountries: () => api.get('/visa/countries'),
  getVisaTypes: (country) => api.get(`/visa/types/${country}`),
  getRequirements: (id) => api.get(`/visa/requirements/${id}`),
  searchVisa: (params) => api.get('/visa/search', { params }),
  getVisaMatrix: () => api.get('/visa/matrix'),
}

export const applicationAPI = {
  submit: (data) => api.post('/applications', data),
  getUserApplications: () => api.get('/applications/user'),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getVisaTypes: () => api.get('/admin/visa-types'),
  createVisaType: (data) => api.post('/admin/visa-types', data),
  updateVisaType: (id, data) => api.put(`/admin/visa-types/${id}`, data),
  getAppointments: (params) => api.get('/admin/appointments', { params }),
  createAppointment: (data) => api.post('/admin/appointments', data),
}

export const uploadAPI = {
  uploadDocument: (file) => {
    const formData = new FormData()
    formData.append('document', file)
    return api.post('/uploads/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadPDF: (file) => {
    const formData = new FormData()
    formData.append('pdf', file)
    return api.post('/uploads/requirements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  downloadFile: (filename) => api.get(`/uploads/download/${filename}`, {
    responseType: 'blob'
  }),
  deleteFile: (filename) => api.delete(`/uploads/${filename}`),
}

export default api