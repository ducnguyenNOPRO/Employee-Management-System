import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",

  // Reporter configuration
  reporter: [["html"], ["list"], ["github"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Run both FE and BE using concurrently
  webServer: {
    command: "cd ../../ && bun run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
