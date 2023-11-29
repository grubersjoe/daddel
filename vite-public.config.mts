import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'firebase-messaging-sw': 'src/firebase-messaging-sw.ts',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
