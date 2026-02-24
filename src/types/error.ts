/**
 * @file 错误类型定义
 * @description YYC³ Design System错误类型定义
 * @module types/error
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import type { ErrorInfo } from 'react';

export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp: number;
  url?: string;
  userAgent?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  level: ErrorLevel;
  category: ErrorCategory;
  message: string;
  code?: string;
  stack?: string;
  context: ErrorContext;
  handled: boolean;
  reported: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorHandler {
  handle: (error: Error, context?: Partial<ErrorContext>) => void;
  log: (log: ErrorLog) => void;
  report: (log: ErrorLog) => Promise<void>;
  clear: () => void;
  getLogs: (filters?: ErrorLogFilters) => ErrorLog[];
}

export interface ErrorLogFilters {
  level?: ErrorLevel;
  category?: ErrorCategory;
  startTime?: number;
  endTime?: number;
  component?: string;
  handled?: boolean;
  reported?: boolean;
}

export interface ErrorReportingConfig {
  enabled?: boolean;
  endpoint?: string;
  apiKey?: string;
  batchSize?: number;
  flushInterval?: number;
  maxRetries?: number;
}

export interface ErrorNotification {
  id: string;
  message: string;
  level: ErrorLevel;
  timestamp: number;
  dismissible: boolean;
  duration?: number;
}
