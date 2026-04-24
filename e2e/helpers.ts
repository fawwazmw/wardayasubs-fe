import { type Page, expect } from '@playwright/test';

/**
 * Register a fresh test user and login.
 * This avoids depending on seeded data.
 */
export async function registerAndLogin(page: Page) {
  const email = `test-${Date.now()}@example.com`;
  const password = 'testpassword123';

  // Register via API directly (bypass email verification)
  const apiBase = 'http://localhost:3001/api';

  const regRes = await page.request.post(`${apiBase}/auth/register`, {
    data: { email, password, name: 'E2E Test User' },
  });

  // If registration returns a verifyToken (dev mode), verify it
  const regBody = await regRes.json();
  if (regBody.verifyToken) {
    await page.request.post(`${apiBase}/auth/verify-email`, {
      data: { token: regBody.verifyToken },
    });
  }

  // Login via UI
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
}

/**
 * Login with existing demo user (requires seed data).
 */
export async function loginDemo(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'demo@wardaya.com');
  await page.fill('input[type="password"]', 'demo1234');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
}
