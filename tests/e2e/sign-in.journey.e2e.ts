import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SIGN_IN = '/dev/proto/sign-in';
const DASHBOARD = /\/dev\/proto\/post-connect-dashboard/;

async function fillValid(page: Page) {
  await page.getByLabel(/^email/i).fill('sarah.harris@example.com');
  await page.getByLabel(/^password/i).fill('correct-horse-battery');
}

test.describe('Sign-in · behaviour bar', () => {
  test('renders the canvas structure, password model only', async ({ page }) => {
    await page.goto(SIGN_IN);

    await expect(page.getByRole('link', { name: /need an account/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByText(/pick up where you left off/i)).toBeVisible();

    await expect(page.getByLabel(/^email/i)).toHaveValue(/@/);
    await expect(page.getByLabel(/^password/i)).toHaveAttribute('type', 'password');
    await expect(page.getByRole('button', { name: /forgot/i })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /remember this device/i })).toBeChecked();
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /start your case/i })).toBeVisible();

    // Decision B: the canvas's Google and passkey affordances stay out, matching sign-up.
    await expect(page.getByText(/continue with google|passkey/i)).toHaveCount(0);
  });

  test('remember-device row: native-scale box inside a 44px hit area', async ({ page }) => {
    await page.goto(SIGN_IN);
    const box = page.getByRole('checkbox', { name: /remember this device/i });
    const metrics = await box.evaluate((el) => {
      const cs = getComputedStyle(el);
      const row = el.closest('label')!.getBoundingClientRect();
      return { size: el.getBoundingClientRect().width, radius: parseFloat(cs.borderRadius), rowHeight: row.height };
    });
    expect(metrics.size).toBeLessThanOrEqual(16);
    expect(metrics.radius).toBeLessThanOrEqual(3);
    expect(metrics.rowHeight).toBeGreaterThanOrEqual(44);
  });

  test('empty password submit stays on the page and announces an error', async ({ page }) => {
    await page.goto(SIGN_IN);
    await page.getByLabel(/^password/i).fill('');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeFocused();
  });

  test('malformed email is rejected', async ({ page }) => {
    await page.goto(SIGN_IN);
    await fillValid(page);
    await page.getByLabel(/^email/i).fill('sarah.harris');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('valid details hand off to the dashboard', async ({ page }) => {
    await page.goto(SIGN_IN);
    await fillValid(page);
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(DASHBOARD);
  });

  test('forgot password explains what happens next without leaving the page', async ({ page }) => {
    await page.goto(SIGN_IN);
    await page.getByRole('button', { name: /forgot/i }).click();
    await expect(page.getByRole('status')).toContainText(/reset link/i);
    await expect(page).toHaveURL(/sign-in/);
  });

  test('keyboard-only: tab order visits every control, Enter submits', async ({ page }) => {
    await page.goto(SIGN_IN);
    const order = [/^email/i, /forgot/i, /^password/i, /remember this device/i, /^sign in$/i];
    await page.getByLabel(/^email/i).focus();
    for (let i = 1; i < order.length; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const name = (await focused.getAttribute('aria-label'))
        ?? (await focused.evaluate((el) => (el as HTMLElement).innerText || (el as HTMLInputElement).labels?.[0]?.innerText || ''));
      expect(name, `tab stop ${i}`).toMatch(order[i]);
    }
    await fillValid(page);
    await page.getByLabel(/^password/i).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(DASHBOARD);
  });

  test('no horizontal overflow at 375px', async ({ page }) => {
    await page.goto(SIGN_IN);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });

  test('a11y floor: zero serious/critical axe violations, before and after an invalid submit', async ({ page }) => {
    await page.goto(SIGN_IN);
    const before = await new AxeBuilder({ page }).analyze();
    await page.getByLabel(/^password/i).fill('');
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    const after = await new AxeBuilder({ page }).analyze();
    const blocking = [...before.violations, ...after.violations].filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
