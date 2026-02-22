/**
 * @file 资源优化配置
 * @description 图片、字体、CSS 等资源的优化配置
 * @module config/resource-optimization
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export const imageOptimizationConfig = {
  enabled: true,
  formats: ['webp', 'avif', 'jpeg', 'png'],
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
    png: 90,
  },
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  lazy: true,
  placeholder: {
    enabled: true,
    blur: 10,
    quality: 30,
  },
  responsive: {
    enabled: true,
    breakpoints: [640, 768, 1024, 1280, 1536],
  },
};

export const fontOptimizationConfig = {
  enabled: true,
  display: 'swap',
  preload: true,
  subset: true,
  formats: ['woff2', 'woff'],
  unicodeRange: {
    latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
    chinese: 'U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F, U+2B740-2B81F, U+2B820-2CEAF',
  },
};

export const cssOptimizationConfig = {
  enabled: true,
  purge: {
    enabled: true,
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './src/**/*.css',
      './src/**/*.scss',
    ],
    safelist: [],
  },
  minify: true,
  autoprefixer: true,
  critical: {
    enabled: true,
    inline: false,
    extract: true,
  },
  modules: {
    enabled: true,
    localIdentName: '[name]__[local]--[hash:base64:5]',
  },
};

export const jsOptimizationConfig = {
  enabled: true,
  minify: true,
  terser: {
    compress: {
      drop_console: false,
      drop_debugger: true,
      pure_funcs: ['console.log'],
      dead_code: true,
      conditionals: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      hoist_funs: true,
      keep_fargs: false,
      hoist_vars: true,
      if_return: true,
      join_vars: true,
      collapse_vars: true,
      reduce_vars: true,
    },
    mangle: {
      safari10: true,
      toplevel: false,
      properties: false,
    },
    output: {
      comments: false,
      beautify: false,
      indent_level: 0,
    },
  },
};

export const compressionConfig = {
  enabled: true,
  algorithms: ['gzip', 'brotli'],
  gzip: {
    enabled: true,
    threshold: 1024,
    level: 9,
    memLevel: 8,
  },
  brotli: {
    enabled: true,
    threshold: 1024,
    quality: 11,
    mode: 0,
  },
};

export const cacheConfig = {
  enabled: true,
  strategy: 'stale-while-revalidate',
  maxAge: 3600,
  staleWhileRevalidate: 86400,
  cacheControl: 'public, max-age=3600, stale-while-revalidate=86400',
  etag: true,
  lastModified: true,
  immutable: ['*.js', '*.css', '*.woff2', '*.woff', '*.webp', '*.avif'],
};

export const bundleAnalysisConfig = {
  enabled: process.env.NODE_ENV === 'development',
  reportFormat: ['json', 'html'],
  maxSize: 244000,
  gzipThreshold: 102400,
  analyze: true,
  openAnalyzer: false,
};

export const performanceBudgetConfig = {
  enabled: true,
  budgets: [
    {
      type: 'initial',
      maximumSize: 244000,
      warning: 200000,
    },
    {
      type: 'anyComponentStyle',
      maximumSize: 15000,
      warning: 10000,
    },
    {
      type: 'anyScript',
      maximumSize: 44000,
      warning: 40000,
    },
    {
      type: 'any',
      maximumSize: 44000,
      warning: 40000,
    },
  ],
};

export default {
  image: imageOptimizationConfig,
  font: fontOptimizationConfig,
  css: cssOptimizationConfig,
  js: jsOptimizationConfig,
  compression: compressionConfig,
  cache: cacheConfig,
  bundleAnalysis: bundleAnalysisConfig,
  performanceBudget: performanceBudgetConfig,
};
