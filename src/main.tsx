import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    let baseUrl = import.meta.env.BASE_URL || "/";
    // Убеждаемся, что baseUrl заканчивается на слэш
    if (!baseUrl.endsWith("/")) {
      baseUrl = baseUrl + "/";
    }
    const serviceWorkerPath = `${baseUrl}serviceWorker.js`;
    // Не указываем scope явно - по умолчанию scope будет равен директории service worker
    navigator.serviceWorker
      .register(serviceWorkerPath)
      .then(() => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
