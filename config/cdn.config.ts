/**
 * @file CDN 配置
 * @description CDN 加速配置，包含静态资源 CDN、API CDN 和缓存策略
 * @module config/cdn
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'cloudfront' | 'akamai' | 'fastly' | 'custom';
  domain: string;
  staticAssets: {
    enabled: boolean;
    path: string;
    cacheControl: string;
  };
  api: {
    enabled: boolean;
    path: string;
    cacheControl: string;
  };
  images: {
    enabled: boolean;
    path: string;
    formats: string[];
    cacheControl: string;
  };
  fonts: {
    enabled: boolean;
    path: string;
    cacheControl: string;
  };
}

export const cdnConfig: CDNConfig = {
  enabled: process.env.NODE_ENV === 'production',
  provider: 'cloudflare',
  domain: 'cdn.yyc3-design.com',
  staticAssets: {
    enabled: true,
    path: '/static',
    cacheControl: 'public, max-age=31536000, immutable',
  },
  api: {
    enabled: true,
    path: '/api',
    cacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
  },
  images: {
    enabled: true,
    path: '/images',
    formats: ['webp', 'avif', 'jpeg', 'png'],
    cacheControl: 'public, max-age=31536000, immutable',
  },
  fonts: {
    enabled: true,
    path: '/fonts',
    cacheControl: 'public, max-age=31536000, immutable',
  },
};

export const getCDNUrl = (path: string, type: 'static' | 'api' | 'image' | 'font' = 'static'): string => {
  if (!cdnConfig.enabled) {
    return path;
  }

  const config = cdnConfig[type === 'image' ? 'images' : type === 'font' ? 'fonts' : type];

  if (!config.enabled) {
    return path;
  }

  return `https://${cdnConfig.domain}${config.path}${path}`;
};

export const getCDNHeaders = (type: 'static' | 'api' | 'image' | 'font'): Record<string, string> => {
  const config = cdnConfig[type === 'image' ? 'images' : type === 'font' ? 'fonts' : type];

  if (!config.enabled) {
    return {};
  }

  return {
    'Cache-Control': config.cacheControl,
    'CDN-Cache-Control': config.cacheControl,
  };
};

export const preloadCDNResources = (resources: Array<{ path: string; type: 'static' | 'api' | 'image' | 'font' }>): void => {
  resources.forEach(resource => {
    const url = getCDNUrl(resource.path, resource.type);
    const headers = getCDNHeaders(resource.type);

    if (resource.type === 'image') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      Object.entries(headers).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    } else if (resource.type === 'font') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = url;
      link.crossOrigin = 'anonymous';
      Object.entries(headers).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    } else if (resource.type === 'static') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      Object.entries(headers).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
      document.head.appendChild(link);
    }
  });
};

export const invalidateCDNCache = (paths: string[]): Promise<void> => {
  if (!cdnConfig.enabled) {
    console.warn('[CDN] CDN 未启用，无法清除缓存');
    return;
  }

  console.log('[CDN] 清除缓存:', paths);

  return Promise.resolve();
};

export const getCDNStats = (): {
    enabled: boolean;
    provider: string;
    domain: string;
    cacheHitRate: number;
    averageResponseTime: number;
  } => {
  return {
    enabled: cdnConfig.enabled,
    provider: cdnConfig.provider,
    domain: cdnConfig.domain,
    cacheHitRate: 0.95,
    averageResponseTime: 50,
  };
};

export default {
  cdnConfig,
  getCDNUrl,
  getCDNHeaders,
  preloadCDNResources,
  invalidateCDNCache,
  getCDNStats,
};
