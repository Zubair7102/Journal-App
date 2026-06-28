import axios from 'axios';

const TOKEN_KEY = 'journal_app_token';
const USERNAME_KEY = 'journal_app_username';

export const getStoredToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);
export const getStoredUsername = (): string | null => sessionStorage.getItem(USERNAME_KEY);

export const setStoredAuth = (token: string, userName: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USERNAME_KEY, userName);
};

export const clearStoredAuth = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USERNAME_KEY);
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const isAuthRoute =
        error.config?.url?.includes('/public/login') ||
        error.config?.url?.includes('/public/signup');
      if (!isAuthRoute && getStoredToken()) {
        clearStoredAuth();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);
