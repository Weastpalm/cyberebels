// Username existence checker — checks several sites server-side (no CORS issues).
import { cors, json, blockedOrigin } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 15, aggregateBy: ["domain", "ip"] } };

const UA = "Mozilla/5.0 (compatible; CyberRebels-OSINT/1.0)";
function timed(url, opts = {}, ms = 7000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, headers: { "User-Agent": UA, ...(opts.headers || {}) }, signal: ctrl.signal }).finally(() => clearTimeout(id));
}

async function check(site, fn) { try { return { site, ...(await fn()) }; } catch { return { site, status: "unknown", url: null }; } }

async function run(u) {
  const checks = [
    check("GitHub", async () => { const r = await timed(`https://api.github.com/users/${u}`); return { status: r.status === 200 ? "found" : r.status === 404 ? "notfound" : "unknown", url: `https://github.com/${u}` }; }),
    check("GitLab", async () => { const r = await timed(`https://gitlab.com/api/v4/users?username=${u}`); const a = await r.json().catch(() => []); return { status: Array.isArray(a) && a.length ? "found" : "notfound", url: `https://gitlab.com/${u}` }; }),
    check("Reddit", async () => { const r = await timed(`https://www.reddit.com/user/${u}/about.json`); return { status: r.status === 200 ? "found" : r.status === 404 ? "notfound" : "unknown", url: `https://www.reddit.com/user/${u}` }; }),
    check("Steam", async () => { const r = await timed(`https://steamcommunity.com/id/${u}?xml=1`); const t = await r.text(); return { status: /<steamID64>/.test(t) ? "found" : /could not be found/i.test(t) ? "notfound" : "unknown", url: `https://steamcommunity.com/id/${u}` }; }),
    check("Twitch", async () => { const r = await timed(`https://decapi.me/twitch/id/${u}`); const t = (await r.text()).trim(); return { status: /^\d+$/.test(t) ? "found" : /not found|error/i.test(t) ? "notfound" : "unknown", url: `https://www.twitch.tv/${u}` }; }),
    check("Keybase", async () => { const r = await timed(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${u}`); const j = await r.json().catch(() => ({})); return { status: j && j.them && j.them.length ? "found" : "notfound", url: `https://keybase.io/${u}` }; }),
    check("Telegram", async () => { const r = await timed(`https://t.me/${u}`); const t = await r.text(); return { status: /tgme_page_title/.test(t) ? "found" : "unknown", url: `https://t.me/${u}` }; }),
  ];
  const auto = await Promise.all(checks);
  const manual = [
    { site: "X / Twitter", status: "link", url: `https://x.com/${u}` },
    { site: "Instagram", status: "link", url: `https://instagram.com/${u}` },
    { site: "TikTok", status: "link", url: `https://www.tiktok.com/@${u}` },
    { site: "YouTube", status: "link", url: `https://www.youtube.com/@${u}` },
  ];
  return [...auto, ...manual];
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  const u = (event.queryStringParameters || {}).u;
  if (!u || !/^[a-zA-Z0-9_.-]{1,40}$/.test(u)) return json(400, { error: "Provide a valid username (letters, numbers, _ . -)." });
  try { return json(200, { username: u, results: await run(encodeURIComponent(u)) }); }
  catch (e) { return json(200, { username: u, results: [], error: "Lookup failed." }); }
};
