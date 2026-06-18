// AbuseIPDB proxy (ES module). SETUP: ABUSEIPDB_API_KEY (+ optional SITE_ORIGIN).
import { cors, json, blockedOrigin, cacheGet, cacheSet, spend } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };
const DAILY_CAP = 900;
const CACHE_MS = 12 * 3600 * 1000;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  const { ip } = event.queryStringParameters || {};
  if (!ip) return json(400, { error: "Missing 'ip'." });

  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey) return json(200, { configured: false });

  const cached = await cacheGet("abuse-cache", ip, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });
  if (!(await spend("abuseipdb", DAILY_CAP))) return json(200, { busy: true });

  try {
    const res = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`, { headers: { Key: apiKey, Accept: "application/json" } });
    if (!res.ok) return json(200, { configured: true, error: `AbuseIPDB returned ${res.status}.` });
    const d = (await res.json())?.data || {};
    const out = {
      configured: true, found: true,
      abuseConfidenceScore: d.abuseConfidenceScore ?? 0, totalReports: d.totalReports ?? 0,
      lastReportedAt: d.lastReportedAt || null, countryCode: d.countryCode || null,
      isp: d.isp || null, domain: d.domain || null, usageType: d.usageType || null,
      isTor: !!d.isTor, isWhitelisted: !!d.isWhitelisted,
    };
    await cacheSet("abuse-cache", ip, out);
    return json(200, out);
  } catch (e) { return json(200, { configured: true, error: "Couldn't reach AbuseIPDB." }); }
};
