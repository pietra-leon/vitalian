import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

/**
 * Pré-carrega a fonte dos títulos (Fraunces) na landing, para o título do
 * hero não trocar de fonte depois de pintado.
 */
function preloadFonteDosTitulos(): Plugin {
  return {
    name: 'preload-fonte-dos-titulos',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      if (!ctx.path.endsWith('/index.html') || ctx.path.includes('jornada')) return html
      const fonte = Object.keys(ctx.bundle ?? {}).find((f) => /fraunces-latin-soft-normal.*\.woff2$/.test(f))
      if (!fonte) return html
      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${fonte}`, crossorigin: '' },
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

export default defineConfig({
  base: '/', // Nome do repositório no GitHub Pages
  plugins: [
    react(),
    tailwindcss(),
    preloadFonteDosTitulos(),
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
