/**
 * @file 资源加载策略配置
 * @description 优化资源加载顺序、优先级和缓存策略
 * @module config/resource-loading-strategy
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface ResourceLoadingStrategy {
  priority: 'critical' | 'high' | 'medium' | 'low';
  loadType: 'eager' | 'lazy' | 'preload' | 'prefetch';
  cacheStrategy: 'memory' | 'disk' | 'service-worker' | 'cdn';
  timeout: number;
  retryCount: number;
}

export interface ResourcePriorityConfig {
  critical: string[];
  high: string[];
  medium: string[];
  low: string[];
}

export const resourcePriorityConfig: ResourcePriorityConfig = {
  critical: [
    '/fonts/inter.woff2',
    '/styles/main.css',
    '/scripts/main.js',
  ],
  high: [
    '/components/Button',
    '/components/Card',
    '/components/Input',
  ],
  medium: [
    '/components/Modal',
    '/components/Tabs',
    '/components/Alert',
  ],
  low: [
    '/components/AIColorRecommender',
    '/components/AIConsistencyChecker',
    '/components/AIUsageAnalyzer',
  ],
};

export const getLoadingStrategy = (resourcePath: string): ResourceLoadingStrategy => {
  const priority = getResourcePriority(resourcePath);

  switch (priority) {
    case 'critical':
      return {
        priority: 'critical',
        loadType: 'eager',
        cacheStrategy: 'memory',
        timeout: 5000,
        retryCount: 3,
      };
    case 'high':
      return {
        priority: 'high',
        loadType: 'preload',
        cacheStrategy: 'memory',
        timeout: 10000,
        retryCount: 2,
      };
    case 'medium':
      return {
        priority: 'medium',
        loadType: 'lazy',
        cacheStrategy: 'disk',
        timeout: 15000,
        retryCount: 2,
      };
    case 'low':
      return {
        priority: 'low',
        loadType: 'prefetch',
        cacheStrategy: 'service-worker',
        timeout: 30000,
        retryCount: 1,
      };
    default:
      return {
        priority: 'medium',
        loadType: 'lazy',
        cacheStrategy: 'disk',
        timeout: 15000,
        retryCount: 2,
      };
  }
};

const getResourcePriority = (resourcePath: string): 'critical' | 'high' | 'medium' | 'low' => {
  if (resourcePriorityConfig.critical.some(path => resourcePath.includes(path))) {
    return 'critical';
  }
  if (resourcePriorityConfig.high.some(path => resourcePath.includes(path))) {
    return 'high';
  }
  if (resourcePriorityConfig.medium.some(path => resourcePath.includes(path))) {
    return 'medium';
  }
  if (resourcePriorityConfig.low.some(path => resourcePath.includes(path))) {
    return 'low';
  }
  return 'medium';
};

export const loadResourcesByPriority = async (
  resources: string[],
  options: {
    parallel?: number;
    delay?: number;
  } = {}
): Promise<void> => {
  const { parallel = 4, delay = 0 } = options;

  const sortedResources = resources.sort((a, b) => {
    const priorityA = getResourcePriority(a);
    const priorityB = getResourcePriority(b);
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  });

  for (let i = 0; i < sortedResources.length; i += parallel) {
    const batch = sortedResources.slice(i, i + parallel);
    await Promise.all(
      batch.map(resource => loadResource(resource))
    );

    if (delay > 0 && i + parallel < sortedResources.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const loadResource = async (resourcePath: string): Promise<void> => {
  const strategy = getLoadingStrategy(resourcePath);

  try {
    switch (strategy.loadType) {
      case 'eager':
        await loadResourceEager(resourcePath, strategy);
        break;
      case 'preload':
        await loadResourcePreload(resourcePath, strategy);
        break;
      case 'lazy':
        await loadResourceLazy(resourcePath, strategy);
        break;
      case 'prefetch':
        await loadResourcePrefetch(resourcePath, strategy);
        break;
    }
  } catch (error) {
    console.error(`[ResourceLoading] 加载资源失败: ${resourcePath}`, error);
    throw error;
  }
};

const loadResourceEager = async (
  resourcePath: string,
  strategy: ResourceLoadingStrategy
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`资源加载超时: ${resourcePath}`));
    }, strategy.timeout);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = resourcePath;

    link.onload = () => {
      clearTimeout(timeout);
      resolve();
    };

    link.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`资源加载失败: ${resourcePath}`));
    };

    document.head.appendChild(link);
  });
};

const loadResourcePreload = async (
  resourcePath: string,
  strategy: ResourceLoadingStrategy
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`资源预加载超时: ${resourcePath}`));
    }, strategy.timeout);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resourcePath;

    if (resourcePath.endsWith('.css')) {
      link.as = 'style';
    } else if (resourcePath.endsWith('.js')) {
      link.as = 'script';
    } else if (resourcePath.endsWith('.woff2') || resourcePath.endsWith('.woff')) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (resourcePath.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
      link.as = 'image';
    }

    link.onload = () => {
      clearTimeout(timeout);
      resolve();
    };

    link.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`资源预加载失败: ${resourcePath}`));
    };

    document.head.appendChild(link);
  });
};

const loadResourceLazy = async (
  resourcePath: string,
  strategy: ResourceLoadingStrategy
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`资源懒加载超时: ${resourcePath}`));
    }, strategy.timeout);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = resourcePath;
    link.media = 'print';
    link.onload = () => {
      clearTimeout(timeout);
      link.media = 'all';
      resolve();
    };

    link.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`资源懒加载失败: ${resourcePath}`));
    };

    document.head.appendChild(link);
  });
};

const loadResourcePrefetch = async (
  resourcePath: string,
  strategy: ResourceLoadingStrategy
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`资源预取超时: ${resourcePath}`));
    }, strategy.timeout);

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resourcePath;

    link.onload = () => {
      clearTimeout(timeout);
      resolve();
    };

    link.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`资源预取失败: ${resourcePath}`));
    };

    document.head.appendChild(link);
  });
};

export const getLoadingProgress = (): {
    total: number;
    loaded: number;
    failed: number;
    percentage: number;
  } => {
  return {
    total: 0,
    loaded: 0,
    failed: 0,
    percentage: 0,
  };
};

export const clearResourceCache = (strategy?: 'memory' | 'disk' | 'service-worker' | 'cdn'): void => {
  console.log(`[ResourceLoading] 清除缓存: ${strategy || 'all'}`);

  if (!strategy || strategy === 'memory') {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
  }

  if (!strategy || strategy === 'service-worker') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
  }
};

export default {
  resourcePriorityConfig,
  getLoadingStrategy,
  loadResourcesByPriority,
  getLoadingProgress,
  clearResourceCache,
};
