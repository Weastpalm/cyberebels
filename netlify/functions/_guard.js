// Shared guard for the OSINT proxy functions (ES module — package.json is type:module).
// Protects free-tier quotas: CORS lock, Netlify Blobs caching, per-API daily budget caps.
import { getStore } from "@netlify/blobs";

const ORIGIN = process.env.SITE_ORIGIN || "";
function hostOf(u) { try { return new URL(u).hostname.toLowerCase(); } catch { return ""; } }
const ALLOWED_HOST = hostOf(ORIGIN);

export function cors() {
  return {
    "Access-Control-Allow-Origin": ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}
export function json(statusCode, body) { return { statusCode, headers: cors(), body: JSON.stringify(body) }; }

export function blockedOrigin(event) {
  if (!ORIGIN || !ALLOWED_HOST) return false;
  const h = event.headers || {};
  const src = h.origin || h.Origin || h.referer || h.Referer || "";
  if (!src) return false;
  const host = hostOf(src);
  if (!host) return false;
  if (host === ALLOWED_HOST) return false;
  if (host.endsWith("." + ALLOWED_HOST)) return false;
  if (ALLOWED_HOST.startsWith("www.") && host === ALLOWED_HOST.slice(4)) return false;
  if ("www." + host === ALLOWED_HOST) return false;
  if (host === ALLOWED_HOST.replace(/^www\./, "")) return false;
  if (host === "localhost" || host === "127.0.0.1") return false;
  if (host.endsWith(".netlify.app")) return false;
  return true;
}

export async function cacheGet(store, key, maxAgeMs) {
  try { const hit = await getStore(store).get(key, { type: "json" }); if (hit && Date.now() - hit.at < maxAgeMs) return hit.data; } catch (e) {}
  return null;
}
export async function cacheSet(store, key, data) { try { await getStore(store).set(key, JSON.stringify({ at: Date.now(), data })); } catch (e) {} }
export async function spend(api, cap) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const store = getStore("osint-budget");
    const key = `${api}:${day}`;
    const used = Number(await store.get(key)) || 0;
    if (used >= cap) return false;
    await store.set(key, String(used + 1));
    return true;
  } catch (e) { return true; }
}
