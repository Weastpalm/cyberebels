// ============================================================
//  SITE CONFIG  —  edit these once and the whole site updates
// ============================================================
export const SITE_URL = "https://cyberebels.com"; // <-- no trailing slash
export const SITE_NAME = "Cyber Rebels";
export const SITE_TAGLINE = "Investigate links. Expose trackers.";
export const SITE_DESCRIPTION =
  "A free OSINT & privacy toolkit. Scan any domain, IP, or URL against 90+ threat engines and geolocate it in seconds — then see exactly what the web knows about you and lock it down. No sign-up, runs in your browser.";
export const SITE_OG_IMAGE = `${SITE_URL}/og-cover.png`;
export const SITE_TWITTER = "@cyberebels";

export const SITE_KEYWORDS =
  "online privacy, browser fingerprint, am I being tracked, VPN comparison, de-google, OSINT, anti-detect browser, digital self-defense, stop tracking";

export function absUrl(path = "/") {
  if (!path.startsWith("/")) path = "/" + path;
  return SITE_URL + (path === "/" ? "" : path);
}
