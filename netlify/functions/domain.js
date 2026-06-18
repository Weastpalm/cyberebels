// Domain intelligence via RDAP (registrar, registration/expiry dates, nameservers, status).
import { cors, json, blockedOrigin, cacheGet, cacheSet } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };
const CACHE_MS = 6 * 3600 * 1000;

function vcardName(entity) {
  try {
    const v = entity.vcardArray && entity.vcardArray[1];
    const fn = v.find((x) => x[0] === "fn");
    return fn ? fn[3] : null;
  } catch { return null; }
}
function registrarOf(data) {
  const ents = data.entities || [];
  const reg = ents.find((e) => (e.roles || []).includes("registrar"));
  return reg ? (vcardName(reg) || reg.handle || null) : null;
}
function eventDate(data, action) {
  const ev = (data.events || []).find((e) => e.eventAction === action);
  return ev ? ev.eventDate : null;
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  let { domain } = event.queryStringParameters || {};
  if (!domain) return json(400, { error: "Missing 'domain'." });
  domain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];

  const cached = await cacheGet("domain-cache", domain, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });

  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { headers: { Accept: "application/rdap+json" } });
    if (res.status === 404) { const out = { found: false, domain }; await cacheSet("domain-cache", domain, out); return json(200, out); }
    if (!res.ok) return json(200, { error: `RDAP returned ${res.status}.`, domain });
    const data = await res.json();
    const created = eventDate(data, "registration");
    const expires = eventDate(data, "expiration");
    const updated = eventDate(data, "last changed");
    const ageDays = created ? Math.floor((Date.now() - new Date(created).getTime()) / 86400000) : null;
    const out = {
      found: true, domain,
      registrar: registrarOf(data),
      created, expires, updated, ageDays,
      nameservers: (data.nameservers || []).map((n) => (n.ldhName || "").toLowerCase()).filter(Boolean),
      statuses: data.status || [],
    };
    await cacheSet("domain-cache", domain, out);
    return json(200, out);
  } catch (e) { return json(200, { error: "Couldn't reach RDAP.", domain }); }
};
