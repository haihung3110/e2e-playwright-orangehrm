import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env.js';
import { runtime } from './src/config/runtime.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: runtime.fullyParallel,
  forbidOnly: Boolean(process.env.CI),
  retries: runtime.retries,
  workers: runtime.workers,
  reporter: [['html', { open: 'never' }], ['./src/reporters/TerminalReporter.ts']],
  use: {
    baseURL: env.baseUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: runtime.headless,
    trace: env.retainTrace ? 'on' : 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
