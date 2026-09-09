import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import path from 'node:path';

const OUT = path.resolve('tests/e2e/.bar');
const APP = 'http://localhost:3000';
const CANVAS = 'http://127.0.0.1:3100/' + encodeURIComponent('Mobile Screens v2 - Standalone.html');
// The canvas draws every artboard at this screen size (FRAME_W × FRAME_H in its source).
const SCREEN = { width: 402, height: 874 };

async function appFontFaces(page: Page): Promise<string> {
  await page.goto(`${APP}/dev/proto/sign-up`, { waitUntil: 'networkidle' });
  return page.evaluate(() => {
    const rules: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let list: CSSRuleList;
      try {
        list = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of Array.from(list)) {
        if (rule instanceof CSSFontFaceRule) rules.push(rule.cssText);
      }
    }
    return rules.join('\n');
  });
}

// Headless Chromium has no egress here, so the canvas cannot reach Google Fonts. Serving the app's
// own Inter to it keeps the blind pick about the design rather than about font-family.
async function shareAppFonts(page: Page, request: APIRequestContext, fontFaces: string) {
  // next/font emits src URLs relative to its CSS chunk dir (/_next/static/chunks/).
  const css = fontFaces
    .replace(/font-family:\s*["']?__Inter[^;"']*["']?/g, 'font-family: Inter')
    .replace(/url\((["']?)\.\.\/media\//g, `url($1${APP}/_next/static/media/`)
    .replace(/url\((["']?)\/_next\//g, `url($1${APP}/_next/`);
  await page.route(/fonts\.googleapis\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: css }));
  await page.route(/fonts\.gstatic\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.route(`${APP}/_next/static/media/**`, async (r) => {
    const res = await request.get(r.request().url());
    await r.fulfill({
      status: res.status(),
      body: await res.body(),
      headers: {
        'content-type': res.headers()['content-type'] ?? 'font/woff2',
        'access-control-allow-origin': '*',
      },
    });
  });
}

test.describe('Sign-up · visual bar capture', () => {
  test('canvas screen: M_SignUp mounted bare at 402x874', async ({ page, request }) => {
    test.setTimeout(180_000);
    const fonts = await appFontFaces(page);
    await page.route(/cdn\.tailwindcss\.com/, (r) =>
      r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
    );
    await shareAppFonts(page, request, fonts);
    await page.setViewportSize(SCREEN);
    await page.goto(CANVAS, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof (window as never as { M_SignUp?: unknown }).M_SignUp === 'function', null, {
      timeout: 120_000,
    });

    // The editor wraps every artboard in a device bezel inside a pan/zoom viewport — a giveaway in a
    // blind comparison. Mounting the screen component on its own yields a bare screen instead.
    await page.evaluate(({ width, height }) => {
      const w = window as never as {
        React: { createElement: (c: unknown) => unknown };
        ReactDOM: { createRoot?: (el: Element) => { render: (n: unknown) => void }; render?: (n: unknown, el: Element) => void };
        M_SignUp: unknown;
      };
      const root = document.getElementById('root');
      if (root) root.style.display = 'none';
      const host = document.createElement('div');
      host.id = 'bar-host';
      Object.assign(host.style, {
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        position: 'fixed',
        top: '0',
        left: '0',
        background: '#fff',
      });
      document.body.appendChild(host);
      const node = w.React.createElement(w.M_SignUp);
      if (w.ReactDOM.createRoot) w.ReactDOM.createRoot(host).render(node);
      else w.ReactDOM.render?.(node, host);
    }, SCREEN);

    const host = page.locator('#bar-host');
    await expect(host.getByText(/start your case/i)).toBeVisible({ timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    expect(await interLoaded(page), 'canvas side must render in the app’s Inter, not a system fallback').toBe(true);
    await host.screenshot({ path: path.join(OUT, 'm-signup.canvas.png') });
  });

  test('rendered /dev/proto/sign-up at 402x874', async ({ page }) => {
    await page.setViewportSize(SCREEN);
    await page.goto('/dev/proto/sign-up');
    // EnvBanner (root layout) and Next's dev-tools indicator are harness chrome, not design — and
    // giveaways in a blind pick.
    await page.addStyleTag({
      content:
        '[role="region"][aria-label="Dev mode banner"],nextjs-portal{display:none !important}',
    });
    await page.evaluate(() => document.fonts.ready);
    expect(await interLoaded(page), 'rendered side must have Inter loaded').toBe(true);
    await page.screenshot({ path: path.join(OUT, 'm-signup.rendered.png') });
  });
});

function interLoaded(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    Array.from(document.fonts).some((f) => f.family.replace(/["']/g, '') === 'Inter' && f.status === 'loaded'),
  );
}
