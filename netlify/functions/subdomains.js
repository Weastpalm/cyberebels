// Subdomain discovery via crt.sh certificate-transparency logs (passive, no scanning).
import { cors, json, blockedOrigin, cacheGet, cacheSet } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 10, aggregateBy: ["domain", "ip"] } };
const CACHE_MS = 12 * 3600 * 1000;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  let { domain } = event.queryStringParameters || {};
  if (!domain) return json(400, { error: "Missing 'domain'." });
  domain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];

  const cached = await cacheGet("subdomain-cache", domain, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });

  try {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(`https://crt.sh/?q=${encodeURIComponent("%." + domain)}&output=json`, { signal: ctrl.signal }).finally(() => clearTimeout(id));
    if (!res.ok) return json(200, { error: `crt.sh returned ${res.status}.`, domain });
    const rows = await res.json();
    const set = new Set();
    for (const r of rows) {
      for (const n of String(r.name_value || "").split("\n")) {
        const s = n.trim().toLowerCase();
        if (s && !s.startsWith("*") && (s === domain || s.endsWith("." + domain))) set.add(s);
      }
    }
    const subs = [...set].sort().slice(0, 300);
    const out = { domain, count: subs.length, subdomains: subs };
    await cacheSet("subdomain-cache", domain, out);
    return json(200, out);
  } catch (e) { return json(200, { error: "Couldn't reach crt.sh (it can be slow — try again).", domain }); }
};
