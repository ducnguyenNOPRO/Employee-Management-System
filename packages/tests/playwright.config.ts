import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./",

  // Crucial config: global setup
  // globalSetup: require.resolve("./global-setup.ts"),

  // Reporter configuration
  reporter: [["html"], ["list"], ["github"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
    video: "on-first-retry",

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

  webServer: {
    command: "cd ../server && bun run dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
