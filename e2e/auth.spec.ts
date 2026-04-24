import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav').getByText('wardayasubs')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('button', { name: 'Sign up', exact: true })).toBeVisible();
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to landing when accessing dashboard without auth', async ({ page }) => {
    // Clear any stored tokens
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/');
  });

  test('should show Google sign-in button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });
});
