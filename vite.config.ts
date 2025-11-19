import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

const keyPath = path.resolve(__dirname, 'cert.key');
const certPath = path.resolve(__dirname, 'cert.crt');
const hasCertificates = fs.existsSync(keyPath) && fs.existsSync(certPath);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, 
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
  base: "/exocalc-front-app",
  server: {
    port: 3000,
    host: true,
    ...(hasCertificates ? {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
    } : {}),
    proxy: {
      "/api": {
        target: (() => {
          const host = process.env.VITE_API_HOST || 'localhost';
          const port = process.env.VITE_API_PORT || '8080';
          const protocol = process.env.VITE_API_PROTOCOL || 'https';
          return `${protocol}://${host}:${port}`;
        })(),
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/minio": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
  },
  preview: {
    host: '172.20.10.4',
    port: 3001,
    strictPort: true,
    ...(hasCertificates ? {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
    } : {}),
    proxy: {
      "/api": {
        target: (() => {
          const host = process.env.VITE_API_HOST || 'localhost';
          const port = process.env.VITE_API_PORT || '8080';
          const protocol = process.env.VITE_API_PROTOCOL || 'https';
          return `${protocol}://${host}:${port}`;
        })(),
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/"),
      },
      "/minio": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
  },
})
