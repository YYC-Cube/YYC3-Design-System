import { DesignTokens } from '../../types/tokens';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tokens: DesignTokens;
  preview?: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: 'light',
    name: 'Light',
    description: '明亮清爽的默认主题',
    tokens: {
      'color.background': '#ffffff',
      'color.foreground': '#000000',
      'color.primary': '#3b82f6',
      'color.primary-light': '#93c5fd',
      'color.primary-dark': '#1d4ed8',
      'color.secondary': '#8b5cf6',
      'color.success': '#10b981',
      'color.warning': '#f59e0b',
      'color.error': '#ef4444',
      'color.border': '#e5e7eb',
      'color.muted': '#f3f4f6',
      'color.muted-foreground': '#6b7280',
      'radius.sm': '4px',
      'radius.md': '8px',
      'radius.lg': '12px',
      'shadow.sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'shadow.md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      'shadow.lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      'font-size.small': '12px',
      'font-size.body': '14px',
      'font-size.large': '16px',
      'font-size.h1': '32px',
      'font-size.h2': '24px',
      'font-size.h3': '20px',
      'typography.font-sans': 'system-ui, -apple-system, sans-serif',
      'typography.font-serif': 'Georgia, serif',
      'typography.font-mono': 'Monaco, monospace',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    description: '深邃优雅的暗色主题',
    tokens: {
      'color.background': '#0f172a',
      'color.foreground': '#f1f5f9',
      'color.primary': '#60a5fa',
      'color.primary-light': '#93c5fd',
      'color.primary-dark': '#3b82f6',
      'color.secondary': '#a78bfa',
      'color.success': '#34d399',
      'color.warning': '#fbbf24',
      'color.error': '#f87171',
      'color.border': '#1e293b',
      'color.muted': '#1e293b',
      'color.muted-foreground': '#94a3b8',
      'radius.sm': '4px',
      'radius.md': '8px',
      'radius.lg': '12px',
      'shadow.sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      'shadow.md': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      'shadow.lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      'font-size.small': '12px',
      'font-size.body': '14px',
      'font-size.large': '16px',
      'font-size.h1': '32px',
      'font-size.h2': '24px',
      'font-size.h3': '20px',
      'typography.font-sans': 'system-ui, -apple-system, sans-serif',
      'typography.font-serif': 'Georgia, serif',
      'typography.font-mono': 'Monaco, monospace',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: '海洋风格的蓝色主题',
    tokens: {
      'color.background': '#f0f9ff',
      'color.foreground': '#0c4a6e',
      'color.primary': '#0ea5e9',
      'color.primary-light': '#7dd3fc',
      'color.primary-dark': '#0369a1',
      'color.secondary': '#6366f1',
      'color.success': '#14b8a6',
      'color.warning': '#f59e0b',
      'color.error': '#ef4444',
      'color.border': '#e0f2fe',
      'color.muted': '#e0f2fe',
      'color.muted-foreground': '#0e7490',
      'radius.sm': '4px',
      'radius.md': '8px',
      'radius.lg': '12px',
      'shadow.sm': '0 1px 2px 0 rgba(14, 165, 233, 0.1)',
      'shadow.md': '0 4px 6px -1px rgba(14, 165, 233, 0.15)',
      'shadow.lg': '0 10px 15px -3px rgba(14, 165, 233, 0.15)',
      'font-size.small': '12px',
      'font-size.body': '14px',
      'font-size.large': '16px',
      'font-size.h1': '32px',
      'font-size.h2': '24px',
      'font-size.h3': '20px',
      'typography.font-sans': 'system-ui, -apple-system, sans-serif',
      'typography.font-serif': 'Georgia, serif',
      'typography.font-mono': 'Monaco, monospace',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: '自然风格的绿色主题',
    tokens: {
      'color.background': '#f0fdf4',
      'color.foreground': '#14532d',
      'color.primary': '#22c55e',
      'color.primary-light': '#86efac',
      'color.primary-dark': '#15803d',
      'color.secondary': '#8b5cf6',
      'color.success': '#10b981',
      'color.warning': '#f59e0b',
      'color.error': '#ef4444',
      'color.border': '#dcfce7',
      'color.muted': '#dcfce7',
      'color.muted-foreground': '#166534',
      'radius.sm': '4px',
      'radius.md': '8px',
      'radius.lg': '12px',
      'shadow.sm': '0 1px 2px 0 rgba(34, 197, 94, 0.1)',
      'shadow.md': '0 4px 6px -1px rgba(34, 197, 94, 0.15)',
      'shadow.lg': '0 10px 15px -3px rgba(34, 197, 94, 0.15)',
      'font-size.small': '12px',
      'font-size.body': '14px',
      'font-size.large': '16px',
      'font-size.h1': '32px',
      'font-size.h2': '24px',
      'font-size.h3': '20px',
      'typography.font-sans': 'system-ui, -apple-system, sans-serif',
      'typography.font-serif': 'Georgia, serif',
      'typography.font-mono': 'Monaco, monospace',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: '温暖绚丽的日落主题',
    tokens: {
      'color.background': '#fff7ed',
      'color.foreground': '#7c2d12',
      'color.primary': '#f97316',
      'color.primary-light': '#fdba74',
      'color.primary-dark': '#c2410c',
      'color.secondary': '#ec4899',
      'color.success': '#10b981',
      'color.warning': '#f59e0b',
      'color.error': '#ef4444',
      'color.border': '#ffedd5',
      'color.muted': '#ffedd5',
      'color.muted-foreground': '#9a3412',
      'radius.sm': '4px',
      'radius.md': '8px',
      'radius.lg': '12px',
      'shadow.sm': '0 1px 2px 0 rgba(249, 115, 22, 0.1)',
      'shadow.md': '0 4px 6px -1px rgba(249, 115, 22, 0.15)',
      'shadow.lg': '0 10px 15px -3px rgba(249, 115, 22, 0.15)',
      'font-size.small': '12px',
      'font-size.body': '14px',
      'font-size.large': '16px',
      'font-size.h1': '32px',
      'font-size.h2': '24px',
      'font-size.h3': '20px',
      'typography.font-sans': 'system-ui, -apple-system, sans-serif',
      'typography.font-serif': 'Georgia, serif',
      'typography.font-mono': 'Monaco, monospace',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: '午夜极简主题',
    tokens: {
      'color.background': '#000000',
      'color.foreground': '#e5e5e5',
      'color.primary': '#737373',
      'color.primary-light': '#a3a3a3',
      'color.primary-dark': '#525252',
      'color.secondary': '#525252',
      'color.success': '#525252',
      'color.warning': '#a3a3a3',
      'color.error': '#737373',
      'color.border': '#262626',
      'color.muted': '#171717',
      'color.muted-foreground': '#a3a3a3',
      'radius.sm': '4px',
      'radius.md': '8px',
      'radius.lg': '12px',
      'shadow.sm': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
      'shadow.md': '0 4px 6px -1px rgba(255, 255, 255, 0.1)',
      'shadow.lg': '0 10px 15px -3px rgba(255, 255, 255, 0.1)',
      'font-size.small': '12px',
      'font-size.body': '14px',
      'font-size.large': '16px',
      'font-size.h1': '32px',
      'font-size.h2': '24px',
      'font-size.h3': '20px',
      'typography.font-sans': 'system-ui, -apple-system, sans-serif',
      'typography.font-serif': 'Georgia, serif',
      'typography.font-mono': 'Monaco, monospace',
    },
  },
];

export const getPresetById = (id: string): ThemePreset | undefined => {
  return themePresets.find(preset => preset.id === id);
};

export const getPresetByName = (name: string): ThemePreset | undefined => {
  return themePresets.find(preset => preset.name.toLowerCase() === name.toLowerCase());
};

export const getAllPresets = (): ThemePreset[] => {
  return [...themePresets];
};

export const createCustomPreset = (
  id: string,
  name: string,
  description: string,
  basePreset?: ThemePreset
): ThemePreset => {
  const baseTokens = basePreset?.tokens || themePresets[0].tokens;
  return {
    id,
    name,
    description,
    tokens: { ...baseTokens },
  };
};

export const mergePresetTokens = (
  basePreset: ThemePreset,
  overrides: Partial<DesignTokens>
): DesignTokens => {
  const merged: DesignTokens = { ...basePreset.tokens };
  Object.keys(overrides).forEach(key => {
    const value = overrides[key];
    if (value !== undefined) {
      merged[key] = value;
    }
  });
  return merged;
};
