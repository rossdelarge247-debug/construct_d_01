import { test } from '@playwright/test';
import path from 'node:path';
import { OUT, captureRendered, mountCanvasScreen } from './helpers/canvas-capture';

test.describe('Sign-in · visual bar capture', () => {
  test('canvas screen: M_SignIn mounted bare at 402x874', async ({ page, request }) => {
    test.setTimeout(180_000);
    const host = await mountCanvasScreen(page, request, {
      screen: 'M_SignIn',
      appRoute: '/dev/proto/sign-in',
      readyText: /welcome back/i,
    });
    await host.screenshot({ path: path.join(OUT, 'm-signin.canvas.png') });
  });

  test('rendered /dev/proto/sign-in at 402x874', async ({ page }) => {
    await captureRendered(page, '/dev/proto/sign-in', path.join(OUT, 'm-signin.rendered.png'));
  });
});
