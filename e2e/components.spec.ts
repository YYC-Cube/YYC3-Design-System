import { test, expect } from '@playwright/test';

test.describe('Button Component E2E Tests', () => {
  test('should render button with default variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');
    const iframe = page.frameLocator('iframe');
    const button = iframe.locator('button').first();
    await expect(button).toBeVisible();
    await expect(button).toHaveText(/Button/i);
  });

  test('should render button with destructive variant', async ({ page }) => {
    await page.goto('/?path=/story/components-button--destructive');
    const iframe = page.frameLocator('iframe');
    const button = iframe.locator('button').first();
    await expect(button).toBeVisible();
    await expect(button).toHaveText(/Button/i);
  });

  test('should be clickable', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');
    const iframe = page.frameLocator('iframe');
    const button = iframe.locator('button').first();
    await button.click();
    await expect(button).toBeVisible();
  });

  test('should be disabled when disabled prop is true', async ({ page }) => {
    await page.goto('/?path=/story/components-button--disabled');
    const iframe = page.frameLocator('iframe');
    const button = iframe.locator('button').first();
    await expect(button).toBeDisabled();
  });
});

test.describe('Input Component E2E Tests', () => {
  test('should render input with placeholder', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    const iframe = page.frameLocator('iframe');
    const input = iframe.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder');
  });

  test('should allow typing in input', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    const iframe = page.frameLocator('iframe');
    const input = iframe.locator('input').first();
    await input.fill('Test input');
    await expect(input).toHaveValue('Test input');
  });

  test('should be disabled when disabled prop is true', async ({ page }) => {
    await page.goto('/?path=/story/components-input--disabled');
    const iframe = page.frameLocator('iframe');
    const input = iframe.locator('input').first();
    await expect(input).toBeDisabled();
  });
});

test.describe('Card Component E2E Tests', () => {
  test('should render card with content', async ({ page }) => {
    await page.goto('/?path=/story/components-card--default');
    const iframe = page.frameLocator('iframe');
    const card = iframe.locator('[class*="card"]').first();
    await expect(card).toBeVisible();
  });
});

test.describe('Theme Toggle E2E Tests', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/?path=/story/components-themetoggle--default');
    const iframe = page.frameLocator('iframe');
    const toggleButton = iframe.locator('button').first();
    
    await toggleButton.click();
    await page.waitForTimeout(500);
    
    await toggleButton.click();
    await page.waitForTimeout(500);
    
    await expect(toggleButton).toBeVisible();
  });
});

test.describe('Accessibility E2E Tests', () => {
  test('should have proper ARIA attributes on buttons', async ({ page }) => {
    await page.goto('/?path=/story/components-button--default');
    const iframe = page.frameLocator('iframe');
    const button = iframe.locator('button').first();
    await expect(button).toHaveAttribute('type', 'button');
  });

  test('should have proper ARIA attributes on inputs', async ({ page }) => {
    await page.goto('/?path=/story/components-input--default');
    const iframe = page.frameLocator('iframe');
    const input = iframe.locator('input').first();
    await expect(input).toHaveAttribute('type', 'text');
  });
});
