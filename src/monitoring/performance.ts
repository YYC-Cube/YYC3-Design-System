/**
 * @file 性能监控工具
 * @description Web Vitals 和性能指标监控
 * @module monitoring/performance
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-28
 */

interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
}

const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
} as const;

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      console.warn('Performance monitoring not supported in this environment');
      return;
    }

    this.isInitialized = true;
    await this.setupObservers();
    this.setupNavigationTiming();
  }

  private async setupObservers(): Promise<void> {
    const vitals = [
      { name: 'FCP', handler: this.handleFCP },
      { name: 'LCP', handler: this.handleLCP },
      { name: 'FID', handler: this.handleFID },
      { name: 'CLS', handler: this.handleCLS },
      { name: 'TTFB', handler: this.handleTTFB },
    ];

    vitals.forEach(({ name, handler }) => {
      this.createObserver(name, handler);
    });
  }

  private createObserver(name: string, handler: (entry: PerformanceEntry) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          handler.call(this, entry);
        });
      });

      const entryTypes = {
        FCP: 'paint',
        LCP: 'largest-contentful-paint',
        FID: 'first-input',
        CLS: 'layout-shift',
        TTFB: 'navigation',
      }[name];

      observer.observe({ type: entryTypes, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to create observer for ${name}:`, error);
    }
  }

  private handleFCP(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: 'FCP',
      value: entry.startTime,
      id: `v1-${Date.now()}-${Math.random()}`,
      rating: this.getRating('FCP', entry.startTime),
    };

    this.recordMetric(metric);
  }

  private handleLCP(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: 'LCP',
      value: entry.startTime,
      id: `v1-${Date.now()}-${Math.random()}`,
      rating: this.getRating('LCP', entry.startTime),
    };

    this.recordMetric(metric);
  }

  private handleFID(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: 'FID',
      value: (entry as any).processingStart - entry.startTime,
      id: `v1-${Date.now()}-${Math.random()}`,
      rating: this.getRating('FID', (entry as any).processingStart - entry.startTime),
    };

    this.recordMetric(metric);
  }

  private handleCLS(entry: PerformanceEntry): void {
    if (!(entry as any).hadRecentInput) {
      const metric: PerformanceMetric = {
        name: 'CLS',
        value: (entry as any).value,
        id: `v1-${Date.now()}-${Math.random()}`,
        rating: this.getRating('CLS', (entry as any).value),
      };

      this.recordMetric(metric);
    }
  }

  private handleTTFB(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: 'TTFB',
      value: (entry as any).responseStart - (entry as any).requestStart,
      id: `v1-${Date.now()}-${Math.random()}`,
      rating: this.getRating('TTFB', (entry as any).responseStart - (entry as any).requestStart),
      navigationType: (entry as any).type,
    };

    this.recordMetric(metric);
  }

  private setupNavigationTiming(): void {
    if ('PerformanceNavigationTiming' in window) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        const navEntry = navEntries[0] as any;
        this.handleTTFB(navEntry);
      }
    }
  }

  private getRating(
    name: keyof typeof THRESHOLDS,
    value: number
  ): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[name];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.set(metric.name, metric);
    this.sendToAnalytics(metric);
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const value = metric.value ?? 0;
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
        custom_map: { metric_rating: metric.rating },
      });
    }

    if (
      typeof window !== 'undefined' &&
      'console' in window &&
      import.meta.env?.MODE === 'development'
    ) {
      const value = metric.value ?? 0;
      console.warn(`[Performance] ${metric.name}:`, {
        value: `${value.toFixed(2)} ms`,
        rating: metric.rating,
      });
    }
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  getOverallScore(): number {
    const metrics = this.getMetrics();
    if (metrics.length === 0) return 0;

    const ratings = metrics.map((m) => {
      switch (m.rating) {
        case 'good':
          return 100;
        case 'needs-improvement':
          return 50;
        case 'poor':
          return 0;
      }
    }) as number[];

    const totalScore = ratings.reduce((sum, rating) => sum + rating, 0);
    return Math.round(totalScore / ratings.length);
  }

  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
    this.isInitialized = false;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

export function initPerformanceMonitoring(): void {
  if (import.meta.env?.MODE === 'production') {
    performanceMonitor.init();
  }
}

export function getPerformanceScore(): number {
  return performanceMonitor.getOverallScore();
}

export function getPerformanceMetrics(): PerformanceMetric[] {
  return performanceMonitor.getMetrics();
}
