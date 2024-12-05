import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  workers: 1,

  reporter: [['line']],

  // use: {
  //   /* Base URL to use in actions like `await page.goto('/')`. */
  //   baseURL: 'http://localhost:3001/',
  // },

  // webServer: {
  //   // TODO: build && start seems broken, use that if it's working
  //   command: 'pnpm run dev',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: !process.env.CI,
  //   stdout: 'pipe',
  // },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
