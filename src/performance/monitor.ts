import { PerformanceMetrics, PerformanceReport } from './types';

interface PerformanceEntry {
  startTime: number;
  processingStart?: number;
  value?: number;
  hadRecentInput?: boolean;
  responseStart?: number;
  requestStart?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private reportUrl?: string;

  constructor(reportUrl?: string) {
    this.reportUrl = reportUrl;
  }

  init() {
    if (typeof window === 'undefined') return;

    this.measureFCP();
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTFB();
  }

  private measureFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.FCP = fcpEntry.startTime;
        this.report();
      }
    });
    observer.observe({ type: 'paint', buffered: true });
    this.observers.push(observer);
  }

  private measureLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      if (lastEntry) {
        this.metrics.LCP = lastEntry.startTime;
        this.report();
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    this.observers.push(observer);
  }

  private measureFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[0] as PerformanceEntry;
      if (fidEntry && fidEntry.processingStart) {
        this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
        this.report();
      }
    });
    observer.observe({ type: 'first-input', buffered: true });
    this.observers.push(observer);
  }

  private measureCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries as PerformanceEntry[]) {
        if (entry.hadRecentInput === false) {
          clsValue += entry.value || 0;
        }
      }
      if (clsValue > 0) {
        this.metrics.CLS = clsValue;
        this.report();
      }
    });
    observer.observe({ type: 'layout-shift', buffered: true });
    this.observers.push(observer);
  }

  private measureTTFB() {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceEntry;
    if (navigation && navigation.responseStart && navigation.requestStart) {
      this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      this.report();
    }
  }

  private report() {
    const report: PerformanceReport = {
      metrics: { ...this.metrics },
      timestamp: Date.now(),
      url: window.location.href,
    };

    console.warn('Performance Metrics:', report);

    if (this.reportUrl) {
      this.sendReport(report);
    }
  }

  private async sendReport(report: PerformanceReport) {
    if (!this.reportUrl) return;

    try {
      await fetch(this.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      } as RequestInit);
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

export default PerformanceMonitor;
