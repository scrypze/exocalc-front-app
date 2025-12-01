// Всегда используем относительный путь для проксирования через Vite/веб-сервер
// Прокси настроен в vite.config.ts для dev/preview режимов
// На production сервере должен быть настроен reverse proxy (nginx/apache)
const baseURL = '/api';

export const API_CONFIG = {
  baseURL,
};
