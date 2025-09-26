import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@iitp-dabt-platform/common': path.resolve(__dirname, '../packages/common/src')
    }
  },
  optimizeDeps: {
    include: ['@iitp-dabt-platform/common']
  }
});


