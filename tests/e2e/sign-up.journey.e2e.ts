import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SIGN_UP = '/dev/proto/sign-up';
const WELCOME_TOUR = /\/dev\/proto\/welcome-tour/;

async function fillValid(page: Page) {
  await page.getByLabel(/full name/i).fill('Sarah Harris');
  await page.getByLabel(/^email/i).fill('sarah.harris@example.com');
  await page.getByLabel(/create password/i).fill('correct-horse-battery');
  await page.getByRole('checkbox', { name: /terms/i }).check();
}

test.describe('Sign-up · behaviour bar', () => {
  test('renders the canvas structure', async ({ page }) => {
    await page.goto(SIGN_UP);

    await expect(page.getByText(/have an account/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /start your case/i })).toBeVisible();
    await expect(page.getByText(/free until you.re ready to share/i)).toBeVisible();

    for (const step of ['Account', 'About you', 'Pay']) {
      await expect(page.getByText(step, { exact: true })).toBeVisible();
    }

    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/^email/i)).toBeVisible();
    await expect(page.getByLabel(/create password/i)).toHaveAttribute('type', 'password');
    await expect(page.getByText(/min 12 characters/i)).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /terms/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
    await expect(page.getByText(/your account is yours/i)).toBeVisible();
  });

  test('empty submit stays on the page and announces an error', async ({ page }) => {
    await page.goto(SIGN_UP);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(/sign-up/);
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('password under 12 characters is rejected', async ({ page }) => {
    await page.goto(SIGN_UP);
    await fillValid(page);
    await page.getByLabel(/create password/i).fill('short-pw');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(/sign-up/);
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('valid details hand off to welcome-tour', async ({ page }) => {
    await page.goto(SIGN_UP);
    await fillValid(page);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL(WELCOME_TOUR);
  });

  test('keyboard-only: tab order visits every control, Enter submits', async ({ page }) => {
    await page.goto(SIGN_UP);
    const order = [/full name/i, /^email/i, /create password/i, /terms/i, /create account/i];
    await page.getByLabel(/full name/i).focus();
    for (let i = 1; i < order.length; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const name = (await focused.getAttribute('aria-label'))
        ?? (await focused.evaluate((el) => (el as HTMLElement).innerText || (el as HTMLInputElement).labels?.[0]?.innerText || ''));
      expect(name, `tab stop ${i}`).toMatch(order[i]);
    }
    await fillValid(page);
    await page.getByLabel(/create password/i).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(WELCOME_TOUR);
  });

  test('no horizontal overflow at 375px', async ({ page }) => {
    await page.goto(SIGN_UP);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });

  test('a11y floor: zero serious/critical axe violations', async ({ page }) => {
    await page.goto(SIGN_UP);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
