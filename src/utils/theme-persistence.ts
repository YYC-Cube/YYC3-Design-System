/**
 * @file 主题持久化工具
 * @description YYC³ 设计系统主题持久化工具，提供localStorage主题存储和管理
 * @module utils/theme-persistence
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

const THEME_KEY = 'yyc3-theme';
const THEME_VERSION_KEY = 'yyc3-theme-version';
const CURRENT_THEME_VERSION = '1.0.0';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  version: string;
  timestamp: number;
}

export const getSystemTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
};

export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      const config: ThemeConfig = JSON.parse(stored);

      if (config.version !== CURRENT_THEME_VERSION) {
        migrateTheme(config.version);
        return 'light';
      }

      if (config.mode === 'system') {
        return getSystemTheme();
      }

      return config.mode;
    }
  } catch (e) {
    console.warn('Failed to read theme from localStorage:', e);
  }

  return 'light';
};

export const setStoredTheme = (mode: ThemeMode): void => {
  if (typeof window === 'undefined') return;

  try {
    const config: ThemeConfig = {
      mode,
      version: CURRENT_THEME_VERSION,
      timestamp: Date.now(),
    };

    localStorage.setItem(THEME_KEY, JSON.stringify(config));
    localStorage.setItem(THEME_VERSION_KEY, CURRENT_THEME_VERSION);

    document.documentElement.setAttribute('data-theme', mode);

    if (mode === 'system') {
      const systemTheme = getSystemTheme();
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  } catch (e) {
    console.warn('Failed to save theme to localStorage:', e);
  }
};

export const clearStoredTheme = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(THEME_VERSION_KEY);
    document.documentElement.removeAttribute('data-theme');
  } catch (e) {
    console.warn('Failed to clear theme from localStorage:', e);
  }
};

export const migrateTheme = (fromVersion: string): void => {
  console.warn(`Migrating theme from version ${fromVersion} to ${CURRENT_THEME_VERSION}`);

  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      const config: ThemeConfig = JSON.parse(stored);
      config.version = CURRENT_THEME_VERSION;
      localStorage.setItem(THEME_KEY, JSON.stringify(config));
    }
  } catch (e) {
    console.warn('Failed to migrate theme:', e);
  }
};

export const syncThemeWithSystem = (): void => {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    const config: ThemeConfig = JSON.parse(stored);
    if (config.mode === 'system') {
      const systemTheme = getSystemTheme();
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  }
};

export const initThemePersistence = (() => {
  if (typeof window === 'undefined') return () => {};

  const mode = getStoredTheme();
  setStoredTheme(mode);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleSystemThemeChange = (e: MediaQueryListEvent): void => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      const config: ThemeConfig = JSON.parse(stored);
      if (config.mode === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
      }
    }
  };

  mediaQuery.addEventListener('change', handleSystemThemeChange);

  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  };
})();

export const getThemeInfo = (): ThemeConfig | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to read theme info from localStorage:', e);
  }

  return null;
};

export const isThemePersisted = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem(THEME_KEY) !== null;
  } catch {
    return false;
  }
};

export default {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  clearStoredTheme,
  migrateTheme,
  syncThemeWithSystem,
  initThemePersistence,
  getThemeInfo,
  isThemePersisted,
};
