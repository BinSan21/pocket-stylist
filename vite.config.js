import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/pocket-stylist/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      includeAssets: ['*.jpg', '*.png', 'favicon.svg'],

      manifest: {
        id: '/pocket-stylist/',
        name: 'Pocket Stylist',
        short_name: 'Pocket Stylist',
        description: 'Find the fit, right where it sits.',
        start_url: '/pocket-stylist/',
        scope: '/pocket-stylist/',
        display: 'standalone',
        background_color: '#71594B',
        theme_color: '#71594B',

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}',
        ],
        cleanupOutdatedCaches: true,
        navigateFallback: '/pocket-stylist/index.html',
      },
    }),
  ],
});