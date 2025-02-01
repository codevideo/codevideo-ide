import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    ctPort: 3100,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    }
  },
  snapshotDir: './tests/snapshots'
});