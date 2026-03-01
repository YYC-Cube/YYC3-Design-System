/**
 * @file 图片预加载工具
 * @description 提供图片预加载、优先级管理和缓存功能
 * @module utils/image-preloader
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface PreloadImageOptions {
  priority?: 'high' | 'low' | 'auto';
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheKey?: string;
  onLoad?: (img: HTMLImageElement) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export interface PreloadImageResult {
  success: boolean;
  image?: HTMLImageElement;
  duration: number;
  cached: boolean;
  error?: Error;
}

export interface PreloadQueueItem {
  src: string;
  options?: PreloadImageOptions;
  priority: number;
  resolve: (result: PreloadImageResult) => void;
  reject: (error: Error) => void;
}

export interface ImageCacheEntry {
  image: HTMLImageElement;
  timestamp: number;
  size: number;
  accessCount: number;
}

export class ImagePreloader {
  private cache: Map<string, ImageCacheEntry>;
  private queue: PreloadQueueItem[];
  private processing: boolean;
  private maxCacheSize: number;
  private maxCacheAge: number;
  private maxConcurrentLoads: number;
  private currentLoads: number;

  constructor(options?: {
    maxCacheSize?: number;
    maxCacheAge?: number;
    maxConcurrentLoads?: number;
  }) {
    this.cache = new Map();
    this.queue = [];
    this.processing = false;
    this.maxCacheSize = options?.maxCacheSize || 50;
    this.maxCacheAge = options?.maxCacheAge || 3600000;
    this.maxConcurrentLoads = options?.maxConcurrentLoads || 4;
    this.currentLoads = 0;
  }

  private getPriority(priority?: string): number {
    switch (priority) {
      case 'high':
        return 3;
      case 'low':
        return 1;
      case 'auto':
      default:
        return 2;
    }
  }

  private addToQueue(item: PreloadQueueItem): void {
    this.queue.push(item);
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private processQueue(): void {
    if (
      this.processing ||
      this.currentLoads >= this.maxConcurrentLoads ||
      this.queue.length === 0
    ) {
      return;
    }

    this.processing = true;

    while (this.currentLoads < this.maxConcurrentLoads && this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.loadImage(item.src, item.options)
          .then((result) => item.resolve(result))
          .catch((error) => item.reject(error));
      }
    }

    this.processing = false;
  }

  private async loadImage(src: string, options?: PreloadImageOptions): Promise<PreloadImageResult> {
    const {
      timeout = 10000,
      retryCount = 3,
      retryDelay = 1000,
      useCache = true,
      cacheKey,
      onLoad,
      onError,
      onProgress,
    } = options || {};

    const key = cacheKey || src;

    if (useCache && this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      entry.accessCount++;
      entry.timestamp = Date.now();

      onProgress?.(100);
      onLoad?.(entry.image);

      return {
        success: true,
        image: entry.image,
        duration: 0,
        cached: true,
      };
    }

    this.currentLoads++;

    try {
      const result = await this.loadImageWithRetry(src, {
        timeout,
        retryCount,
        retryDelay,
        onProgress,
      });

      if (result.success && result.image && useCache) {
        this.addToCache(key, result.image);
      }

      onLoad?.(result.image!);
      return result;
    } finally {
      this.currentLoads--;
      this.processQueue();
    }
  }

  private async loadImageWithRetry(
    src: string,
    options: {
      timeout: number;
      retryCount: number;
      retryDelay: number;
      onProgress?: (progress: number) => void;
    }
  ): Promise<PreloadImageResult> {
    const { timeout, retryCount, retryDelay, onProgress } = options;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const result = await this.loadSingleImage(src, timeout, onProgress);
        return result;
      } catch (error) {
        lastError = error as Error;
        if (attempt < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    return {
      success: false,
      duration: 0,
      cached: false,
      error: lastError || new Error(`Failed to load image: ${src}`),
    };
  }

  private loadSingleImage(
    src: string,
    timeout: number,
    onProgress?: (progress: number) => void
  ): Promise<PreloadImageResult> {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const img = new Image();
      let timeoutId: ReturnType<typeof setTimeout>;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        const duration = performance.now() - startTime;
        onProgress?.(100);

        resolve({
          success: true,
          image: img,
          duration,
          cached: false,
        });
      };

      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };

      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Image load timeout: ${src}`));
      }, timeout);

      img.src = src;
    });
  }

  private addToCache(key: string, image: HTMLImageElement): void {
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      image,
      timestamp: Date.now(),
      size: image.naturalWidth * image.naturalHeight,
      accessCount: 1,
    });
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private evictLRU(): void {
    let lruKey: string | null = null;
    let minAccessCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  preload(src: string, options?: PreloadImageOptions): Promise<PreloadImageResult> {
    return new Promise((resolve, reject) => {
      this.addToQueue({
        src,
        options,
        priority: this.getPriority(options?.priority),
        resolve,
        reject,
      });
    });
  }

  preloadBatch(
    images: Array<{ src: string; options?: PreloadImageOptions }>
  ): Promise<PreloadImageResult[]> {
    const promises = images.map(({ src, options }) => this.preload(src, options));
    return Promise.all(promises);
  }

  preloadWithProgress(
    images: Array<{ src: string; options?: PreloadImageOptions }>,
    onProgress: (loaded: number, total: number) => void
  ): Promise<PreloadImageResult[]> {
    const results: PreloadImageResult[] = [];
    let loaded = 0;

    const promises = images.map(({ src, options }) =>
      this.preload(src, {
        ...options,
        onProgress: () => {
          loaded++;
          onProgress(loaded, images.length);
        },
      })
    );

    return Promise.all(promises);
  }

  getFromCache(key: string): HTMLImageElement | null {
    const entry = this.cache.get(key);
    if (entry) {
      entry.accessCount++;
      entry.timestamp = Date.now();
      return entry.image;
    }
    return null;
  }

  removeFromCache(key: string): boolean {
    return this.cache.delete(key);
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxCacheAge) {
        this.cache.delete(key);
      }
    }
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  getStats(): {
    cacheSize: number;
    queueSize: number;
    processing: boolean;
    currentLoads: number;
  } {
    return {
      cacheSize: this.cache.size,
      queueSize: this.queue.length,
      processing: this.processing,
      currentLoads: this.currentLoads,
    };
  }
}

export const createImagePreloader = (options?: {
  maxCacheSize?: number;
  maxCacheAge?: number;
  maxConcurrentLoads?: number;
}): ImagePreloader => {
  return new ImagePreloader(options);
};

export const defaultImagePreloader = new ImagePreloader();

export const preloadImage = (
  src: string,
  options?: PreloadImageOptions
): Promise<PreloadImageResult> => {
  return defaultImagePreloader.preload(src, options);
};

export const preloadImageBatch = (
  images: Array<{ src: string; options?: PreloadImageOptions }>
): Promise<PreloadImageResult[]> => {
  return defaultImagePreloader.preloadBatch(images);
};

export const preloadImageWithProgress = (
  images: Array<{ src: string; options?: PreloadImageOptions }>,
  onProgress: (loaded: number, total: number) => void
): Promise<PreloadImageResult[]> => {
  return defaultImagePreloader.preloadWithProgress(images, onProgress);
};

export const getCachedImage = (key: string): HTMLImageElement | null => {
  return defaultImagePreloader.getFromCache(key);
};

export const removeCachedImage = (key: string): boolean => {
  return defaultImagePreloader.removeFromCache(key);
};

export const clearImageCache = (): void => {
  defaultImagePreloader.clearCache();
};

export const clearExpiredImageCache = (): void => {
  defaultImagePreloader.clearExpiredCache();
};

export const getImagePreloaderStats = () => {
  return defaultImagePreloader.getStats();
};

export const preloadCriticalImages = (
  criticalImages: string[],
  options?: PreloadImageOptions
): Promise<PreloadImageResult[]> => {
  return preloadImageBatch(
    criticalImages.map((src) => ({
      src,
      options: { ...options, priority: 'high' },
    }))
  );
};

export const preloadViewportImages = (
  images: string[],
  options?: PreloadImageOptions
): Promise<PreloadImageResult[]> => {
  return preloadImageBatch(
    images.map((src) => ({
      src,
      options: { ...options, priority: 'auto' },
    }))
  );
};

export const preloadBelowFoldImages = (
  images: string[],
  options?: PreloadImageOptions
): Promise<PreloadImageResult[]> => {
  return preloadImageBatch(
    images.map((src) => ({
      src,
      options: { ...options, priority: 'low' },
    }))
  );
};

export default {
  ImagePreloader,
  createImagePreloader,
  defaultImagePreloader,
  preloadImage,
  preloadImageBatch,
  preloadImageWithProgress,
  getCachedImage,
  removeCachedImage,
  clearImageCache,
  clearExpiredImageCache,
  getImagePreloaderStats,
  preloadCriticalImages,
  preloadViewportImages,
  preloadBelowFoldImages,
};
