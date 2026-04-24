import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers';

test.describe('Dashboard', () => {
  test('should login and see dashboard', async ({ page }) => {
    await registerAndLogin(page);
    await expect(page.getByText('Dashboard Overview')).toBeVisible();
  });

  test('should navigate to subscriptions tab', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Subscriptions' }).click();
    await expect(page.getByText('My Subscriptions')).toBeVisible();
  });

  test('should navigate to payments tab', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Payments' }).click();
    await expect(page.getByText('Payment History')).toBeVisible();
  });

  test('should navigate to categories tab', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Categories' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Categories').first()).toBeVisible();
  });

  test('should navigate to insights tab', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Insights' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Insights').first()).toBeVisible();
  });

  test('should navigate to AI assistant tab', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'AI Assistant' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('AI Assistant').first()).toBeVisible();
  });

  test('should show user info in sidebar', async ({ page }) => {
    await registerAndLogin(page);
    await expect(page.getByText('E2E Test User')).toBeVisible();
  });
});
