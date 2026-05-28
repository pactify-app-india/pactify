// ============================================================
// config.js
// PURPOSE: Central configuration file for the app.
// All environment-specific values live here.
// DO NOT put secrets or private API keys here if this is
// a public GitHub repo. Use environment variables instead.
// ============================================================

const APP_CONFIG = {

  // ----------------------------------------------------------
  // APP IDENTITY
  // Change these to match your project name and version.
  // ----------------------------------------------------------
  appName: "MyApp",
  appVersion: "1.0.0",

  // ----------------------------------------------------------
  // API ENDPOINTS
  // Change BASE_URL to your actual backend or Firebase URL.
  // Example: "https://my-app.firebaseapp.com"
  // ----------------------------------------------------------
  baseURL: "https://your-api-or-firebase-url.com",

  // ----------------------------------------------------------
  // AUTH ROUTES
  // These are the page paths your app redirects to.
  // Change "dashboard.html" to whatever your main page is.
  // ----------------------------------------------------------
  routes: {
    loginPage:     "login.html",
    dashboardPage: "dashboard.html",
    errorPage:     "error.html"
  },

  // ----------------------------------------------------------
  // SESSION SETTINGS
  // sessionTimeout: how long (in ms) before auto-logout.
  // 1800000 = 30 minutes.
  // ----------------------------------------------------------
  sessionTimeout: 1800000,

  // ----------------------------------------------------------
  // FLAGS
  // enableLogging: set to false in production.
  // ----------------------------------------------------------
  enableLogging: true

};

// Freeze so no other file accidentally mutates config values.
Object.freeze(APP_CONFIG);