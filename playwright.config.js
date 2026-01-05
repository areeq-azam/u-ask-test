const { defineConfig, devices } = require('@playwright/test');
const config = require('./config');

/**
 * Playwright configuration for cross-browser testing
 */

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: config.viewport,
    actionTimeout: config.timeouts.action,
    navigationTimeout: config.timeouts.navigation,
    // Add stealth options to avoid captcha detection
    locale: 'en-US',
    timezoneId: 'America/New_York',
    // Reduce automation detection
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

