/**
 * @file 主题持久化工具测试
 * @description 测试主题持久化工具的各项功能
 * @module __tests__/utils/theme-persistence.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import {
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  clearStoredTheme,
  migrateTheme,
  syncThemeWithSystem,
  getThemeInfo,
  isThemePersisted,
} from './theme-persistence';

describe('theme-persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('getSystemTheme', () => {
    it('应该返回系统主题', () => {
      const theme = getSystemTheme();
      expect(['light', 'dark']).toContain(theme);
    });
  });

  describe('getStoredTheme', () => {
    it('当没有存储的主题时应该返回light', () => {
      const theme = getStoredTheme();
      expect(theme).toBe('light');
    });

    it('应该返回存储的light主题', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'light',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      const theme = getStoredTheme();
      expect(theme).toBe('light');
    });

    it('应该返回存储的dark主题', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      const theme = getStoredTheme();
      expect(theme).toBe('dark');
    });

    it('当模式为system时应该返回系统主题', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'system',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      const theme = getStoredTheme();
      expect(['light', 'dark']).toContain(theme);
    });

    it('当版本不匹配时应该返回light', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '0.9.0',
        timestamp: Date.now()
      }));
      const theme = getStoredTheme();
      expect(theme).toBe('light');
    });
  });

  describe('setStoredTheme', () => {
    it('应该保存light主题', () => {
      setStoredTheme('light');
      const stored = localStorage.getItem('yyc3-theme');
      expect(stored).toBeTruthy();
      const config = JSON.parse(stored!);
      expect(config.mode).toBe('light');
      expect(config.version).toBe('1.0.0');
    });

    it('应该保存dark主题', () => {
      setStoredTheme('dark');
      const stored = localStorage.getItem('yyc3-theme');
      expect(stored).toBeTruthy();
      const config = JSON.parse(stored!);
      expect(config.mode).toBe('dark');
    });

    it('应该保存system主题', () => {
      setStoredTheme('system');
      const stored = localStorage.getItem('yyc3-theme');
      expect(stored).toBeTruthy();
      const config = JSON.parse(stored!);
      expect(config.mode).toBe('system');
    });

    it('应该设置data-theme属性', () => {
      setStoredTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('应该保存时间戳', () => {
      const beforeTime = Date.now();
      setStoredTheme('light');
      const afterTime = Date.now();
      
      const stored = localStorage.getItem('yyc3-theme');
      const config = JSON.parse(stored!);
      expect(config.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(config.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('clearStoredTheme', () => {
    it('应该清除存储的主题', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      clearStoredTheme();
      expect(localStorage.getItem('yyc3-theme')).toBeNull();
    });

    it('应该清除主题版本', () => {
      localStorage.setItem('yyc3-theme-version', '1.0.0');
      clearStoredTheme();
      expect(localStorage.getItem('yyc3-theme-version')).toBeNull();
    });

    it('应该移除data-theme属性', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      clearStoredTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });

  describe('migrateTheme', () => {
    it('应该迁移主题版本', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '0.9.0',
        timestamp: Date.now()
      }));
      migrateTheme('0.9.0');
      const stored = localStorage.getItem('yyc3-theme');
      const config = JSON.parse(stored!);
      expect(config.version).toBe('1.0.0');
    });

    it('应该保留主题模式', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '0.9.0',
        timestamp: Date.now()
      }));
      migrateTheme('0.9.0');
      const stored = localStorage.getItem('yyc3-theme');
      const config = JSON.parse(stored!);
      expect(config.mode).toBe('dark');
    });
  });

  describe('syncThemeWithSystem', () => {
    it('当模式为system时应该同步系统主题', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'system',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      syncThemeWithSystem();
      const theme = document.documentElement.getAttribute('data-theme');
      expect(['light', 'dark']).toContain(theme);
    });

    it('当模式不为system时不应该同步', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      syncThemeWithSystem();
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });

  describe('getThemeInfo', () => {
    it('当没有存储的主题时应该返回null', () => {
      const info = getThemeInfo();
      expect(info).toBeNull();
    });

    it('应该返回主题配置', () => {
      const config = {
        mode: 'dark' as const,
        version: '1.0.0',
        timestamp: Date.now()
      };
      localStorage.setItem('yyc3-theme', JSON.stringify(config));
      const info = getThemeInfo();
      expect(info).toEqual(config);
    });
  });

  describe('isThemePersisted', () => {
    it('当没有存储的主题时应该返回false', () => {
      const persisted = isThemePersisted();
      expect(persisted).toBe(false);
    });

    it('当有存储的主题时应该返回true', () => {
      localStorage.setItem('yyc3-theme', JSON.stringify({
        mode: 'dark',
        version: '1.0.0',
        timestamp: Date.now()
      }));
      const persisted = isThemePersisted();
      expect(persisted).toBe(true);
    });
  });
});
