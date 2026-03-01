/**
 * YYC³ Design System — Language Switching E2E Tests (Playwright)
 */
import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('defaults to Chinese', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'zh-CN');
  });

  test('language toggle button switches to English', async ({ page }) => {
    const langBtn = page.locator("button:has-text('中')");
    await langBtn.click();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(page.locator("button:has-text('EN')")).toBeVisible();
  });

  test('Ctrl+Alt+L toggles language', async ({ page }) => {
    await page.keyboard.press('Control+Alt+l');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await page.keyboard.press('Control+Alt+l');
    await expect(html).toHaveAttribute('lang', 'zh-CN');
  });

  test('language persists after reload', async ({ page }) => {
    await page.keyboard.press('Control+Alt+l');
    await page.reload();
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('navigation labels change with language', async ({ page }) => {
    // In Chinese
    await expect(page.locator('text=总览')).toBeVisible();
    // Switch to English
    await page.keyboard.press('Control+Alt+l');
    await expect(page.locator('text=Overview')).toBeVisible();
  });
});
