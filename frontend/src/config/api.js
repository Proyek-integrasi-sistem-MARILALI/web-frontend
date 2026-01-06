const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

// Notify all pending requests that the token has been refreshed
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Add request to queue while token is being refreshed
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

export const api = {
  baseURL: API_BASE_URL,
  
  // Helper to get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
  
  // Generic request handler with automatic token refresh on 401
  request: async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...api.getAuthHeaders(),
          ...options.headers,
        },
      });
      
      // Handle 401 - Token expired, try to refresh
      if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, logout
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }

        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve) => {
            addRefreshSubscriber((token) => {
              // Retry original request with new token
              options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
              };
              resolve(api.request(endpoint, options));
            });
          });
        }

        // Start refresh process
        isRefreshing = true;

        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Token refresh failed');
          }

          const refreshData = await refreshResponse.json();
          const newToken = refreshData.access_token;
          
          // Store new token
          localStorage.setItem('token', newToken);
          
          // Notify all queued requests
          onRefreshed(newToken);
          isRefreshing = false;

          // Retry original request with new token
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          };
          return api.request(endpoint, options);
        } catch (refreshError) {
          isRefreshing = false;
          // Refresh failed, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }
      
      // Handle other non-OK responses
      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If error response isn't JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      // Parse successful response
      return await response.json();
    } catch (error) {
      // Network errors or other fetch errors
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
  
  // Convenience methods for common HTTP verbs
  get: (endpoint) => api.request(endpoint, { method: 'GET' }),
  
  post: (endpoint, data) => api.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => api.request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
  
  // Special method for form data (login uses form-urlencoded)
  postForm: async (endpoint, data) => {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...api.getAuthHeaders(),
        },
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
};

export default api;
