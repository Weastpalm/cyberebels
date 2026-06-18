// VirusTotal reputation proxy (ES module). SETUP: VIRUSTOTAL_API_KEY (+ optional SITE_ORIGIN).
import crypto from "node:crypto";
import { cors, json, blockedOrigin, cacheGet, cacheSet, spend } from "./_guard.js";

export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };

const DAILY_CAP = 450;
const CACHE_MS = 6 * 3600 * 1000;

const urlSha = (u) => crypto.createHash("sha256").update(u).digest("hex");
function guiLink(type, value) {
  if (type === "ip") return `https://www.virustotal.com/gui/ip-address/${encodeURIComponent(value)}`;
  if (type === "domain") return `https://www.virustotal.com/gui/domain/${encodeURIComponent(value)}`;
  if (type === "file") return `https://www.virustotal.com/gui/file/${encodeURIComponent(value)}`;
  if (type === "url") return `https://www.virustotal.com/gui/url/${urlSha(value)}`;
  return "https://www.virustotal.com/gui/home/search";
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });

  let { type, value } = event.queryStringParameters || {};
  if (!type || !value) return json(400, { error: "Missing 'type' or 'value'." });
  if (type === "url" && !/^https?:\/\//i.test(value)) value = "http://" + value;
  const guiUrl = guiLink(type, value);

  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) return json(200, { configured: false, guiUrl });

  const cacheKey = `${type}:${value}`;
  const cached = await cacheGet("vt-cache", cacheKey, CACHE_MS);
  if (cached) return json(200, { ...cached, cached: true });
  if (!(await spend("vt", DAILY_CAP))) return json(200, { busy: true, guiUrl });

  let endpoint;
  if (type === "ip") endpoint = `ip_addresses/${encodeURIComponent(value)}`;
  else if (type === "domain") endpoint = `domains/${encodeURIComponent(value)}`;
  else if (type === "url") endpoint = `urls/${urlSha(value)}`;
  else if (type === "file") endpoint = `files/${encodeURIComponent(value)}`;
  else return json(400, { error: "type must be ip, domain, url, or file." });

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/${endpoint}`, { headers: { "x-apikey": apiKey } });

    if (res.status === 404) {
      // URLs aren't in VT until someone submits them — submit it and tell the user it's queued.
      if (type === "url") {
        try {
          await fetch("https://www.virustotal.com/api/v3/urls", {
            method: "POST",
            headers: { "x-apikey": apiKey, "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ url: value }).toString(),
          });
        } catch (e) {}
        return json(200, { configured: true, queued: true, type, value, guiUrl });
      }
      const out = { configured: true, found: false, type, value, guiUrl };
      await cacheSet("vt-cache", cacheKey, out);
      return json(200, out);
    }
    if (!res.ok) return json(200, { configured: true, error: `VirusTotal returned ${res.status}.`, guiUrl });

    const data = await res.json();
    const a = data?.data?.attributes || {};
    const stats = a.last_analysis_stats || {};
    const total = Object.values(stats).reduce((x, y) => x + (y || 0), 0);
    // A freshly-submitted URL can return with 0 engines done — treat as still analyzing.
    if (type === "url" && total === 0) return json(200, { configured: true, queued: true, type, value, guiUrl });
    const out = {
      configured: true, found: true, type, value, guiUrl,
      stats: {
        malicious: stats.malicious || 0, suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0, undetected: stats.undetected || 0, timeout: stats.timeout || 0,
      },
      reputation: typeof a.reputation === "number" ? a.reputation : null,
      categories: a.categories ? Object.values(a.categories) : [],
      asOwner: a.as_owner || null, country: a.country || null,
      lastAnalysisDate: a.last_analysis_date || null,
      meaningfulName: a.meaningful_name || null, typeDescription: a.type_description || null,
    };
    await cacheSet("vt-cache", cacheKey, out);
    return json(200, out);
  } catch (e) {
    return json(200, { configured: true, error: "Couldn't reach VirusTotal.", guiUrl });
  }
};
