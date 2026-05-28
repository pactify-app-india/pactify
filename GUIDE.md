# Login System — Developer Guide

A reference for anyone working on this project. Covers what is inside each file, what is fixed, what can be changed, and what must be added before going to production.

---

## Project Structure

```
project-root/
  login.html          ← Entry point. The login page.
  dashboard.html      ← Where the user lands after login (create this).
  js/
    config.js         ← Central configuration. Edit this first.
    auth.js           ← Authentication logic (validate, login, session).
    login.js          ← UI logic for login.html only.
```

---

## File-by-File Breakdown

### `login.html`

| Element | What it does | Can be changed? |
|---|---|---|
| `<form id="loginForm">` | The login form container | Yes — add fields if needed |
| `<input id="username">` | Username field | Yes — change type to `email` if using email login |
| `<input id="password">` | Password field | Yes |
| `<div id="errorMsg">` | Shows validation errors inline | Yes — restyle freely |
| `<button id="submitBtn">` | Submit button | Yes |
| `<script src="./js/config.js">` | Loads config first | Do not remove or reorder |
| `<script src="./js/auth.js">` | Loads auth second | Do not remove or reorder |
| `<script src="./js/login.js">` | Loads page logic last | Do not remove or reorder |

**Script load order is mandatory.**

---

### `js/config.js`

| Key | What it is | Change it? |
|---|---|---|
| `appName` | Display name of app | Yes |
| `appVersion` | Version string | Yes |
| `baseURL` | Your backend or Firebase URL | **Yes — required before production** |
| `routes.loginPage` | Path to login page | Yes if you rename login.html |
| `routes.dashboardPage` | Redirect target after login | **Yes — must match your real page** |
| `routes.errorPage` | Redirect target on critical error | Yes |
| `sessionTimeout` | Auto-logout delay in milliseconds | Yes — 1800000 = 30 min |
| `enableLogging` | Console logs on/off | **Set to `false` in production** |

---

### `js/auth.js`

| Function | What it does | Change it? |
|---|---|---|
| `validateInput()` | Checks for empty fields and password length | Yes |
| `login()` | Sends credentials to backend | **Yes — replace mock with real API** |
| `saveSession()` | Stores token in memory, starts auto-logout | Yes |
| `clearSession()` | Wipes the in-memory token | No |
| `isAuthenticated()` | Returns true if session token exists | Yes |

---

### `js/login.js`

| Block | What it does | Change it? |
|---|---|---|
| `DOMContentLoaded` listener | Waits for page to fully load | No |
| `showError / clearError` | Displays and hides error message | Yes |
| `form submit` handler | Runs the full login flow | Yes |
| `submitBtn.disabled` | Prevents double-submit | No |
| `window.location.href` | Redirects on success | Change destination in config.js |

---

## What Must Be Added Before Production

| Item | Priority |
|---|---|
| Replace mock login in `auth.js` with real API call | **Critical** |
| Set `enableLogging: false` in `config.js` | **Critical** |
| Add HTTPS to `baseURL` | **Critical** |
| Create `dashboard.html` | **Required** |
| Add rate limiting on backend | **Required** |
| Replace in-memory session with HttpOnly cookies | **Recommended** |
| Add password visibility toggle | Recommended |
| Add CSRF protection | Recommended |

---

## Dependency Map

```
login.html
  │
  ├── loads → js/config.js     (APP_CONFIG object)
  ├── loads → js/auth.js       (Auth object — depends on APP_CONFIG)
  └── loads → js/login.js      (depends on both Auth and APP_CONFIG)
                │
                └── redirects → dashboard.html (on login success)
```

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `APP_CONFIG is not defined` | config.js failed to load or wrong order | Check script order in login.html |
| `Auth is not defined` | auth.js failed to load | Check file path ./js/auth.js |
| Redirect goes to 404 | dashboard.html does not exist | Create the file or fix routes in config.js |
| Login always fails | Mock not removed, real API not wired | Replace mock block in auth.js |
| Form submits twice | submitBtn.disabled removed | Keep the disable-on-submit logic |