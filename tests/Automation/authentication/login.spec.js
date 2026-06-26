const { test, expect } = require("@playwright/test");
require("dotenv").config(); // Load environment variables from .env file

const TARGET_URL = "https://vaibquest.netlify.app";

test.describe("Feature: User Login", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page (root URL) before each test.
    await page.goto(TARGET_URL);
    // Wait for a stable element to ensure the page is ready.
    await expect(
      page.getByRole("heading", { name: "Login to VaibQuest" }),
    ).toBeVisible({ timeout: 10000 });
  });

  // Test Case: LOG-01
  test("should handle Successful login", async ({ page }) => {
    await page
      .getByPlaceholder("Enter email")
      .fill(process.env.TEST_EMAIL || "");
    await page
      .getByPlaceholder("Enter password")
      .fill(process.env.TEST_PASSWORD || "");
    await page.getByRole("button", { name: "Login" }).click();

    // Assert redirection to the dashboard and welcome message.
    await expect(page).toHaveURL(`${TARGET_URL}/dashboard`, { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: /Welcome back/ }),
    ).toBeVisible();
  });

  // Test Case: LOG-02
  test("should handle Login with invalid password", async ({ page }) => {
    // This user must exist in the database.
    await page
      .getByPlaceholder("Enter email")
      .fill(process.env.TEST_EMAIL || "");
    await page.getByPlaceholder("Enter password").fill("WrongPassword123");
    await page.getByRole("button", { name: "Login" }).click();

    // Assert that a toast with the error message appears.
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  // Test Case: LOG-03
  test("should handle Login with a non-existent email", async ({ page }) => {
    await page
      .getByPlaceholder("Enter email")
      .fill(`non-existent-user-${Date.now()}@example.com`);
    await page.getByPlaceholder("Enter password").fill("anypassword");
    await page.getByRole("button", { name: "Login" }).click();

    // Assert that a toast with the error message appears.
    await expect(page.getByText("User not found")).toBeVisible();
  });

  test("should show validation error for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();

    // Assert that client-side validation messages are shown.
    await expect(page.getByText("Email address is required.")).toBeVisible();
    await expect(page.getByText("Password is required.")).toBeVisible();
  });
});
