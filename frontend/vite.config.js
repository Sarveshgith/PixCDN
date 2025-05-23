import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite' // assuming you're using React

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
