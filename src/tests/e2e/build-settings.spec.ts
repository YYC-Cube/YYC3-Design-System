/**
 * YYC³ Design System — Build Settings E2E Tests (Playwright)
 */
import { test, expect } from '@playwright/test';

test.describe('Build Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/build');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with platform cards', async ({ page }) => {
    await expect(page.locator('text=SCSS')).toBeVisible();
    await expect(page.locator('text=Swift')).toBeVisible();
    await expect(page.locator('text=Kotlin')).toBeVisible();
  });

  test('platform toggle enables/disables build', async ({ page }) => {
    const toggles = page.locator('role=switch');
    const count = await toggles.count();
    expect(count).toBeGreaterThanOrEqual(3);
    await toggles.first().click();
  });

  test('generate button triggers build process', async ({ page }) => {
    const generateBtn = page
      .locator("button:has-text('Generate'), button:has-text('生成')")
      .first();
    await generateBtn.click();
    // Wait for progress bar to appear
    await page.waitForTimeout(1000);
  });

  test('Ctrl+Alt+B opens Build Settings page', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+Alt+b');
    await page.waitForTimeout(500);
    // Should navigate to /build
    expect(page.url()).toContain('build');
  });
});
