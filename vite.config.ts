import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
	host: true,
  },
});
