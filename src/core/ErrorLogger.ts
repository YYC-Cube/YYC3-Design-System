/**
 * @file 错误日志服务
 * @description YYC³ Design System错误日志服务
 * @module core/ErrorLogger
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import {
  ErrorLog,
  ErrorLevel,
  ErrorCategory,
  ErrorContext,
  ErrorLogFilters,
  ErrorReportingConfig,
  ErrorNotification,
} from '../types/error';

export class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 1000;
  private config: ErrorReportingConfig;
  private reportingQueue: ErrorLog[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private notificationCallbacks: Set<(notification: ErrorNotification) => void> = new Set();

  constructor(config: ErrorReportingConfig = {}) {
    this.config = {
      enabled: true,
      batchSize: 10,
      flushInterval: 30000,
      maxRetries: 3,
      ...config,
    };

    if (typeof window !== 'undefined') {
      this.setupWindowErrorHandlers();
      this.startFlushTimer();
    }
  }

  private setupWindowErrorHandlers(): void {
    window.addEventListener('error', (event) => {
      this.log({
        id: this.generateId(),
        level: ErrorLevel.ERROR,
        category: ErrorCategory.CLIENT,
        message: event.message,
        stack: event.error?.stack,
        context: {
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
        handled: false,
        reported: false,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.log({
        id: this.generateId(),
        level: ErrorLevel.ERROR,
        category: ErrorCategory.UNKNOWN,
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        context: {
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
        handled: false,
        reported: false,
      });
    });
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flushQueue();
    }, this.config.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private generateId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return ErrorCategory.NETWORK;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION;
    }
    if (message.includes('auth') || message.includes('unauthorized')) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (message.includes('permission') || message.includes('forbidden')) {
      return ErrorCategory.AUTHORIZATION;
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorCategory.NOT_FOUND;
    }
    if (message.includes('server') || message.includes('500')) {
      return ErrorCategory.SERVER;
    }

    return ErrorCategory.CLIENT;
  }

  private determineLevel(error: Error): ErrorLevel {
    if (error.message.includes('fatal') || error.message.includes('critical')) {
      return ErrorLevel.FATAL;
    }
    if (error.message.includes('warning') || error.message.includes('deprecated')) {
      return ErrorLevel.WARN;
    }

    return ErrorLevel.ERROR;
  }

  private shouldNotify(level: ErrorLevel): boolean {
    return level === ErrorLevel.ERROR || level === ErrorLevel.FATAL;
  }

  private notify(log: ErrorLog): void {
    if (!this.shouldNotify(log.level)) {
      return;
    }

    const notification: ErrorNotification = {
      id: this.generateId(),
      message: log.message,
      level: log.level,
      timestamp: log.context.timestamp,
      dismissible: true,
      duration: 5000,
    };

    this.notificationCallbacks.forEach((callback) => callback(notification));
  }

  log(log: ErrorLog): void {
    const fullLog: ErrorLog = {
      ...log,
      id: log.id || this.generateId(),
    };

    this.logs.unshift(fullLog);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    if (this.config.enabled) {
      this.reportingQueue.push(fullLog);

      if (this.reportingQueue.length >= (this.config.batchSize || 10)) {
        this.flushQueue();
      }
    }

    this.notify(fullLog);

    if (typeof console !== 'undefined') {
      const consoleMethod =
        log.level === ErrorLevel.DEBUG
          ? 'debug'
          : log.level === ErrorLevel.INFO
            ? 'info'
            : log.level === ErrorLevel.WARN
              ? 'warn'
              : 'error';
      console[consoleMethod](`[${log.category.toUpperCase()}]`, log.message, log.context);
    }
  }

  handle(error: Error, context?: Partial<ErrorContext>): void {
    const fullContext: ErrorContext = {
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...context,
    };

    this.log({
      id: this.generateId(),
      level: this.determineLevel(error),
      category: this.categorizeError(error),
      message: error.message,
      stack: error.stack,
      context: fullContext,
      handled: true,
      reported: false,
    });
  }

  async report(log: ErrorLog): Promise<void> {
    if (!this.config.enabled || !this.config.endpoint) {
      return;
    }

    const payload = {
      ...log,
      apiKey: this.config.apiKey,
    };

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      log.reported = true;
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.reportingQueue.length === 0) {
      return;
    }

    const batch = this.reportingQueue.splice(0, this.config.batchSize);

    for (const log of batch) {
      await this.report(log);
    }
  }

  getLogs(filters?: ErrorLogFilters): ErrorLog[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.level) {
        filteredLogs = filteredLogs.filter((log) => log.level === filters.level);
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter((log) => log.category === filters.category);
      }
      if (filters.startTime) {
        filteredLogs = filteredLogs.filter((log) => log.context.timestamp >= filters.startTime!);
      }
      if (filters.endTime) {
        filteredLogs = filteredLogs.filter((log) => log.context.timestamp <= filters.endTime!);
      }
      if (filters.component) {
        filteredLogs = filteredLogs.filter((log) => log.context.component === filters.component);
      }
      if (filters.handled !== undefined) {
        filteredLogs = filteredLogs.filter((log) => log.handled === filters.handled);
      }
      if (filters.reported !== undefined) {
        filteredLogs = filteredLogs.filter((log) => log.reported === filters.reported);
      }
    }

    return filteredLogs;
  }

  clear(): void {
    this.logs = [];
    this.reportingQueue = [];
  }

  onNotification(callback: (notification: ErrorNotification) => void): () => void {
    this.notificationCallbacks.add(callback);

    return () => {
      this.notificationCallbacks.delete(callback);
    };
  }

  updateConfig(config: Partial<ErrorReportingConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.flushInterval !== undefined) {
      this.startFlushTimer();
    }
  }

  destroy(): void {
    this.stopFlushTimer();
    this.clear();
    this.notificationCallbacks.clear();
  }
}

export const errorLogger = new ErrorLogger();
