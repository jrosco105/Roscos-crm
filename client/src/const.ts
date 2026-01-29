export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // SAFETY WRAPPER: Try/Catch around everything so this function NEVER crashes the app
  try {
    // 1. Get Variables (Check both VITE names just in case)
    const oauthPortalUrl = import.meta.env.VITE_OAUTH_SERVER_URL || import.meta.env.VITE_OAUTH_PORTAL_URL || "";
    const appId = import.meta.env.VITE_APP_ID || "";

    // 2. Critical Check: If variables are missing, stop immediately.
    if (!oauthPortalUrl || !appId) {
      console.warn("CRITICAL: Missing VITE_OAUTH_SERVER_URL or VITE_APP_ID. Using fallback.");
      return "#"; 
    }

    // 3. Fix URL formatting (Ensure it starts with http/https)
    let safeBaseUrl = oauthPortalUrl;
    if (!safeBaseUrl.startsWith("http")) {
      safeBaseUrl = `https://${safeBaseUrl}`;
    }

    // 4. Determine Origin (Browser vs Server check)
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${origin}/api/oauth/callback`;
    
    // Safety check for btoa (encoding)
    const state = typeof btoa === "function" ? btoa(redirectUri) : redirectUri;

    // 5. Build the final URL
    const url = new URL(`${safeBaseUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();

  } catch (error) {
    // ULTIMATE FAILSAFE: If anything at all fails, return "#" so the app stays alive.
    console.error("Failed to construct Login URL:", error);
    return "#";
  }
};
