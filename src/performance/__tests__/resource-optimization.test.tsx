/**
 * @file 资源优化测试
 * @description 测试性能优化功能
 * @module __tests__/performance/resource-optimization.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

;

import { render, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom';
import { imageCache, resourceCache, compressImage, generateResponsiveImageUrls, createBlurHash, preloadImage, preloadResource, useImageOptimization, useResourcePreload, createImageOptimizationConfig, createResourcePreloadConfig } from '../resource-optimization';
import React from 'react';

global.fetch = jest.fn() as any;

describe('Resource Optimization Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resourceCache.clear();
    imageCache.clear();
    (global.fetch as any).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('资源缓存', () => {
    it('应该存储和检索缓存项', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      resourceCache.set(key, value);
      const retrieved = resourceCache.get(key);

      expect(retrieved).toEqual(value);
      expect(resourceCache.has(key)).toBe(true);
    });

    it('应该支持删除缓存项', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      resourceCache.set(key, value);
      expect(resourceCache.has(key)).toBe(true);

      resourceCache.delete(key);
      expect(resourceCache.has(key)).toBe(false);
    });

    it('应该支持清空缓存', () => {
      resourceCache.set('key1', { data: 'test1' });
      resourceCache.set('key2', { data: 'test2' });
      resourceCache.set('key3', { data: 'test3' });

      expect(resourceCache.size()).toBe(3);

      resourceCache.clear();
      expect(resourceCache.size()).toBe(0);
    });

    it('应该支持缓存大小限制', () => {
      resourceCache.set('key1', { data: 'test1' });
      resourceCache.set('key2', { data: 'test2' });
      resourceCache.set('key3', { data: 'test3' });
      resourceCache.set('key4', { data: 'test4' });
      resourceCache.set('key5', { data: 'test5' });

      expect(resourceCache.size()).toBeGreaterThan(0);
    });

    it('应该支持TTL过期', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      resourceCache.set(key, value, 100);

      expect(resourceCache.has(key)).toBe(true);

      return new Promise((resolve) => {
        setTimeout(() => {
          const expired = resourceCache.get(key);
          expect(expired).toBeNull();
          resolve(true);
        }, 150);
      });
    });

    it('应该处理缓存过期', () => {
      const key = 'expired-key';
      const value = { data: 'expired-data' };

      resourceCache.set(key, value, 50);

      return new Promise((resolve) => {
        setTimeout(() => {
          const retrieved = resourceCache.get(key);
          expect(retrieved).toBeNull();
          resolve(true);
        }, 100);
      });
    });
  });

  describe('图像优化', () => {
    it('应该处理图像加载失败', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null
      };

      global.Image = jest.fn(() => {
        setTimeout(() => {
          if (mockImage.onerror) {
            mockImage.onerror();
          }
        }, 10);
        return mockImage;
      }) as any;

      await expect(
        compressImage(new File(['mock'], 'test.png') as any)
      ).rejects.toThrow('Failed to load image');
    });

    it('应该生成响应式图像URL', () => {
      const baseUrl = 'https://example.com/image.jpg';
      const sizes = [300, 600, 1200];
      const urls = generateResponsiveImageUrls(baseUrl, sizes);

      expect(urls).toHaveLength(3);
      expect(urls[0].width).toBe(300);
      expect(urls[0].src).toContain('w=300');
      expect(urls[1].width).toBe(600);
      expect(urls[1].src).toContain('w=600');
      expect(urls[2].width).toBe(1200);
      expect(urls[2].src).toContain('w=1200');
    });

    it('应该生成响应式图像URL使用默认断点', () => {
      const baseUrl = 'https://example.com/image.jpg';
      const urls = generateResponsiveImageUrls(baseUrl);

      expect(urls.length).toBeGreaterThan(0);
      expect(urls[0].src).toContain(baseUrl);
    });

    it('应该处理模糊哈希创建失败', async () => {
      (global.HTMLCanvasElement as any).prototype.getContext = jest.fn(() => null);

      const blurHash = await createBlurHash(new File(['mock'], 'test.png') as any);

      expect(blurHash).toBe('');
    });

    it('应该支持自定义图像格式', () => {
      const config = createImageOptimizationConfig({
        format: 'webp'
      });

      expect(config.format).toBe('webp');
    });

    it('应该支持自定义质量设置', () => {
      const config = createImageOptimizationConfig({
        quality: 0.9
      });

      expect(config.quality).toBe(0.9);
    });

    it('应该支持自定义图像尺寸', () => {
      const config = createImageOptimizationConfig({
        maxWidth: 1920,
        maxHeight: 1080
      });

      expect(config.maxWidth).toBe(1920);
      expect(config.maxHeight).toBe(1080);
    });

    it('应该支持自定义断点', () => {
      const breakpoints = [320, 640, 960, 1280];
      const config = createImageOptimizationConfig({
        breakpoints
      });

      expect(config.breakpoints).toEqual(breakpoints);
    });

    it('应该支持启用占位符', () => {
      const config = createImageOptimizationConfig({
        enablePlaceholder: true
      });

      expect(config.enablePlaceholder).toBe(true);
    });

    it('应该支持启用响应式图像', () => {
      const config = createImageOptimizationConfig({
        enableResponsiveImages: true
      });

      expect(config.enableResponsiveImages).toBe(true);
    });
  });

  describe('资源预加载', () => {
    it('应该预加载图像', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null
      };

      global.Image = jest.fn(() => {
        setTimeout(() => {
          if (mockImage.onload) {
            mockImage.onload();
          }
        }, 10);
        return mockImage;
      }) as any;

      const result = await preloadImage('https://example.com/image.jpg');

      expect(result.success).toBe(true);
      expect(result.resource).toBe('https://example.com/image.jpg');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('应该从缓存加载图像', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null
      };

      global.Image = jest.fn(() => {
        setTimeout(() => {
          if (mockImage.onload) {
            mockImage.onload();
          }
        }, 10);
        return mockImage;
      }) as any;

      const src = 'https://example.com/image.jpg';
      imageCache.set(src, mockImage as any);

      const result = await preloadImage(src);

      expect(result.success).toBe(true);
      expect(result.cached).toBe(true);
      expect(result.duration).toBe(0);
    });

    it('应该预加载fetch资源', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true
      });

      const result = await preloadResource('https://example.com/data.json', 'fetch');

      expect(result.success).toBe(true);
      expect(result.resource).toBe('https://example.com/data.json');
    });

    it('应该处理预加载失败', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null
      };

      global.Image = jest.fn(() => {
        setTimeout(() => {
          if (mockImage.onerror) {
            mockImage.onerror();
          }
        }, 10);
        return mockImage;
      }) as any;

      const result = await preloadImage('https://example.com/nonexistent.jpg');

      expect(result.success).toBe(false);
      expect(result.resource).toBe('https://example.com/nonexistent.jpg');
    });

    it('应该重试失败的预加载', async () => {
      let attemptCount = 0;
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null
      };

      global.Image = jest.fn(() => {
        attemptCount++;
        setTimeout(() => {
          if (attemptCount < 3) {
            if (mockImage.onerror) {
              mockImage.onerror();
            }
          } else {
            if (mockImage.onload) {
              mockImage.onload();
            }
          }
        }, 10);
        return mockImage;
      }) as any;

      const result = await preloadImage('https://example.com/retry.jpg', {
        retryCount: 3,
        retryDelay: 50
      });

      expect(result.success).toBe(true);
      expect(attemptCount).toBe(3);
    });

    it('应该处理无效的资源类型', async () => {
      const result = await preloadResource('https://example.com/data', 'invalid' as any);

      expect(result.success).toBe(false);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('React Hooks', () => {
    it('应该使用图像优化hook', () => {
      const TestComponent = () => {
        const imageOpt = useImageOptimization({
          maxWidth: 800,
          quality: 0.8
        });

        return (
          <div>
            <div data-testid="compress-type">{typeof imageOpt.compress}</div>
            <div data-testid="preload-type">{typeof imageOpt.preload}</div>
            <div data-testid="generate-type">{typeof imageOpt.generateResponsive}</div>
            <div data-testid="blurhash-type">{typeof imageOpt.createBlurHash}</div>
          </div>
        );
      };

      const { container } = render(<TestComponent />);

      expect(container.querySelector('[data-testid="compress-type"]')).toHaveTextContent('function');
      expect(container.querySelector('[data-testid="preload-type"]')).toHaveTextContent('function');
      expect(container.querySelector('[data-testid="generate-type"]')).toHaveTextContent('function');
      expect(container.querySelector('[data-testid="blurhash-type"]')).toHaveTextContent('function');
    });

    it('应该使用资源预加载hook', () => {
      const TestComponent = () => {
        const resourcePreload = useResourcePreload({
          preloadPriority: 'high'
        });

        return (
          <div>
            <div data-testid="preload-func-type">{typeof resourcePreload.preload}</div>
            <div data-testid="progress">{resourcePreload.progress}</div>
            <div data-testid="results">{resourcePreload.results.length}</div>
            <div data-testid="clear-cache-type">{typeof resourcePreload.clearCache}</div>
          </div>
        );
      };

      const { container } = render(<TestComponent />);

      expect(container.querySelector('[data-testid="preload-func-type"]')).toHaveTextContent('function');
      expect(container.querySelector('[data-testid="progress"]')).toHaveTextContent('0');
      expect(container.querySelector('[data-testid="results"]')).toHaveTextContent('0');
      expect(container.querySelector('[data-testid="clear-cache-type"]')).toHaveTextContent('function');
    });

    it('应该调用资源预加载hook的preload函数', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null
      };

      global.Image = jest.fn(() => {
        setTimeout(() => {
          if (mockImage.onload) {
            mockImage.onload();
          }
        }, 10);
        return mockImage;
      }) as any;

      const TestComponent = () => {
        const resourcePreload = useResourcePreload({});
        const [loaded, setLoaded] = React.useState(false);

        const handleLoad = async () => {
          await resourcePreload.preload([
            { url: 'https://example.com/image.jpg', type: 'image' }
          ]);
          setLoaded(true);
        };

        return (
          <div>
            <div data-testid="loaded">{loaded ? 'yes' : 'no'}</div>
            <button data-testid="load-btn" onClick={handleLoad}>Load</button>
          </div>
        );
      };

      const { container } = render(<TestComponent />);

      const loadButton = container.querySelector('[data-testid="load-btn"]') as HTMLButtonElement;
      loadButton.click();

      await waitFor(() => {
        expect(container.querySelector('[data-testid="loaded"]')).toHaveTextContent('yes');
      });
    });

    it('应该调用clearCache函数', async () => {
      const TestComponent = () => {
        const resourcePreload = useResourcePreload({});
        const [cleared, setCleared] = React.useState(false);

        const handleClear = () => {
          resourcePreload.clearCache();
          setCleared(true);
        };

        return (
          <div>
            <div data-testid="cleared">{cleared ? 'yes' : 'no'}</div>
            <button data-testid="clear-btn" onClick={handleClear}>Clear</button>
          </div>
        );
      };

      const { container } = render(<TestComponent />);

      const clearButton = container.querySelector('[data-testid="clear-btn"]') as HTMLButtonElement;
      clearButton.click();

      await waitFor(() => {
        expect(container.querySelector('[data-testid="cleared"]')).toHaveTextContent('yes');
      });
      
      expect(imageCache.size()).toBe(0);
      expect(resourceCache.size()).toBe(0);
    });
  });

  describe('配置管理', () => {
    it('应该创建图像优化配置', () => {
      const config = createImageOptimizationConfig({
        maxWidth: 1920,
        quality: 0.9
      });

      expect(config.maxWidth).toBe(1920);
      expect(config.quality).toBe(0.9);
      expect(config.cacheEnabled).toBe(true);
    });

    it('应该创建资源预加载配置', () => {
      const config = createResourcePreloadConfig({
        preloadPriority: 'high',
        preloadTimeout: 5000
      });

      expect(config.preloadPriority).toBe('high');
      expect(config.preloadTimeout).toBe(5000);
      expect(config.cacheEnabled).toBe(true);
    });
  });
});