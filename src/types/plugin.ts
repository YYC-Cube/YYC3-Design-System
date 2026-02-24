/**
 * @file 插件类型定义
 * @description YYC³ Design System插件系统类型定义
 * @module types/plugin
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import type { ComponentType } from 'react';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  icon?: string;
  screenshots?: string[];
  main?: string;
  types?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: {
    node?: string;
    yyc3?: string;
  };
  yyc3?: {
    minVersion?: string;
    maxVersion?: string;
    apiVersion?: string;
    hooks?: PluginHooks;
  };
}

export interface PluginContext {
  pluginId: string;
  pluginVersion: string;
  appVersion: string;
  config: PluginConfig;
  api: PluginAPI;
  logger: PluginLogger;
  hooks: PluginHooks;
}

export interface PluginConfig {
  enabled: boolean;
  settings: Record<string, any>;
  permissions: string[];
}

export interface PluginAPI {
  registerComponent: (component: ComponentRegistration) => void;
  unregisterComponent: (componentId: string) => void;
  registerTheme: (theme: ThemeRegistration) => void;
  unregisterTheme: (themeId: string) => void;
  registerToken: (token: TokenRegistration) => void;
  unregisterToken: (tokenId: string) => void;
  getComponents: () => ComponentRegistration[];
  getThemes: () => ThemeRegistration[];
  getTokens: () => TokenRegistration[];
  emitEvent: (event: PluginEvent) => void;
  onEvent: (event: string, callback: (data: any) => void) => void;
  offEvent: (event: string, callback: (data: any) => void) => void;
}

export interface PluginLogger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export interface PluginHooks {
  onInstall: (context: PluginContext) => void | Promise<void>;
  onActivate: (context: PluginContext) => void | Promise<void>;
  onDeactivate: (context: PluginContext) => void | Promise<void>;
  onUninstall: (context: PluginContext) => void | Promise<void>;
  onConfigChange: (config: PluginConfig) => void | Promise<void>;
  onThemeChange: (theme: string) => void | Promise<void>;
  onLanguageChange: (language: string) => void | Promise<void>;
}

export interface ComponentRegistration {
  id: string;
  name: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
  category?: string;
  tags?: string[];
  icon?: string;
  description?: string;
  pluginId?: string;
}

export interface ThemeRegistration {
  id: string;
  name: string;
  theme: Record<string, string>;
  preview?: string;
  category?: string;
  tags?: string[];
  pluginId?: string;
}

export interface TokenRegistration {
  id: string;
  name: string;
  token: Record<string, string | number>;
  category?: string;
  tags?: string[];
  pluginId?: string;
}

export interface PluginEvent {
  type: string;
  source: string;
  timestamp: number;
  data: any;
}

export interface PluginState {
  installed: boolean;
  activated: boolean;
  version: string;
  lastUpdated: number;
}

export interface PluginError extends Error {
  pluginId: string;
  code: string;
  details?: any;
}

export type PluginHook = keyof PluginHooks;

export type PluginEventType = string;
