import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register/', data),
  login: (username, password) => api.post('/auth/login/', { username, password }),
  refresh: (refresh_token) => api.post('/auth/refresh/', { refresh: refresh_token }),
};

export const userService = {
  getProfile: () => api.get('/user/profile/'),
  updateProfile: (data) => api.put('/user/profile/update/', data),
  getSessions: () => api.get('/user/sessions/'),
};

export const testService = {
  scaleTest: () => api.get('/scale/test/'),
  healthCheck: () => api.get('/health/'),
};

export default api;
