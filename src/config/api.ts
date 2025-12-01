const API_HOST = import.meta.env.VITE_API_HOST || '172.20.10.4';
const API_PORT = import.meta.env.VITE_API_PORT || '8443';
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'https';

const baseURL = import.meta.env.MODE === 'production'
  ? `${API_PROTOCOL}://${API_HOST}:${API_PORT}/api`
  : '/api';

export const API_CONFIG = {
  baseURL,
};
