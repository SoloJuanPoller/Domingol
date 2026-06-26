import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],

      manifest: {
        name: 'Domingol',
        short_name: 'Domingol',
        description: 'Organizador de partidos de fútbol',
        theme_color: '#0f0f1a',
        background_color: '#080810',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          // El técnico debe agregar estos PNGs generados desde el SVG:
          // pwa-192.png  (192x192)
          // pwa-512.png  (512x512, maskable)
        ],
      },

      workbox: {
        // Precachea todos los assets del build (JS, CSS, HTML, fonts locales)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Navegación SPA — siempre sirve index.html para rutas desconocidas
        navigateFallback: 'index.html',

        runtimeCaching: [
          {
            // Fotos de jugadores subidas por el técnico (carpeta /uploads/)
            // CacheFirst: se bajan una vez y quedan en caché para siempre
            urlPattern: /\/uploads\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'player-photos',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 60, // 60 días
              },
            },
          },
          {
            // Llamadas a la API (jugadores, partidos)
            // NetworkFirst: intenta el servidor; si no hay conexión usa caché
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-responses',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días offline
              },
            },
          },
          {
            // Google Fonts CSS
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            // Google Fonts archivos (woff2)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 año
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
