import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/', // Nome do repositório no GitHub Pages
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      // Duas páginas: a landing (/) e o mockup da jornada da paciente (/jornada/).
      input: {
        main: path.resolve(__dirname, 'index.html'),
        jornada: path.resolve(__dirname, 'jornada/index.html'),
      },
    },
  },
})
