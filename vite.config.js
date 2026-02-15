import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensuring the dev server runs on port 5000 as per your Replit setup
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  define: {
    // This allows you to access environment variables like VITE_BEM_API_KEY 
    // and VITE_GOOGLE_PLACES_API consistently across your components.
    'process.env': {},
  },
});
