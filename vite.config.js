import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import svgLoader from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: "removeAttrs",
            params: { attrs: "(fill|stroke)" }
          }
        ]
      }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
