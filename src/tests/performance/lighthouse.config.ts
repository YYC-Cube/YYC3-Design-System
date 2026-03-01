/**
 * YYC³ Design System — Lighthouse CI Configuration
 *
 * Performance budgets aligned with Five-High goals:
 *   - FCP <= 1.5s (High Performance)
 *   - LCP <= 2.5s
 *   - CLS <= 0.1
 *   - Total JS <= 200KB
 *   - Accessibility score >= 90
 *
 * Install: pnpm add -D @lhci/cli
 * Run:     npx lhci autorun
 */

export const lighthouseConfig = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/components',
        'http://localhost:5173/playground',
        'http://localhost:5173/tokens',
        'http://localhost:5173/token-manager',
        'http://localhost:5173/build',
      ],
    },
    assert: {
      assertions: {
        // ─── Performance (五高: 高性能) ───
        'categories:performance': ['error', { minScore: 0.85 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // ─── Accessibility (五高: 高可访问性) ───
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',

        // ─── Best Practices ───
        'categories:best-practices': ['warn', { minScore: 0.85 }],

        // ─── Resource budgets (五高: 高性能) ───
        'resource-summary:script:size': ['error', { maxNumericValue: 204800 }], // 200KB
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 51200 }], // 50KB
        'resource-summary:total:size': ['error', { maxNumericValue: 512000 }], // 500KB
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

/**
 * Performance budget file (can be used with Webpack/Vite plugins)
 */
export const performanceBudget = {
  resourceSizes: [
    { resourceType: 'script', budget: 200 }, // KB
    { resourceType: 'stylesheet', budget: 50 },
    { resourceType: 'total', budget: 500 },
    { resourceType: 'image', budget: 200 },
    { resourceType: 'font', budget: 100 },
  ],
  resourceCounts: [
    { resourceType: 'script', budget: 10 },
    { resourceType: 'stylesheet', budget: 5 },
    { resourceType: 'third-party', budget: 5 },
  ],
  timings: [
    { metric: 'first-contentful-paint', budget: 1500 },
    { metric: 'largest-contentful-paint', budget: 2500 },
    { metric: 'cumulative-layout-shift', budget: 0.1 },
    { metric: 'total-blocking-time', budget: 300 },
    { metric: 'interactive', budget: 3000 },
  ],
};

export default lighthouseConfig;
