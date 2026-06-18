// CISA Known Exploited Vulnerabilities feed (US-gov, public domain). Keyless + cached.
import { cors, json, blockedOrigin, cacheGet, cacheSet } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 30, aggregateBy: ["domain", "ip"] } };
const CACHE_MS = 6 * 3600 * 1000;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  const cached = await cacheGet("kev-cache", "latest", CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });
  try {
    const ctrl = new AbortController(); const id = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", { signal: ctrl.signal }).finally(() => clearTimeout(id));
    if (!res.ok) return json(200, { error: `CISA returned ${res.status}.` });
    const data = await res.json();
    const all = (data.vulnerabilities || []).slice().sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""));
    const items = all.slice(0, 15).map((v) => ({
      cve: v.cveID, vendor: v.vendorProject, product: v.product,
      name: v.vulnerabilityName, dateAdded: v.dateAdded,
      ransomware: /known/i.test(v.knownRansomwareCampaignUse || ""),
    }));
    const out = { total: all.length, count: items.length, items };
    await cacheSet("kev-cache", "latest", out);
    return json(200, out);
  } catch (e) { return json(200, { error: "Couldn't reach the CISA KEV feed." }); }
};
