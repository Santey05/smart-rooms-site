import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-конфигурация (CLAUDE.md, раздел 12.1). Сценарий всего один: поиск на
 * главной → переход на /booking → проверка, что параметры и сам модуль
 * Bnovo дошли до места назначения. Полный сценарий оплаты внутри чужого
 * iframe здесь не тестируется — см. раздел 12.1.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
