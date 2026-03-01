/**
 * @file Service Worker 注册和管理
 * @description 提供离线支持和资源缓存功能
 * @module pwa/service-worker
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import * as React from 'react';

declare global {
  interface URLPattern {
    exec(input: string, base?: string): URLPatternResult | null;
    test(input: string, base?: string): boolean;
  }

  interface URLPatternInit {
    protocol?: string;
    username?: string;
    password?: string;
    hostname?: string;
    port?: string;
    pathname?: string;
    search?: string;
    hash?: string;
  }

  interface URLPatternResult {
    protocol: { input: string; groups: Record<string, string> };
    username: { input: string; groups: Record<string, string> };
    password: { input: string; groups: Record<string, string> };
    hostname: { input: string; groups: Record<string, string> };
    port: { input: string; groups: Record<string, string> };
    pathname: { input: string; groups: Record<string, string> };
    search: { input: string; groups: Record<string, string> };
    hash: { input: string; groups: Record<string, string> };
  }
}

export interface ServiceWorkerConfig {
  enabled?: boolean;
  scope?: string;
  updateInterval?: number;
  maxCacheSize?: number;
  cacheName?: string;
  strategies?: CacheStrategy[];
  offlineFallback?: string;
  skipWaiting?: boolean;
  clientsClaim?: boolean;
  navigationPreload?: boolean;
  backgroundSync?: BackgroundSyncConfig;
  pushNotifications?: PushNotificationConfig;
}

export interface CacheStrategy {
  name: string;
  urlPattern: string | RegExp | object;
  strategy:
    | 'cache-first'
    | 'network-first'
    | 'cache-only'
    | 'network-only'
    | 'stale-while-revalidate';
  maxAge?: number;
  maxEntries?: number;
  cacheableResponse?: {
    statuses?: number[];
    headers?: Record<string, string>;
  };
}

export interface BackgroundSyncConfig {
  enabled?: boolean;
  tag?: string;
  minRetention?: number;
  maxRetention?: number;
}

export interface PushNotificationConfig {
  enabled?: boolean;
  subscriptionOptions?: PushSubscriptionOptions;
}

export interface ServiceWorkerStatus {
  installed: boolean;
  active: boolean;
  controlled: boolean;
  updateAvailable: boolean;
  version?: string;
  lastUpdate?: number;
}

class ServiceWorkerManager {
  private config: Required<ServiceWorkerConfig>;
  private registration: ServiceWorkerRegistration | null = null;
  private status: ServiceWorkerStatus = {
    installed: false,
    active: false,
    controlled: false,
    updateAvailable: false,
  };
  private listeners: Set<(status: ServiceWorkerStatus) => void> = new Set();
  private updateIntervalId: number | null = null;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      scope: config.scope ?? '/',
      updateInterval: config.updateInterval ?? 3600000,
      maxCacheSize: config.maxCacheSize ?? 50 * 1024 * 1024,
      cacheName: config.cacheName ?? 'yyc3-cache-v1',
      strategies: config.strategies ?? this.getDefaultStrategies(),
      offlineFallback: config.offlineFallback ?? '/offline.html',
      skipWaiting: config.skipWaiting ?? true,
      clientsClaim: config.clientsClaim ?? true,
      navigationPreload: config.navigationPreload ?? true,
      backgroundSync: config.backgroundSync ?? {
        enabled: false,
        tag: 'background-sync',
        minRetention: 60000,
        maxRetention: 86400000,
      },
      pushNotifications: config.pushNotifications ?? {
        enabled: false,
      },
    };

    if (this.config.enabled && 'serviceWorker' in navigator) {
      this.initialize();
    }
  }

  private getDefaultStrategies(): CacheStrategy[] {
    return [
      {
        name: 'static-assets',
        urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/,
        strategy: 'cache-first',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        maxEntries: 100,
      },
      {
        name: 'api-responses',
        urlPattern: /^\/api\//,
        strategy: 'network-first',
        maxAge: 5 * 60 * 1000,
        maxEntries: 50,
      },
      {
        name: 'html-pages',
        urlPattern: /\.(?:html)$/,
        strategy: 'stale-while-revalidate',
        maxAge: 24 * 60 * 60 * 1000,
        maxEntries: 20,
      },
    ];
  }

  private async initialize(): Promise<void> {
    try {
      this.registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: this.config.scope,
      });

      this.status.installed = true;
      this.status.active = !!this.registration.active;
      this.status.controlled = !!navigator.serviceWorker.controller;

      this.setupEventListeners();
      this.startUpdateCheck();

      this.notifyStatusChange();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private setupEventListeners(): void {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.status.updateAvailable = true;
            this.notifyStatusChange();
          }
        });
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      this.status.controlled = true;
      this.status.updateAvailable = false;
      window.location.reload();
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        this.status.updateAvailable = true;
      }
    });
  }

  private startUpdateCheck(): void {
    if (this.updateIntervalId !== null) return;

    this.updateIntervalId = window.setInterval(async () => {
      if (this.registration) {
        await this.registration.update();
      }
    }, this.config.updateInterval);
  }

  private stopUpdateCheck(): void {
    if (this.updateIntervalId !== null) {
      clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
    }
  }

  private notifyStatusChange(): void {
    this.listeners.forEach((listener) => listener({ ...this.status }));
  }

  public onStatusChange(callback: (status: ServiceWorkerStatus) => void): () => void {
    this.listeners.add(callback);
    callback({ ...this.status });

    return () => {
      this.listeners.delete(callback);
    };
  }

  public async update(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Service Worker update failed:', error);
      return false;
    }
  }

  public async skipWaiting(): Promise<void> {
    if (!this.registration || !this.registration.waiting) return;

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  public async clearCache(): Promise<void> {
    if (!this.registration) return;

    try {
      const caches = await window.caches.open(this.config.cacheName);
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  public async getCacheSize(): Promise<number> {
    try {
      const cacheNames = await window.caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await window.caches.open(cacheName);
        const keys = await cache.keys();

        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  }

  public async getCacheEntries(): Promise<CacheEntry[]> {
    try {
      const cache = await window.caches.open(this.config.cacheName);
      const requests = await cache.keys();
      const entries: CacheEntry[] = [];

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          entries.push({
            url: request.url,
            timestamp: Date.now(),
            size: parseInt(response.headers.get('content-length') || '0', 10),
          });
        }
      }

      return entries;
    } catch (error) {
      console.error('Failed to get cache entries:', error);
      return [];
    }
  }

  public getStatus(): ServiceWorkerStatus {
    return { ...this.status };
  }

  public async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    this.stopUpdateCheck();

    try {
      await this.registration.unregister();
      this.status.installed = false;
      this.status.active = false;
      this.status.controlled = false;
      this.notifyStatusChange();
      return true;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  public async subscribeToPushNotifications(
    userVisibleOnly: boolean = true,
    applicationServerKey?: string
  ): Promise<PushSubscription | null> {
    if (!this.registration || !this.config.pushNotifications.enabled) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly,
        applicationServerKey:
          applicationServerKey ||
          this.config.pushNotifications.subscriptionOptions?.applicationServerKey,
      });

      return subscription;
    } catch (error) {
      console.error('Push notification subscription failed:', error);
      return null;
    }
  }

  public async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Push notification unsubscription failed:', error);
      return false;
    }
  }

  public async getPushSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) return null;

    try {
      return await this.registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  public destroy(): void {
    this.stopUpdateCheck();
    this.listeners.clear();
  }
}

export interface CacheEntry {
  url: string;
  timestamp: number;
  size: number;
}

export const createServiceWorkerManager = (config?: ServiceWorkerConfig): ServiceWorkerManager => {
  return new ServiceWorkerManager(config);
};

export const useServiceWorker = (config?: ServiceWorkerConfig) => {
  const [status, setStatus] = React.useState<ServiceWorkerStatus>({
    installed: false,
    active: false,
    controlled: false,
    updateAvailable: false,
  });

  const managerRef = React.useRef<ServiceWorkerManager | null>(null);
  const configRef = React.useRef(config);

  React.useEffect(() => {
    configRef.current = config;
  }, [config]);

  React.useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = createServiceWorkerManager(configRef.current);

      const unsubscribe = managerRef.current.onStatusChange(setStatus);

      return () => {
        unsubscribe();
        managerRef.current?.destroy();
      };
    }

    return undefined;
  }, []);

  const update = React.useCallback(async () => {
    return (await managerRef.current?.update()) ?? false;
  }, []);

  const skipWaiting = React.useCallback(async () => {
    await managerRef.current?.skipWaiting();
  }, []);

  const clearCache = React.useCallback(async () => {
    await managerRef.current?.clearCache();
  }, []);

  const getCacheSize = React.useCallback(async () => {
    return (await managerRef.current?.getCacheSize()) ?? 0;
  }, []);

  const getCacheEntries = React.useCallback(async () => {
    return (await managerRef.current?.getCacheEntries()) ?? [];
  }, []);

  const subscribeToPush = React.useCallback(
    async (userVisibleOnly?: boolean, applicationServerKey?: string) => {
      return (
        (await managerRef.current?.subscribeToPushNotifications(
          userVisibleOnly,
          applicationServerKey
        )) ?? null
      );
    },
    []
  );

  const unsubscribeFromPush = React.useCallback(async () => {
    return (await managerRef.current?.unsubscribeFromPushNotifications()) ?? false;
  }, []);

  const getPushSubscription = React.useCallback(async () => {
    return (await managerRef.current?.getPushSubscription()) ?? null;
  }, []);

  return {
    status,
    update,
    skipWaiting,
    clearCache,
    getCacheSize,
    getCacheEntries,
    subscribeToPush,
    unsubscribeFromPush,
    getPushSubscription,
  };
};

export default {
  ServiceWorkerManager,
  createServiceWorkerManager,
  useServiceWorker,
};
