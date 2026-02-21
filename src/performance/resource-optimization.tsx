/**
 * @file 资源优化模块
 * @description 提供图片压缩、预加载和资源优化功能
 * @module performance/resource-optimization
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface ImageOptimizationConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  enableLazyLoading?: boolean;
  enableResponsiveImages?: boolean;
  breakpoints?: number[];
  enablePlaceholder?: boolean;
  placeholderSize?: number;
  enableBlurHash?: boolean;
  enableProgressiveLoading?: boolean;
  cacheEnabled?: boolean;
  cacheTimeout?: number;
}

export interface OptimizedImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  config?: ImageOptimizationConfig;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

export interface ResourcePreloadConfig {
  maxPreloadCount?: number;
  preloadPriority?: 'high' | 'low' | 'auto';
  preloadTimeout?: number;
  retryCount?: number;
  retryDelay?: number;
  cacheEnabled?: boolean;
}

export interface PreloadResult {
  success: boolean;
  resource: string;
  duration: number;
  cached: boolean;
}

export interface ResourceCache<T = unknown> {
  get: (key: string) => T | null;
  set: (key: string, value: T, ttl?: number) => void;
  has: (key: string) => boolean;
  delete: (key: string) => void;
  clear: () => void;
  size: () => number;
}

class ResourceCacheManager<T = unknown> implements ResourceCache<T> {
  private cache: Map<string, { value: T; expiry: number }>;
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 3600000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T, ttl: number = this.defaultTTL): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const imageCache = new ResourceCacheManager<HTMLImageElement>(50, 1800000);
export const resourceCache = new ResourceCacheManager<unknown>(100, 3600000);

export const compressImage = async (
  file: File,
  config: ImageOptimizationConfig = {}
): Promise<Blob> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = config;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const generateResponsiveImageUrls = (
  baseUrl: string,
  breakpoints: number[] = [320, 640, 768, 1024, 1200, 1920],
  format: string = 'webp'
): Array<{ src: string; width: number; media?: string }> => {
  const url = new URL(baseUrl, window.location.origin);
  
  return breakpoints.map(width => {
    const searchParams = new URLSearchParams(url.search);
    searchParams.set('w', width.toString());
    searchParams.set('f', format);
    
    return {
      src: `${url.origin}${url.pathname}?${searchParams.toString()}`,
      width,
      media: `(max-width: ${width}px)`
    };
  });
};

export const createBlurHash = async (
  image: HTMLImageElement,
  size: number = 32
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = size;
  canvas.height = size;
  
  ctx.drawImage(image, 0, 0, size, size);
  
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  let hash = '';
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    const value = (r << 24) | (g << 16) | (b << 8) | a;
    hash += value.toString(16).padStart(8, '0');
  }
  
  return hash.substring(0, 20);
};

export const preloadImage = (
  src: string,
  config: ResourcePreloadConfig = {}
): Promise<PreloadResult> => {
  const {
    retryCount = 3,
    retryDelay = 1000,
    cacheEnabled = true
  } = config;

  if (cacheEnabled && imageCache.has(src)) {
    return Promise.resolve({
      success: true,
      resource: src,
      duration: 0,
      cached: true
    });
  }

  return new Promise((resolve) => {
    const startTime = performance.now();
    let attempts = 0;

    const attemptLoad = () => {
      const img = new Image();

      img.onload = () => {
        const duration = performance.now() - startTime;
        
        if (cacheEnabled) {
          imageCache.set(src, img);
        }

        resolve({
          success: true,
          resource: src,
          duration,
          cached: false
        });
      };

      img.onerror = () => {
        attempts++;
        
        if (attempts < retryCount) {
          setTimeout(attemptLoad, retryDelay);
        } else {
          resolve({
            success: false,
            resource: src,
            duration: performance.now() - startTime,
            cached: false
          });
        }
      };

      img.src = src;
    };

    attemptLoad();
  });
};

export const preloadResource = (
  url: string,
  type: 'image' | 'script' | 'style' | 'font' | 'fetch',
  config: ResourcePreloadConfig = {}
): Promise<PreloadResult> => {
  const {
    retryCount = 3,
    retryDelay = 1000,
    cacheEnabled = true
  } = config;

  if (cacheEnabled && resourceCache.has(url)) {
    return Promise.resolve({
      success: true,
      resource: url,
      duration: 0,
      cached: true
    });
  }

  return new Promise((resolve) => {
    const startTime = performance.now();
    let attempts = 0;

    const attemptLoad = () => {
      switch (type) {
        case 'image':
          preloadImage(url, config).then(resolve);
          break;
        case 'script':
        case 'style':
        case 'font': {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = type === 'font' ? 'font' : type;
          link.href = url;

          if (type === 'font') {
            link.crossOrigin = 'anonymous';
          }

          link.onload = () => {
            const duration = performance.now() - startTime;
            
            if (cacheEnabled) {
              resourceCache.set(url, true);
            }

            resolve({
              success: true,
              resource: url,
              duration,
              cached: false
            });
          };

          link.onerror = () => {
            attempts++;
            
            if (attempts < retryCount) {
              setTimeout(attemptLoad, retryDelay);
            } else {
              resolve({
                success: false,
                resource: url,
                duration: performance.now() - startTime,
                cached: false
              });
            }
          };

          document.head.appendChild(link);
          break;
        }
        case 'fetch':
          fetch(url)
            .then(() => {
              const duration = performance.now() - startTime;
              
              if (cacheEnabled) {
                resourceCache.set(url, true);
              }

              resolve({
                success: true,
                resource: url,
                duration,
                cached: false
              });
            })
            .catch(() => {
              attempts++;
              
              if (attempts < retryCount) {
                setTimeout(attemptLoad, retryDelay);
              } else {
                resolve({
                  success: false,
                  resource: url,
                  duration: performance.now() - startTime,
                  cached: false
                });
              }
            });
          break;
        default:
          resolve({
            success: false,
            resource: url,
            duration: performance.now() - startTime,
            cached: false
          });
      }
    };

    attemptLoad();
  });
};

export const OptimizedImage: React.FC<OptimizedImageOptions> = ({
  src,
  alt,
  width,
  height,
  config = {},
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  const {
    enableLazyLoading = true,
    enableResponsiveImages = true,
    breakpoints = [320, 640, 768, 1024, 1200, 1920],
    enablePlaceholder = true
  } = config;

  const responsiveUrls = useMemo(() => {
    if (enableResponsiveImages) {
      return generateResponsiveImageUrls(src, breakpoints);
    }
    return [];
  }, [src, enableResponsiveImages, breakpoints]);

  const srcSet = useMemo(() => {
    if (responsiveUrls.length > 0) {
      return responsiveUrls.map(r => `${r.src} ${r.width}w`).join(', ');
    }
    return '';
  }, [responsiveUrls]);

  const sizes = useMemo(() => {
    if (responsiveUrls.length > 0) {
      return responsiveUrls.map(r => r.media).join(', ');
    }
    return '';
  }, [responsiveUrls]);

  const shouldLazyLoad = enableLazyLoading && loading === 'lazy' && 'IntersectionObserver' in window;

  useEffect(() => {
    if (!shouldLazyLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, shouldLazyLoad]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  return (
    <picture>
      {responsiveUrls.length > 0 && responsiveUrls.map((url, index) => (
        <source
          key={index}
          srcSet={`${url.src} 1x, ${url.src} 2x`}
          media={url.media}
        />
      ))}
      <img
        ref={imgRef}
        src={currentSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      {!isLoaded && enablePlaceholder && (
        <div
          className={`image-placeholder ${className}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            backgroundImage: `linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)`,
            backgroundSize: '200% 100%',
            animation: 'skeleton-loading 1.5s infinite'
          }}
        />
      )}
    </picture>
  );
};

export const ResourcePreloader: React.FC<{
  resources: Array<{ url: string; type: 'image' | 'script' | 'style' | 'font' | 'fetch' }>;
  config?: ResourcePreloadConfig;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: (results: PreloadResult[]) => void;
}> = ({ resources, config = {}, onProgress, onComplete }) => {
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const preloadResources = async () => {
      const preloadPromises = resources.map((resource) =>
        preloadResource(resource.url, resource.type, config)
      );

      const preloadResults = await Promise.all(preloadPromises);
      setLoaded(resources.length);
      onComplete?.(preloadResults);
    };

    preloadResources();
  }, [resources, config, onComplete]);

  useEffect(() => {
    onProgress?.(loaded, resources.length);
  }, [loaded, resources.length, onProgress]);

  return null;
};

export const useImageOptimization = (config: ImageOptimizationConfig = {}) => {
  const compress = useCallback(
    (file: File) => compressImage(file, config),
    [config]
  );

  const preload = useCallback(
    (src: string, preloadConfig?: ResourcePreloadConfig) =>
      preloadImage(src, preloadConfig),
    []
  );

  const generateResponsive = useCallback(
    (baseUrl: string) => generateResponsiveImageUrls(baseUrl, config.breakpoints, config.format),
    [config.breakpoints, config.format]
  );

  return {
    compress,
    preload,
    generateResponsive,
    createBlurHash
  };
};

export const useResourcePreload = (config: ResourcePreloadConfig = {}) => {
  const [preloading, setPreloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PreloadResult[]>([]);

  const preload = useCallback(
    async (
      resources: Array<{ url: string; type: 'image' | 'script' | 'style' | 'font' | 'fetch' }>
    ) => {
      setPreloading(true);
      setProgress(0);

      const preloadPromises = resources.map((resource, index) =>
        preloadResource(resource.url, resource.type, config).then((result) => {
          setProgress((prev) => Math.max(prev, index + 1));
          return result;
        })
      );

      const results = await Promise.all(preloadPromises);
      setResults(results);
      setPreloading(false);

      return results;
    },
    [config]
  );

  const clearCache = useCallback(() => {
    imageCache.clear();
    resourceCache.clear();
  }, []);

  return {
    preload,
    preloading,
    progress,
    results,
    clearCache
  };
};

export const createImageOptimizationConfig = (overrides?: Partial<ImageOptimizationConfig>): ImageOptimizationConfig => ({
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'jpeg',
  enableLazyLoading: true,
  enableResponsiveImages: true,
  breakpoints: [320, 640, 768, 1024, 1200, 1920],
  enablePlaceholder: true,
  placeholderSize: 10,
  enableBlurHash: false,
  enableProgressiveLoading: true,
  cacheEnabled: true,
  cacheTimeout: 1800000,
  ...overrides
});

export const createResourcePreloadConfig = (overrides?: Partial<ResourcePreloadConfig>): ResourcePreloadConfig => ({
  maxPreloadCount: 10,
  preloadPriority: 'auto',
  preloadTimeout: 5000,
  retryCount: 3,
  retryDelay: 1000,
  cacheEnabled: true,
  ...overrides
});

export default {
  compressImage,
  generateResponsiveImageUrls,
  createBlurHash,
  preloadImage,
  preloadResource,
  OptimizedImage,
  ResourcePreloader,
  useImageOptimization,
  useResourcePreload,
  createImageOptimizationConfig,
  createResourcePreloadConfig,
  imageCache,
  resourceCache
};
