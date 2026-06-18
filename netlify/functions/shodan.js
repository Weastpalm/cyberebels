// Shodan InternetDB proxy (ES module) — FREE, no API key. Cached + rate-limited.
import { cors, json, blockedOrigin, cacheGet, cacheSet } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 30, aggregateBy: ["domain", "ip"] } };
const CACHE_MS = 24 * 3600 * 1000;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  const { ip } = event.queryStringParameters || {};
  if (!ip) return json(400, { error: "Missing 'ip'." });

  const cached = await cacheGet("shodan-cache", ip, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });

  try {
    const res = await fetch(`https://internetdb.shodan.io/${encodeURIComponent(ip)}`);
    if (res.status === 404) { const out = { found: false }; await cacheSet("shodan-cache", ip, out); return json(404, out); }
    if (!res.ok) return json(200, { error: `InternetDB returned ${res.status}.` });
    const out = await res.json();
    await cacheSet("shodan-cache", ip, out);
    return json(200, out);
  } catch (e) { return json(200, { error: "Couldn't reach Shodan InternetDB." }); }
};
