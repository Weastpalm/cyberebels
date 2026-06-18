// URL redirect-chain analyzer — follows redirects server-side and reports each hop.
import { cors, json, blockedOrigin } from "./_guard.js";
export const config = { rateLimit: { windowSize: 60, windowLimit: 20, aggregateBy: ["domain", "ip"] } };
const UA = "Mozilla/5.0 (compatible; CyberRebels-OSINT/1.0)";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (blockedOrigin(event)) return json(403, { error: "Forbidden origin." });
  let { url } = event.queryStringParameters || {};
  if (!url) return json(400, { error: "Missing 'url'." });
  if (!/^https?:\/\//i.test(url)) url = "http://" + url;

  const chain = [];
  let current = url;
  try {
    for (let i = 0; i < 10; i++) {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), 7000);
      let res;
      try { res = await fetch(current, { method: "GET", redirect: "manual", headers: { "User-Agent": UA }, signal: ctrl.signal }); }
      finally { clearTimeout(id); }
      const loc = res.headers.get("location");
      chain.push({ url: current, status: res.status });
      if (res.status >= 300 && res.status < 400 && loc) { current = new URL(loc, current).toString(); }
      else break;
    }
    return json(200, { chain, hops: chain.length, final: chain.length ? chain[chain.length - 1].url : url });
  } catch (e) { return json(200, { chain, error: "Couldn't follow the URL (it may be down or blocking requests).", final: current }); }
};
