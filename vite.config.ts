import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

const isTauri = process.env.TAURI_PLATFORM === 'tauri' || process.env.TAURI_DEV === 'true' || process.env.TAURI_PLATFORM !== undefined || process.env.npm_lifecycle_script?.includes('build:tauri')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: !isTauri, 
      },
      manifest: {
        name: "Экзопланетный калькулятор",
        short_name: "Экзокалькулятор",
        start_url: "/exocalc-front-app/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/exocalc-front-app/img/image.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/exocalc-front-app/img/image.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
      },
    })
  ],
  base: isTauri ? "/" : "/exocalc-front-app",
  server: {
    port: 3000,
    host: true,
    ...(isTauri ? {} : {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
      },
    }),
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
  },
  preview: {
    host: '172.20.10.4',
    port: 3001,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
  },
})
