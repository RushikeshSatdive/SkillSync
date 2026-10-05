import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', allowedHosts: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/(recharts|d3-[^/]+|victory-vendor|react-smooth)\//.test(id)) return 'charts'
          if (id.includes('/node_modules/')) return 'vendor'
        },
      },
    },
  },
})
