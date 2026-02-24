/**
 * @file 资源优化测试
 * @description 测试资源优化相关的工具函数
 * @module __tests__/resource-optimization.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import {
  observeLazyImage,
  loadImage,
  preloadLazyImage,
  createLazyImageBatchLoader,
  createProgressiveImageLoader,
  getLazyImageStats,
  destroyAllLazyImages,
} from '../../utils/image-lazy-loader';

import {
  preloadFont,
  preloadFontBatch,
  preloadFontsWithProgress,
  getCachedFont,
  clearFontCache,
  getFontPreloaderStats,
  isFontLoaded,
  waitForFontLoad,
} from '../../utils/font-preloader';

import {
  preloadResource,
  preloadResources,
  preloadCriticalResources,
  preconnect,
  preconnectOrigins,
  prefetch,
  prefetchResources,
  preloadScript,
  preloadStyle,
  preloadImage as preloadResourceImage,
  preloadFont as preloadResourceFont,
  isPreloaded,
  isPreconnected,
  isPrefetched,
  clearAllResources,
  getResourcePreloaderStats,
  generatePreloadHints,
} from '../resource-preloader';

describe('资源优化测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearImageCache();
    clearFontCache();
    clearAllResources();
  });

  describe('图片懒加载测试', () => {
    it('应该观察图片并延迟加载', () => {
      const mockElement = document.createElement('img');
      const mockObserver = {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
      jest.spyOn(window, 'IntersectionObserver').mockImplementation((callback) => {
        mockObserver.observe = jest.fn();
        return mockObserver as any;
      });

      const unobserve = observeLazyImage(mockElement, {
        placeholder: 'data:image/svg+xml;base64,placeholder',
      });

      expect(mockObserver.observe).toHaveBeenCalledWith(mockElement);

      unobserve();
      expect(mockObserver.disconnect).toHaveBeenCalled();
    });

    it('应该使用占位符', () => {
      const mockElement = document.createElement('img');
      const placeholder = 'data:image/svg+xml;base64,placeholder';

      observeLazyImage(mockElement, { placeholder });

      expect(mockElement.src).toBe(placeholder);
    });

    it('应该处理加载完成', () => {
      const mockElement = document.createElement('img');
      const onLoad = jest.fn();

      observeLazyImage(mockElement, { onLoad });

      mockElement.dispatchEvent(new Event('load'));

      expect(onLoad).toHaveBeenCalled();
    });

    it('应该处理加载错误', () => {
      const mockElement = document.createElement('img');
      const onError = jest.fn();

      observeLazyImage(mockElement, { onError });

      mockElement.dispatchEvent(new Event('error'));

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('图片预加载测试', () => {
    it('应该预加载单张图片', async () => {
      const mockSrc = 'https://example.com/image.jpg';
      const mockImage = {
        onload: null as any,
        onerror: null as any,
      };
      jest.spyOn(window, 'Image').mockImplementation(() => mockImage);

      await preloadImage(mockSrc, { priority: 'high' });

      expect(mockImage.onload).toBeDefined();
    });

    it('应该批量预加载图片', async () => {
      const mockImages = [
        { src: 'https://example.com/image1.jpg', priority: 'high' as const },
        { src: 'https://example.com/image2.jpg', priority: 'low' as const },
      ];

      await preloadImageBatch(mockImages);

      const stats = getImagePreloaderStats();
      expect(stats.cacheSize).toBeGreaterThan(0);
    });

    it('应该带进度预加载图片', async () => {
      const mockImages = [
        { src: 'https://example.com/image1.jpg', priority: 'high' as const },
        { src: 'https://example.com/image2.jpg', priority: 'low' as const },
      ];
      const onProgress = jest.fn();

      await preloadImageWithProgress(mockImages, onProgress);

      expect(onProgress).toHaveBeenCalled();
    });

    it('应该缓存预加载的图片', async () => {
      const mockSrc = 'https://example.com/image.jpg';
      const mockImage = {
        onload: null as any,
      };
      jest.spyOn(window, 'Image').mockImplementation(() => mockImage);

      await preloadImage(mockSrc);

      const cached = getCachedImage(mockSrc);
      expect(cached).toBeDefined();
    });

    it('应该清空图片缓存', async () => {
      const mockSrc = 'https://example.com/image.jpg';
      const mockImage = {
        onload: null as any,
      };
      jest.spyOn(window, 'Image').mockImplementation(() => mockImage);

      await preloadImage(mockSrc);
      expect(getImagePreloaderStats().cacheSize).toBeGreaterThan(0);

      clearImageCache();

      expect(getImagePreloaderStats().cacheSize).toBe(0);
    });
  });

  describe('字体预加载测试', () => {
    it('应该预加载单个字体', async () => {
      const mockFont = {
        fontFamily: 'Inter',
        fontSrc: 'https://example.com/inter.woff2',
        fontWeight: '400',
        fontStyle: 'normal',
      };

      await preloadFont(
        mockFont.fontFamily,
        mockFont.fontSrc,
        {
          fontWeight: mockFont.fontWeight,
          fontStyle: mockFont.fontStyle,
          priority: 'high',
        }
      );

      const stats = getFontPreloaderStats();
      expect(stats.cacheSize).toBeGreaterThan(0);
    });

    it('应该批量预加载字体', async () => {
      const mockFonts = [
        {
          fontFamily: 'Inter',
          fontSrc: 'https://example.com/inter.woff2',
          fontWeight: '400',
          fontStyle: 'normal',
        },
        {
          fontFamily: 'Roboto',
          fontSrc: 'https://example.com/roboto.woff2',
          fontWeight: '400',
          fontStyle: 'normal',
        },
      ];

      await preloadFontBatch(
        mockFonts.map((font) => ({
          fontFamily: font.fontFamily,
          fontSrc: font.fontSrc,
          fontWeight: font.fontWeight,
          fontStyle: font.fontStyle,
          options: { priority: 'auto' },
        }))
      );

      const stats = getFontPreloaderStats();
      expect(stats.cacheSize).toBeGreaterThan(0);
    });

    it('应该带进度预加载字体', async () => {
      const mockFonts = [
        {
          fontFamily: 'Inter',
          fontSrc: 'https://example.com/inter.woff2',
          fontWeight: '400',
          fontStyle: 'normal',
        },
      ];
      const onProgress = jest.fn();

      await preloadFontsWithProgress(
        mockFonts.map((font) => ({
          fontFamily: font.fontFamily,
          fontSrc: font.fontSrc,
          fontWeight: font.fontWeight,
          fontStyle: font.fontStyle,
          options: { priority: 'low' },
        })),
        onProgress
      );

      expect(onProgress).toHaveBeenCalled();
    });

    it('应该缓存预加载的字体', async () => {
      const mockFont = {
        fontFamily: 'Inter',
        fontSrc: 'https://example.com/inter.woff2',
        fontWeight: '400',
        fontStyle: 'normal',
      };

      await preloadFont(
        mockFont.fontFamily,
        mockFont.fontSrc,
        {
          fontWeight: mockFont.fontWeight,
          fontStyle: mockFont.fontStyle,
        }
      );

      const cached = getCachedFont(mockFont.fontFamily, mockFont.fontWeight, mockFont.fontStyle);
      expect(cached).toBeDefined();
    });

    it('应该清空字体缓存', async () => {
      const mockFont = {
        fontFamily: 'Inter',
        fontSrc: 'https://example.com/inter.woff2',
        fontWeight: '400',
        fontStyle: 'normal',
      };

      await preloadFont(
        mockFont.fontFamily,
        mockFont.fontSrc,
        {
          fontWeight: mockFont.fontWeight,
          fontStyle: mockFont.fontStyle,
        }
      );

      expect(getFontPreloaderStats().cacheSize).toBeGreaterThan(0);

      clearFontCache();

      expect(getFontPreloaderStats().cacheSize).toBe(0);
    });

    it('应该检测字体是否已加载', async () => {
      const mockFont = {
        fontFamily: 'Inter',
        fontSrc: 'https://example.com/inter.woff2',
        fontWeight: '400',
        fontStyle: 'normal',
      };

      expect(isFontLoaded(mockFont.fontFamily)).toBe(false);

      await preloadFont(
        mockFont.fontFamily,
        mockFont.fontSrc,
        {
          fontWeight: mockFont.fontWeight,
          fontStyle: mockFont.fontStyle,
        }
      );

      await waitForFontLoad(mockFont.fontFamily, 5000);

      expect(isFontLoaded(mockFont.fontFamily)).toBe(true);
    });
  });

  describe('字体子集化测试', () => {
    it('应该分析字符', () => {
      const text = 'Hello World 你好世界';

      const analysis = analyzeCharacters(text);

      expect(analysis.totalChars).toBeGreaterThan(0);
      expect(analysis.uniqueChars).toBeGreaterThan(0);
      expect(analysis.charCategories).toBeDefined();
    });

    it('应该从文本提取字符', () => {
      const text = 'Hello World 你好世界';

      const chars = extractCharactersFromText(text);

      expect(chars.length).toBeGreaterThan(0);
      expect(chars).toContain('H');
      expect(chars).toContain('你');
    });

    it('应该生成子集字符串', () => {
      const subset = generateSubsetString({
        includeLatin: true,
        includeCJK: true,
      });

      expect(subset).toBeDefined();
      expect(typeof subset).toBe('string');
    });

    it('应该创建 Font Face 子集', () => {
      const fontFamily = 'Inter';
      const fontSrc = 'https://example.com/inter.woff2';
      const subsetChars = 'Hello';

      const fontFace = createFontFaceWithSubset(
        fontFamily,
        fontSrc,
        subsetChars,
        { includeLatin: true }
      );

      expect(fontFace).toContain('@font-face');
      expect(fontFace).toContain(fontFamily);
      expect(fontFace).toContain('unicode-range');
    });

    it('应该创建关键字体子集', () => {
      const text = 'Hello World 你好世界';

      const criticalSubset = createCriticalFontSubset(text);

      expect(criticalSubset).toBeDefined();
      expect(typeof criticalSubset).toBe('string');
    });

    it('应该创建渐进式字体子集', () => {
      const text = 'Hello World 你好世界';

      const progressiveSubsets = createProgressiveFontSubsets(text, 3);

      expect(progressiveSubsets).toHaveLength(3);
      expect(progressiveSubsets[0].priority).toBe(3);
      expect(progressiveSubsets[1].priority).toBe(2);
      expect(progressiveSubsets[2].priority).toBe(1);
    });

    it('应该生成字体子集报告', () => {
      const originalSize = 100000;
      const subsetChars = 'Hello';
      const analysis = analyzeCharacters(subsetChars);

      const report = generateFontSubsetReport(originalSize, subsetChars, analysis);

      expect(report).toBeDefined();
      expect(report.originalSize).toBe(originalSize);
      expect(report.subsetSize).toBeLessThan(originalSize);
      expect(report.reduction).toBeGreaterThan(0);
    });
  });

  describe('资源预加载测试', () => {
    it('应该预加载单个资源', async () => {
      const mockUrl = 'https://example.com/script.js';

      await preloadResource(mockUrl, 'script', { priority: 'high' });

      expect(isPreloaded(mockUrl)).toBe(true);
    });

    it('应该批量预加载资源', async () => {
      const mockResources = [
        {
          url: 'https://example.com/script.js',
          type: 'script' as const,
          priority: 'high' as const,
          critical: true,
        },
        {
          url: 'https://example.com/style.css',
          type: 'style' as const,
          priority: 'high' as const,
          critical: true,
        },
      ];

      await preloadResources(mockResources);

      const stats = getResourcePreloaderStats();
      expect(stats.preloadedCount).toBeGreaterThan(0);
    });

    it('应该预加载关键资源', async () => {
      const mockResources = [
        {
          url: 'https://example.com/script.js',
          type: 'script' as const,
          priority: 'high' as const,
          critical: true,
        },
        {
          url: 'https://example.com/style.css',
          type: 'style' as const,
          priority: 'low' as const,
          critical: false,
        },
      ];

      await preloadCriticalResources(mockResources);

      const stats = getResourcePreloaderStats();
      expect(stats.preloadedCount).toBe(1);
    });

    it('应该预连接到源', () => {
      const mockOrigin = 'https://example.com';

      preconnect(mockOrigin, { crossOrigin: 'anonymous' });

      expect(isPreconnected(mockOrigin)).toBe(true);
    });

    it('应该批量预连接到源', () => {
      const mockOrigins = [
        { href: 'https://example.com', crossOrigin: 'anonymous' as const },
        { href: 'https://cdn.example.com', crossOrigin: 'anonymous' as const },
      ];

      preconnectOrigins(mockOrigins);

      expect(isPreconnected('https://example.com')).toBe(true);
      expect(isPreconnected('https://cdn.example.com')).toBe(true);
    });

    it('应该预取资源', async () => {
      const mockUrl = 'https://example.com/next-page.html';

      await prefetch(mockUrl, { priority: 'low' });

      expect(isPrefetched(mockUrl)).toBe(true);
    });

    it('应该批量预取资源', async () => {
      const mockResources = [
        {
          url: 'https://example.com/image1.jpg',
          type: 'image' as const,
          priority: 'low' as const,
        },
        {
          url: 'https://example.com/image2.jpg',
          type: 'image' as const,
          priority: 'low' as const,
        },
      ];

      await prefetchResources(mockResources);

      const stats = getResourcePreloaderStats();
      expect(stats.prefetchedCount).toBeGreaterThan(0);
    });

    it('应该预加载脚本', async () => {
      const mockUrl = 'https://example.com/script.js';

      await preloadScript(mockUrl, { priority: 'high' });

      expect(isPreloaded(mockUrl)).toBe(true);
    });

    it('应该预加载样式', async () => {
      const mockUrl = 'https://example.com/style.css';

      await preloadStyle(mockUrl, { priority: 'high' });

      expect(isPreloaded(mockUrl)).toBe(true);
    });

    it('应该预加载图片', async () => {
      const mockUrl = 'https://example.com/image.jpg';

      await preloadResourceImage(mockUrl, { priority: 'auto' });

      expect(isPreloaded(mockUrl)).toBe(true);
    });

    it('应该预加载字体', async () => {
      const mockUrl = 'https://example.com/font.woff2';

      await preloadResourceFont(mockUrl, { priority: 'high' });

      expect(isPreloaded(mockUrl)).toBe(true);
    });

    it('应该清空所有资源缓存', async () => {
      const mockUrl = 'https://example.com/script.js';

      await preloadResource(mockUrl, 'script');

      expect(getResourcePreloaderStats().preloadedCount).toBeGreaterThan(0);

      clearAllResources();

      expect(getResourcePreloaderStats().preloadedCount).toBe(0);
      expect(getResourcePreloaderStats().preconnectedCount).toBe(0);
      expect(getResourcePreloaderStats().prefetchedCount).toBe(0);
    });

    it('应该生成预加载提示', () => {
      const mockResources = [
        {
          url: 'https://example.com/script.js',
          type: 'script' as const,
          priority: 'high' as const,
          critical: true,
        },
      ];
      const mockOrigins = [
        { href: 'https://cdn.example.com', crossOrigin: 'anonymous' as const },
      ];

      const hints = generatePreloadHints(mockResources, mockOrigins);

      expect(hints).toContain('rel="preconnect"');
      expect(hints).toContain('rel="preload"');
      expect(hints).toContain('as="script"');
    });
  });

  describe('性能基准测试', () => {
    it('应该测量图片加载性能', async () => {
      const mockSrc = 'https://example.com/image.jpg';
      const mockImage = {
        onload: null as any,
      };
      jest.spyOn(window, 'Image').mockImplementation(() => mockImage);

      const start = performance.now();

      await preloadImage(mockSrc);

      const end = performance.now();
      const loadTime = end - start;

      expect(loadTime).toBeLessThan(1000);
    });

    it('应该测量字体加载性能', async () => {
      const mockFont = {
        fontFamily: 'Inter',
        fontSrc: 'https://example.com/inter.woff2',
        fontWeight: '400',
        fontStyle: 'normal',
      };

      const start = performance.now();

      await preloadFont(
        mockFont.fontFamily,
        mockFont.fontSrc,
        {
          fontWeight: mockFont.fontWeight,
          fontStyle: mockFont.fontStyle,
        }
      );

      const end = performance.now();
      const loadTime = end - start;

      expect(loadTime).toBeLessThan(1000);
    });

    it('应该测量资源预加载性能', async () => {
      const mockUrl = 'https://example.com/script.js';

      const start = performance.now();

      await preloadResource(mockUrl, 'script');

      const end = performance.now();
      const loadTime = end - start;

      expect(loadTime).toBeLessThan(1000);
    });
  });
});
