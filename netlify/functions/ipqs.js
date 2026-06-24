// IPQualityScore proxy (ES module). SETUP: IPQS_API_KEY (free tier ~5,000 lookups/mo).
import { cors, json, blockedOrigin, cacheGet, cacheSet, spend } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };
const DAILY_CAP = 150; // protect the free monthly allowance
const CACHE_MS = 12 * 3600 * 1000;

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  let { type, value } = event.queryStringParameters || {};
  if (!type || !value) return json(400, { error: "Missing 'type' or 'value'." });

  const apiKey = process.env.IPQS_API_KEY;
  if (!apiKey) return json(200, { configured: false });

  const cacheKey = `${type}:${value}`;
  const cached = await cacheGet("ipqs-cache", cacheKey, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });
  if (!(await spend("ipqs", DAILY_CAP))) return json(200, { busy: true });

  try {
    let url, kind;
    if (type === "ip") {
      url = `https://www.ipqualityscore.com/api/json/ip/${apiKey}/${encodeURIComponent(value)}?strictness=1&allow_public_access_points=true`;
      kind = "ip";
    } else if (type === "url" || type === "domain") {
      let v = value;
      if (type === "url" && !/^https?:\/\//i.test(v)) v = "http://" + v;
      url = `https://www.ipqualityscore.com/api/json/url/${apiKey}/${encodeURIComponent(v)}`;
      kind = "url";
    } else {
      return json(200, { configured: true, error: "IPQS supports ip, domain or url." });
    }

    const res = await fetch(url);
    if (!res.ok) return json(200, { configured: true, error: `IPQS returned ${res.status}.` });
    const d = await res.json();
    if (d.success === false) return json(200, { configured: true, error: d.message || "IPQS request failed." });

    let out;
    if (kind === "ip") {
      out = {
        configured: true, found: true, kind: "ip",
        fraudScore: typeof d.fraud_score === "number" ? d.fraud_score : null,
        proxy: !!d.proxy, vpn: !!d.vpn, tor: !!d.tor, activeVpn: !!d.active_vpn, activeTor: !!d.active_tor,
        recentAbuse: !!d.recent_abuse, botStatus: !!d.bot_status, isCrawler: !!d.is_crawler, mobile: !!d.mobile,
        connectionType: d.connection_type || null, abuseVelocity: d.abuse_velocity || null,
        isp: d.ISP || null, org: d.organization || null, country: d.country_code || null,
      };
    } else {
      out = {
        configured: true, found: true, kind: "url",
        riskScore: typeof d.risk_score === "number" ? d.risk_score : null,
        unsafe: !!d.unsafe, malware: !!d.malware, phishing: !!d.phishing, suspicious: !!d.suspicious,
        spamming: !!d.spamming, adult: !!d.adult, parking: !!d.parking,
        category: d.category || null, domain: d.domain || null, ipAddress: d.ip_address || null,
        server: d.server || null, domainRank: typeof d.domain_rank === "number" ? d.domain_rank : null,
        domainAge: (d.domain_age && d.domain_age.human) || null,
      };
    }
    await cacheSet("ipqs-cache", cacheKey, out);
    return json(200, out);
  } catch (e) {
    return json(200, { configured: true, error: "Couldn't reach IPQS." });
  }
};
