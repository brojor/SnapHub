/// <reference types="vitest" />
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),  UnoCSS(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'SnapHub',
      short_name: 'SnapHub',
      description: 'A private, family-friendly photo sharing PWA that gathers pictures and videos from multiple devices into one secure, centralized hub for easy viewing and preservation of memories.',
      theme_color: '#A78AF9',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  test: {
    environment: 'jsdom',
    globals: true
  }
})