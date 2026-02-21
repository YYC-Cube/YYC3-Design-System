/**
 * @file 性能优化配置
 * @description YYC³ 设计系统性能优化配置，包含构建优化、运行时优化、资源优化等
 * @module config/performance
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

export const performanceConfig = {
  build: {
    codeSplitting: {
      enabled: true,
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 25,
      automaticNameDelimiter: '-',
    },
    compression: {
      enabled: true,
      algorithms: ['gzip', 'brotli'],
      gzip: {
        threshold: 1024,
        level: 9,
      },
      brotli: {
        threshold: 1024,
        quality: 11,
      },
    },
    minification: {
      enabled: true,
      terser: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
        mangle: {
          safari10: true,
        },
        output: {
          comments: false,
          beautify: false,
        },
      },
    },
    treeShaking: {
      enabled: true,
      sideEffects: false,
    },
  },
  runtime: {
    debounce: {
      defaultDelay: 300,
      resizeDelay: 150,
      scrollDelay: 100,
    },
    throttle: {
      defaultDelay: 100,
      resizeDelay: 50,
      scrollDelay: 50,
    },
    lazyLoading: {
      enabled: true,
      threshold: 0.1,
      rootMargin: '50px',
    },
    virtualization: {
      enabled: true,
      itemSize: 50,
      overscan: 5,
    },
  },
  resources: {
    images: {
      lazy: true,
      formats: ['webp', 'avif'],
      quality: 85,
      maxWidth: 1920,
      maxHeight: 1080,
    },
    fonts: {
      display: 'swap',
      preload: true,
      subset: true,
    },
    css: {
      critical: true,
      inline: false,
      purge: true,
    },
    js: {
      async: true,
      defer: true,
      preload: false,
    },
  },
  caching: {
    strategy: 'stale-while-revalidate',
    maxAge: 3600,
    staleWhileRevalidate: 86400,
    cacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
    etag: true,
    lastModified: true,
  },
  monitoring: {
    enabled: true,
    metrics: {
      FCP: { threshold: 1500, good: 1000 },
      LCP: { threshold: 2500, good: 2500 },
      FID: { threshold: 100, good: 100 },
      CLS: { threshold: 0.1, good: 0.1 },
      TTFB: { threshold: 800, good: 600 },
    },
    sampling: {
      rate: 0.1,
      maxSamples: 1000,
    },
    reporting: {
      endpoint: '/api/performance',
      interval: 60000,
      batchSize: 50,
    },
  },
  bundleAnalysis: {
    enabled: process.env.NODE_ENV === 'development',
    reportFormat: ['json', 'html'],
    maxSize: 244000,
    gzipThreshold: 102400,
  },
};

export const performanceThresholds = {
  render: {
    simple: 16,
    medium: 50,
    complex: 100,
    veryComplex: 200,
  },
  interaction: {
    click: 50,
    input: 100,
    scroll: 16,
  },
  animation: {
    frameTime: 16.67,
    fps: 60,
  },
  memory: {
    max: 50 * 1024 * 1024,
    warning: 30 * 1024 * 1024,
  },
};

export const optimizationStrategies = {
  memoization: {
    enabled: true,
    components: true,
    hooks: true,
    computed: true,
  },
  codeSplitting: {
    enabled: true,
    routes: true,
    vendors: true,
    common: true,
  },
  lazyLoading: {
    enabled: true,
    components: true,
    routes: true,
    images: true,
  },
  prefetching: {
    enabled: true,
    links: true,
    resources: true,
  },
};

export default performanceConfig;
