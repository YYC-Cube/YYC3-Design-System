/**
 * @file Jest 测试环境设置
 * @description 设置测试环境和全局变量
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

// Mock matchMedia for tests
global.matchMedia = global.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock PerformanceObserver
global.PerformanceObserver = global.PerformanceObserver || class PerformanceObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
  takeRecords() { return []; }
};

// Mock performance
global.performance = global.performance || {
  now: () => Date.now(),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

// Mock Response for Node environment
global.Response = global.Response || class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || '';
    this.headers = init.headers || {};
    this.ok = this.status >= 200 && this.status < 300;
  }
  json() {
    return Promise.resolve(typeof this.body === 'string' ? JSON.parse(this.body) : this.body);
  }
  text() {
    return Promise.resolve(String(this.body));
  }
  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
    });
  }
};

// Mock Request
global.Request = global.Request || class Request {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init.method || 'GET';
    this.headers = init.headers || {};
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
};

// Mock Headers
global.Headers = global.Headers || class Headers {
  constructor(init) {
    this._headers = new Map();
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), value);
        });
      } else {
        Object.entries(init).forEach(([key, value]) => {
          this._headers.set(key.toLowerCase(), String(value));
        });
      }
    }
  }
  get(name) {
    return this._headers.get(name.toLowerCase()) || null;
  }
  set(name, value) {
    this._headers.set(name.toLowerCase(), value);
  }
  has(name) {
    return this._headers.has(name.toLowerCase());
  }
  forEach(callback) {
    this._headers.forEach((value, key) => callback(value, key));
  }
};

// Mock URL
const OriginalURL = global.URL || require('url').URL;
global.URL = class URL extends OriginalURL {
  static createObjectURL() {
    return 'blob:test-url';
  }
  static revokeObjectURL() {}
};

// Mock HTMLCanvasElement
if (typeof global.HTMLCanvasElement === 'undefined') {
  global.HTMLCanvasElement = class HTMLCanvasElement {
    getContext() {
      return {
        drawImage: jest.fn(),
        getImageData: jest.fn(() => ({
          data: new Uint8ClampedArray(100 * 100 * 4),
          width: 100,
          height: 100,
        })),
        putImageData: jest.fn(),
        createImageData: jest.fn(),
      };
    }
    toBlob(callback) {
      const blob = new Blob(['mock-image-data'], { type: 'image/jpeg' });
      callback(blob);
    }
  };
}

// Mock Image
global.Image = global.Image || class Image {
  constructor() {
    this.src = '';
    this.width = 100;
    this.height = 100;
    this.onload = null;
    this.onerror = null;
  }
};

// Mock HTMLImageElement
if (typeof global.HTMLImageElement === 'undefined') {
  global.HTMLImageElement = class HTMLImageElement {
    constructor() {
      this.src = '';
      this.onload = null;
      this.onerror = null;
    }
  };
}

// Mock getComputedStyle for style testing
if (typeof global.getComputedStyle === 'undefined') {
  global.getComputedStyle = function(_element) {
    return {
      getPropertyValue: () => '',
      getPropertyPriority: () => '',
      setProperty: () => {},
      removeProperty: () => {},
      cssText: '',
      length: 0,
      item: () => '',
      parentRule: null,
    };
  };
}
