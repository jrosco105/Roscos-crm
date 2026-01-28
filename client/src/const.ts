export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // FIX 1: We check for 'VITE_OAUTH_SERVER_URL' because that is what you have in Railway.
  // We also keep 'VITE_OAUTH_PORTAL_URL' as a backup.
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_SERVER_URL || import.meta.env.VITE_OAUTH_PORTAL_URL || "";
  
  const appId = import.meta.env.VITE_APP_ID || "";

  // FIX 2: SAFETY CHECK
  // If the variable is still missing, we stop here instead of crashing the app.
  if (!oauthPortalUrl || !appId) {
    console.error("CRITICAL: Missing VITE_OAUTH_SERVER_URL or VITE_APP_ID. Check Railway Variables.");
    return "#"; 
  }

  // Double check that we are in a browser environment
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirectUri = `${origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch (error) {
    console.error("Failed to construct Login URL:", error);
    return "#";
  }
};
