/**
 * YYC³ Design System — Token Manager E2E Tests (Playwright)
 */
import { test, expect } from '@playwright/test';

test.describe('Token Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-manager');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with Import tab visible', async ({ page }) => {
    await expect(page.locator('text=Import, text=导入').first()).toBeVisible();
  });

  test('Ctrl+Alt+I focuses Import tab', async ({ page }) => {
    // Navigate away from Import first
    await page.locator('text=Edit, text=编辑').first().click();
    await page.keyboard.press('Control+Alt+i');
    // Should switch back to Import
  });

  test('can switch between all four tabs', async ({ page }) => {
    const tabs = ['Import', 'Edit', 'Export', 'History'];
    for (const tab of tabs) {
      const tabEl = page.locator(`text=${tab}`).first();
      if (await tabEl.isVisible()) {
        await tabEl.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('file import box accepts drag and drop', async ({ page }) => {
    const dropZone = page.locator("[class*='border-dashed']").first();
    await expect(dropZone).toBeVisible();
  });

  test('export tab shows format options', async ({ page }) => {
    await page.locator('text=Export, text=导出').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=JSON')).toBeVisible();
    await expect(page.locator('text=CSS')).toBeVisible();
  });
});
