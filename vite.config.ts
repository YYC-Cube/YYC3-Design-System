/**
 * @file Vite 构建配置
 * @description Vite 构建配置，包含代码分割、压缩和优化设置
 * @module vite.config
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('@testing-library')) {
              return 'vendor-testing';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entry/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        arrows: true,
        collapse_vars: true,
        comparisons: true,
        computed_props: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: true,
        inline: true,
        loops: true,
        negate_iife: true,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        switches: true,
        toplevel: true,
        typeofs: true,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
  server: {
    port: 3200,
    host: true,
    open: true,
    hmr: {
      overlay: false,
    },
  },
  css: {
    devSourcemap: false,
    postcss: './postcss.config.js',
  },
});
