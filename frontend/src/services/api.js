import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

// Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Purchase API
export const purchaseAPI = {
  getUserPurchases: async () => {
    const response = await api.get('/purchases/');
    return response.data;
  },
  
  createPurchase: async (data) => {
    const response = await api.post('/purchases/', data);
    return response.data;
  },
};

// Email API
export const emailAPI = {
  saveEmail: async (email) => {
    const response = await api.post('/emails/', { email });
    return response.data;
  },
  
  getAllEmails: async () => {
    const response = await api.get('/emails/');
    return response.data;
  },
};

// Purchase Request API
export const purchaseRequestAPI = {
  createRequest: async (data) => {
    const response = await api.post('/purchase-requests/', data);
    return response.data;
  },
  
  getUserRequests: async () => {
    const response = await api.get('/purchase-requests/');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  banUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/ban`);
    return response.data;
  },
  
  unbanUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unban`);
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  deleteEmail: async (emailId) => {
    const response = await api.delete(`/admin/emails/${emailId}`);
    return response.data;
  },
  
  getPurchaseRequests: async () => {
    const response = await api.get('/admin/purchase-requests');
    return response.data;
  },
  
  updateRequestStatus: async (requestId, status) => {
    const response = await api.put(`/admin/purchase-requests/${requestId}/status?status=${status}`);
    return response.data;
  },
  
  deleteRequest: async (requestId) => {
    const response = await api.delete(`/admin/purchase-requests/${requestId}`);
    return response.data;
  },
};

// User Profile API
export const userAPI = {
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/request-reset', { email });
    return response.data;
  },
  
  resetPassword: async (token, new_password) => {
    const response = await api.post('/auth/reset-password', { token, new_password });
    return response.data;
  },
};

export default api;
