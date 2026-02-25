/**
 * @file Storybook 预览配置
 * @description 全局 Storybook 配置，包括主题、视口和背景设置
 * @module .storybook/preview
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 * @updated 2026-02-25
 */

import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    docs: {
      toc: true,
      page: null,
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'iPhone 12',
          styles: {
            width: '390px',
            height: '844px',
          },
        },
        tablet: {
          name: 'iPad',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'gray',
          value: '#f3f4f6',
        },
      ],
    },
    a11y: {
      config: {},
      options: {
        checks: {
          'color-contrast': { options: { noScroll: false } },
          'valid-lang': { enabled: false },
        },
        restoreScroll: true,
      },
    },
    measure: {
      enable: false,
    },
    outline: {
      enable: false,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', left: '☀️', title: 'Light' },
          { value: 'dark', left: '🌙', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'zh-CN',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'zh-CN', title: '中文' },
          { value: 'en-US', title: 'English' },
          { value: 'ja-JP', title: '日本語' },
        ],
      },
    },
    direction: {
      description: 'Text direction',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to Right' },
          { value: 'rtl', title: 'Right to Left' },
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
