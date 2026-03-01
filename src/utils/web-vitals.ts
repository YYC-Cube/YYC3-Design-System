/**
 * @file Web Vitals 集成模块
 * @description 使用 web-vitals 库收集核心性能指标
 * @module utils/web-vitals
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface Metric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  id?: string;
  delta?: number;
  entries?: unknown[];
}

export interface PerformanceReport {
  fcp?: Metric;
  lcp?: Metric;
  inp?: Metric;
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

const createPerformanceReport = (metrics: {
  fcp?: Metric;
  lcp?: Metric;
  inp?: Metric;
  cls?: Metric;
  ttfb?: Metric;
}): PerformanceReport => {
  return {
    fcp: metrics.fcp,
    lcp: metrics.lcp,
    inp: metrics.inp,
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

export const reportWebVitals = async (
  reporter: PerformanceReporter = DEFAULT_REPORTER
): Promise<void> => {
  if (typeof window === 'undefined') {
    console.warn('[Performance] Web Vitals can only be collected in browser');
    return;
  }

  const collectedMetrics: {
    fcp?: Metric;
    lcp?: Metric;
    inp?: Metric;
    cls?: Metric;
    ttfb?: Metric;
  } = {};

  const onPerfEntry = (metric: unknown): void => {
    const perfMetric = metric as {
      name: string;
      value: number;
      rating?: 'good' | 'needs-improvement' | 'poor';
      id?: string;
      delta?: number;
    };
    const formattedMetric: Metric = {
      name: perfMetric.name,
      value: perfMetric.value,
      rating: perfMetric.rating,
      id: perfMetric.id,
      delta: perfMetric.delta,
    };

    console.warn('[Performance]', formatMetric(formattedMetric));

    if (formattedMetric.name === 'FCP') {
      collectedMetrics.fcp = formattedMetric;
    } else if (formattedMetric.name === 'LCP') {
      collectedMetrics.lcp = formattedMetric;
    } else if (formattedMetric.name === 'INP') {
      collectedMetrics.inp = formattedMetric;
    } else if (formattedMetric.name === 'CLS') {
      collectedMetrics.cls = formattedMetric;
    } else if (formattedMetric.name === 'TTFB') {
      collectedMetrics.ttfb = formattedMetric;
    }

    const report = createPerformanceReport(collectedMetrics);
    metricsBuffer.push(report);

    if (metricsBuffer.length >= (reporter.batchSize || 50)) {
      sendMetrics(reporter);
    }
  };

  try {
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');

    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);

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
  averageINP: number;
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
      averageINP: 0,
      averageCLS: 0,
      goodMetrics: 0,
      warningMetrics: 0,
      poorMetrics: 0,
    };
  }

  const fcpValues = metricsBuffer.filter((m) => m.fcp).map((m) => m.fcp!.value);
  const lcpValues = metricsBuffer.filter((m) => m.lcp).map((m) => m.lcp!.value);
  const inpValues = metricsBuffer.filter((m) => m.inp).map((m) => m.inp!.value);
  const clsValues = metricsBuffer.filter((m) => m.cls).map((m) => m.cls!.value);

  const averageFCP = fcpValues.reduce((a, b) => a + b, 0) / fcpValues.length;
  const averageLCP = lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length;
  const averageINP = inpValues.reduce((a, b) => a + b, 0) / inpValues.length;
  const averageCLS = clsValues.reduce((a, b) => a + b, 0) / clsValues.length;

  const allMetrics = [...fcpValues, ...lcpValues, ...inpValues, ...clsValues];
  const goodMetrics = allMetrics.filter((m) => m <= 1500).length;
  const warningMetrics = allMetrics.filter((m) => m > 1500 && m <= 2500).length;
  const poorMetrics = allMetrics.filter((m) => m > 2500).length;

  return {
    totalReports: metricsBuffer.length,
    averageFCP,
    averageLCP,
    averageINP,
    averageCLS,
    goodMetrics,
    warningMetrics,
    poorMetrics,
  };
};

export const exportMetricsAsJSON = (): string => {
  const summary = getMetricsSummary();
  return JSON.stringify(
    {
      summary,
      reports: metricsBuffer,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
};

export const exportMetricsAsCSV = (): string => {
  if (metricsBuffer.length === 0) {
    return '';
  }

  const headers = ['timestamp', 'url', 'fcp', 'lcp', 'inp', 'cls', 'ttfb'];
  const rows = metricsBuffer.map((report) => [
    report.timestamp,
    report.url,
    report.fcp?.value || '',
    report.lcp?.value || '',
    report.inp?.value || '',
    report.cls?.value || '',
    report.ttfb?.value || '',
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
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
