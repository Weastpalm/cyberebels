// urlscan.io passive search — shows existing public scans for a target (no key needed).
import { cors, json, blockedOrigin, cacheGet, cacheSet } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };
const CACHE_MS = 6 * 3600 * 1000;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  const { type, value } = event.queryStringParameters || {};
  if (!value) return json(400, { error: "Missing 'value'." });
  const q = type === "ip" ? `ip:"${value}"` : `page.domain:"${value.replace(/^https?:\/\//, "").split("/")[0]}"`;

  const ck = `${type}:${value}`;
  const cached = await cacheGet("urlscan-cache", ck, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });

  try {
    const ctrl = new AbortController(); const id = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(`https://urlscan.io/api/v1/search/?q=${encodeURIComponent(q)}&size=6`, { signal: ctrl.signal }).finally(() => clearTimeout(id));
    if (!res.ok) return json(200, { error: `urlscan returned ${res.status}.` });
    const d = await res.json();
    const results = (d.results || [])
      .filter((r) => r.page && r.page.url && r.page.status && String(r.page.status) !== "0")
      .slice(0, 6)
      .map((r) => ({
        id: r._id, url: r.page.url, domain: r.page.domain, ip: r.page.ip, country: r.page.country,
        status: r.page.status, server: r.page.server || null, network: r.page.asnname || r.page.asn || null,
        time: r.task && r.task.time,
      }));
    const out = { found: results.length > 0, total: results.length, results };
    await cacheSet("urlscan-cache", ck, out);
    return json(200, out);
  } catch (e) { return json(200, { error: "Couldn't reach urlscan.io." }); }
};
