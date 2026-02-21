import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import svgLoader from 'vite-svg-loader'

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
    })
  ],
})
