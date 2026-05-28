// ============================================================
// login.js
// PURPOSE: Page-specific logic for login.html ONLY.
// Connects the form UI to auth.js functions.
// Does NOT handle authentication logic directly.
// ============================================================

// ----------------------------------------------------------
// WAIT FOR DOM TO FULLY LOAD BEFORE RUNNING
// ----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  // Grab form elements from login.html
  const form          = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMsg      = document.getElementById("errorMsg");
  const submitBtn     = document.getElementById("submitBtn");

  // ----------------------------------------------------------
  // SHOW ERROR
  // ----------------------------------------------------------
  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
  }

  // ----------------------------------------------------------
  // CLEAR ERROR
  // ----------------------------------------------------------
  function clearError() {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }

  usernameInput.addEventListener("input", clearError);
  passwordInput.addEventListener("input", clearError);

  // ----------------------------------------------------------
  // FORM SUBMIT HANDLER
  // ----------------------------------------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const validation = Auth.validateInput(username, password);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const result = await Auth.login(username, password);

    if (result.success) {
      Auth.saveSession(result.token);
      window.location.href = APP_CONFIG.routes.dashboardPage;
    } else {
      showError(result.error || "Login failed. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }

  });

});