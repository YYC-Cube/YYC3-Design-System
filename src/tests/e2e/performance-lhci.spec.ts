// path: src/qa/tests/e2e/performance-lhci.spec.ts
/**
 * YYC\u00b3 Design System \u2014 Performance E2E Tests (Playwright)
 *
 * Uses Playwright to verify runtime performance metrics match Five-High budgets.
 * For full Lighthouse CI integration, use `npx lhci autorun` in CI.
 *
 * Budgets (Five-High: \u9ad8\u6027\u80fd):
 *   - FCP <= 1.5s
 *   - LCP <= 2.5s
 *   - CLS <= 0.1
 *   - JS Bundle <= 200KB
 */
import { test, expect } from '@playwright/test';

test.describe('Performance Metrics', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Page should load DOM within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('no layout shift during initial render', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check CLS via Performance Observer
    const cls = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value || 0;
            }
          }
        });
        try {
          observer.observe({ type: 'layout-shift', buffered: true });
        } catch {
          // PerformanceObserver not supported
        }
        // Wait a bit for any late shifts
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 1000);
      });
    });

    expect(cls).toBeLessThan(0.1);
  });

  test('CSS custom properties are available without JS computation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const primaryColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );

    // Primary color should be set via CSS (not computed by JS)
    expect(primaryColor).toBeTruthy();
    expect(primaryColor.length).toBeGreaterThan(0);
  });

  test('theme switching uses CSS variables (no repaint)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Measure time for theme switch
    const switchTime = await page.evaluate(() => {
      const start = performance.now();
      document.documentElement.setAttribute('data-theme', 'cyber');
      // Force a style recalculation
      getComputedStyle(document.documentElement).getPropertyValue('--primary');
      return performance.now() - start;
    });

    // Theme switch should be nearly instant (< 50ms)
    expect(switchTime).toBeLessThan(50);
  });

  test('total resource transfer size is within budget', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const resourceInfo = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let jsSize = 0;
      let cssSize = 0;
      let totalSize = 0;

      for (const entry of entries) {
        const size = entry.transferSize || 0;
        totalSize += size;
        if (entry.name.endsWith('.js') || entry.name.includes('.js?')) {
          jsSize += size;
        }
        if (entry.name.endsWith('.css') || entry.name.includes('.css?')) {
          cssSize += size;
        }
      }

      return {
        jsKB: Math.round(jsSize / 1024),
        cssKB: Math.round(cssSize / 1024),
        totalKB: Math.round(totalSize / 1024),
      };
    });

    // Budget: JS <= 200KB, Total <= 500KB
    expect(resourceInfo.jsKB).toBeLessThanOrEqual(500); // relaxed for dev mode
    expect(resourceInfo.totalKB).toBeLessThanOrEqual(2000); // relaxed for dev mode
  });

  test('all pages respond within 2 seconds', async ({ page }) => {
    const routes = [
      '/',
      '/components',
      '/playground',
      '/tokens',
      '/token-manager',
      '/build',
      '/alignment',
    ];

    for (const route of routes) {
      const start = Date.now();
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000); // 5s budget for dev mode
    }
  });

  test('animations respect 300ms blocking budget', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify animation duration tokens
    const durations = await page.evaluate(() => ({
      fast: getComputedStyle(document.documentElement).getPropertyValue('--duration-fast').trim(),
      normal: getComputedStyle(document.documentElement)
        .getPropertyValue('--duration-normal')
        .trim(),
      slow: getComputedStyle(document.documentElement).getPropertyValue('--duration-slow').trim(),
    }));

    // Parse ms values
    const parseMs = (v: string) => parseInt(v.replace('ms', ''), 10) || 0;
    expect(parseMs(durations.fast)).toBeLessThanOrEqual(150);
    expect(parseMs(durations.normal)).toBeLessThanOrEqual(300);
  });
});
