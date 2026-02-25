/**
 * @file Storybook 主配置文件
 * @description Storybook 构建配置，包含代码分割、压缩和优化设置
 * @module .storybook/main
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 * @updated 2026-02-25
 */

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    'storybook-addon-performance',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-vite',
  },
  features: {
    storySort: {
      method: 'alphabetical',
      order: ['Intro', 'Components', 'Utilities', 'Hooks', 'AI Features', '*'],
    },
  },
  viteFinal: async (config) => {
    config.build = {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        output: {
          ...config.build?.rollupOptions?.output,
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@radix-ui')) {
                return 'vendor-radix';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lodash')) {
                return 'vendor-lodash';
              }
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext',
    };

    config.esbuild = {
      ...config.esbuild,
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      legalComments: 'none',
      drop: config.mode === 'production' ? ['console', 'debugger'] : [],
    };

    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        'react',
        'react-dom',
        'zustand',
        'clsx',
        'tailwind-merge',
      ],
    };

    return config;
  },
};

export default config;
