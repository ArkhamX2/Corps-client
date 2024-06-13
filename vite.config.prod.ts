import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
export default defineConfig({
  plugins: [react()],
  define:{
    base_url: JSON.stringify('http://localhost:5228')
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
        input: {
            main: './index.html',
        },
    },
},
})
