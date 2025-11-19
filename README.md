# Экзопланетный калькулятор

React-приложение для работы со звёздами и их свойствами. Позволяет просматривать список звёзд, изучать их детальные характеристики и формировать заявки на расчёты.

## Технологии

- React 19
- TypeScript
- Vite
- React Router DOM
- Redux Toolkit

## Функциональность

1. **Список звёзд** - главная страница со списком звёзд и поиском
2. **Детальная страница звезды** - просмотр всех характеристик звезды
3. **Выбранные звёзды** - корзина для формирования заявки на расчёты

## Установка и запуск

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для production
```bash
npm run build
```

### Предпросмотр production сборки
```bash
npm run preview
```

## Структура проекта

```
src/
├── components/       # Переиспользуемые компоненты
│   ├── Header.tsx
│   └── Header.css
├── pages/           # Страницы приложения
│   ├── StarsList.tsx
│   ├── StarsList.css
│   ├── StarDetail.tsx
│   ├── StarDetail.css
│   ├── SelectedStars.tsx
│   └── SelectedStars.css
├── data/            # Mock данные
│   └── stars.ts
├── types/           # TypeScript типы
│   └── index.ts
├── App.tsx          # Главный компонент с роутингом
└── main.tsx         # Точка входа
```

## Основные возможности

- **Поиск звёзд** по названию
- **Добавление звёзд в заявку** с возможностью добавления комментариев
- **Навигация** между страницами с помощью React Router
- **Сохранение состояния** выбранных звёзд в localStorage
- **Адаптивный дизайн** с использованием CSS Grid и Flexbox
- **TypeScript** для типобезопасности

## Настройка подключения к API

Приложение настроено для работы с бэкенд API через IP адрес в локальной сети.

Бэкенд API находится в проекте `Developer/develop-internet-applications` и слушает на порту `8080`.

### Настройка подключения к API

1. Создайте файл `.env` в корне проекта `exocalc-front-app`:
```bash
VITE_API_HOST=172.20.10.4
VITE_API_PORT=8080
VITE_API_PROTOCOL=https
```

2. Настройте параметры:
   - `VITE_API_HOST` - IP адрес или домен вашего API сервера
   - `VITE_API_PORT` - Порт API сервера (обычно 8080)
   - `VITE_API_PROTOCOL` - Протокол: `https` (рекомендуется) или `http`

3. Если переменные окружения не заданы, приложение будет использовать `https://localhost:8080` по умолчанию.

### Примеры конфигурации

**Для локальной разработки (фронтенд и API на одной машине):**
```env
VITE_API_HOST=localhost
VITE_API_PORT=8080
VITE_API_PROTOCOL=https
```

**Для подключения к API в локальной сети с HTTPS:**
```env
VITE_API_HOST=172.20.10.4
VITE_API_PORT=8080
VITE_API_PROTOCOL=https
```

**Для подключения к API с HTTP (если HTTPS не настроен):**
```env
VITE_API_HOST=172.20.10.4
VITE_API_PORT=8080
VITE_API_PROTOCOL=http
```

**Чтобы узнать IP адрес вашей машины:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# или
ipconfig getifaddr en0
```

После изменения `.env` файла перезапустите dev сервер (`npm run dev`) или пересоберите приложение (`npm run build`).

## Работа с данными

Приложение использует mock-данные из файла `src/data/stars.ts` как fallback, если API недоступен. Основной источник данных - бэкенд API, настроенный через переменные окружения.

## Лицензия

MIT
