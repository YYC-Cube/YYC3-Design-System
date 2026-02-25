/**
 * @file Storybook 主题切换插件
 * @description YYC³ 设计系统 Storybook 主题切换插件，支持亮色/暗色主题切换
 * @module .storybook/theme-switcher
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

export const THEMES = {
  light: {
    id: 'light',
    name: '亮色主题',
    class: 'light',
    background: '#fbfbfc',
    foreground: '#1a1a1a',
    borderColor: '#e0e0e0',
  },
  dark: {
    id: 'dark',
    name: '暗色主题',
    class: 'dark',
    background: '#1a1a1a',
    foreground: '#f0f0f0',
    borderColor: '#333333',
  },
};

export const PARAM_KEY = 'yyc3Theme';
