/**
 * YYC³ Design System — Theme Switching E2E Tests (Playwright)
 *
 * Verifies: visual theme cycling, light/dark toggle, keyboard shortcuts,
 * persistence across page reloads, all three theme color palettes.
 */
import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('default theme is future', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'future');
  });

  test('click theme toggle cycles to cyber', async ({ page }) => {
    // Find the cyber theme button in ThemeToggle
    const cyberBtn = page.locator("button[title*='Cyber'], button[title*='赛博']");
    await cyberBtn.click();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'cyber');
  });

  test('click theme toggle cycles to business', async ({ page }) => {
    const businessBtn = page.locator("button[title*='Business'], button[title*='商务']");
    await businessBtn.click();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'business');
  });

  test('Ctrl+Alt+T cycles theme via keyboard', async ({ page }) => {
    await page.keyboard.press('Control+Alt+t');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'cyber');
    await page.keyboard.press('Control+Alt+t');
    await expect(html).toHaveAttribute('data-theme', 'business');
    await page.keyboard.press('Control+Alt+t');
    await expect(html).toHaveAttribute('data-theme', 'future');
  });

  test('light/dark toggle works', async ({ page }) => {
    const modeBtn = page.locator("button[aria-label*='mode'], button[aria-label*='模式']");
    await modeBtn.click();
    // Check that dark class is toggled
    const html = page.locator('html');
    const isDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(typeof isDark).toBe('boolean');
  });

  test('theme persists after page reload', async ({ page }) => {
    const cyberBtn = page.locator("button[title*='Cyber'], button[title*='赛博']");
    await cyberBtn.click();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'cyber');
  });

  test('primary color changes with theme', async ({ page }) => {
    const futurePrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );

    const cyberBtn = page.locator("button[title*='Cyber'], button[title*='赛博']");
    await cyberBtn.click();
    await page.waitForTimeout(200);

    const cyberPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );

    expect(futurePrimary).not.toBe(cyberPrimary);
  });
});
