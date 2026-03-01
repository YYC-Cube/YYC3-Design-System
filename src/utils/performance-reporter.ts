/**
 * @file 性能数据上报服务
 * @description 将性能数据发送到后端或本地存储
 * @module utils/performance-reporter
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { PerformanceReport } from './web-vitals';

export interface ReportConfig {
  endpoint?: string;
  apiKey?: string;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  enableLocalBackup?: boolean;
  enableAnalytics?: boolean;
}

export interface ReportResult {
  success: boolean;
  timestamp: number;
  endpoint?: string;
  error?: string;
}

const DEFAULT_CONFIG: ReportConfig = {
  endpoint: '/api/performance',
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 5000,
  enableLocalBackup: true,
  enableAnalytics: process.env.NODE_ENV === 'production',
};

const STORAGE_KEY = 'yyc3-performance-reports';
const MAX_LOCAL_REPORTS = 100;

class PerformanceReporter {
  private config: ReportConfig;
  private reportQueue: PerformanceReport[] = [];
  private isReporting = false;

  constructor(config: Partial<ReportConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public addReport(report: PerformanceReport): void {
    this.reportQueue.push(report);
    this.saveToLocalStorage(report);

    if (this.reportQueue.length >= 10) {
      this.flush();
    }
  }

  public async flush(): Promise<ReportResult[]> {
    if (this.isReporting || this.reportQueue.length === 0) {
      return [];
    }

    this.isReporting = true;
    const reports = [...this.reportQueue];
    this.reportQueue = [];

    const results: ReportResult[] = [];

    if (this.config.enableAnalytics && this.config.endpoint) {
      const result = await this.sendToEndpoint(reports);
      results.push(result);
    }

    if (this.config.enableLocalBackup) {
      this.saveToLocalStorageBatch(reports);
    }

    this.isReporting = false;
    return results;
  }

  private async sendToEndpoint(reports: PerformanceReport[]): Promise<ReportResult> {
    const startTime = Date.now();

    for (let attempt = 0; attempt < (this.config.maxRetries || 3); attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(this.config.endpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
          },
          body: JSON.stringify({
            reports,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            timestamp: Date.now(),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('[PerformanceReporter] Reports sent successfully:', data);

        return {
          success: true,
          timestamp: Date.now(),
          endpoint: this.config.endpoint,
        };
      } catch (error) {
        if (attempt === (this.config.maxRetries || 3) - 1) {
          console.error('[PerformanceReporter] All attempts failed:', error);
          return {
            success: false,
            timestamp: Date.now(),
            endpoint: this.config.endpoint,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }

        const delay = (this.config.retryDelay || 1000) * Math.pow(2, attempt);
        console.warn(
          `[PerformanceReporter] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      timestamp: Date.now(),
      endpoint: this.config.endpoint,
      error: 'Max retries exceeded',
    };
  }

  private saveToLocalStorage(report: PerformanceReport): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const existing = this.getLocalReports();
      const updated = [report, ...existing].slice(0, MAX_LOCAL_REPORTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[PerformanceReporter] Failed to save to localStorage:', error);
    }
  }

  private saveToLocalStorageBatch(reports: PerformanceReport[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const existing = this.getLocalReports();
      const updated = [...reports, ...existing].slice(0, MAX_LOCAL_REPORTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[PerformanceReporter] Failed to save batch to localStorage:', error);
    }
  }

  public getLocalReports(): PerformanceReport[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[PerformanceReporter] Failed to read from localStorage:', error);
      return [];
    }
  }

  public clearLocalReports(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('[PerformanceReporter] Failed to clear localStorage:', error);
      }
    }
  }

  public getQueueSize(): number {
    return this.reportQueue.length;
  }

  public getStats(): {
    totalReports: number;
    queueSize: number;
    lastReportTime: number | null;
  } {
    const localReports = this.getLocalReports();
    const lastReport = localReports[0];

    return {
      totalReports: localReports.length,
      queueSize: this.reportQueue.length,
      lastReportTime: lastReport ? lastReport.timestamp : null,
    };
  }
}

let reporterInstance: PerformanceReporter | null = null;

export const initPerformanceReporter = (config?: Partial<ReportConfig>): PerformanceReporter => {
  if (!reporterInstance) {
    reporterInstance = new PerformanceReporter(config);
  }
  return reporterInstance;
};

export const getPerformanceReporter = (): PerformanceReporter | null => {
  return reporterInstance;
};

export const reportPerformance = (report: PerformanceReport): void => {
  const reporter = getPerformanceReporter();
  if (reporter) {
    reporter.addReport(report);
  }
};

export const flushPerformanceReports = async (): Promise<ReportResult[]> => {
  const reporter = getPerformanceReporter();
  if (reporter) {
    return await reporter.flush();
  }
  return [];
};

export const getPerformanceStats = () => {
  const reporter = getPerformanceReporter();
  if (reporter) {
    return reporter.getStats();
  }
  return {
    totalReports: 0,
    queueSize: 0,
    lastReportTime: null,
  };
};

export const clearPerformanceReports = (): void => {
  const reporter = getPerformanceReporter();
  if (reporter) {
    reporter.clearLocalReports();
  }
};

export default {
  initPerformanceReporter,
  getPerformanceReporter,
  reportPerformance,
  flushPerformanceReports,
  getPerformanceStats,
  clearPerformanceReports,
  PerformanceReporter,
};
