/**
 * @file Vite 构建配置
 * @description Vite 构建配置，包含代码分割、压缩和优化设置
 * @module vite.config
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 * @updated 2026-02-25
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
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
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
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
        unused: true,
        dead_code: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        if_return: true,
        join_vars: true,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      output: {
        comments: false,
        beautify: false,
      },
      ecma: 2015,
      keep_classnames: false,
      keep_fnames: false,
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    maxParallelFileOps: 8,
    dynamicImportVarsOptions: {
      warnOnError: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
    force: false,
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
    devSourcemap: mode === 'development',
    postcss: './postcss.config.js',
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none',
  },
}));
