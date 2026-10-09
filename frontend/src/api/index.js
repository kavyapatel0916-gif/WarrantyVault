import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor: normalize error shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred.'
    const code = error.response?.data?.error?.code || 'UNKNOWN_ERROR'
    const status = error.response?.status || 0

    // If 401, the AuthContext will handle redirect
    return Promise.reject({ message, code, status, original: error })
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Products
export const productsAPI = {
  list: (params) => api.get('/products', { params }),
  create: (data) => api.post('/products', data),
  get: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

// Receipts
export const receiptsAPI = {
  listForProduct: (productId) => api.get(`/products/${productId}/receipts`),
  upload: (productId, formData) =>
    api.post(`/products/${productId}/receipts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (id) => api.get(`/receipts/${id}/download`, { responseType: 'blob' }),
  ocr: (id) => api.post(`/receipts/${id}/ocr`),
  delete: (id) => api.delete(`/receipts/${id}`),
}

// Service records
export const servicesAPI = {
  listForProduct: (productId) => api.get(`/products/${productId}/services`),
  create: (productId, data) => api.post(`/products/${productId}/services`, data),
  update: (id, data) => api.patch(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

// Dashboard
export const dashboardAPI = {
  summary: () => api.get('/dashboard/summary'),
}

export default api
