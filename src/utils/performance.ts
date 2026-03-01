/**
 * @file 性能优化工具
 * @description 提供运行时性能优化工具和函数
 * @module utils/performance
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import React, { useCallback, useRef, useEffect, useState } from 'react';

export type PerformanceMetrics = {
  fps: number;
  memory?: number;
  longTasks: number[];
  renderTime: number;
};

export type PerformanceOptions = {
  sampleInterval?: number;
  threshold?: number;
  onThresholdExceeded?: (metrics: PerformanceMetrics) => void;
};

const performanceCache = new Map<string, any>();
const MAX_CACHE_SIZE = 100;

export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (performanceCache.has(key)) {
      return performanceCache.get(key);
    }

    const result = fn(...args);

    if (performanceCache.size >= MAX_CACHE_SIZE) {
      const firstKey = performanceCache.keys().next().value;
      if (firstKey) {
        performanceCache.delete(firstKey);
      }
    }

    performanceCache.set(key, result);
    return result;
  }) as T;
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      lastResult = fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  };
};

export const useDebounce = <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  ) as T;
};

export const useThrottle = <T extends (...args: any[]) => any>(fn: T, limit: number): T => {
  const inThrottleRef = useRef(false);
  const lastResultRef = useRef<ReturnType<T> | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottleRef.current) {
        const result = fn(...args);
        lastResultRef.current = result;
        inThrottleRef.current = true;
        setTimeout(() => {
          inThrottleRef.current = false;
        }, limit);
      }
      return lastResultRef.current;
    },
    [fn, limit]
  ) as T;
};

export const useIdleCallback = <T extends (...args: any[]) => any>(
  fn: T,
  timeout: number = 2000
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(
          () => {
            fn(...args);
          },
          { timeout }
        );
        timeoutRef.current = setTimeout(() => {
          window.cancelIdleCallback(handle);
          fn(...args);
        }, timeout);
      } else {
        timeoutRef.current = setTimeout(() => fn(...args), 0);
      }
    },
    [fn, timeout]
  ) as T;
};

export const measurePerformance = (fn: () => void, _label: string = 'performance'): number => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 0,
    longTasks: [],
    renderTime: 0,
  };

  private frameCount = 0;
  private lastFrameTime = performance.now();
  private observer: PerformanceObserver | null = null;
  private rafId: number | null = null;
  private options: PerformanceOptions;

  constructor(options: PerformanceOptions = {}) {
    this.options = {
      sampleInterval: 1000,
      threshold: 50,
      ...options,
    };
  }

  start(): void {
    this.rafId = requestAnimationFrame(this.measureFrame.bind(this));
    this.observeLongTasks();
  }

  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      fps: 0,
      longTasks: [],
      renderTime: 0,
    };
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
  }

  private measureFrame(): void {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.frameCount++;
    this.metrics.renderTime = delta;

    if (now - this.lastFrameTime >= this.options.sampleInterval!) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / delta);

      if (this.options.onThresholdExceeded && this.metrics.renderTime > this.options.threshold!) {
        this.options.onThresholdExceeded(this.getMetrics());
      }

      this.frameCount = 0;
      this.lastFrameTime = now;
    }

    if (this.rafId !== null) {
      this.rafId = requestAnimationFrame(this.measureFrame.bind(this));
    }
  }

  private observeLongTasks(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.metrics.longTasks.push(entry.duration);
          }
        }
      });

      this.observer.observe({ entryTypes: ['longtask'] });
    }
  }
}

export const usePerformanceMonitor = (options: PerformanceOptions = {}) => {
  const monitorRef = useRef<PerformanceMonitor | null>(null);

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor(options);
    monitorRef.current.start();

    return () => {
      monitorRef.current?.stop();
    };
  }, [options]);

  return {
    getMetrics: () => monitorRef.current?.getMetrics(),
    reset: () => monitorRef.current?.reset(),
  };
};

export const batchDOMUpdates = <T>(updates: Array<() => T>): T[] => {
  return updates.map((update) => update());
};

export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight,
    scrollTop,
    setScrollTop,
  };
};

export const useLazyLoad = <T>(
  loader: () => Promise<T>,
  _fallback?: React.ReactNode
): { Component: React.ComponentType<T> | null; loading: boolean } => {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loader()
      .then((module) => {
        setComponent(() => (module as any).default || module);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lazy load failed:', error);
        setLoading(false);
      });
  }, [loader]);

  return { Component, loading };
};

export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const preloadImages = async (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map(preloadImage));
};

export const clearPerformanceCache = (): void => {
  performanceCache.clear();
};

export const getCacheSize = (): number => {
  return performanceCache.size;
};
