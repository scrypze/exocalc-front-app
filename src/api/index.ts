import { Api } from './Api';

// Используем прокси в dev режиме, прямой адрес в production
const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return '/api'; // Используем прокси из vite.config.ts
  }
  // В production используем прямой адрес
  // По умолчанию используем те же значения, что и в vite.config.ts
  const host = import.meta.env.VITE_API_HOST || '172.20.10.4';
  const port = import.meta.env.VITE_API_PORT || '8443';
  const protocol = import.meta.env.VITE_API_PROTOCOL || 'https';
  return `${protocol}://${host}:${port}/api`;
};

export const api = new Api({
    baseURL: getBaseURL(),
});

api.instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
        }
        return Promise.reject(error);
    }
);

