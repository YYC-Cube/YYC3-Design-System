/**
 * @file 懒加载工具函数
 * @description 提供组件和资源的懒加载功能
 * @module utils/lazy-loader
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { lazy, Suspense, ComponentType, ReactNode } from 'react';

export interface LazyComponentOptions {
  fallback?: ReactNode;
  delay?: number;
  timeout?: number;
}

export interface LazyLoadResult<T extends ComponentType<any>> {
  Component: T;
  isLoading: boolean;
  error: Error | null;
}

const DEFAULT_FALLBACK = (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    padding: '2rem',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3f',
      borderTop: '4px solid #d45a5f',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
  </div>
);

const DEFAULT_ERROR_FALLBACK = (
  <div style={{
    padding: '2rem',
    textAlign: 'center',
    color: '#ef4444',
  }}>
    <p>加载组件失败，请刷新页面重试</p>
  </div>
);

const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): T => {
  const {
    fallback = DEFAULT_FALLBACK,
    delay = 300,
    timeout = 5000,
  } = options;

  const LazyComponent = lazy(() => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`组件加载超时 (${timeout}ms)`));
      }, timeout);

      importFn()
        .then(module => {
          clearTimeout(timer);
          setTimeout(() => resolve(module), delay);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  });

  return LazyComponent as T;
};

export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  options: LazyComponentOptions = {}
): ComponentType<P> => {
  const LazyComponent = createLazyComponent(
    () => Promise.resolve({ default: Component }),
    options
  );

  return (props: P) => (
    <Suspense fallback={options.fallback || DEFAULT_FALLBACK}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const createLazyWrapper = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
): ComponentType<P> => {
  const LazyComponent = createLazyComponent(importFn, options);

  return (props: P) => (
    <Suspense fallback={options.fallback || DEFAULT_FALLBACK}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const preloadComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): void => {
  importFn().catch(error => {
    console.error('[LazyLoader] 预加载组件失败:', error);
  });
};

export const lazyLoadImage = (
  src: string,
  options: {
    threshold?: number;
    rootMargin?: string;
    fallback?: string;
  } = {}
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const {
      threshold = 0.1,
      rootMargin = '50px',
      fallback = '',
    } = options;

    if ('IntersectionObserver' in window) {
      const img = new Image();
      img.src = fallback || src;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.unobserve(entry.target);
              resolve(img);
            }
          });
        },
        { threshold, rootMargin }
      );

      observer.observe(img);
    } else {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    }
  });
};

export const lazyLoadScript = (
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    integrity?: string;
    crossOrigin?: string;
  } = {}
): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = options.async ?? true;
    script.defer = options.defer ?? true;

    if (options.integrity) {
      script.integrity = options.integrity;
    }

    if (options.crossOrigin) {
      script.crossOrigin = options.crossOrigin;
    }

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`脚本加载失败: ${src}`));

    document.head.appendChild(script);
  });
};

export const lazyLoadStyle = (
  href: string,
  options: {
    media?: string;
    crossOrigin?: string;
  } = {}
): Promise<HTMLLinkElement> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    if (options.media) {
      link.media = options.media;
    }

    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin;
    }

    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`样式加载失败: ${href}`));

    document.head.appendChild(link);
  });
};

export const createResourcePreloader = () => {
  const preloadedResources = new Set<string>();

  return {
    preload: (url: string, type: 'script' | 'style' | 'image' | 'font') => {
      if (preloadedResources.has(url)) {
        return;
      }

      preloadedResources.add(url);

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;

      switch (type) {
        case 'script':
          link.as = 'script';
          break;
        case 'style':
          link.as = 'style';
          break;
        case 'image':
          link.as = 'image';
          break;
        case 'font':
          link.as = 'font';
          link.crossOrigin = 'anonymous';
          break;
      }

      document.head.appendChild(link);
    },
    clear: () => {
      preloadedResources.clear();
    },
  };
};

export const LazyLoadable = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
): ComponentType<P> => {
  return createLazyWrapper(importFn, options);
};

export default {
  createLazyComponent,
  withLazyLoading,
  createLazyWrapper,
  preloadComponent,
  lazyLoadImage,
  lazyLoadScript,
  lazyLoadStyle,
  createResourcePreloader,
  LazyLoadable,
};
