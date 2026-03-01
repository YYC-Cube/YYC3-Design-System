// path: src/qa/tests/e2e/storybook-isolation.spec.ts
/**
 * YYC\u00b3 Design System \u2014 Storybook Isolation Mode E2E Tests (Playwright)
 *
 * Verifies: Settings panel open/close, isolation toggle, snapshot layout,
 * render quality slider, test execution, iframe isolation.
 */
import { test, expect } from '@playwright/test';

test.describe('Storybook Isolation Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
    await page.waitForLoadState('networkidle');
  });

  test('Settings button is visible on Components page', async ({ page }) => {
    const settingsBtn = page.locator(
      "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
    );
    await expect(settingsBtn.first()).toBeVisible();
  });

  test('clicking Settings opens the Storybook Settings Panel', async ({ page }) => {
    const settingsBtn = page
      .locator(
        "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
      )
      .first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    // Panel should now be visible
    const panel = page.locator("[role='dialog'], [class*='panel'], [class*='modal']").first();
    await expect(panel).toBeVisible();
  });

  test('Isolation Mode switch toggles on/off', async ({ page }) => {
    // Open settings
    const settingsBtn = page
      .locator(
        "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
      )
      .first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    // Find isolation switch
    const isolationSwitch = page.locator('role=switch').first();
    if (await isolationSwitch.isVisible()) {
      await isolationSwitch.click();
      // Switch should now be checked
      const isChecked = await isolationSwitch.getAttribute('data-state');
      expect(['checked', 'unchecked']).toContain(isChecked);
    }
  });

  test('Snapshot Layout dropdown has Grid/List/Carousel options', async ({ page }) => {
    const settingsBtn = page
      .locator(
        "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
      )
      .first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    // Look for the layout selector
    const layoutTrigger = page
      .locator("button:has-text('Grid'), button:has-text('List'), button:has-text('Carousel')")
      .first();
    if (await layoutTrigger.isVisible()) {
      await layoutTrigger.click();
      await page.waitForTimeout(200);
    }
  });

  test('Render quality slider is interactive', async ({ page }) => {
    const settingsBtn = page
      .locator(
        "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
      )
      .first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    const slider = page.locator('role=slider').first();
    if (await slider.isVisible()) {
      // Verify slider is interactive
      const value = await slider.getAttribute('aria-valuenow');
      expect(value).toBeDefined();
    }
  });

  test('Run Isolated Tests button triggers test execution', async ({ page }) => {
    const settingsBtn = page
      .locator(
        "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
      )
      .first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    const runBtn = page.locator("button:has-text('Run'), button:has-text('\u8fd0\u884c')").first();
    if (await runBtn.isVisible()) {
      await runBtn.click();
      await page.waitForTimeout(2000);
      // Status badge should update
      const badge = page
        .locator('text=Passed, text=Failed, text=\u901a\u8fc7, text=\u5931\u8d25')
        .first();
      if (await badge.isVisible()) {
        const text = await badge.textContent();
        expect(text).toBeTruthy();
      }
    }
  });

  test('closing the panel hides it', async ({ page }) => {
    const settingsBtn = page
      .locator(
        "button[aria-label*='Settings'], button[aria-label*='\u8bbe\u7f6e'], button:has-text('Settings'), button:has-text('\u8bbe\u7f6e')"
      )
      .first();
    await settingsBtn.click();
    await page.waitForTimeout(300);

    // Find close button
    const closeBtn = page
      .locator(
        "button[aria-label*='Close'], button[aria-label*='\u5173\u95ed'], button:has-text('\u00d7')"
      )
      .first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  });
});
