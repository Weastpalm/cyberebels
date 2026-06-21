/**
 * osint.js — client wrappers for the threat-intel sources used by the SOC page.
 * Keyed sources (VirusTotal, AbuseIPDB) go through Netlify functions so API keys
 * stay server-side and are guarded against quota abuse. Shodan InternetDB needs
 * no key. resolveHost() turns a domain/URL into an IP (via DNS-over-HTTPS) so we
 * can geolocate any indicator, not just raw IPs.
 */
async function getJSON(url, opts) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, { ...(opts || {}), signal: ctrl.signal });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null, unreachable: true };
  } finally {
    clearTimeout(id);
  }
}

export function detectType(s) {
  const v = (s || "").trim();
  if (!v) return "domain";
  if (/^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/i.test(v)) return "file";
  if (/^https?:\/\//i.test(v) || (v.includes("/") && !/^(\d{1,3}\.){3}\d{1,3}/.test(v))) return "url";
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(v)) return "ip";
  if (v.includes(":") && /^[0-9a-f:]+$/i.test(v)) return "ip";
  return "domain";
}

export function hostOf(type, value) {
  if (type === "ip") return value;
  if (type === "url") { try { return new URL(value).hostname; } catch { return value.replace(/^https?:\/\//, "").split("/")[0]; } }
  if (type === "domain") return value;
  return null;
}

export async function vtLookup(type, value) {
  const r = await getJSON(`/.netlify/functions/vt-lookup?type=${type}&value=${encodeURIComponent(value)}`);
  if (r.unreachable) return { source: "virustotal", state: "unreachable" };
  const data = r.data || {};
  if (!r.ok && !data.error) data.error = `feed error (HTTP ${r.status || "?"})`;
  return { source: "virustotal", state: "ok", ...data };
}

export async function abuseIpdb(ip) {
  const r = await getJSON(`/.netlify/functions/abuseipdb?ip=${encodeURIComponent(ip)}`);
  if (r.unreachable) return { source: "abuseipdb", state: "unreachable" };
  const data = r.data || {};
  if (!r.ok && !data.error) data.error = `feed error (HTTP ${r.status || "?"})`;
  return { source: "abuseipdb", state: "ok", ...data };
}

export async function shodanInternetDB(ip) {
  let r = await getJSON(`https://internetdb.shodan.io/${encodeURIComponent(ip)}`);
  if (r.unreachable) r = await getJSON(`/.netlify/functions/shodan?ip=${encodeURIComponent(ip)}`);
  if (r.unreachable) return { source: "shodan", state: "unreachable" };
  if (r.status === 404) return { source: "shodan", state: "ok", found: false };
  const d = r.data || {};
  return { source: "shodan", state: "ok", found: true, ports: d.ports || [], vulns: d.vulns || [], hostnames: d.hostnames || [], cpes: d.cpes || [], tags: d.tags || [] };
}

// Resolve a hostname → IPv4 via Google's DNS-over-HTTPS (free, CORS-enabled).
export async function resolveHost(host) {
  try {
    const r = await getJSON(`https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`);
    const ans = (r.data && r.data.Answer) || [];
    const a = ans.find((x) => x.type === 1);
    return a ? a.data : null;
  } catch { return null; }
}

// Username existence check across several sites (server-side, no CORS issues).
export async function checkUsername(name) {
  const r = await getJSON(`/.netlify/functions/username?u=${encodeURIComponent(name)}`);
  if (r.unreachable) return { state: "unreachable", results: [] };
  return { state: "ok", ...(r.data || {}) };
}

export async function domainIntel(domain) {
  const r = await getJSON(`/.netlify/functions/domain?domain=${encodeURIComponent(domain)}`);
  if (r.unreachable) return { state: "unreachable" };
  return { state: "ok", ...(r.data || {}) };
}
export async function checkRedirects(url) {
  const r = await getJSON(`/.netlify/functions/redirects?url=${encodeURIComponent(url)}`);
  if (r.unreachable) return { state: "unreachable" };
  return { state: "ok", ...(r.data || {}) };
}
export async function sslInspect(host) {
  const r = await getJSON(`/.netlify/functions/ssl?host=${encodeURIComponent(host)}`);
  if (r.unreachable) return { state: "unreachable" };
  return { state: "ok", ...(r.data || {}) };
}
export async function subdomainScan(domain) {
  const r = await getJSON(`/.netlify/functions/subdomains?domain=${encodeURIComponent(domain)}`);
  if (r.unreachable) return { state: "unreachable" };
  return { state: "ok", ...(r.data || {}) };
}
export async function dnsRecords(name) {
  const types = ["A", "AAAA", "MX", "NS", "TXT"];
  const out = {};
  await Promise.all(types.map(async (t) => {
    const r = await getJSON(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${t}`);
    out[t] = (((r.data && r.data.Answer) || []).map((a) => a.data)) || [];
  }));
  return out;
}

// CISA Known Exploited Vulnerabilities (public-domain feed, fine for commercial use).
export async function cisaKev() {
  const r = await getJSON(`/.netlify/functions/kev`);
  if (r.unreachable) return { state: "unreachable" };
  return { state: "ok", ...(r.data || {}) };
}

// urlscan.io passive search — existing public scans for an IP/domain/URL.
export async function urlscanSearch(type, value) {
  const r = await getJSON(`/.netlify/functions/urlscan?type=${type}&value=${encodeURIComponent(value)}`);
  if (r.unreachable) return { source: "urlscan", state: "unreachable" };
  return { source: "urlscan", state: "ok", ...(r.data || {}) };
}
