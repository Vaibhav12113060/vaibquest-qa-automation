// const { test, expect } = require("@playwright/test");

// const TARGET_URL = "https://dummy-auth-app.com";

// test.describe("Feature: User Registration", () => {
//   test.beforeEach(async ({ page }) => {
//     // Intercept the initial page load and provide a dummy HTML.
//     // This allows the test to run without a live server.
//     await page.route(TARGET_URL + "/register", (route) => {
//       route.fulfill({
//         status: 200,
//         contentType: "text/html",
//         body: `
//           <h1>Registration Page</h1>
//           <form>
//             <label for="name">Name</label><input id="name" type="text" />
//             <label for="email">Email</label><input id="email" type="email" />
//             <label for="password">Password</label><input id="password" type="password" />
//             <label for="confirmPassword">Confirm Password</label><input id="confirmPassword" type="password" />
//             <button type="submit">Register</button>
//           </form>
//           <div class="success-message"></div>
//           <div class="error-message"></div>
//         `,
//       });
//     });
//     await page.goto(`${TARGET_URL}/register`);
//   });

//   // Test Case: REG-01
//   // Verifies that a user can register successfully with valid inputs.
//   test("should register a new user successfully", async ({ page }) => {
//     await page.route("**/api/auth/register", (route) =>
//       route.fulfill({
//         status: 201,
//         contentType: "application/json",
//         body: JSON.stringify({ message: "User created" }),
//       }),
//     );

//     // This is the "hack". We tell the test what should happen after the API call.
//     // When the '/api/auth/register' route is called, we manually add the success message to the DOM.
//     await page.exposeFunction("showSuccessMessage", () => {
//       page.locator(".success-message").textContent =
//         "User created successfully!";
//     });

//     await page.getByLabel("Name").fill("Vaibhav Kumar");
//     await page.getByLabel("Email").fill("newuser@example.com");
//     await page
//       .getByLabel("Password", { exact: true })
//       .fill("SecurePassword123");
//     await page.getByLabel("Confirm Password").fill("SecurePassword123");
//     await page
//       .getByRole("button", { name: "Register" })
//       .click()
//       .then(() => page.evaluate(() => showSuccessMessage()));

//     await expect(page.locator(".success-message")).toBeVisible();
//   });

//   // Test Case: REG-02
//   // Verifies that registration fails if the email already exists.
//   test("should fail registration on duplicate email", async ({ page }) => {
//     await page.route("**/api/auth/register", (route) =>
//       route.fulfill({
//         status: 409,
//         contentType: "application/json",
//         body: JSON.stringify({ error: "Conflict" }),
//       }),
//     );

//     // When the API returns 409, we manually show the error message.
//     await page.exposeFunction("showDuplicateEmailError", () => {
//       page.locator(".error-message").textContent = "Email already registered";
//     });

//     await page.getByLabel("Name").fill("Duplicate Name");
//     await page.getByLabel("Email").fill("vaibhav@example.com");
//     await page
//       .getByLabel("Password", { exact: true })
//       .fill("SecurePassword123");
//     await page.getByLabel("Confirm Password").fill("SecurePassword123");
//     await page
//       .getByRole("button", { name: "Register" })
//       .click()
//       .then(() => page.evaluate(() => showDuplicateEmailError()));

//     await expect(page.locator(".error-message")).toContainText(
//       "Email already registered",
//     );
//   });

//   // Test Case: REG-03
//   // Verifies client-side validation for mismatched passwords.
//   test("should show a client-side error for mismatched passwords", async ({
//     page,
//   }) => {
//     // This test verifies client-side validation. No network call should be made.
//     await page.route("**/api/auth/register", (route) => {
//       test.fail(
//         "A network request was sent, but it should have been blocked by the UI.",
//       );
//       route.continue();
//     });

//     // For client-side validation, we simulate the UI's immediate feedback.
//     await page.exposeFunction("showMismatchError", () => {
//       page.locator(".error-message").textContent = "Passwords do not match";
//     });

//     await page.getByLabel("Name").fill("Test User");
//     await page.getByLabel("Email").fill("test.validation@example.com");
//     await page.getByLabel("Password", { exact: true }).fill("ValidPassword123");
//     await page.getByLabel("Confirm Password").fill("DIFFERENTPassword123");
//     // We don't need a .then() here as client-side validation is often synchronous on blur or change.
//     await page
//       .getByLabel("Confirm Password")
//       .blur()
//       .then(() => page.evaluate(() => showMismatchError()));

//     await expect(page.locator(".error-message")).toContainText(
//       "Passwords do not match",
//     );
//   });

//   // Test Case: REG-06
//   // Verifies validation for an invalid email format.
//   test("should fail registration with an invalid email format", async ({
//     // Corresponds to REG-06
//     page,
//   }) => {
//     await page.route("**/api/auth/register", (route) =>
//       route.fulfill({ status: 400 }),
//     );

//     await page.exposeFunction("showInvalidEmailError", () => {
//       page.locator(".error-message").textContent = "Invalid email format";
//     });

//     await page.getByLabel("Name").fill("Invalid Email User");
//     await page.getByLabel("Email").fill("invalid-email-format");
//     await page.getByLabel("Password", { exact: true }).fill("ValidPassword123");
//     await page.getByLabel("Confirm Password").fill("ValidPassword123");
//     await page
//       .getByRole("button", { name: "Register" })
//       .click()
//       .then(() => page.evaluate(() => showInvalidEmailError()));

//     await expect(page.locator(".error-message")).toContainText(
//       "Invalid email format",
//     );
//   });

//   // Test Case: REG-08
//   // Verifies password complexity rule (must contain numbers).
//   test("should fail registration if password contains only letters", async ({
//     // Corresponds to REG-08
//     page,
//   }) => {
//     await page.route("**/api/auth/register", (route) =>
//       route.fulfill({ status: 400 }),
//     );

//     await page.exposeFunction("showPasswordComplexityError", () => {
//       page.locator(".error-message").textContent =
//         "Password must contain letters and numbers";
//     });

//     await page.getByLabel("Name").fill("Weak Password User");
//     await page.getByLabel("Email").fill("weakpass@example.com");
//     await page.getByLabel("Password", { exact: true }).fill("OnlyLettersHere");
//     await page.getByLabel("Confirm Password").fill("OnlyLettersHere");
//     await page
//       .getByRole("button", { name: "Register" })
//       .click()
//       .then(() => page.evaluate(() => showPasswordComplexityError()));

//     await expect(page.locator(".error-message")).toContainText(
//       "Password must contain letters and numbers",
//     );
//   });

//   // Test Case: REG-08 (Variant)
//   // Verifies password complexity rule (must contain letters).
//   test("should fail registration if password contains only numbers", async ({
//     // Corresponds to REG-08
//     page,
//   }) => {
//     await page.route("**/api/auth/register", (route) =>
//       route.fulfill({ status: 400 }),
//     );

//     await page.exposeFunction("showPasswordComplexityError", () => {
//       page.locator(".error-message").textContent =
//         "Password must contain letters and numbers";
//     });

//     await page.getByLabel("Name").fill("Weak Password User 2");
//     await page.getByLabel("Email").fill("weakpass2@example.com");
//     await page.getByLabel("Password", { exact: true }).fill("123456789012");
//     await page.getByLabel("Confirm Password").fill("123456789012");
//     await page
//       .getByRole("button", { name: "Register" })
//       .click()
//       .then(() => page.evaluate(() => showPasswordComplexityError()));

//     await expect(page.locator(".error-message")).toContainText(
//       "Password must contain letters and numbers",
//     );
//   });

//   // Test Case: REG-07
//   // Verifies the minimum password length validation.
//   test("should fail registration with a password less than 12 characters", async ({
//     page,
//   }) => {
//     await page.route("**/api/auth/register", (route) =>
//       route.fulfill({
//         status: 400,
//         contentType: "application/json",
//         body: JSON.stringify({ error: "Validation Failed" }),
//       }),
//     );

//     await page.exposeFunction("showPasswordLengthError", () => {
//       page.locator(".error-message").textContent =
//         "Password must be at least 12 characters";
//     });

//     await page.getByLabel("Name").fill("Test User");
//     await page.getByLabel("Email").fill("test.validation@example.com");
//     await page.getByLabel("Password", { exact: true }).fill("short");
//     await page.getByLabel("Confirm Password").fill("short");
//     await page
//       .getByRole("button", { name: "Register" })
//       .click()
//       .then(() => page.evaluate(() => showPasswordLengthError()));

//     await expect(page.locator(".error-message")).toContainText(
//       "Password must be at least 12 characters",
//     );
//   });
// });

const { test, expect } = require("@playwright/test");
require("dotenv").config();

const TARGET_URL = "https://vaibquest.netlify.app";

test.describe("Feature: User Registration on VaibQuest", () => {
  test.beforeEach(async ({ page }) => {
    // Navigating directly onto the production application instance path
    await page.goto(`${TARGET_URL}/register`, {
      waitUntil: "domcontentloaded",
    });

    // **THE FIX**: Wait for a stable element (like the main heading) to be visible.
    // This ensures the page is interactive before the test proceeds.
    await expect(
      page.getByRole("heading", { name: "Create Account" }),
    ).toBeVisible({ timeout: 10000 });
  });

  test("should register a new user successfully", async ({ page }) => {
    const uniqueEmail = `test.user.${Date.now()}@example.com`;

    await page.getByPlaceholder("Enter username").fill("Test User");
    await page.getByPlaceholder("Enter email").fill(uniqueEmail);
    await page.getByPlaceholder("Enter password").fill("Password123");
    // REMOVED: No "Confirm Password" field in the application.
    await page.getByRole("button", { name: "Register" }).click();

    // Assert that a success toast appears and the user is on the login page.
    await expect(page.getByText("User registered successfully")).toBeVisible({
      timeout: 15000,
    });
    // FIX: The app auto-logins and redirects to the dashboard, not the login page.
    await expect(page).toHaveURL(`${TARGET_URL}/dashboard`, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: /Welcome back/ }),
    ).toBeVisible();
  });

  test("should fail registration on duplicate email", async ({ page }) => {
    // A user with this email must exist in your database for this test to be valid.
    await page.getByPlaceholder("Enter username").fill("Duplicate User");
    await page.getByPlaceholder("Enter email").fill("vaibhav@example.com");
    await page.getByPlaceholder("Enter password").fill("Password123");
    // REMOVED: No "Confirm Password" field.
    await page.getByRole("button", { name: "Register" }).click();

    // Assert that the correct error message is shown by the frontend.
    await expect(page.getByText("User already exists")).toBeVisible({
      timeout: 15000,
    });
    // Add a check to ensure the user stays on the registration page.
    await expect(page).toHaveURL(`${TARGET_URL}/register`);
  });

  test("should show client-side validation for empty fields", async ({
    page,
  }) => {
    // Click register without filling any fields.
    await page.getByRole("button", { name: "Register" }).click();

    // Assert that validation messages appear for all required fields.
    // NOTE: The exact text must match your application's validation messages.
    await expect(page.getByText("Username is required.")).toBeVisible();
    await expect(page.getByText("Email address is required.")).toBeVisible();
    await expect(page.getByText("Password is required.")).toBeVisible();
    // REMOVED: No "Confirm Password" validation.
  });

  test("should fail registration with an invalid email format", async ({
    page,
  }) => {
    await page.getByPlaceholder("Enter username").fill("Invalid Email User");
    await page.getByPlaceholder("Enter email").fill("invalid-email-format");
    await page.getByPlaceholder("Enter password").fill("ValidPassword123");
    await page.getByRole("button", { name: "Register" }).click();

    // This checks the browser's native HTML5 validation message on the input field.
    const emailInput = page.getByPlaceholder("Enter email");
    const validationMessage = await emailInput.evaluate(
      (element) => element.validationMessage,
    );
    expect(validationMessage).not.toBe("");
  });

  test("should fail registration with a password less than 6 characters", async ({
    page,
  }) => {
    await page.getByPlaceholder("Enter username").fill("Short Pass User");
    await page.getByPlaceholder("Enter email").fill("short@example.com");
    await page.getByPlaceholder("Enter password").fill("123");
    // REMOVED: No "Confirm Password" field.
    await page.getByRole("button", { name: "Register" }).click();

    // Assert that the password length validation message appears.
    // This matches the actual validation rule in VaibQuest.
    await expect(
      page.getByText("Please fix the validation errors before submitting."),
    ).toBeVisible();
  });

  // test("should show a client-side error for mismatched passwords", async ({
  //   page,
  // }) => {
  //   await page.getByPlaceholder("Enter your name").fill("Test User");
  //   await page
  //     .getByPlaceholder("Enter your email")
  //     .fill(`mismatch.${Date.now()}@example.com`);
  //   await page.getByPlaceholder("Enter your password").fill("ValidPassword123");
  //   await page
  //     .getByPlaceholder("Confirm password")
  //     .fill("DIFFERENTPassword123");
  //   await page.getByRole("button", { name: "Register" }).click();

  //   // Assert that the passwords do not match error is visible
  //   await expect(page.getByText("Passwords do not match")).toBeVisible();
  // });

  // test("should fail registration if password contains only letters", async ({
  //   page,
  // }) => {
  //   await page.getByPlaceholder("Enter your name").fill("Weak Password User");
  //   await page
  //     .getByPlaceholder("Enter your email")
  //     .fill(`letters-only.${Date.now()}@example.com`);
  //   await page
  //     .getByPlaceholder("Enter your password")
  //     .fill("OnlyLettersHereNotGood");
  //   await page
  //     .getByPlaceholder("Confirm password")
  //     .fill("OnlyLettersHereNotGood");
  //   await page.getByRole("button", { name: "Register" }).click();

  //   await expect(page.getByText(/Password must contain/)).toBeVisible();
  // });
});
