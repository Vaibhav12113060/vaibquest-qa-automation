const { test, expect } = require("@playwright/test");
require("dotenv").config(); // Load environment variables from .env file

// Use the real, deployed application URL
const TARGET_URL = "https://vaibquest.netlify.app";

test.describe("Feature: Authorization & JWT Security", () => {
  // Test Case: AUTH-01 (Corresponds to "Access dashboard without login (redirect)")
  // Verifies that a user who is not logged in is redirected from a protected route.
  test("should redirect to login when accessing dashboard without login", async ({
    page,
  }) => {
    // Attempt to go directly to the protected dashboard page
    await page.goto(`${TARGET_URL}/dashboard`);

    // Assert that the page was redirected to the login page
    // We wait for the URL to become the login page's URL.
    await expect(page).toHaveURL(TARGET_URL, { timeout: 15000 }); // Redirects to root (/) which is the Login page

    // Optional: Assert that a login form is visible to be extra sure
    await expect(
      page.getByRole("heading", { name: "Login to VaibQuest" }),
    ).toBeVisible();
  });

  // Test Case: AUTH-03
  // Verifies that a tampered/expired JWT results in forced logout.
  test("should log out user if JWT is tampered", async ({ page }) => {
    // Step 1: Perform a real login to get a valid token.
    // NOTE: This requires a valid, registered user in your database.
    // Using a valid test user.
    await page.goto(TARGET_URL);
    await page
      .getByPlaceholder("Enter email")
      .fill(process.env.TEST_EMAIL || "");
    await page
      .getByPlaceholder("Enter password")
      .fill(process.env.TEST_PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for navigation to the dashboard to confirm login was successful.
    await expect(page).toHaveURL(`${TARGET_URL}/dashboard`);

    // Step 2: Tamper with the JWT in localStorage.
    await page.evaluate(() => {
      const token = localStorage.getItem("token");
      const tamperedToken = "tampered" + token;
      localStorage.setItem("token", tamperedToken);
    });

    // Step 3: Refresh the page. The app's internal state will now have a bad token.
    await page.reload();

    // Step 4: Perform an action that requires authentication, like logging out.
    // The app's logic should catch the invalid token and force a redirect to the login page.
    await page.getByRole("button", { name: "Logout" }).click();

    // Assert that the user is now on the login page.
    await expect(page).toHaveURL(TARGET_URL);
  });

  // Group tests that require a logged-in 'USER'
  test.describe("when logged in as a normal user", () => {
    test.beforeEach(async ({ page }) => {
      // This block performs a real login before each test in this group.
      // Use credentials for a standard, non-admin user.
      await page.goto(TARGET_URL);
      await page
        .getByPlaceholder("Enter email")
        .fill(process.env.TEST_EMAIL || "");
      await page
        .getByPlaceholder("Enter password")
        .fill(process.env.TEST_PASSWORD);
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(`${TARGET_URL}/dashboard`);
    });

    // Test Case: RBAC Negative
    // Verifies that a normal user cannot access a UI route reserved for admins.
    test("should be prevented from accessing the admin UI page", async ({
      page,
    }) => {
      // Attempt to navigate to the admin page
      await page.goto(`${TARGET_URL}/admin`);

      // The application redirects non-admin users away from the /admin route.
      // We assert that the user is sent back to the dashboard.
      await expect(page).toHaveURL(`${TARGET_URL}/dashboard`, {
        timeout: 10000,
      });
      // And we can verify a key element of the dashboard is visible.
      await expect(
        page.getByRole("heading", { name: /Welcome back/ }),
      ).toBeVisible();
    });
  });

  // Group tests that require a logged-in 'ADMIN'
  test.describe("when logged in as an admin user", () => {
    test.beforeEach(async ({ page }) => {
      // This block performs a real login for an ADMIN user.
      // Replace with credentials for a real admin user in your database.
      await page.goto(TARGET_URL);
      await page
        .getByPlaceholder("Enter email")
        .fill(process.env.ADMIN_EMAIL || "");
      await page
        .getByPlaceholder("Enter password")
        .fill(process.env.ADMIN_PASSWORD);
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(`${TARGET_URL}/dashboard`);
    });

    // Test Case: RBAC Positive
    // Verifies that a user with an 'ADMIN' role CAN access the admin page.
    test("should be allowed to access the admin page", async ({ page }) => {
      await page.goto(`${TARGET_URL}/admin`);

      // Assert that the URL is the admin page and a key element is visible.
      await expect(page).toHaveURL(`${TARGET_URL}/admin`);
      await expect(
        page.getByRole("heading", { name: "Admin Dashboard" }),
      ).toBeVisible();
    });
  });
});
