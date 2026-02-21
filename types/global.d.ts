/**
 * @file 全局类型定义
 * @description 解决TypeScript类型兼容性问题
 * @module types/global
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

/**
 * ImportMeta类型扩展
 */
interface ImportMeta {
  readonly hot?: boolean;
  readonly env?: {
    readonly MODE?: string;
    readonly DEV?: boolean;
    readonly PROD?: boolean;
    readonly SSR?: boolean;
  };
}

/**
 * Window接口扩展
 */
interface Window {
  matchMedia: (query: string) => MediaQueryList;
}

/**
 * MediaQueryList接口
 */
interface MediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
  addEventListener: (type: string, listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
  dispatchEvent: (event: Event) => boolean;
}

/**
 * MediaQueryListEvent接口
 */
interface MediaQueryListEvent extends Event {
  readonly matches: boolean;
  readonly media: string;
}

/**
 * Navigator接口扩展
 */
interface Navigator {
  serviceWorker: ServiceWorkerContainer | undefined;
}

/**
 * ServiceWorkerContainer接口
 */
interface ServiceWorkerContainer {
  ready: Promise<ServiceWorkerRegistration>;
  controller: ServiceWorker | null;
  register(scriptURL: string, options?: RegistrationOptions): Promise<ServiceWorkerRegistration>;
  getRegistration(): Promise<ServiceWorkerRegistration | undefined>;
  getRegistrations(): Promise<ReadonlyArray<ServiceWorkerRegistration>>;
}

/**
 * RegistrationOptions接口
 */
interface RegistrationOptions {
  scope?: string;
  type?: WorkerType;
}

/**
 * WorkerType类型
 */
type WorkerType = 'classic' | 'module';
