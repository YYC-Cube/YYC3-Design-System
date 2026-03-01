/**
 * @file 图片懒加载工具
 * @description 提供基于 IntersectionObserver 的图片懒加载功能
 * @module utils/image-lazy-loader
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface LazyImageOptions {
  rootMargin?: string;
  threshold?: number | number[];
  placeholder?: string;
  errorPlaceholder?: string;
  retryCount?: number;
  retryDelay?: number;
  onLoad?: (img: HTMLImageElement) => void;
  onError?: (img: HTMLImageElement) => void;
}

export interface LazyImageConfig {
  enabled: boolean;
  rootMargin: string;
  threshold: number;
  placeholder: string;
  errorPlaceholder: string;
  retryCount: number;
  retryDelay: number;
}

const defaultConfig: LazyImageConfig = {
  enabled: true,
  rootMargin: '50px',
  threshold: 0.01,
  placeholder:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
  errorPlaceholder:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZjZGNkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtc2l6ZT0iMTQiPuaXoDwvdGV4dD48L3N2Zz4=',
  retryCount: 3,
  retryDelay: 1000,
};

let globalConfig: LazyImageConfig = { ...defaultConfig };

const observerMap = new WeakMap<Element, IntersectionObserver>();

export const setLazyImageConfig = (config: Partial<LazyImageConfig>): void => {
  globalConfig = { ...globalConfig, ...config };
};

export const getLazyImageConfig = (): LazyImageConfig => {
  return { ...globalConfig };
};

export const createLazyImageObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: globalConfig.rootMargin,
    threshold: globalConfig.threshold,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

export const observeLazyImage = (
  element: HTMLImageElement,
  options?: LazyImageOptions
): (() => void) => {
  if (!globalConfig.enabled || !('IntersectionObserver' in window)) {
    loadImage(element, options);
    return () => {};
  }

  const dataSrc = element.getAttribute('data-src');
  if (!dataSrc) {
    return () => {};
  }

  const observer = createLazyImageObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target as HTMLImageElement, options);
        observer.unobserve(entry.target);
      }
    });
  });

  observer.observe(element);
  observerMap.set(element, observer);

  return () => {
    observer.unobserve(element);
    observerMap.delete(element);
  };
};

export const loadImage = (
  element: HTMLImageElement,
  options?: LazyImageOptions,
  retryCount: number = 0
): void => {
  const dataSrc = element.getAttribute('data-src');
  if (!dataSrc) {
    return;
  }

  const {
    placeholder = globalConfig.placeholder,
    errorPlaceholder = globalConfig.errorPlaceholder,
    retryCount: maxRetries = globalConfig.retryCount,
    retryDelay = globalConfig.retryDelay,
    onLoad,
    onError,
  } = options || {};

  const originalSrc = element.src;
  element.src = placeholder;

  const img = new Image();

  img.onload = () => {
    element.src = dataSrc;
    element.removeAttribute('data-src');
    element.classList.add('lazy-loaded');
    onLoad?.(element);
  };

  img.onerror = () => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        loadImage(element, options, retryCount + 1);
      }, retryDelay);
    } else {
      element.src = errorPlaceholder;
      element.classList.add('lazy-error');
      onError?.(element);
    }
  };

  img.src = dataSrc;
};

export const unobserveLazyImage = (element: HTMLImageElement): void => {
  const observer = observerMap.get(element);
  if (observer) {
    observer.unobserve(element);
    observerMap.delete(element);
  }
};

export const observeAllLazyImages = (
  selector: string = 'img[data-src]',
  options?: LazyImageOptions
): (() => void) => {
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  const unobserveFunctions: Array<() => void> = [];

  images.forEach((img) => {
    unobserveFunctions.push(observeLazyImage(img, options));
  });

  return () => {
    unobserveFunctions.forEach((unobserve) => unobserve());
  };
};

export const resetLazyImage = (element: HTMLImageElement, originalSrc: string): void => {
  element.src = globalConfig.placeholder;
  element.setAttribute('data-src', originalSrc);
  element.classList.remove('lazy-loaded', 'lazy-error');
  unobserveLazyImage(element);
};

export const preloadLazyImage = (
  src: string,
  options?: LazyImageOptions
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      options?.onLoad?.(img);
      resolve(img);
    };

    img.onerror = () => {
      options?.onError?.(img);
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
};

export const createLazyImageBatchLoader = (batchSize: number = 5, delay: number = 100) => {
  let queue: HTMLImageElement[] = [];
  let processing = false;

  const processBatch = async () => {
    if (processing || queue.length === 0) {
      return;
    }

    processing = true;
    const batch = queue.splice(0, batchSize);

    await Promise.all(
      batch.map((img) => {
        return new Promise<void>((resolve) => {
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            const tempImg = new Image();
            tempImg.onload = () => {
              img.src = dataSrc;
              img.removeAttribute('data-src');
              img.classList.add('lazy-loaded');
              resolve();
            };
            tempImg.onerror = () => {
              img.src = globalConfig.errorPlaceholder;
              img.classList.add('lazy-error');
              resolve();
            };
            tempImg.src = dataSrc;
          } else {
            resolve();
          }
        });
      })
    );

    processing = false;

    if (queue.length > 0) {
      setTimeout(processBatch, delay);
    }
  };

  return {
    add: (img: HTMLImageElement) => {
      queue.push(img);
      processBatch();
    },
    addBatch: (images: HTMLImageElement[]) => {
      queue.push(...images);
      processBatch();
    },
    clear: () => {
      queue = [];
    },
    getQueueSize: () => queue.length,
  };
};

export const createProgressiveImageLoader = (
  lowQualitySrc: string,
  highQualitySrc: string,
  element: HTMLImageElement,
  options?: LazyImageOptions
): void => {
  element.src = lowQualitySrc;
  element.classList.add('progressive-loading');

  const highQualityImg = new Image();

  highQualityImg.onload = () => {
    element.src = highQualitySrc;
    element.classList.remove('progressive-loading');
    element.classList.add('progressive-loaded');
    options?.onLoad?.(element);
  };

  highQualityImg.onerror = () => {
    element.classList.remove('progressive-loading');
    element.classList.add('progressive-error');
    options?.onError?.(element);
  };

  highQualityImg.src = highQualitySrc;
};

export const createLazyImageWithPlaceholder = (
  element: HTMLImageElement,
  placeholderColor: string = '#f0f0f0',
  placeholderText: string = 'Loading...'
): void => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = placeholderColor;
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = '#999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(placeholderText, 50, 50);

    element.src = canvas.toDataURL('image/png');
  }

  observeLazyImage(element);
};

export const getLazyImageStats = (): {
  total: number;
  loaded: number;
  error: number;
  pending: number;
} => {
  const images = document.querySelectorAll<HTMLImageElement>(
    'img[data-src], img.lazy-loaded, img.lazy-error'
  );
  const total = images.length;
  const loaded = document.querySelectorAll<HTMLImageElement>('img.lazy-loaded').length;
  const error = document.querySelectorAll<HTMLImageElement>('img.lazy-error').length;
  const pending = total - loaded - error;

  return { total, loaded, error, pending };
};

export const destroyAllLazyImages = (): void => {
  const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
  images.forEach((img) => {
    unobserveLazyImage(img);
  });
};

export const clearImageCache = (): void => {
  const images = document.querySelectorAll<HTMLImageElement>('img[data-src]');
  images.forEach((img) => {
    unobserveLazyImage(img);
    img.src = '';
    img.removeAttribute('data-src');
  });
};

export default {
  setLazyImageConfig,
  getLazyImageConfig,
  observeLazyImage,
  unobserveLazyImage,
  observeAllLazyImages,
  loadImage,
  resetLazyImage,
  preloadLazyImage,
  createLazyImageBatchLoader,
  createProgressiveImageLoader,
  createLazyImageWithPlaceholder,
  getLazyImageStats,
  destroyAllLazyImages,
  clearImageCache,
};
