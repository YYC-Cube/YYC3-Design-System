/**
 * @file 插件管理器
 * @description YYC³ Design System插件管理器
 * @module core/PluginManager
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import {
  PluginManifest,
  PluginContext,
  PluginAPI,
  PluginLogger,
  PluginHooks,
  PluginState,
  ComponentRegistration,
  ThemeRegistration,
  TokenRegistration,
  PluginEvent,
  PluginConfig,
} from '../types/plugin';

export class PluginManager {
  private plugins: Map<string, PluginManifest> = new Map();
  private pluginStates: Map<string, PluginState> = new Map();
  private componentRegistry: Map<string, ComponentRegistration> = new Map();
  private themeRegistry: Map<string, ThemeRegistration> = new Map();
  private tokenRegistry: Map<string, TokenRegistration> = new Map();
  private eventListeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor() {
    this.loadPlugins();
  }

  async install(manifest: PluginManifest): Promise<void> {
    const { id, version, yyc3 } = manifest;

    if (this.plugins.has(id)) {
      throw new Error(`Plugin ${id} is already installed`);
    }

    if (yyc3?.minVersion && this.isVersionIncompatible(yyc3.minVersion)) {
      throw new Error(
        `Plugin ${id} requires YYC³ Design System version ${yyc3.minVersion} or higher`
      );
    }

    if (yyc3?.maxVersion && this.isVersionIncompatible('0.0.0', yyc3.maxVersion)) {
      throw new Error(
        `Plugin ${id} is not compatible with YYC³ Design System version ${yyc3.maxVersion}`
      );
    }

    this.plugins.set(id, manifest);
    this.pluginStates.set(id, {
      installed: true,
      activated: false,
      version,
      lastUpdated: Date.now(),
    });

    const context = this.createContext(manifest);
    await this.executeHook('onInstall', context);
    this.emitEvent({
      type: 'plugin:installed',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { pluginId: id, manifest },
    });
  }

  async activate(pluginId: string): Promise<void> {
    const manifest = this.plugins.get(pluginId);
    if (!manifest) {
      throw new Error(`Plugin ${pluginId} is not installed`);
    }

    const state = this.pluginStates.get(pluginId);
    if (state?.activated) {
      return;
    }

    const context = this.createContext(manifest);
    await this.executeHook('onActivate', context);

    this.pluginStates.set(pluginId, {
      installed: state?.installed ?? false,
      version: state?.version ?? manifest.version,
      activated: true,
      lastUpdated: Date.now(),
    });

    this.emitEvent({
      type: 'plugin:activated',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { pluginId },
    });
  }

  async deactivate(pluginId: string): Promise<void> {
    const manifest = this.plugins.get(pluginId);
    if (!manifest) {
      throw new Error(`Plugin ${pluginId} is not installed`);
    }

    const state = this.pluginStates.get(pluginId);
    if (!state?.activated) {
      return;
    }

    const context = this.createContext(manifest);
    await this.executeHook('onDeactivate', context);

    this.pluginStates.set(pluginId, {
      ...state,
      activated: false,
      lastUpdated: Date.now(),
    });

    this.emitEvent({
      type: 'plugin:deactivated',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { pluginId },
    });
  }

  async uninstall(pluginId: string): Promise<void> {
    const manifest = this.plugins.get(pluginId);
    if (!manifest) {
      throw new Error(`Plugin ${pluginId} is not installed`);
    }

    const context = this.createContext(manifest);
    await this.executeHook('onUninstall', context);

    this.plugins.delete(pluginId);
    this.pluginStates.delete(pluginId);

    this.emitEvent({
      type: 'plugin:uninstalled',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { pluginId },
    });
  }

  getPlugin(pluginId: string): PluginManifest | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginState(pluginId: string): PluginState | undefined {
    return this.pluginStates.get(pluginId);
  }

  getAllPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values());
  }

  getInstalledPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values());
  }

  getActivatedPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).filter(
      (plugin) => this.pluginStates.get(plugin.id)?.activated
    );
  }

  registerComponent(registration: ComponentRegistration): void {
    this.componentRegistry.set(registration.id, registration);
    this.emitEvent({
      type: 'component:registered',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { componentId: registration.id },
    });
  }

  unregisterComponent(componentId: string): void {
    this.componentRegistry.delete(componentId);
    this.emitEvent({
      type: 'component:unregistered',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { componentId },
    });
  }

  getComponents(): ComponentRegistration[] {
    return Array.from(this.componentRegistry.values());
  }

  registerTheme(registration: ThemeRegistration): void {
    this.themeRegistry.set(registration.id, registration);
    this.emitEvent({
      type: 'theme:registered',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { themeId: registration.id },
    });
  }

  unregisterTheme(themeId: string): void {
    this.themeRegistry.delete(themeId);
    this.emitEvent({
      type: 'theme:unregistered',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { themeId },
    });
  }

  getThemes(): ThemeRegistration[] {
    return Array.from(this.themeRegistry.values());
  }

  registerToken(registration: TokenRegistration): void {
    this.tokenRegistry.set(registration.id, registration);
    this.emitEvent({
      type: 'token:registered',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { tokenId: registration.id },
    });
  }

  unregisterToken(tokenId: string): void {
    this.tokenRegistry.delete(tokenId);
    this.emitEvent({
      type: 'token:unregistered',
      source: 'PluginManager',
      timestamp: Date.now(),
      data: { tokenId },
    });
  }

  getTokens(): TokenRegistration[] {
    return Array.from(this.tokenRegistry.values());
  }

  emitEvent(event: PluginEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((callback) => callback(event));
    }
  }

  onEvent(event: string, callback: (data: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  offEvent(event: string, callback: (data: unknown) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  private createContext(manifest: PluginManifest): PluginContext {
    const appVersion = this.getAppVersion();
    const config = this.getPluginConfig(manifest.id);

    return {
      pluginId: manifest.id,
      pluginVersion: manifest.version,
      appVersion,
      config,
      api: this.createAPI(manifest.id),
      logger: this.createLogger(manifest.id),
      hooks: this.getPluginHooks(manifest),
    };
  }

  private createAPI(pluginId: string): PluginAPI {
    return {
      registerComponent: (component) => this.registerComponent({ ...component, pluginId }),
      unregisterComponent: (componentId) => this.unregisterComponent(componentId),
      registerTheme: (theme) => this.registerTheme({ ...theme, pluginId }),
      unregisterTheme: (themeId) => this.unregisterTheme(themeId),
      registerToken: (token) => this.registerToken({ ...token, pluginId }),
      unregisterToken: (tokenId) => this.unregisterToken(tokenId),
      getComponents: () => this.getComponents(),
      getThemes: () => this.getThemes(),
      getTokens: () => this.getTokens(),
      emitEvent: (event) => this.emitEvent({ ...event, source: pluginId }),
      onEvent: (event, callback) => this.onEvent(event, callback),
      offEvent: (event, callback) => this.offEvent(event, callback),
    };
  }

  private createLogger(pluginId: string): PluginLogger {
    return {
      debug: (message, ...args) => console.debug(`[${pluginId}]`, message, ...args),
      info: (message, ...args) => console.info(`[${pluginId}]`, message, ...args),
      warn: (message, ...args) => console.warn(`[${pluginId}]`, message, ...args),
      error: (message, ...args) => console.error(`[${pluginId}]`, message, ...args),
    };
  }

  private getPluginHooks(manifest: PluginManifest): PluginHooks {
    const createEmptyHook = () => async () => {};

    return {
      onInstall: manifest.yyc3?.hooks?.onInstall || createEmptyHook(),
      onActivate: manifest.yyc3?.hooks?.onActivate || createEmptyHook(),
      onDeactivate: manifest.yyc3?.hooks?.onDeactivate || createEmptyHook(),
      onUninstall: manifest.yyc3?.hooks?.onUninstall || createEmptyHook(),
      onConfigChange: manifest.yyc3?.hooks?.onConfigChange || (async (_config: PluginConfig) => {}),
      onThemeChange: manifest.yyc3?.hooks?.onThemeChange || (async (_theme: string) => {}),
      onLanguageChange: manifest.yyc3?.hooks?.onLanguageChange || (async (_language: string) => {}),
    };
  }

  private async executeHook(hookName: keyof PluginHooks, context: PluginContext): Promise<void> {
    const hook = context.hooks[hookName];
    if (hook && typeof hook === 'function') {
      try {
        switch (hookName) {
          case 'onInstall':
          case 'onActivate':
          case 'onDeactivate':
          case 'onUninstall':
            await (hook as any)(context);
            break;
          case 'onConfigChange':
            await (hook as any)(context.config);
            break;
          case 'onThemeChange':
            await (hook as any)('');
            break;
          case 'onLanguageChange':
            await (hook as any)('');
            break;
        }
      } catch (error) {
        console.error(`Error executing hook ${hookName}:`, error);
      }
    }
  }

  private loadPlugins(): void {
    const stored = localStorage.getItem('yyc3-plugins');
    if (stored) {
      try {
        const plugins = JSON.parse(stored);
        plugins.forEach((plugin: PluginManifest) => {
          this.plugins.set(plugin.id, plugin);
          this.pluginStates.set(plugin.id, {
            installed: true,
            activated: false,
            version: plugin.version,
            lastUpdated: Date.now(),
          });
        });
      } catch (error) {
        console.error('Error loading plugins:', error);
      }
    }
  }

  private savePlugins(): void {
    const plugins = Array.from(this.plugins.values());
    localStorage.setItem('yyc3-plugins', JSON.stringify(plugins));
  }

  private getPluginConfig(pluginId: string): PluginConfig {
    const stored = localStorage.getItem(`yyc3-plugin-config-${pluginId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading plugin config:', error);
      }
    }
    return {
      enabled: false,
      settings: {},
      permissions: [],
    };
  }

  private getAppVersion(): string {
    return process.env.YYC3_VERSION || '1.4.0';
  }

  private isVersionIncompatible(minVersion: string, maxVersion?: string): boolean {
    if (minVersion && this.compareVersions(this.getAppVersion(), minVersion) < 0) {
      return true;
    }
    if (maxVersion && this.compareVersions(this.getAppVersion(), maxVersion) > 0) {
      return true;
    }
    return false;
  }

  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;

      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }
}

export const pluginManager = new PluginManager();
