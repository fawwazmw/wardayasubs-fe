import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers';

test.describe('Subscriptions', () => {
  test('should open add subscription form', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Subscriptions' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Add Subscription' }).click();
    await expect(page.getByText('Add New Subscription')).toBeVisible();
  });

  test('should open template picker', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Subscriptions' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Use Template' }).click();
    await expect(page.getByText('Quick Add Template')).toBeVisible();
  });

  test('should show empty state for new user', async ({ page }) => {
    await registerAndLogin(page);
    await page.getByRole('button', { name: 'Subscriptions' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('No subscriptions yet')).toBeVisible();
  });
});
