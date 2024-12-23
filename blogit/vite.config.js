import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config()

console.log('loaded variables',process.env)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
})
