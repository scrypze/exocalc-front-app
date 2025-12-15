import { Api } from './Api';

const TOKEN_KEY = 'access_token';

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

let accessToken: string | null =
  typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_KEY) : null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};

export const api = new Api({
  baseURL: getBaseURL(),
});

api.instance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
