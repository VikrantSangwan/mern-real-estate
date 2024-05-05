import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server : {
    // each time  /api add localhost:3000 in the begining
    proxy : {
      '/api' : {
        target : 'http://localhost:3000',
        secure: false
      }
    }
  },
  plugins: [react()],
})
