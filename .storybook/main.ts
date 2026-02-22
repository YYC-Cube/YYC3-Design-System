/**
 * @file Storybook 主配置文件
 * @description Storybook 构建配置，包含代码分割、压缩和优化设置
 * @module .storybook/main
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      config.build = {
        ...config.build,
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
              if (id.includes('@storybook')) {
                return 'vendor-storybook';
              }
              return 'vendor';
            }
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entry/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        chunkSizeWarningLimit: 500,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: false,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
          mangle: {
            safari10: true,
          },
          output: {
            comments: false,
          },
        },
      };
    }

    config.optimizeDeps = {
      include: ['react', 'react-dom'],
      exclude: [],
    };

    config.esbuild = {
      legalComments: 'none',
      treeShaking: true,
      minify: configType === 'PRODUCTION',
    };

    return config;
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
