import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (zustand persist)
    const authState = localStorage.getItem('vera-auth');
    if (authState) {
      try {
        const { state } = JSON.parse(authState);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';

      // Handle 401 - unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('vera-auth');
        window.location.href = '/login';
      }

      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error('Network error. Please try again.'));
  }
);

export default api;
