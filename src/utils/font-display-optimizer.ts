/**
 * @file 字体显示优化工具
 * @description 提供字体加载状态检测、显示优化和回退策略
 * @module utils/font-display-optimizer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export type FontDisplayStrategy = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

export interface FontDisplayOptions {
  strategy?: FontDisplayStrategy;
  timeout?: number;
  fallbackFont?: string;
  showLoadingIndicator?: boolean;
  hideOnLoad?: boolean;
  onLoad?: (fontFamily: string) => void;
  onError?: (fontFamily: string) => void;
}

export interface FontLoadingState {
  fontFamily: string;
  loading: boolean;
  loaded: boolean;
  failed: boolean;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export interface FontDisplayConfig {
  fontFamily: string;
  display: FontDisplayStrategy;
  fallback: string;
  timeout: number;
  preload: boolean;
  critical: boolean;
}

export class FontDisplayOptimizer {
  private loadingStates: Map<string, FontLoadingState>;
  private observers: Map<string, IntersectionObserver>;
  private configs: Map<string, FontDisplayConfig>;

  constructor() {
    this.loadingStates = new Map();
    this.observers = new Map();
    this.configs = new Map();
  }

  configureFont(config: FontDisplayConfig): void {
    this.configs.set(config.fontFamily, config);

    if (config.preload) {
      this.preloadFont(config);
    }
  }

  private preloadFont(config: FontDisplayConfig): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = this.getFontUrl(config.fontFamily);
    link.crossOrigin = 'anonymous';
    link.setAttribute('font-display', config.display);
    document.head.appendChild(link);
  }

  private getFontUrl(fontFamily: string): string {
    return `/fonts/${fontFamily.replace(/\s+/g, '-').toLowerCase()}.woff2`;
  }

  createFontFace(fontFamily: string, fontSrc: string, options?: FontDisplayOptions): string {
    const { strategy = 'swap', fallbackFont = 'sans-serif' } = options || {};

    const config = this.configs.get(fontFamily) || {
      fontFamily,
      display: strategy,
      fallback: fallbackFont,
      timeout: 3000,
      preload: false,
      critical: false,
    };

    return `
@font-face {
  font-family: '${fontFamily}';
  src: url('${fontSrc}') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: ${config.display};
}
    `.trim();
  }

  createFontFaceWithFallback(
    fontFamily: string,
    fontSrc: string,
    fallbackFont: string,
    options?: FontDisplayOptions
  ): string {
    const { strategy = 'swap' } = options || {};

    return `
@font-face {
  font-family: '${fontFamily}';
  src: url('${fontSrc}') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: ${strategy};
}

@font-face {
  font-family: '${fontFamily}-fallback';
  src: local('${fallbackFont}');
  font-weight: normal;
  font-style: normal;
}
    `.trim();
  }

  waitForFontLoad(fontFamily: string, options?: FontDisplayOptions): Promise<FontLoadingState> {
    const { timeout = 3000, fallbackFont = 'sans-serif', onLoad, onError } = options || {};

    return new Promise((resolve) => {
      const startTime = performance.now();
      const state: FontLoadingState = {
        fontFamily,
        loading: true,
        loaded: false,
        failed: false,
        startTime,
      };

      this.loadingStates.set(fontFamily, state);

      const checkFont = () => {
        const loaded = document.fonts.check(`16px ${fontFamily}`);

        if (loaded) {
          state.loaded = true;
          state.loading = false;
          state.endTime = performance.now();
          state.duration = state.endTime - state.startTime;

          this.loadingStates.set(fontFamily, state);
          onLoad?.(fontFamily);
          resolve(state);
        }
      };

      const timeoutId = setTimeout(() => {
        if (!state.loaded) {
          state.failed = true;
          state.loading = false;
          state.endTime = performance.now();
          state.duration = state.endTime - state.startTime;

          this.loadingStates.set(fontFamily, state);
          onError?.(fontFamily);
          resolve(state);
        }
      }, timeout);

      const checkInterval = setInterval(() => {
        checkFont();
        if (state.loaded || state.failed) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
        }
      }, 100);

      checkFont();
    });
  }

  observeFontLoading(
    element: HTMLElement,
    fontFamily: string,
    options?: FontDisplayOptions
  ): () => void {
    const { showLoadingIndicator = true, hideOnLoad = true, onLoad, onError } = options || {};

    const originalStyle = element.style.fontFamily;

    if (showLoadingIndicator) {
      element.style.fontFamily = `${fontFamily}, ${this.configs.get(fontFamily)?.fallback || 'sans-serif'}`;
      element.classList.add('font-loading');
    }

    const unobserve = () => {
      if (hideOnLoad) {
        element.classList.remove('font-loading');
      }
    };

    this.waitForFontLoad(fontFamily, options).then((state) => {
      unobserve();

      if (state.loaded) {
        element.style.fontFamily = fontFamily;
        onLoad?.(fontFamily);
      } else if (state.failed) {
        element.style.fontFamily = this.configs.get(fontFamily)?.fallback || 'sans-serif';
        onError?.(fontFamily);
      }
    });

    return unobserve;
  }

  getLoadingState(fontFamily: string): FontLoadingState | undefined {
    return this.loadingStates.get(fontFamily);
  }

  isFontLoaded(fontFamily: string): boolean {
    return document.fonts.check(`16px ${fontFamily}`);
  }

  isFontLoading(fontFamily: string): boolean {
    const state = this.loadingStates.get(fontFamily);
    return state?.loading || false;
  }

  isFontFailed(fontFamily: string): boolean {
    const state = this.loadingStates.get(fontFamily);
    return state?.failed || false;
  }

  getAllLoadingStates(): FontLoadingState[] {
    return Array.from(this.loadingStates.values());
  }

  clearLoadingState(fontFamily: string): void {
    this.loadingStates.delete(fontFamily);
  }

  clearAllLoadingStates(): void {
    this.loadingStates.clear();
  }

  createLoadingIndicator(
    element: HTMLElement,
    options?: {
      color?: string;
      size?: number;
      position?: 'before' | 'after';
    }
  ): void {
    const { color = '#999', size = 14, position = 'before' } = options || {};

    const indicator = document.createElement('span');
    indicator.className = 'font-loading-indicator';
    indicator.style.cssText = `
      display: inline-block;
      width: ${size}px;
      height: ${size}px;
      border: 2px solid ${color};
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);

    if (position === 'before') {
      element.insertBefore(indicator, element.firstChild);
    } else {
      element.appendChild(indicator);
    }
  }

  removeLoadingIndicator(element: HTMLElement): void {
    const indicator = element.querySelector('.font-loading-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  createFontSwapEffect(
    element: HTMLElement,
    fontFamily: string,
    fallbackFont: string,
    duration: number = 300
  ): void {
    element.style.fontFamily = fallbackFont;
    element.style.transition = `font-family ${duration}ms ease`;

    requestAnimationFrame(() => {
      element.style.fontFamily = fontFamily;
    });
  }

  createFOITPrevention(
    element: HTMLElement,
    fontFamily: string,
    fallbackFont: string,
    timeout: number = 3000
  ): void {
    element.style.fontFamily = fallbackFont;

    this.waitForFontLoad(fontFamily, { timeout }).then((state) => {
      if (state.loaded) {
        element.style.fontFamily = fontFamily;
      }
    });
  }

  createFOUTPrevention(
    element: HTMLElement,
    fontFamily: string,
    fallbackFont: string,
    timeout: number = 100
  ): void {
    element.style.visibility = 'hidden';
    element.style.fontFamily = `${fontFamily}, ${fallbackFont}`;

    this.waitForFontLoad(fontFamily, { timeout }).then((state) => {
      if (state.loaded) {
        element.style.visibility = 'visible';
      }
    });
  }

  getOptimalDisplayStrategy(fontFamily: string, isCritical: boolean = false): FontDisplayStrategy {
    if (isCritical) {
      return 'block';
    }

    if (this.isFontLoaded(fontFamily)) {
      return 'auto';
    }

    return 'swap';
  }

  createSystemFontStack(): string {
    const systemFonts = [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ];

    return systemFonts.join(', ');
  }

  createMonospaceFontStack(): string {
    const monospaceFonts = ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'];

    return monospaceFonts.join(', ');
  }

  analyzeFontPerformance(): {
    totalFonts: number;
    loadedFonts: number;
    failedFonts: number;
    loadingFonts: number;
    averageLoadTime: number;
    slowestFont: { fontFamily: string; duration: number } | null;
  } {
    const states = this.getAllLoadingStates();
    const loadedFonts = states.filter((s) => s.loaded).length;
    const failedFonts = states.filter((s) => s.failed).length;
    const loadingFonts = states.filter((s) => s.loading).length;

    const completedStates = states.filter((s) => s.duration !== undefined);
    const totalLoadTime = completedStates.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageLoadTime = completedStates.length > 0 ? totalLoadTime / completedStates.length : 0;

    let slowestFont: { fontFamily: string; duration: number } | null = null;
    for (const state of completedStates) {
      if (!slowestFont || (state.duration || 0) > slowestFont.duration) {
        slowestFont = {
          fontFamily: state.fontFamily,
          duration: state.duration || 0,
        };
      }
    }

    return {
      totalFonts: states.length,
      loadedFonts,
      failedFonts,
      loadingFonts,
      averageLoadTime,
      slowestFont,
    };
  }
}

export const createFontDisplayOptimizer = (): FontDisplayOptimizer => {
  return new FontDisplayOptimizer();
};

export const defaultFontDisplayOptimizer = new FontDisplayOptimizer();

export const configureFont = (config: FontDisplayConfig): void => {
  defaultFontDisplayOptimizer.configureFont(config);
};

export const createFontFace = (
  fontFamily: string,
  fontSrc: string,
  options?: FontDisplayOptions
): string => {
  return defaultFontDisplayOptimizer.createFontFace(fontFamily, fontSrc, options);
};

export const waitForFontLoad = (
  fontFamily: string,
  options?: FontDisplayOptions
): Promise<FontLoadingState> => {
  return defaultFontDisplayOptimizer.waitForFontLoad(fontFamily, options);
};

export const isFontLoaded = (fontFamily: string): boolean => {
  return defaultFontDisplayOptimizer.isFontLoaded(fontFamily);
};

export const observeFontLoading = (
  element: HTMLElement,
  fontFamily: string,
  options?: FontDisplayOptions
): (() => void) => {
  return defaultFontDisplayOptimizer.observeFontLoading(element, fontFamily, options);
};

export const getFontLoadingState = (fontFamily: string): FontLoadingState | undefined => {
  return defaultFontDisplayOptimizer.getLoadingState(fontFamily);
};

export const createFontSwapEffect = (
  element: HTMLElement,
  fontFamily: string,
  fallbackFont: string,
  duration?: number
): void => {
  defaultFontDisplayOptimizer.createFontSwapEffect(element, fontFamily, fallbackFont, duration);
};

export const createFOITPrevention = (
  element: HTMLElement,
  fontFamily: string,
  fallbackFont: string,
  timeout?: number
): void => {
  defaultFontDisplayOptimizer.createFOITPrevention(element, fontFamily, fallbackFont, timeout);
};

export const createFOUTPrevention = (
  element: HTMLElement,
  fontFamily: string,
  fallbackFont: string,
  timeout?: number
): void => {
  defaultFontDisplayOptimizer.createFOUTPrevention(element, fontFamily, fallbackFont, timeout);
};

export const getSystemFontStack = (): string => {
  return defaultFontDisplayOptimizer.createSystemFontStack();
};

export const getMonospaceFontStack = (): string => {
  return defaultFontDisplayOptimizer.createMonospaceFontStack();
};

export const analyzeFontPerformance = () => {
  return defaultFontDisplayOptimizer.analyzeFontPerformance();
};

export default {
  FontDisplayOptimizer,
  createFontDisplayOptimizer,
  defaultFontDisplayOptimizer,
  configureFont,
  createFontFace,
  waitForFontLoad,
  isFontLoaded,
  observeFontLoading,
  getFontLoadingState,
  createFontSwapEffect,
  createFOITPrevention,
  createFOUTPrevention,
  getSystemFontStack,
  getMonospaceFontStack,
  analyzeFontPerformance,
};
