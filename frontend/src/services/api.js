/**
 * ParkEase API Service Layer
 * This service handles all API calls to the backend
 * Currently configured for mock data, ready for backend integration
 */

const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) || 'http://localhost:3000/api';
const API_TIMEOUT = 30000;

// Helper function for API calls with error handling
async function apiCall(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = true,
  } = options

  try {
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    // Add auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem('parkease_token')
      if (token) {
        requestOptions.headers['Authorization'] = `Bearer ${token}`
      }
    }

    // Add request body if provided
    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`API Call Failed: ${endpoint}`, error)
    return { success: false, error: error.message }
  }
}

// ============================================
// AUTH ENDPOINTS
// ============================================
export const authAPI = {
  signup: async (userData) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: userData,
      requiresAuth: false,
    })
  },

  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: credentials,
      requiresAuth: false,
    })
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    })
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('parkease_refresh_token')
    return apiCall('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      requiresAuth: false,
    })
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    })
  },
}

// ============================================
// PARKING SLOTS ENDPOINTS
// ============================================
export const slotsAPI = {
  searchSlots: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/slots?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getSlotById: async (slotId) => {
    return apiCall(`/slots/${slotId}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  createSlot: async (slotData) => {
    return apiCall('/slots', {
      method: 'POST',
      body: slotData,
      requiresAuth: true,
    })
  },

  updateSlot: async (slotId, slotData) => {
    return apiCall(`/slots/${slotId}`, {
      method: 'PATCH',
      body: slotData,
      requiresAuth: true,
    })
  },

  deleteSlot: async (slotId) => {
    return apiCall(`/slots/${slotId}`, {
      method: 'DELETE',
      requiresAuth: true,
    })
  },

  checkAvailability: async (slotId, checkIn, checkOut) => {
    return apiCall('/slots/check-availability', {
      method: 'POST',
      body: { slotId, checkIn, checkOut },
      requiresAuth: true,
    })
  },
}

// ============================================
// RESERVATIONS ENDPOINTS
// ============================================
export const reservationsAPI = {
  createReservation: async (reservationData) => {
    return apiCall('/reservations', {
      method: 'POST',
      body: reservationData,
      requiresAuth: true,
    })
  },

  getReservationById: async (reservationId) => {
    return apiCall(`/reservations/${reservationId}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getUserReservations: async (userId) => {
    return apiCall(`/users/${userId}/reservations`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  updateReservation: async (reservationId, reservationData) => {
    return apiCall(`/reservations/${reservationId}`, {
      method: 'PATCH',
      body: reservationData,
      requiresAuth: true,
    })
  },

  cancelReservation: async (reservationId, reason = '') => {
    return apiCall(`/reservations/${reservationId}/cancel`, {
      method: 'PATCH',
      body: { reason },
      requiresAuth: true,
    })
  },

  listReservations: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/reservations?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

// ============================================
// PAYMENTS ENDPOINTS
// ============================================
export const paymentsAPI = {
  createPayment: async (paymentData) => {
    return apiCall('/payments', {
      method: 'POST',
      body: paymentData,
      requiresAuth: true,
    })
  },

  getPaymentById: async (paymentId) => {
    return apiCall(`/payments/${paymentId}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  refundPayment: async (paymentId) => {
    return apiCall(`/payments/${paymentId}/refund`, {
      method: 'POST',
      requiresAuth: true,
    })
  },

  getPaymentHistory: async (userId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/users/${userId}/payments?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

// ============================================
// TICKETS ENDPOINTS
// ============================================
export const ticketsAPI = {
  generateTicket: async (reservationId) => {
    return apiCall(`/reservations/${reservationId}/ticket`, {
      method: 'POST',
      requiresAuth: true,
    })
  },

  getTicket: async (reservationId) => {
    return apiCall(`/reservations/${reservationId}/ticket`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  verifyEntry: async (entryCode) => {
    return apiCall('/tickets/verify-entry', {
      method: 'POST',
      body: { entryCode },
      requiresAuth: false,
    })
  },
}

// ============================================
// VEHICLES ENDPOINTS
// ============================================
export const vehiclesAPI = {
  getUserVehicles: async (userId) => {
    return apiCall(`/users/${userId}/vehicles`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getVehicleById: async (vehicleId) => {
    return apiCall(`/vehicles/${vehicleId}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  createVehicle: async (vehicleData) => {
    return apiCall('/vehicles', {
      method: 'POST',
      body: vehicleData,
      requiresAuth: true,
    })
  },

  updateVehicle: async (vehicleId, vehicleData) => {
    return apiCall(`/vehicles/${vehicleId}`, {
      method: 'PATCH',
      body: vehicleData,
      requiresAuth: true,
    })
  },

  deleteVehicle: async (vehicleId) => {
    return apiCall(`/vehicles/${vehicleId}`, {
      method: 'DELETE',
      requiresAuth: true,
    })
  },

  verifyVehicle: async (vehicleId) => {
    return apiCall(`/vehicles/${vehicleId}/verify`, {
      method: 'PATCH',
      requiresAuth: true,
    })
  },
}

// ============================================
// USERS ENDPOINTS
// ============================================
export const usersAPI = {
  getUserProfile: async (userId) => {
    return apiCall(`/users/${userId}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  updateUserProfile: async (userId, userData) => {
    return apiCall(`/users/${userId}`, {
      method: 'PATCH',
      body: userData,
      requiresAuth: true,
    })
  },

  suspendUser: async (userId) => {
    return apiCall(`/users/${userId}/suspend`, {
      method: 'PATCH',
      requiresAuth: true,
    })
  },

  activateUser: async (userId) => {
    return apiCall(`/users/${userId}/activate`, {
      method: 'PATCH',
      requiresAuth: true,
    })
  },
}

// ============================================
// APPROVALS / ADMIN ENDPOINTS
// ============================================
export const approvalsAPI = {
  getPendingApprovals: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/approvals/pending?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  approveRegistration: async (approvalId, approvalData) => {
    return apiCall(`/approvals/${approvalId}/approve`, {
      method: 'POST',
      body: approvalData,
      requiresAuth: true,
    })
  },

  rejectRegistration: async (approvalId, reason = '') => {
    return apiCall(`/approvals/${approvalId}/reject`, {
      method: 'POST',
      body: { reason },
      requiresAuth: true,
    })
  },

  getApprovalById: async (approvalId) => {
    return apiCall(`/approvals/${approvalId}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

// ============================================
// REPORTS & STATISTICS ENDPOINTS
// ============================================
export const reportsAPI = {
  getOverview: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/reports/overview?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getRevenueReport: async (from, to) => {
    return apiCall(`/reports/revenue?from=${from}&to=${to}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getOccupancyReport: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/reports/occupancy?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },

  getUserGrowthReport: async () => {
    return apiCall('/reports/user-growth', {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

// ============================================
// WALK-INS ENDPOINTS
// ============================================
export const walkinsAPI = {
  createWalkIn: async (walkInData) => {
    return apiCall('/walkins', {
      method: 'POST',
      body: walkInData,
      requiresAuth: true,
    })
  },

  getWalkIns: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return apiCall(`/walkins?${queryParams}`, {
      method: 'GET',
      requiresAuth: true,
    })
  },
}

export default {
  authAPI,
  slotsAPI,
  reservationsAPI,
  paymentsAPI,
  ticketsAPI,
  vehiclesAPI,
  usersAPI,
  approvalsAPI,
  reportsAPI,
  walkinsAPI,
}
