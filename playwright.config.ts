import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.e2e.ts',
  outputDir: 'tests/e2e/.results',
  timeout: 45_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 375, height: 667 },
    trace: 'retain-on-failure',
    // Sandbox pre-installs Chromium 1194; Playwright 1.63 expects 1243 and cannot download here.
    launchOptions: { executablePath: '/opt/pw-browsers/chromium' },
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000/dev/proto',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      // The decoded canvas fetches its own state JSON at boot; Chromium blocks that over file://.
      command:
        'python3 -m http.server 3100 --bind 127.0.0.1 --directory "docs/design-source/mobile-screens-v2/decoded"',
      url: 'http://127.0.0.1:3100/',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
