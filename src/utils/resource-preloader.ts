/**
 * @file 资源预加载工具
 * @description 提供关键资源预加载、预连接和预取功能
 * @module utils/resource-preloader
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export type ResourceType = 'script' | 'style' | 'image' | 'font' | 'document' | 'fetch' | 'worker';

export type PreloadPriority = 'high' | 'low' | 'auto';

export interface PreloadOptions {
  priority?: PreloadPriority;
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  timeout?: number;
  onLoad?: (resource: string) => void;
  onError?: (resource: string, error: Error) => void;
}

export interface PreconnectOptions {
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
}

export interface PrefetchOptions {
  priority?: PreloadPriority;
  timeout?: number;
  onLoad?: (resource: string) => void;
  onError?: (resource: string, error: Error) => void;
}

export interface ResourcePreloadConfig {
  url: string;
  type: ResourceType;
  priority?: PreloadPriority;
  critical?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
  integrity?: string;
}

export interface PreconnectConfig {
  href: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
}

export interface PrefetchConfig {
  url: string;
  type?: ResourceType;
  priority?: PreloadPriority;
}

export class ResourcePreloader {
  private preloadedResources: Set<string>;
  private preconnectedOrigins: Set<string>;
  private prefetchedResources: Set<string>;
  private loadingResources: Map<string, Promise<boolean>>;

  constructor() {
    this.preloadedResources = new Set();
    this.preconnectedOrigins = new Set();
    this.prefetchedResources = new Set();
    this.loadingResources = new Map();
  }

  preloadResource(
    url: string,
    type: ResourceType,
    options?: PreloadOptions
  ): Promise<boolean> {
    if (this.preloadedResources.has(url)) {
      return Promise.resolve(true);
    }

    if (this.loadingResources.has(url)) {
      return this.loadingResources.get(url)!;
    }

    const {
      priority = 'auto',
      crossOrigin = false,
      referrerPolicy,
      integrity,
      timeout = 10000,
      onLoad,
      onError,
    } = options || {};

    const promise = new Promise<boolean>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;

      if (priority !== 'auto') {
        link.setAttribute('fetchpriority', priority);
      }

      if (crossOrigin) {
        link.crossOrigin = crossOrigin === true ? 'anonymous' : crossOrigin;
      }

      if (referrerPolicy) {
        link.referrerPolicy = referrerPolicy;
      }

      if (integrity) {
        link.integrity = integrity;
      }

      const timeoutId = setTimeout(() => {
        link.remove();
        const error = new Error(`Resource preload timeout: ${url}`);
        onError?.(url, error);
        this.loadingResources.delete(url);
        resolve(false);
      }, timeout);

      link.onload = () => {
        clearTimeout(timeoutId);
        this.preloadedResources.add(url);
        this.loadingResources.delete(url);
        onLoad?.(url);
        resolve(true);
      };

      link.onerror = () => {
        clearTimeout(timeoutId);
        link.remove();
        const error = new Error(`Resource preload failed: ${url}`);
        onError?.(url, error);
        this.loadingResources.delete(url);
        resolve(false);
      };

      document.head.appendChild(link);
    });

    this.loadingResources.set(url, promise);
    return promise;
  }

  preloadResources(
    resources: ResourcePreloadConfig[],
    options?: {
      concurrent?: number;
      onProgress?: (loaded: number, total: number) => void;
    }
  ): Promise<boolean[]> {
    const { concurrent = Infinity, onProgress } = options || {};
    const results: boolean[] = [];
    let loaded = 0;

    const processBatch = async (batch: ResourcePreloadConfig[]): Promise<void> => {
      const promises = batch.map((resource) =>
        this.preloadResource(resource.url, resource.type, {
          priority: resource.priority,
          crossOrigin: resource.crossOrigin,
          integrity: resource.integrity,
        })
      );

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
      loaded += batch.length;
      onProgress?.(loaded, resources.length);
    };

    const processAll = async () => {
      for (let i = 0; i < resources.length; i += concurrent) {
        const batch = resources.slice(i, i + concurrent);
        await processBatch(batch);
      }
    };

    return processAll().then(() => results);
  }

  preloadCriticalResources(resources: ResourcePreloadConfig[]): Promise<boolean[]> {
    const criticalResources = resources.filter((r) => r.critical);
    return this.preloadResources(criticalResources, {
      concurrent: 3,
    });
  }

  preloadViewportResources(resources: ResourcePreloadConfig[]): Promise<boolean[]> {
    return this.preloadResources(resources, {
      concurrent: 5,
    });
  }

  preloadBelowFoldResources(resources: ResourcePreloadConfig[]): Promise<boolean[]> {
    return this.preloadResources(resources, {
      concurrent: 2,
    });
  }

  preconnect(origin: string, options?: PreconnectOptions): void {
    if (this.preconnectedOrigins.has(origin)) {
      return;
    }

    const { crossOrigin = false } = options || {};

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;

    if (crossOrigin) {
      link.crossOrigin = crossOrigin === true ? 'anonymous' : crossOrigin;
    }

    document.head.appendChild(link);
    this.preconnectedOrigins.add(origin);
  }

  preconnectOrigins(origins: PreconnectConfig[]): void {
    origins.forEach((config) => {
      this.preconnect(config.href, { crossOrigin: config.crossOrigin });
    });
  }

  prefetch(
    url: string,
    options?: PrefetchOptions
  ): Promise<boolean> {
    if (this.prefetchedResources.has(url)) {
      return Promise.resolve(true);
    }

    const {
      priority = 'auto',
      timeout = 10000,
      onLoad,
      onError,
    } = options || {};

    return new Promise<boolean>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;

      if (priority !== 'auto') {
        link.setAttribute('fetchpriority', priority);
      }

      const timeoutId = setTimeout(() => {
        link.remove();
        const error = new Error(`Resource prefetch timeout: ${url}`);
        onError?.(url, error);
        resolve(false);
      }, timeout);

      link.onload = () => {
        clearTimeout(timeoutId);
        this.prefetchedResources.add(url);
        onLoad?.(url);
        resolve(true);
      };

      link.onerror = () => {
        clearTimeout(timeoutId);
        link.remove();
        const error = new Error(`Resource prefetch failed: ${url}`);
        onError?.(url, error);
        resolve(false);
      };

      document.head.appendChild(link);
    });
  }

  prefetchResources(
    resources: PrefetchConfig[],
    options?: {
      concurrent?: number;
      onProgress?: (loaded: number, total: number) => void;
    }
  ): Promise<boolean[]> {
    const { concurrent = Infinity, onProgress } = options || {};
    const results: boolean[] = [];
    let loaded = 0;

    const processBatch = async (batch: PrefetchConfig[]): Promise<void> => {
      const promises = batch.map((resource) =>
        this.prefetch(resource.url, {
          priority: resource.priority,
        })
      );

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
      loaded += batch.length;
      onProgress?.(loaded, resources.length);
    };

    const processAll = async () => {
      for (let i = 0; i < resources.length; i += concurrent) {
        const batch = resources.slice(i, i + concurrent);
        await processBatch(batch);
      }
    };

    return processAll().then(() => results);
  }

  preloadScript(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'script', options);
  }

  preloadStyle(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'style', options);
  }

  preloadImage(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'image', options);
  }

  preloadFont(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'font', options);
  }

  preloadDocument(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'document', options);
  }

  preloadFetch(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'fetch', options);
  }

  preloadWorker(
    url: string,
    options?: PreloadOptions
  ): Promise<boolean> {
    return this.preloadResource(url, 'worker', options);
  }

  isPreloaded(url: string): boolean {
    return this.preloadedResources.has(url);
  }

  isPreconnected(origin: string): boolean {
    return this.preconnectedOrigins.has(origin);
  }

  isPrefetched(url: string): boolean {
    return this.prefetchedResources.has(url);
  }

  isLoading(url: string): boolean {
    return this.loadingResources.has(url);
  }

  clearPreloadedResources(): void {
    this.preloadedResources.clear();
    this.loadingResources.clear();
  }

  clearPreconnectedOrigins(): void {
    this.preconnectedOrigins.clear();
  }

  clearPrefetchedResources(): void {
    this.prefetchedResources.clear();
  }

  clearAll(): void {
    this.clearPreloadedResources();
    this.clearPreconnectedOrigins();
    this.clearPrefetchedResources();
  }

  getStats(): {
    preloadedCount: number;
    preconnectedCount: number;
    prefetchedCount: number;
    loadingCount: number;
  } {
    return {
      preloadedCount: this.preloadedResources.size,
      preconnectedCount: this.preconnectedOrigins.size,
      prefetchedCount: this.prefetchedResources.size,
      loadingCount: this.loadingResources.size,
    };
  }

  generatePreloadHints(
    resources: ResourcePreloadConfig[],
    origins: PreconnectConfig[]
  ): string {
    let hints = '';

    origins.forEach((origin) => {
      hints += `<link rel="preconnect" href="${origin.href}"`;
      if (origin.crossOrigin) {
        hints += ` crossorigin="${origin.crossOrigin}"`;
      }
      hints += '>\n';
    });

    resources.forEach((resource) => {
      hints += `<link rel="preload" href="${resource.url}" as="${resource.type}"`;
      if (resource.priority && resource.priority !== 'auto') {
        hints += ` fetchpriority="${resource.priority}"`;
      }
      if (resource.crossOrigin) {
        hints += ` crossorigin="${resource.crossOrigin}"`;
      }
      if (resource.integrity) {
        hints += ` integrity="${resource.integrity}"`;
      }
      hints += '>\n';
    });

    return hints;
  }
}

export const createResourcePreloader = (): ResourcePreloader => {
  return new ResourcePreloader();
};

export const defaultResourcePreloader = new ResourcePreloader();

export const preloadResource = (
  url: string,
  type: ResourceType,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadResource(url, type, options);
};

export const preloadResources = (
  resources: ResourcePreloadConfig[],
  options?: {
    concurrent?: number;
    onProgress?: (loaded: number, total: number) => void;
  }
): Promise<boolean[]> => {
  return defaultResourcePreloader.preloadResources(resources, options);
};

export const preloadCriticalResources = (
  resources: ResourcePreloadConfig[]
): Promise<boolean[]> => {
  return defaultResourcePreloader.preloadCriticalResources(resources);
};

export const preloadViewportResources = (
  resources: ResourcePreloadConfig[]
): Promise<boolean[]> => {
  return defaultResourcePreloader.preloadViewportResources(resources);
};

export const preloadBelowFoldResources = (
  resources: ResourcePreloadConfig[]
): Promise<boolean[]> => {
  return defaultResourcePreloader.preloadBelowFoldResources(resources);
};

export const preconnect = (
  origin: string,
  options?: PreconnectOptions
): void => {
  defaultResourcePreloader.preconnect(origin, options);
};

export const preconnectOrigins = (origins: PreconnectConfig[]): void => {
  defaultResourcePreloader.preconnectOrigins(origins);
};

export const prefetch = (
  url: string,
  options?: PrefetchOptions
): Promise<boolean> => {
  return defaultResourcePreloader.prefetch(url, options);
};

export const prefetchResources = (
  resources: PrefetchConfig[],
  options?: {
    concurrent?: number;
    onProgress?: (loaded: number, total: number) => void;
  }
): Promise<boolean[]> => {
  return defaultResourcePreloader.prefetchResources(resources, options);
};

export const preloadScript = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadScript(url, options);
};

export const preloadStyle = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadStyle(url, options);
};

export const preloadImage = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadImage(url, options);
};

export const preloadFont = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadFont(url, options);
};

export const preloadDocument = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadDocument(url, options);
};

export const preloadFetch = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadFetch(url, options);
};

export const preloadWorker = (
  url: string,
  options?: PreloadOptions
): Promise<boolean> => {
  return defaultResourcePreloader.preloadWorker(url, options);
};

export const isPreloaded = (url: string): boolean => {
  return defaultResourcePreloader.isPreloaded(url);
};

export const isPreconnected = (origin: string): boolean => {
  return defaultResourcePreloader.isPreconnected(origin);
};

export const isPrefetched = (url: string): boolean => {
  return defaultResourcePreloader.isPrefetched(url);
};

export const isLoading = (url: string): boolean => {
  return defaultResourcePreloader.isLoading(url);
};

export const clearPreloadedResources = (): void => {
  defaultResourcePreloader.clearPreloadedResources();
};

export const clearPreconnectedOrigins = (): void => {
  defaultResourcePreloader.clearPreconnectedOrigins();
};

export const clearPrefetchedResources = (): void => {
  defaultResourcePreloader.clearPrefetchedResources();
};

export const clearAllResources = (): void => {
  defaultResourcePreloader.clearAll();
};

export const getResourcePreloaderStats = () => {
  return defaultResourcePreloader.getStats();
};

export const generatePreloadHints = (
  resources: ResourcePreloadConfig[],
  origins: PreconnectConfig[]
): string => {
  return defaultResourcePreloader.generatePreloadHints(resources, origins);
};

export default {
  ResourcePreloader,
  createResourcePreloader,
  defaultResourcePreloader,
  preloadResource,
  preloadResources,
  preloadCriticalResources,
  preloadViewportResources,
  preloadBelowFoldResources,
  preconnect,
  preconnectOrigins,
  prefetch,
  prefetchResources,
  preloadScript,
  preloadStyle,
  preloadImage,
  preloadFont,
  preloadDocument,
  preloadFetch,
  preloadWorker,
  isPreloaded,
  isPreconnected,
  isPrefetched,
  isLoading,
  clearPreloadedResources,
  clearPreconnectedOrigins,
  clearPrefetchedResources,
  clearAllResources,
  getResourcePreloaderStats,
  generatePreloadHints,
};
