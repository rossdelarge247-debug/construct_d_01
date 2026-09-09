import { expect, type Page, type APIRequestContext, type Locator } from '@playwright/test';
import path from 'node:path';

export const OUT = path.resolve('tests/e2e/.bar');
export const APP = 'http://localhost:3000';
export const CANVAS = 'http://127.0.0.1:3100/' + encodeURIComponent('Mobile Screens v2 - Standalone.html');
// The canvas draws every artboard at this screen size (FRAME_W × FRAME_H in its source).
export const SCREEN = { width: 402, height: 874 };

export interface CanvasScreen {
  /** `window.M_*` global the decoded canvas exposes for the artboard. */
  screen: string;
  /** App route whose @font-face rules are shared with the canvas. */
  appRoute: string;
  /** Text that proves the screen mounted. */
  readyText: RegExp;
}

async function appFontFaces(page: Page, appRoute: string): Promise<string> {
  await page.goto(`${APP}${appRoute}`, { waitUntil: 'networkidle' });
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

/**
 * Mounts one canvas screen component on its own at 402×874 and returns its host locator.
 * The editor wraps every artboard in a device bezel inside a pan/zoom viewport — a giveaway in a
 * blind comparison — so the component is rendered bare instead.
 */
export async function mountCanvasScreen(
  page: Page,
  request: APIRequestContext,
  { screen, appRoute, readyText }: CanvasScreen,
): Promise<Locator> {
  const fonts = await appFontFaces(page, appRoute);
  await page.route(/cdn\.tailwindcss\.com/, (r) =>
    r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
  await shareAppFonts(page, request, fonts);
  await page.setViewportSize(SCREEN);
  await page.goto(CANVAS, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    (name) => typeof (window as never as Record<string, unknown>)[name] === 'function',
    screen,
    { timeout: 120_000 },
  );

  await page.evaluate(
    ({ width, height, name }) => {
      const w = window as never as Record<string, unknown> & {
        React: { createElement: (c: unknown) => unknown };
        ReactDOM: { createRoot?: (el: Element) => { render: (n: unknown) => void }; render?: (n: unknown, el: Element) => void };
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
      const node = w.React.createElement(w[name]);
      if (w.ReactDOM.createRoot) w.ReactDOM.createRoot(host).render(node);
      else w.ReactDOM.render?.(node, host);
    },
    { ...SCREEN, name: screen },
  );

  const host = page.locator('#bar-host');
  await expect(host.getByText(readyText)).toBeVisible({ timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  expect(await interLoaded(page), 'canvas side must render in the app’s Inter, not a system fallback').toBe(true);
  return host;
}

/** Captures an app route bare at 402×874 with the harness chrome hidden. */
export async function captureRendered(page: Page, appRoute: string, file: string) {
  await page.setViewportSize(SCREEN);
  await page.goto(appRoute);
  // EnvBanner (root layout) and Next's dev-tools indicator are harness chrome, not design — and
  // giveaways in a blind pick.
  await page.addStyleTag({
    content: '[role="region"][aria-label="Dev mode banner"],nextjs-portal{display:none !important}',
  });
  await page.evaluate(() => document.fonts.ready);
  expect(await interLoaded(page), 'rendered side must have Inter loaded').toBe(true);
  await page.screenshot({ path: file });
}

export function interLoaded(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    Array.from(document.fonts).some((f) => f.family.replace(/["']/g, '') === 'Inter' && f.status === 'loaded'),
  );
}
