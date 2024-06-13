import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
export default defineConfig({
  plugins: [react()],
  server: {
    host: readFileSync("hostIp.txt").toString()
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
