/**
 * @file Jest配置文件
 * @description 设置测试环境和全局变量
 * @module jest.setup
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import '@testing-library/jest-dom';

global.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}) as any;

global.performance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 10000000,
  },
} as any;

const OriginalURL = global.URL;
global.URL = class URL extends OriginalURL {
  constructor(url: string, base?: string | URL) {
    super(url, base);
  }
  
  static createObjectURL = jest.fn(() => 'blob:test-url');
  static revokeObjectURL = jest.fn();
} as any;

global.HTMLCanvasElement = {
  prototype: {
    getContext: jest.fn(() => ({
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(100 * 100 * 4),
        width: 100,
        height: 100,
      })),
      putImageData: jest.fn(),
      createImageData: jest.fn(),
    })),
    toBlob: jest.fn((callback: (blob: Blob | null) => void) => {
      const blob = new Blob(['mock-image-data'], { type: 'image/jpeg' });
      callback(blob);
    }),
  },
} as any;

global.HTMLImageElement = {
  prototype: {
    onload: null,
    onerror: null,
  },
} as any;

global.Image = jest.fn(() => ({
  src: '',
  width: 100,
  height: 100,
  onload: null,
  onerror: null,
})) as any;

global.Response = class Response {
  body: any;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;
  
  constructor(body?: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || '';
    this.headers = new Headers(init?.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }
  
  json() {
    return Promise.resolve(this.body);
  }
  
  text() {
    return Promise.resolve(this.body);
  }
  
  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }
} as any;

global.Request = class Request {
  url: string;
  method: string;
  headers: Headers;
  
  constructor(input: string | Request, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
  }
  
  json() {
    return Promise.resolve({});
  }
  
  clone() {
    return new Request(this.url, {
      method: this.method,
      headers: this.headers,
    });
  }
} as any;

global.Headers = class Headers {
  private headers: Map<string, string> = new Map();
  
  constructor(init?: HeadersInit) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
  }
  
  get(name: string) {
    return this.headers.get(name.toLowerCase()) || null;
  }
  
  set(name: string, value: string) {
    this.headers.set(name.toLowerCase(), value);
  }
  
  has(name: string) {
    return this.headers.has(name.toLowerCase());
  }
  
  delete(name: string) {
    this.headers.delete(name.toLowerCase());
  }
  
  forEach(callback: (value: string, key: string) => void) {
    this.headers.forEach((value, key) => callback(value, key));
  }
} as any;