/**
 * @file 统一类型定义入口
 * @description 提供完整的类型定义导出，包括设计令牌、组件Props和高级类型工具
 * @module types
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

export * from './tokens-unified';
export * from './react';

export type {
  AnimationTokens,
  AnimationConfig,
  AnimatedProps,
  AnimationKeyframe,
} from './animations';

export type {
  ErrorLevel,
  ErrorCategory,
  ErrorContext,
  ErrorLog,
  ErrorBoundaryState,
  ErrorHandler,
  ErrorLogFilters,
  ErrorReportingConfig,
  ErrorNotification,
} from '../src/types/error';

export type {
  PluginManifest,
  PluginContext,
  PluginConfig,
  PluginAPI,
  PluginLogger,
  PluginHooks,
  ComponentRegistration,
  ThemeRegistration,
  TokenRegistration,
  PluginEvent,
  PluginState,
  PluginError,
  PluginHook,
  PluginEventType,
} from '../src/types/plugin';
