import { setAuthTokenGetter } from "@workspace/api-client-react";

// ---------------------------------------------------------------------------
// API Client Setup
// ---------------------------------------------------------------------------
// IMPORTANT: We do NOT call setBaseUrl() here.
//
// All API calls use relative paths (e.g. /api/auth/login).
// - In DEV: Vite dev server proxies /api/* → http://127.0.0.1:8080
// - In PROD: Netlify redirects /api/* → Railway backend (via netlify.toml)
//
// This means the browser NEVER makes a cross-origin request → CORS is a non-issue.
// Do NOT set VITE_API_URL — it would cause direct cross-origin calls and CORS errors.
// ---------------------------------------------------------------------------
export function setupApiClient() {
  setAuthTokenGetter(() => {
    return localStorage.getItem("accessToken");
  });
}
