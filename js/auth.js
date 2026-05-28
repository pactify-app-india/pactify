// ============================================================
// auth.js
// PURPOSE: Handles all authentication logic.
// This file does NOT do UI. It only handles validation,
// session checks, and communicating with the backend.
// ============================================================

const Auth = (() => {

  // ----------------------------------------------------------
  // INTERNAL HELPER: log only if config allows it.
  // ----------------------------------------------------------
  function _log(msg) {
    if (APP_CONFIG.enableLogging) console.log("[Auth]", msg);
  }

  // ----------------------------------------------------------
  // VALIDATE INPUT
  // Basic checks before even attempting login.
  // You can extend this with regex, min-length rules, etc.
  // ----------------------------------------------------------
  function validateInput(username, password) {
    if (!username || username.trim() === "") {
      return { valid: false, error: "Username cannot be empty." };
    }
    if (!password || password.trim() === "") {
      return { valid: false, error: "Password cannot be empty." };
    }
    if (password.length < 6) {
      return { valid: false, error: "Password must be at least 6 characters." };
    }
    return { valid: true, error: null };
  }

  // ----------------------------------------------------------
  // LOGIN
  // Replace the body of this function with your real API call.
  // Currently uses a simple hardcoded mock for testing.
  // CHANGE THIS: Replace mock with fetch() to your backend.
  // ----------------------------------------------------------
  async function login(username, password) {
    _log(`Attempting login for: ${username}`);

    // -- MOCK LOGIN (remove this block when using a real API) --
    if (username === "admin" && password === "password123") {
      _log("Mock login successful.");
      return { success: true, token: "mock-token-abc123" };
    }

    // -- REAL API CALL (uncomment and configure when ready) --
    // try {
    //   const response = await fetch(`${APP_CONFIG.baseURL}/api/login`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ username, password })
    //   });
    //   const data = await response.json();
    //   if (response.ok) return { success: true, token: data.token };
    //   return { success: false, error: data.message || "Login failed." };
    // } catch (err) {
    //   _log("Network error: " + err.message);
    //   return { success: false, error: "Network error. Please try again." };
    // }

    return { success: false, error: "Invalid username or password." };
  }

  // ----------------------------------------------------------
  // SAVE SESSION
  // Stores auth token in memory (not localStorage — see note).
  // ADD: If you move to a server, use HttpOnly cookies instead.
  // ----------------------------------------------------------
  let _sessionToken = null;

  function saveSession(token) {
    _sessionToken = token;
    _log("Session saved.");

    // Auto-logout after sessionTimeout
    setTimeout(() => {
      clearSession();
      _log("Session expired. Redirecting to login.");
      window.location.href = APP_CONFIG.routes.loginPage;
    }, APP_CONFIG.sessionTimeout);
  }

  // ----------------------------------------------------------
  // CLEAR SESSION
  // Call this on logout.
  // ----------------------------------------------------------
  function clearSession() {
    _sessionToken = null;
    _log("Session cleared.");
  }

  // ----------------------------------------------------------
  // CHECK SESSION
  // Returns true if user is currently authenticated.
  // CHANGE THIS: Replace with real token validation if needed.
  // ----------------------------------------------------------
  function isAuthenticated() {
    return _sessionToken !== null;
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // Only expose what other files need to use.
  // ----------------------------------------------------------
  return {
    validateInput,
    login,
    saveSession,
    clearSession,
    isAuthenticated
  };

})();