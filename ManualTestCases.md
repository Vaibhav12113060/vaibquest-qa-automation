# Manual Test Cases - User Authentication & Authorization (JWT)

## 1. User Registration (REG)

### REG-01: Valid Registration Flow (Positive)

- **Priority:** High
- **Preconditions:** Registration page is loaded. The email "fresh.user@example.com" does not exist in the database.
- **Steps:**
  1. Input Name: "Vaibhav Kumar"
  2. Input Email: "fresh.user@example.com"
  3. Input Password: "Password1234"
  4. (If applicable) Input Confirm Password: "Password1234"
  5. Click "Register".
- **Expected Result:** API returns 201 Created. UI shows success toast/alert, and user is routed to the login page.
- **Note:** The actual application provides an enhanced UX by auto-logging the user in and redirecting to `/dashboard`. The automation script validates this implemented behavior.

### REG-02: Registration with Existing Email (Negative)

- **Priority:** High
- **Preconditions:** The email "vaibhav@example.com" is already registered in the database.
- **Steps:**
  1. Fill form with Name: "Amit", Password/Confirm: "SecurePass123"
  2. Input Email: "vaibhav@example.com"
  3. Click "Register".
- **Expected Result:** API returns 409 Conflict. UI displays "Email already registered."

### REG-03: Mismatched Passwords

- **Priority:** High
- **Steps:** Fill valid fields, but put "Password1234" in Password and "DiffPassword12" in Confirm Password. Click Register.
- **Expected Result:** UI stops the form submission instantly. Error message shows: "Passwords do not match." No network call hits the server.
- **Automation Status:** Not Applicable. The registration form in the target application does not have a "Confirm Password" field.

### REG-04: Name Field Below Minimum Length

- **Priority:** Medium
- **Steps:** Enter Name: "Dev" (4 characters), fill other fields with valid data, click Register.
- **Expected Result:** Form validation fails. Error shows: "Name must be between 5 and 24 characters."

### REG-05: Name Field Exceeding Maximum Length

- **Priority:** Medium
- **Steps:** Enter Name with 25 characters ("Abcdefghijklmnopqrstuvwxy"), fill other fields validly, click Register.
- **Expected Result:** Form blocks submission or backend catches it with 400 Bad Request. Error: "Name must be between 5 and 24 characters."

### REG-06: Invalid Email Formatting

- **Priority:** High
- **Steps:** Test with invalid email formats like "vaibhav@", "vaibhav.com", and "@example.com". Click Register.
- **Expected Result:** Client-side or server-side validation blocks submission. Error: "Invalid email format."

### REG-07: Password Below Minimum Length

- **Priority:** High
- **Steps:** Enter Password: "Short1" (6 characters), match Confirm Password, fill other fields validly. Click Register.
- **Expected Result:** System blocks request. Error: "Password must be at least 12 characters long."
- **Note:** The application's actual validation rule is a minimum of 6 characters. The automated test validates against this 6-character rule.

### REG-08: Password Missing Numeric Characters

- **Priority:** High
- **Steps:** Enter Password: "JustLettersOnly" (No digits included, length > 12). Click Register.
- **Expected Result:** Validation failure. Error: "Password must contain both letters and numbers."
- **Automation Status:** Not Applicable. The application does not enforce a letter/number complexity rule.

### REG-09: Email Case Insensitivity Transformation

- **Priority:** Medium
- **Preconditions:** "vaibhav@example.com" exists in DB.
- **Steps:** Attempt to register a new user with the email: "VAIBHAV@EXAMPLE.COM" (uppercase).
- **Expected Result:** Backend normalizes email to lowercase, triggers uniqueness check, and returns 409 Conflict.

### REG-10: SQL Injection Attempt in Inputs

- **Priority:** High
- **Steps:** Input Name as `John'; DROP TABLE Users;--` and Email as `test@ex.com' OR '1'='1`. Click Register.
- **Expected Result:** Input is either sanitized by backend or cleanly rejected. Application does not crash.
- **Note:** This is a security test case. The primary check is for application stability and graceful error handling.

### REG-11: XSS Script Injection

- **Priority:** High
- **Steps:** Input Name as `<script>alert('xss')</script>`. Finish registration process.
- **Expected Result:** Script characters are HTML-encoded when displayed on the frontend (e.g., on the dashboard) and do not execute in the browser.

### REG-12: API Rate Limiting Check

- **Priority:** High
- **Steps:** Use an API client or script to fire 11 registration requests rapidly from the same IP within an hour.
- **Expected Result:** The 11th request receives HTTP 429 Too Many Requests status code.

### REG-13: Simultaneous Concurrent Registration (Conceptual)

- **Priority:** High
- **Steps:** Two parallel requests submit the exact same email "speedy@example.com" at the identical millisecond.
- **Expected Result:** The database's unique constraint ensures only one request succeeds (201 Created), while the other fails (409 Conflict).

---

## 2. User Login (LOG)

### LOG-01: Valid Login (Positive)

- **Priority:** High
- **Preconditions:** "vaibhav@example.com" is registered.
- **Steps:** Enter Email: "vaibhav@example.com", Password: "VaibPass1234", click Login.
- **Expected Result:** API returns 200 OK along with a valid JWT. User is redirected to `/dashboard`.

### LOG-02: Login with Incorrect Password

- **Priority:** High
- **Steps:** Enter valid Email but wrong Password: "WrongPassword1", click Login.
- **Expected Result:** API returns 401 Unauthorized. UI displays: "Invalid email or password."

### LOG-03: Login with Unregistered Email

- **Priority:** High
- **Steps:** Enter "ghost@example.com", any password, click Login.
- **Expected Result:** API returns 401 Unauthorized. UI shows generic error to prevent email enumeration.

### LOG-04: HTML Injection in Login Inputs

- **Priority:** Medium
- **Steps:** Enter Email: `<h1>test</h1>@example.com`, click Login.
- **Expected Result:** Request fails with 401 or 400. Raw HTML does not render visually on screen.

---

## 3. Dashboard & JWT Security (AUTH)

### AUTH-01: Unauthenticated Dashboard Access

- **Priority:** High
- **Preconditions:** Browser storage is clean (no JWT stored).
- **Steps:** Manually type and open URL: `https://dummy-auth-app.com/dashboard`.
- **Expected Result:** Frontend route guard intercepts request, blocks access, and forces a redirect to `/login`.

### AUTH-02: Session Information Verification

- **Priority:** High
- **Preconditions:** Logged in successfully as "vaibhav@example.com".
- **Steps:** Check the profile/dashboard header details.
- **Expected Result:** Dashboard successfully decodes the JWT payload to display the active email "vaibhav@example.com" and route name.

### AUTH-03: Tampered Token Rejection

- **Priority:** High
- **Preconditions:** Logged in.
- **Steps:** Open browser dev tools, manually change a character of the JWT in `localStorage`, refresh page.
- **Expected Result:** Backend validation catches the bad signature, responds with 401, and frontend wipes storage and boots user to `/login`.
