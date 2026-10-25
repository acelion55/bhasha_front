import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token from localStorage as fallback for cross-domain
api.interceptors.request.use((config) => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Store token from response
api.interceptors.response.use(
  (response) => {
    // If backend returns token in body (for cross-domain)
    if (response.data?.accessToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.accessToken);
      }
    }
    return response;
  },
  (error) => {
    // Drop any stale token when the session is no longer valid
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
  },
);
