const { test, expect } = require("@playwright/test");

test("Google test", async ({ page }) => {
  await page.goto("https://Google.com");
  await expect(page).toHaveTitle("Google");
});
