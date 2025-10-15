import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Make sure this matches your repo name!
export default defineConfig({
  base: '/AlgoTracker/',
  plugins: [react()],
})
