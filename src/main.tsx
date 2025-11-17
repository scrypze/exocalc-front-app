import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import store from './store'

console.log('=== APP STARTING ===');
console.log('Tauri environment:', typeof window !== 'undefined' ? !!window.__TAURI__ : 'window not available');
console.log('Root element:', document.getElementById('root'));

try {
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
  console.log('=== APP RENDERED ===');
} catch (error) {
  console.error('=== RENDER ERROR ===', error);
  document.body.innerHTML = `<div style="padding: 40px; color: red; background: black;">
    <h1>Критическая ошибка</h1>
    <pre>${String(error)}</pre>
  </div>`;
}

const isTauri = typeof window !== 'undefined' && window.location.protocol === 'tauri:';
if ("serviceWorker" in navigator && !isTauri) {
  registerSW()
}
