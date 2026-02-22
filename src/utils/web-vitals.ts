/**
 * @file Web Vitals 集成模块
 * @description 使用 web-vitals 库收集核心性能指标
 * @module utils/web-vitals
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { Metric } from 'web-vitals';

export interface PerformanceReport {
  fcp?: Metric;
  lcp?: Metric;
  fid?: Metric;
  cls?: Metric;
  ttfb?: Metric;
  timestamp: number;
  url: string;
}

export interface PerformanceReporter {
  endpoint?: string;
  batchSize?: number;
  reportInterval?: number;
  enabled?: boolean;
}

const DEFAULT_REPORTER: PerformanceReporter = {
  endpoint: '/api/performance',
  batchSize: 50,
  reportInterval: 60000,
  enabled: process.env.NODE_ENV === 'production',
};

let metricsBuffer: PerformanceReport[] = [];
let reportTimer: ReturnType<typeof setInterval> | null = null;

const formatMetric = (metric: Metric | undefined): string | undefined => {
  if (!metric) return undefined;
  return `${metric.name}: ${metric.value.toFixed(2)} ${metric.rating === 'good' ? '✓' : '⚠'}`;
};

const getMetricRating = (metric: Metric): 'good' | 'needs-improvement' | 'poor' => {
  if (metric.rating === 'good') return 'good';
  if (metric.rating === 'needs-improvement') return 'needs-improvement';
  return 'poor';
};

const createPerformanceReport = (
  metrics: {
    fcp?: Metric;
    lcp?: Metric;
    fid?: Metric;
    cls?: Metric;
    ttfb?: Metric;
  }
): PerformanceReport => {
  return {
    fcp: metrics.fcp,
    lcp: metrics.lcp,
    fid: metrics.fid,
    cls: metrics.cls,
    ttfb: metrics.ttfb,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
  };
};

const sendMetrics = async (reporter: PerformanceReporter): Promise<void> => {
  if (!reporter.enabled || !reporter.endpoint) {
    return;
  }

  try {
    const response = await fetch(reporter.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metricsBuffer),
    });

    if (!response.ok) {
      console.error('[Performance] Failed to send metrics:', response.status);
      return;
    }

    metricsBuffer = [];
  } catch (error) {
    console.error('[Performance] Error sending metrics:', error);
  }
};

const startReporting = (reporter: PerformanceReporter = DEFAULT_REPORTER): void => {
  if (reportTimer) {
    clearInterval(reportTimer);
  }

  reportTimer = setInterval(() => {
    if (metricsBuffer.length >= (reporter.batchSize || 50)) {
      sendMetrics(reporter);
    }
  }, reporter.reportInterval || 60000);
};

const stopReporting = (): void => {
  if (reportTimer) {
    clearInterval(reportTimer);
    reportTimer = null;
  }
};

export const reportWebVitals = (
  reporter: PerformanceReporter = DEFAULT_REPORTER
): void => {
  if (typeof window === 'undefined') {
    console.warn('[Performance] Web Vitals can only be collected in browser');
    return;
  }

  const collectedMetrics: {
    fcp?: Metric;
    lcp?: Metric;
    fid?: Metric;
    cls?: Metric;
    ttfb?: Metric;
  } = {};

  const onPerfEntry = (metric: Metric): void => {
    console.log('[Performance]', formatMetric(metric));

    if (metric.name === 'FCP') {
      collectedMetrics.fcp = metric;
    } else if (metric.name === 'LCP') {
      collectedMetrics.lcp = metric;
    } else if (metric.name === 'FID') {
      collectedMetrics.fid = metric;
    } else if (metric.name === 'CLS') {
      collectedMetrics.cls = metric;
    } else if (metric.name === 'TTFB') {
      collectedMetrics.ttfb = metric;
    }

    const report = createPerformanceReport(collectedMetrics);
    metricsBuffer.push(report);

    if (metricsBuffer.length >= (reporter.batchSize || 50)) {
      sendMetrics(reporter);
    }
  };

  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);

    startReporting(reporter);
  } catch (error) {
    console.error('[Performance] Failed to load web-vitals:', error);
  }
};

export const stopWebVitalsReporting = (): void => {
  stopReporting();
};

export const getPerformanceMetrics = (): PerformanceReport | null => {
  if (metricsBuffer.length === 0) {
    return null;
  }

  return metricsBuffer[metricsBuffer.length - 1];
};

export const clearMetricsBuffer = (): void => {
  metricsBuffer = [];
};

export const getMetricsSummary = (): {
  totalReports: number;
  averageFCP: number;
  averageLCP: number;
  averageFID: number;
  averageCLS: number;
  goodMetrics: number;
  warningMetrics: number;
  poorMetrics: number;
} => {
  if (metricsBuffer.length === 0) {
    return {
      totalReports: 0,
      averageFCP: 0,
      averageLCP: 0,
      averageFID: 0,
      averageCLS: 0,
      goodMetrics: 0,
      warningMetrics: 0,
      poorMetrics: 0,
    };
  }

  const fcpValues = metricsBuffer.filter(m => m.fcp).map(m => m.fcp!.value);
  const lcpValues = metricsBuffer.filter(m => m.lcp).map(m => m.lcp!.value);
  const fidValues = metricsBuffer.filter(m => m.fid).map(m => m.fid!.value);
  const clsValues = metricsBuffer.filter(m => m.cls).map(m => m.cls!.value);

  const averageFCP = fcpValues.reduce((a, b) => a + b, 0) / fcpValues.length;
  const averageLCP = lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length;
  const averageFID = fidValues.reduce((a, b) => a + b, 0) / fidValues.length;
  const averageCLS = clsValues.reduce((a, b) => a + b, 0) / clsValues.length;

  const allMetrics = [...fcpValues, ...lcpValues, ...fidValues, ...clsValues];
  const goodMetrics = allMetrics.filter(m => m <= 1500).length;
  const warningMetrics = allMetrics.filter(m => m > 1500 && m <= 2500).length;
  const poorMetrics = allMetrics.filter(m => m > 2500).length;

  return {
    totalReports: metricsBuffer.length,
    averageFCP,
    averageLCP,
    averageFID,
    averageCLS,
    goodMetrics,
    warningMetrics,
    poorMetrics,
  };
};

export const exportMetricsAsJSON = (): string => {
  const summary = getMetricsSummary();
  return JSON.stringify({
    summary,
    reports: metricsBuffer,
    exportedAt: new Date().toISOString(),
  }, null, 2);
};

export const exportMetricsAsCSV = (): string => {
  if (metricsBuffer.length === 0) {
    return '';
  }

  const headers = ['timestamp', 'url', 'fcp', 'lcp', 'fid', 'cls', 'ttfb'];
  const rows = metricsBuffer.map(report => [
    report.timestamp,
    report.url,
    report.fcp?.value || '',
    report.lcp?.value || '',
    report.fid?.value || '',
    report.cls?.value || '',
    report.ttfb?.value || '',
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const downloadMetricsReport = (format: 'json' | 'csv' = 'json'): void => {
  const content = format === 'json' ? exportMetricsAsJSON() : exportMetricsAsCSV();
  const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-report-${Date.now()}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default {
  reportWebVitals,
  stopWebVitalsReporting,
  getPerformanceMetrics,
  clearMetricsBuffer,
  getMetricsSummary,
  exportMetricsAsJSON,
  exportMetricsAsCSV,
  downloadMetricsReport,
};
