/**
 * @file 资源优化测试（简化版）
 * @description 测试资源优化相关的工具函数（简化版本，避免复杂 Mock）
 * @module __tests__/resource-optimization-simplified.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-28
 */

import { preloadLazyImage, clearImageCache } from '../../utils/image-lazy-loader';

import { preloadFont, clearFontCache, getFontPreloaderStats } from '../../utils/font-preloader';

import {
  preloadResource,
  clearAllResources,
  getResourcePreloaderStats,
  generatePreloadHints,
} from '../resource-preloader';

describe('资源优化测试（简化版）', () => {
  beforeEach(() => {
    clearImageCache();
    clearFontCache();
    clearAllResources();
  });

  describe('图片预加载测试', () => {
    it('应该能够调用 preloadLazyImage 函数', async () => {
      const mockSrc = 'https://example.com/image.jpg';

      await expect(preloadLazyImage(mockSrc)).resolves.not.toThrow();
    }, 10000);
  });

  describe('字体预加载测试', () => {
    it('应该能够调用 preloadFont 函数', async () => {
      const mockFont = {
        fontFamily: 'Test Font',
        fontSrc: 'https://example.com/font.woff2',
      };

      await expect(preloadFont(mockFont.fontFamily, mockFont.fontSrc)).resolves.not.toThrow();
    });

    it('应该能够获取字体预加载器统计信息', () => {
      const stats = getFontPreloaderStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('cacheSize');
    });

    it('应该能够清空字体缓存', () => {
      clearFontCache();
      const stats = getFontPreloaderStats();
      expect(stats.cacheSize).toBe(0);
    });
  });

  describe('资源预加载测试', () => {
    it('应该能够调用 preloadResource 函数', () => {
      const mockUrl = 'https://example.com/script.js';

      expect(() => preloadResource(mockUrl, 'script')).not.toThrow();
    });

    it('应该能够获取资源预加载器统计信息', () => {
      const stats = getResourcePreloaderStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('count');
    });

    it('应该能够清空所有资源缓存', () => {
      clearAllResources();
      const stats = getResourcePreloaderStats();
      expect(stats.count).toBe(0);
    });

    it('应该能够生成预加载提示', () => {
      const hints = generatePreloadHints();
      expect(Array.isArray(hints)).toBe(true);
    });
  });

  describe('性能基准测试（简化版）', () => {
    it('应该能够在合理时间内预加载图片', async () => {
      const mockSrc =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';

      const start = performance.now();
      await preloadLazyImage(mockSrc);
      const end = performance.now();

      const loadTime = end - start;
      expect(loadTime).toBeLessThan(5000);
    }, 10000);

    it('应该能够在合理时间内预加载字体', async () => {
      const mockFont = {
        fontFamily: 'Test Font',
        fontSrc: 'data:font/woff2;base64,',
      };

      const start = performance.now();
      await preloadFont(mockFont.fontFamily, mockFont.fontSrc);
      const end = performance.now();

      const loadTime = end - start;
      expect(loadTime).toBeLessThan(5000);
    }, 10000);

    it('应该能够在合理时间内预加载资源', () => {
      const mockUrl = 'https://example.com/script.js';

      const start = performance.now();
      preloadResource(mockUrl, 'script');
      const end = performance.now();

      const loadTime = end - start;
      expect(loadTime).toBeLessThan(5000);
    }, 10000);
  });
});
