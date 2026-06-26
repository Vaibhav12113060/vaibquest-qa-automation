# Playwright Test Automation Assignment

This repository contains an end-to-end test automation suite for a user authentication and authorization system, built with Playwright. The suite is designed to validate the functionality of a live web application, covering registration, login, and JWT-based authorization flows.

---

## Project Structure

The project is organized to separate test code, documentation, and configuration, ensuring clarity and maintainability.

```
Playwright_Assignment/
├── Evidence/
│   ├── CompleteTestReport.png
│   ├── LoginTestSteps.png
│   ├── ValidateTokenSteps.png
│   └── setup-notes.md
├── node_modules/
├── tests/
│   └── Automation/
│       ├── authentication/
│       │   ├── login.spec.js
│       │   └── registration.spec.js
│       ├── authorization.spec.js
│       ├── example.spec.js
│       └── test1.spec.js
├── .env                # Stores confidential test data (e.g., user credentials)
├── .gitignore
├── Assumptions.md      # Documents assumptions made during test implementation
├── BoundaryCases.md    # Outlines boundary value analysis test cases
├── ManualTestCases.md  # Details the manual test case specifications
├── package-lock.json
├── package.json
├── playwright.config.js # Main configuration file for Playwright
└── README.md            # This file
```

### Key Directories & Files

- **`/tests/Automation/authentication/`**: Contains the core test scripts for `login`, `registration`, and `authorization` features.
- **`/Evidence/`**: Stores all project documentation and visual proof, including test reports and setup guides.
- **`ManualTestCases.md`**: Provides a detailed breakdown of the manual test cases that form the basis for the automation scripts.
- **`playwright.config.js`**: Configures browsers, test execution settings, and reporters.
- **`.env`**: A crucial file for storing environment-specific variables like test user credentials. It is excluded from version control for security.

---

## Test Suite Execution Report

The following screenshot provides a complete overview of the test suite execution, showing all 48 tests passing across three major browsers (Chromium, Firefox, and WebKit).

### Complete Test Run Summary

!CompleteTestReport

---

## Detailed Test Steps

The following images show the detailed steps executed within individual tests, providing a granular view of the test logic and assertions.

### Login Test Steps

This report details the sequence of actions for a successful user login, from filling credentials to verifying the dashboard redirection.

!LoginTestSteps

### JWT Tampering Test (Token Validation)

This report illustrates the security test case for validating JWT integrity. It shows the steps to log in, tamper with the token in local storage, and verify that the application forces a logout upon detecting the invalid token.

!TokenValidationSteps
