import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import store from './store'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found!');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

const isTauri = typeof window !== 'undefined' && window.location.protocol === 'tauri:';
if ("serviceWorker" in navigator && !isTauri) {
  registerSW()
}
