import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Promoteur App Vite Configuration
 *
 * Alias Strategy:
 * - '@/' → Local app code (apps/promoteur/src/)
 * - '@legacy/' → Legacy code from /src/ (for gradual migration)
 * - '@realpro/*' → Shared packages
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Local app-specific code
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),

      // Legacy code from root /src/ (migration path)
      '@legacy': path.resolve(__dirname, '../../src'),
      '@legacy/components': path.resolve(__dirname, '../../src/components'),
      '@legacy/pages': path.resolve(__dirname, '../../src/pages'),
      '@legacy/hooks': path.resolve(__dirname, '../../src/hooks'),
      '@legacy/contexts': path.resolve(__dirname, '../../src/contexts'),
      '@legacy/lib': path.resolve(__dirname, '../../src/lib'),
      '@legacy/shared': path.resolve(__dirname, '../../src/shared'),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Optimize dependencies from monorepo
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
