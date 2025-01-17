import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? 'https://aaron.greider.org/JJ-Item-Search/dist/' : '/',
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          dir: './dist/',
          entryFileNames: 'script.js',
          assetFileNames: 'style.css',
        }
      }
    }
  };
});
