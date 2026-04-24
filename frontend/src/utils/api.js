import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept refresh or logout requests to prevent infinite loops
    if (originalRequest.url.includes('/api/auth/refresh') || originalRequest.url.includes('/api/auth/logout')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token using httpOnly cookie
        const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        
        const newAccessToken = res.data.data.accessToken;
        
        // Update store
        useAuthStore.getState().setAccessToken(newAccessToken);
        
        // Attach new token and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, silently clear local auth state
        useAuthStore.getState().setAccessToken(null);
        useAuthStore.setState({ user: null, isAuthenticated: false });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
