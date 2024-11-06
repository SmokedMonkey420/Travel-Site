import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://smokedmonkey420.github.io/Travel-Site/",
  plugins: [react()],
})
