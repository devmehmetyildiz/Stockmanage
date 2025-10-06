import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@Api": path.resolve(__dirname, "src/Api"),
      "@Assets": path.resolve(__dirname, "src/Assets"),
      "@Components": path.resolve(__dirname, "src/Components"),
      "@Constant": path.resolve(__dirname, "src/Constant"),
      "@Context": path.resolve(__dirname, "src/Context"),
      "@Hooks": path.resolve(__dirname, "src/Hooks"),
      "@Pages": path.resolve(__dirname, "src/Pages"),
      "@Utils": path.resolve(__dirname, "src/Utils"),
    },
  },
})
