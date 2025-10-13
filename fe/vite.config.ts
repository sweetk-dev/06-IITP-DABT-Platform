import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    open: true,
  },
  optimizeDeps: {
    include: ['@iitp-dabt-platform/common']
  }
});


