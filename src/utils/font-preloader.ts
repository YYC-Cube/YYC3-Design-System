/**
 * @file 字体预加载工具
 * @description 提供字体预加载、缓存管理和字体检测功能
 * @module utils/font-preloader
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface FontPreloadOptions {
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  useCache?: boolean;
  cacheKey?: string;
  onLoad?: (font: FontFace) => void;
  onError?: (error: Error) => void;
}

export interface FontPreloadResult {
  success: boolean;
  font?: FontFace;
  duration: number;
  cached: boolean;
  error?: Error;
}

export interface FontInfo {
  family: string;
  weight: string;
  style: string;
  src: string;
  loaded: boolean;
  cached: boolean;
}

export interface FontCacheEntry {
  font: FontFace;
  timestamp: number;
  accessCount: number;
}

export class FontPreloader {
  private cache: Map<string, FontCacheEntry>;
  private loading: Map<string, Promise<FontPreloadResult>>;
  private maxCacheSize: number;
  private maxCacheAge: number;

  constructor(options?: { maxCacheSize?: number; maxCacheAge?: number }) {
    this.cache = new Map();
    this.loading = new Map();
    this.maxCacheSize = options?.maxCacheSize || 20;
    this.maxCacheAge = options?.maxCacheAge || 3600000;
  }

  private getCacheKey(fontFamily: string, fontWeight: string, fontStyle: string): string {
    return `${fontFamily}-${fontWeight}-${fontStyle}`;
  }

  private addToCache(key: string, font: FontFace): void {
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      font,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
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

    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  preloadFont(
    fontFamily: string,
    fontSrc: string,
    options?: FontPreloadOptions & {
      fontWeight?: string;
      fontStyle?: string;
    }
  ): Promise<FontPreloadResult> {
    const {
      fontWeight = 'normal',
      fontStyle = 'normal',
      timeout = 10000,
      retryCount = 3,
      retryDelay = 1000,
      useCache = true,
      cacheKey,
      onLoad,
      onError,
    } = options || {};

    const key = cacheKey || this.getCacheKey(fontFamily, fontWeight, fontStyle);

    if (useCache && this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      entry.accessCount++;
      entry.timestamp = Date.now();

      onLoad?.(entry.font);

      return Promise.resolve({
        success: true,
        font: entry.font,
        duration: 0,
        cached: true,
      });
    }

    if (this.loading.has(key)) {
      return this.loading.get(key)!;
    }

    const promise = this.loadFontWithRetry(fontFamily, fontSrc, fontWeight, fontStyle, {
      timeout,
      retryCount,
      retryDelay,
      onLoad,
      onError,
    }).then((result) => {
      this.loading.delete(key);

      if (result.success && result.font && useCache) {
        this.addToCache(key, result.font);
      }

      return result;
    });

    this.loading.set(key, promise);
    return promise;
  }

  private async loadFontWithRetry(
    fontFamily: string,
    fontSrc: string,
    fontWeight: string,
    fontStyle: string,
    options: {
      timeout: number;
      retryCount: number;
      retryDelay: number;
      onLoad?: (font: FontFace) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<FontPreloadResult> {
    const { timeout, retryCount, retryDelay, onLoad, onError } = options;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const result = await this.loadSingleFont(
          fontFamily,
          fontSrc,
          fontWeight,
          fontStyle,
          timeout
        );

        onLoad?.(result.font!);
        return result;
      } catch (error) {
        lastError = error as Error;
        if (attempt < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    onError?.(lastError!);
    return {
      success: false,
      duration: 0,
      cached: false,
      error: lastError || new Error(`Failed to load font: ${fontFamily}`),
    };
  }

  private loadSingleFont(
    fontFamily: string,
    fontSrc: string,
    fontWeight: string,
    fontStyle: string,
    timeout: number
  ): Promise<FontPreloadResult> {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      let timeoutId: ReturnType<typeof setTimeout>;

      const fontFace = new FontFace(fontFamily, `url(${fontSrc})`, {
        weight: fontWeight,
        style: fontStyle,
      });

      fontFace
        .load()
        .then(() => {
          clearTimeout(timeoutId);
          document.fonts.add(fontFace);

          const duration = performance.now() - startTime;

          resolve({
            success: true,
            font: fontFace,
            duration,
            cached: false,
          });
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load font: ${fontFamily}`));
        });

      timeoutId = setTimeout(() => {
        reject(new Error(`Font load timeout: ${fontFamily}`));
      }, timeout);
    });
  }

  preloadFontBatch(
    fonts: Array<{
      fontFamily: string;
      fontSrc: string;
      fontWeight?: string;
      fontStyle?: string;
      options?: FontPreloadOptions;
    }>
  ): Promise<FontPreloadResult[]> {
    const promises = fonts.map(({ fontFamily, fontSrc, fontWeight, fontStyle, options }) =>
      this.preloadFont(fontFamily, fontSrc, {
        ...options,
        fontWeight,
        fontStyle,
      })
    );

    return Promise.all(promises);
  }

  preloadFontsWithProgress(
    fonts: Array<{
      fontFamily: string;
      fontSrc: string;
      fontWeight?: string;
      fontStyle?: string;
      options?: FontPreloadOptions;
    }>,
    onProgress: (loaded: number, total: number) => void
  ): Promise<FontPreloadResult[]> {
    const results: FontPreloadResult[] = [];
    let loaded = 0;

    const promises = fonts.map(({ fontFamily, fontSrc, fontWeight, fontStyle, options }, index) => {
      return this.preloadFont(fontFamily, fontSrc, {
        ...options,
        fontWeight,
        fontStyle,
        onLoad: (font) => {
          loaded++;
          onProgress(loaded, fonts.length);
          options?.onLoad?.(font);
        },
      }).then((result) => {
        results[index] = result;
        return result;
      });
    });

    return Promise.all(promises).then(() => results);
  }

  getFromCache(
    fontFamily: string,
    fontWeight: string = 'normal',
    fontStyle: string = 'normal'
  ): FontFace | null {
    const key = this.getCacheKey(fontFamily, fontWeight, fontStyle);
    const entry = this.cache.get(key);

    if (entry) {
      entry.accessCount++;
      entry.timestamp = Date.now();
      return entry.font;
    }

    return null;
  }

  removeFromCache(
    fontFamily: string,
    fontWeight: string = 'normal',
    fontStyle: string = 'normal'
  ): boolean {
    const key = this.getCacheKey(fontFamily, fontWeight, fontStyle);
    return this.cache.delete(key);
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearExpiredCache(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > this.maxCacheAge) {
        this.cache.delete(key);
      }
    }
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getLoadingCount(): number {
    return this.loading.size;
  }

  getStats(): {
    cacheSize: number;
    loadingCount: number;
    cacheEntries: FontInfo[];
  } {
    const cacheEntries: FontInfo[] = [];

    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      const [family, weight, style] = key.split('-');
      cacheEntries.push({
        family,
        weight,
        style,
        src: entry.font.family,
        loaded: true,
        cached: true,
      });
    }

    return {
      cacheSize: this.cache.size,
      loadingCount: this.loading.size,
      cacheEntries,
    };
  }
}

export const createFontPreloader = (options?: {
  maxCacheSize?: number;
  maxCacheAge?: number;
}): FontPreloader => {
  return new FontPreloader(options);
};

export const defaultFontPreloader = new FontPreloader();

export const preloadFont = (
  fontFamily: string,
  fontSrc: string,
  options?: FontPreloadOptions & {
    fontWeight?: string;
    fontStyle?: string;
  }
): Promise<FontPreloadResult> => {
  return defaultFontPreloader.preloadFont(fontFamily, fontSrc, options);
};

export const preloadFontBatch = (
  fonts: Array<{
    fontFamily: string;
    fontSrc: string;
    fontWeight?: string;
    fontStyle?: string;
    options?: FontPreloadOptions;
  }>
): Promise<FontPreloadResult[]> => {
  return defaultFontPreloader.preloadFontBatch(fonts);
};

export const preloadFontsWithProgress = (
  fonts: Array<{
    fontFamily: string;
    fontSrc: string;
    fontWeight?: string;
    fontStyle?: string;
    options?: FontPreloadOptions;
  }>,
  onProgress: (loaded: number, total: number) => void
): Promise<FontPreloadResult[]> => {
  return defaultFontPreloader.preloadFontsWithProgress(fonts, onProgress);
};

export const getCachedFont = (
  fontFamily: string,
  fontWeight?: string,
  fontStyle?: string
): FontFace | null => {
  return defaultFontPreloader.getFromCache(fontFamily, fontWeight, fontStyle);
};

export const removeCachedFont = (
  fontFamily: string,
  fontWeight?: string,
  fontStyle?: string
): boolean => {
  return defaultFontPreloader.removeFromCache(fontFamily, fontWeight, fontStyle);
};

export const clearFontCache = (): void => {
  defaultFontPreloader.clearCache();
};

export const clearExpiredFontCache = (): void => {
  defaultFontPreloader.clearExpiredCache();
};

export const getFontPreloaderStats = () => {
  return defaultFontPreloader.getStats();
};

export const preloadCriticalFonts = (
  fonts: Array<{
    fontFamily: string;
    fontSrc: string;
    fontWeight?: string;
    fontStyle?: string;
  }>,
  options?: FontPreloadOptions
): Promise<FontPreloadResult[]> => {
  return preloadFontBatch(
    fonts.map((font) => ({
      ...font,
      options: { ...options, timeout: 5000 },
    }))
  );
};

export const preloadViewportFonts = (
  fonts: Array<{
    fontFamily: string;
    fontSrc: string;
    fontWeight?: string;
    fontStyle?: string;
  }>,
  options?: FontPreloadOptions
): Promise<FontPreloadResult[]> => {
  return preloadFontBatch(
    fonts.map((font) => ({
      ...font,
      options: { ...options, timeout: 10000 },
    }))
  );
};

export const preloadBelowFoldFonts = (
  fonts: Array<{
    fontFamily: string;
    fontSrc: string;
    fontWeight?: string;
    fontStyle?: string;
  }>,
  options?: FontPreloadOptions
): Promise<FontPreloadResult[]> => {
  return preloadFontBatch(
    fonts.map((font) => ({
      ...font,
      options: { ...options, timeout: 15000 },
    }))
  );
};

export const isFontLoaded = (fontFamily: string): boolean => {
  return document.fonts.check(`16px ${fontFamily}`);
};

export const waitForFontLoad = (fontFamily: string, timeout: number = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isFontLoaded(fontFamily)) {
      resolve(true);
      return;
    }

    const checkInterval = setInterval(() => {
      if (isFontLoaded(fontFamily)) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, timeout);
  });
};

export const getAvailableFonts = (): string[] => {
  const fonts = Array.from(document.fonts.values());
  const fontFamilies = new Set<string>();

  fonts.forEach((font) => {
    fontFamilies.add(font.family);
  });

  return Array.from(fontFamilies);
};

export default {
  FontPreloader,
  createFontPreloader,
  defaultFontPreloader,
  preloadFont,
  preloadFontBatch,
  preloadFontsWithProgress,
  getCachedFont,
  removeCachedFont,
  clearFontCache,
  clearExpiredFontCache,
  getFontPreloaderStats,
  preloadCriticalFonts,
  preloadViewportFonts,
  preloadBelowFoldFonts,
  isFontLoaded,
  waitForFontLoad,
  getAvailableFonts,
};
