import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import AdSlot from "../components/AdSlot.jsx";
import GeoConsole from "../components/GeoConsole.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { getIpGeo } from "../lib/detect.js";
import { detectType, hostOf, vtLookup, abuseIpdb, shodanInternetDB, resolveHost, urlscanSearch } from "../lib/osint.js";
import { loadHistory, saveHistory, addEntry, clearHistory } from "../lib/history.js";

const TYPES = [
  { k: "ip", label: "IP" },
  { k: "domain", label: "Domain" },
  { k: "url", label: "URL" },
  { k: "file", label: "File hash" },
];

const TONE = {
  bad: "border-danger/50 text-danger",
  warn: "border-warn/50 text-warn",
  good: "border-brand/50 text-brand",
  info: "border-info/50 text-info",
  mute: "border-line text-faint",
};
function Pill({ tone = "mute", children }) { return <span className={`chip ${TONE[tone]}`}>{children}</span>; }
function Stat({ label, short, value, tone }) {
  const c = tone === "bad" ? "text-danger" : tone === "warn" ? "text-warn" : tone === "good" ? "text-brand" : "text-ink";
  return (<div className="min-w-0 rounded-md border border-line bg-base/40 p-1.5 text-center sm:p-2.5"><div className={`font-mono text-base font-bold tabular-nums sm:text-xl ${c}`}>{value}</div><div className="mt-0.5 truncate font-mono text-[9px] uppercase leading-tight tracking-wide text-faint sm:text-[10px] sm:tracking-wider"><span className="sm:hidden">{short || label}</span><span className="hidden sm:inline">{label}</span></div></div>);
}

function SourceCard({ name, logo, status, children }) {
  const map = { loading: ["mute", "querying…"], ok: ["good", "online"], needkey: ["warn", "needs key"], unreachable: ["mute", "offline"], none: ["mute", "no record"], busy: ["warn", "budget hit"] };
  const [tone, label] = map[status] || map.none;
  return (
    <div className="panel min-w-0 overflow-hidden">
      <div className="console-bar">
        {logo ? <BrandLogo slug={logo} name={name} size={16} className="!h-6 !w-6 !rounded-md" /> : <span className="console-dot bg-brand/70" />}
        <span className="ml-1 min-w-0 flex-1 truncate font-mono text-[11px] text-faint">{name}</span>
        <span className="flex-none"><Pill tone={tone}>{label}</Pill></span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}
const Note = ({ children }) => <p className="font-mono text-xs leading-relaxed text-muted">{children}</p>;
const NeedKey = ({ name, url, env }) => (<Note>Add a free <a href={url} target="_blank" rel="noopener noreferrer" className="link-accent">{name} API key</a> as <code className="rounded bg-elevated px-1 text-brand">{env}</code> in your Netlify env vars to enable this feed.</Note>);
const Offline = () => <Note>Feed offline — its serverless function runs on the deployed site. Not available in a plain local preview.</Note>;
const GuiLink = ({ url }) => url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] link-accent">View full report on VirusTotal ↗</a> : null;
const WarnNote = ({ children }) => <p className="font-mono text-xs leading-relaxed text-warn">{children}</p>;
function apiError(d) {
  const e = String(d.error || "");
  if (/forbidden/i.test(e)) return "Request blocked by the origin lock. Your SITE_ORIGIN doesn't match the URL you're on (e.g. www vs non-www, or the .netlify.app URL). Fix or remove SITE_ORIGIN and redeploy.";
  const code = (e.match(/(\d{3})/) || [])[1];
  if (code === "429") return "VirusTotal rate limit hit — the free tier allows about 4 lookups/min. Wait a minute and retry; repeat lookups are cached.";
  if (code === "401") return "VirusTotal rejected the API key (401). Check VIRUSTOTAL_API_KEY in your Netlify env vars.";
  if (code === "403") return "VirusTotal denied the request (403). Your key may be over its daily quota or restricted.";
  return e || "The feed returned an unexpected response.";
}

function VtBody({ d, type }) {
  if (!d || d.state === "unreachable") return <Offline />;
  const gui = <GuiLink url={d.guiUrl} />;
  if (d.busy) return <div><Note>Daily lookup budget reached (protecting the free tier) — try again later.</Note>{gui}</div>;
  if (d.configured === false) return <div><NeedKey name="VirusTotal" url="https://www.virustotal.com/gui/my-apikey" env="VIRUSTOTAL_API_KEY" />{gui}</div>;
  if (d.queued) return <div><Note>Submitted to VirusTotal — a brand-new URL takes ~30\u201360s to analyze across the engines. Re-run this scan shortly, or open the live report:</Note>{gui}</div>;

  if (d.error) return <div><WarnNote>{apiError(d)}</WarnNote>{gui}</div>;
  if (d.found === false) return <div><Note>No record — VirusTotal hasn&apos;t analyzed this target. Treat as <span className="text-ink">unknown</span>, not safe.</Note>{gui}</div>;
  if (!d.stats) return <div><Note>No analysis data returned.</Note>{gui}</div>;
  const total = Object.values(d.stats).reduce((a, b) => a + b, 0);
  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <Stat label="Malicious" short="Mal" value={d.stats.malicious} tone={d.stats.malicious ? "bad" : "ink"} />
        <Stat label="Suspicious" short="Susp" value={d.stats.suspicious} tone={d.stats.suspicious ? "warn" : "ink"} />
        <Stat label="Harmless" short="Safe" value={d.stats.harmless} tone="good" />
        <Stat label="Clean/undet" short="Undet" value={d.stats.undetected} tone="ink" />
      </div>
      <dl className="mt-2.5 space-y-1 font-mono text-[11px]">
        <div className="flex justify-between gap-3"><dt className="text-faint">engines</dt><dd className="text-muted">{total} checked{d.cached ? " · cached" : ""}</dd></div>
        {type === "file" && d.meaningfulName && <div className="flex justify-between gap-3"><dt className="flex-none text-faint">name</dt><dd className="min-w-0 truncate text-right text-muted">{d.meaningfulName}</dd></div>}
        {type === "file" && d.typeDescription && <div className="flex justify-between gap-3"><dt className="text-faint">type</dt><dd className="text-muted">{d.typeDescription}</dd></div>}
        {d.asOwner && <div className="flex justify-between gap-3"><dt className="flex-none text-faint">network</dt><dd className="min-w-0 truncate text-right text-muted">{d.asOwner}</dd></div>}
        {d.country && <div className="flex justify-between gap-3"><dt className="text-faint">country</dt><dd className="text-muted">{d.country}</dd></div>}
        {d.reputation !== null && d.reputation !== undefined && <div className="flex justify-between gap-3"><dt className="text-faint">reputation</dt><dd className={d.reputation < 0 ? "text-danger" : "text-muted"}>{d.reputation}</dd></div>}
        {d.categories && d.categories.length > 0 && <div className="flex justify-between gap-3"><dt className="flex-none text-faint">categories</dt><dd className="min-w-0 truncate text-right text-muted">{[...new Set(d.categories)].slice(0, 3).join(", ")}</dd></div>}
      </dl>
      {gui}
    </div>
  );
}

function AbuseBody({ d }) {
  if (!d || d.state === "unreachable") return <Offline />;
  if (d.busy) return <Note>Daily budget reached (protecting the free tier) — try again later.</Note>;
  if (d.configured === false) return <NeedKey name="AbuseIPDB" url="https://www.abuseipdb.com/account/api" env="ABUSEIPDB_API_KEY" />;
  if (d.error) return <WarnNote>{apiError(d)}</WarnNote>;
  const score = d.abuseConfidenceScore ?? 0;
  const tone = score >= 50 ? "text-danger" : score > 0 ? "text-warn" : "text-brand";
  return (
    <div>
      <div className="flex items-end gap-3">
        <div className={`font-mono text-3xl font-extrabold tabular-nums ${tone}`}>{score}<span className="text-base text-faint">%</span></div>
        <div className="pb-1 font-mono text-[11px] text-faint">abuse confidence{d.cached ? " · cached" : ""}</div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-elevated"><div className={`h-full rounded-full ${score >= 50 ? "bg-danger" : score > 0 ? "bg-warn" : "bg-brand"}`} style={{ width: `${Math.max(2, score)}%` }} /></div>
      <dl className="mt-3 space-y-1 font-mono text-[11px]">
        <div className="flex justify-between gap-3"><dt className="text-faint">reports</dt><dd className="text-muted">{(d.totalReports ?? 0).toLocaleString()}</dd></div>
        {d.usageType && <div className="flex justify-between gap-3"><dt className="flex-none text-faint">usage</dt><dd className="min-w-0 truncate text-right text-muted">{d.usageType}</dd></div>}
        {d.isp && <div className="flex justify-between gap-3"><dt className="flex-none text-faint">isp</dt><dd className="min-w-0 truncate text-right text-muted">{d.isp}</dd></div>}
        <div className="flex justify-between gap-3"><dt className="text-faint">tor exit</dt><dd className={d.isTor ? "text-warn" : "text-muted"}>{d.isTor ? "yes" : "no"}</dd></div>
      </dl>
    </div>
  );
}

function ShodanBody({ d }) {
  if (!d || d.state === "unreachable") return <Offline />;
  if (d.found === false) return <Note>No exposed services indexed for this IP. <span className="text-faint">(InternetDB · free)</span></Note>;
  return (
    <div className="space-y-3">
      <div><div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-faint">open ports ({d.ports.length})</div><div className="flex flex-wrap gap-1.5">{d.ports.length ? d.ports.map((p) => <Pill key={p} tone="info">{p}</Pill>) : <span className="font-mono text-xs text-muted">none</span>}</div></div>
      {d.vulns.length > 0 && (<div><div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-danger">vulnerabilities ({d.vulns.length})</div><div className="flex flex-wrap gap-1.5">{d.vulns.slice(0, 10).map((c) => <Pill key={c} tone="bad">{c}</Pill>)}</div></div>)}
      {d.hostnames.length > 0 && <div className="break-all font-mono text-[11px]"><span className="text-faint">hostnames: </span><span className="text-muted">{d.hostnames.slice(0, 3).join(", ")}</span></div>}
      {d.tags.length > 0 && <div className="flex flex-wrap gap-1.5">{d.tags.map((t) => <Pill key={t}>{t}</Pill>)}</div>}
      <p className="font-mono text-[10px] text-faint">Shodan InternetDB · free · updated weekly</p>
    </div>
  );
}

function UrlscanBody({ d }) {
  if (!d || d.state === "unreachable") return <Offline />;
  if (d.error) return <Note>{d.error}</Note>;
  if (!d.found) return <Note>No public scans indexed on urlscan.io. <a href="https://urlscan.io/" target="_blank" rel="noopener noreferrer" className="link-accent">Submit a scan ↗</a></Note>;
  return (
    <div className="space-y-1.5">
      {d.results.map((x) => (
        <a key={x.id} href={`https://urlscan.io/result/${x.id}/`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden rounded-md border border-line bg-elevated/40 p-2 hover:border-brand">
          <img src={`https://urlscan.io/screenshots/${x.id}.png`} alt="" loading="lazy" className="h-9 w-14 flex-none rounded border border-line object-cover sm:h-10 sm:w-16" />
          <span className="min-w-0 flex-1"><span className="block truncate font-mono text-[11px] text-ink">{x.url}</span><span className="block truncate font-mono text-[10px] text-faint">{[x.status && ("HTTP " + x.status), x.server, x.network, x.country, x.time && x.time.slice(0, 10)].filter(Boolean).join(" · ")}</span></span>
          <span className="flex-none font-mono text-[10px] text-faint">\u2197</span>
        </a>
      ))}
      <p className="font-mono text-[10px] text-faint">urlscan.io passive search \u00b7 {(d.total || d.results.length).toLocaleString()} public scan(s)</p>
    </div>
  );
}

function overallVerdict(r) {
  const { vt, abuse, shodan } = r;
  let bad = false, warn = false;
  if (vt && vt.stats) { if (vt.stats.malicious > 0) bad = true; else if (vt.stats.suspicious > 0) warn = true; }
  if (abuse && typeof abuse.abuseConfidenceScore === "number") { if (abuse.abuseConfidenceScore >= 50) bad = true; else if (abuse.abuseConfidenceScore > 0) warn = true; }
  if (shodan && shodan.vulns && shodan.vulns.length > 0) warn = true;
  if (bad) return { tone: "bad", badge: "MALICIOUS", text: "Multiple feeds flag this target. Treat as hostile." };
  if (warn) return { tone: "warn", badge: "SUSPICIOUS", text: "At least one feed raised a flag. Investigate before trusting." };
  if (!(vt && vt.stats) && !(abuse && abuse.configured) && !(shodan && shodan.found)) return null;
  return { tone: "good", badge: "CLEAN", text: "No feed flagged this target. Stay context-aware." };
}

function recordHistory(onResult, r) {
  if (!onResult) return;
  const vt = r.vt; let mal = null, total = null;
  if (vt && vt.stats) { total = Object.values(vt.stats).reduce((a, b) => a + b, 0); mal = vt.stats.malicious; }
  const v = overallVerdict(r);
  onResult({ indicator: r.query, type: r.type, mal, total, tone: v ? v.tone : "mute", ts: Date.now(), full: r });
}

function HistoryList({ items, onClear }) {
  if (!items || !items.length) return null;
  return (
    <div className="panel mt-4 overflow-hidden">
      <div className="console-bar">
        <span className="console-dot bg-brand/70" />
        <span className="ml-1 font-mono text-[11px] text-faint">recent lookups · {items.length}</span>
        <button onClick={onClear} className="ml-auto font-mono text-[10px] uppercase tracking-wider text-faint transition-colors hover:text-danger">clear</button>
      </div>
      <ul className="max-h-72 divide-y divide-line/50 overflow-y-auto">
        {items.map((e) => {
          const tone = e.tone === "bad" ? "text-danger" : e.tone === "warn" ? "text-warn" : e.tone === "good" ? "text-brand" : "text-muted";
          const ratio = e.total != null ? `${e.mal}/${e.total}` : "—";
          const to = e.type === "url" ? `/osint/recon?q=${encodeURIComponent(e.indicator)}` : `/osint/recon/${encodeURIComponent(e.indicator)}`;
          return (
            <li key={e.indicator + e.type + e.ts}>
              <Link to={to} className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-elevated/40">
                <span className="chip flex-none">{e.type}</span>
                <span className="truncate font-mono text-xs text-ink">{e.indicator}</span>
                <span className={`ml-auto flex-none font-mono text-xs tabular-nums ${tone}`}>{ratio}{e.total != null && e.mal > 0 ? " malicious" : e.total != null ? " clean" : ""}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Scanning({ type }) {
  const feeds = type === "ip" ? ["resolving target", "virustotal", "abuseipdb", "shodan internetdb", "geolocation"] : type === "file" ? ["virustotal file analysis"] : ["resolving host", "virustotal", "geolocation"];
  return (
    <div className="panel-accent mt-4 overflow-hidden">
      <div className="console-bar"><span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" /><span className="ml-2 font-mono text-xs text-faint">recon.sh — correlating feeds</span></div>
      <div className="p-5 font-mono text-sm">
        {feeds.map((f, i) => (<div key={f} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${i * 110}ms` }}><span className="text-brand">▸</span><span className="text-muted">querying {f}</span><span className="text-faint animate-blink">_</span></div>))}
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded bg-elevated"><div className="absolute inset-y-0 w-1/3 rounded bg-brand animate-sweep" /></div>
        <div className="mt-2 text-faint">// decrypting signals · stand by</div>
      </div>
    </div>
  );
}

function cardStatus(d, running) {
  if (running || !d) return "loading";
  if (d.state === "unreachable") return "unreachable";
  if (d.busy) return "busy";
  if (d.configured === false) return "needkey";
  if (d.found === false) return "none";
  return "ok";
}

async function geoFor(type, value) {
  if (type === "file") return null;
  if (type === "ip") return await getIpGeo(value);
  const host = hostOf(type, value);
  if (!host) return null;
  const ip = await resolveHost(host);
  if (!ip) return null;
  const g = await getIpGeo(ip);
  return g && g.ok ? { ...g, resolvedFrom: host, resolvedIp: ip } : g;
}

function GeoBlock({ geo }) {
  if (!geo || !geo.ok || typeof geo.lat !== "number") return null;
  return (
    <div className="min-w-0 md:col-span-2">
      <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <GeoConsole lat={geo.lat} lon={geo.lon} label={[geo.city, geo.country].filter(Boolean).join(", ")} sub={geo.resolvedFrom ? `resolved ${geo.resolvedFrom} → ${geo.resolvedIp}` : geo.timezone ? `TZ ${geo.timezone}` : null} />
        <dl className="space-y-1.5 self-center font-mono text-xs">
          <div className="flex justify-between gap-3"><dt className="flex-none text-faint">location</dt><dd className="min-w-0 truncate text-right text-ink">{geo.flag} {[geo.city, geo.region, geo.country].filter(Boolean).join(", ")}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-faint">coordinates</dt><dd className="tabular-nums text-muted">{geo.lat?.toFixed(4)}, {geo.lon?.toFixed(4)}</dd></div>
          {geo.isp && <div className="flex justify-between gap-3"><dt className="flex-none text-faint">isp</dt><dd className="min-w-0 truncate text-right text-muted">{geo.isp}</dd></div>}
          {geo.asn && <div className="flex justify-between gap-3"><dt className="text-faint">asn</dt><dd className="text-muted">{geo.asn}</dd></div>}
        </dl>
      </div>
    </div>
  );
}

function Investigator({ initialQuery = "", onResult, preset }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [val, setVal] = useState(initialQuery);
  const [type, setType] = useState(detectType(initialQuery || "ip"));
  const [touched, setTouched] = useState(false);
  const [running, setRunning] = useState(false);
  const [r, setR] = useState(null);

  function onChange(v) { setVal(v); if (!touched) setType(detectType(v)); }
  function go(qOverride, tOverride) {
    const query = (qOverride ?? val).trim();
    const t = tOverride ?? type;
    if (!query) return;
    if (t === "url") navigate(`/osint/recon?q=${encodeURIComponent(query)}`);
    else navigate(`/osint/recon/${encodeURIComponent(query)}`);
  }

  async function run(query, t) {
    setRunning(true);
    setR({ type: t, query });
    try {
      if (t === "ip") {
        const [vt, abuse, shodan, geo, urlscan] = await Promise.all([vtLookup("ip", query), abuseIpdb(query), shodanInternetDB(query), geoFor("ip", query), urlscanSearch("ip", query)]);
        let hostVt = null, hostName = null;
        if (shodan && shodan.found && shodan.hostnames && shodan.hostnames.length && vt && vt.stats) { hostName = shodan.hostnames[0]; hostVt = await vtLookup("domain", hostName); }
        const result = { type: t, query, vt, abuse, shodan, geo, hostVt, hostName, urlscan };
        setR(result); recordHistory(onResult, result);
      } else {
        const us = t !== "file" ? urlscanSearch(t, query) : Promise.resolve(null);
        const [vt, geo, urlscan] = await Promise.all([vtLookup(t, query), geoFor(t, query), us]);
        const result = { type: t, query, vt, geo, urlscan };
        setR(result); recordHistory(onResult, result);
      }
    } finally { setRunning(false); }
  }

  useEffect(() => {
    const query = (initialQuery || "").trim();
    if (!query) { setR(null); return; }
    const t = detectType(query);
    setType(t); setVal(query);
    if (preset && preset.query === query) { setRunning(false); setR({ ...preset, _saved: true }); }
    else { run(query, t); }
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const verdict = r && r.vt && !running ? overallVerdict(r) : null;
  const isIp = r?.type === "ip";

  return (
    <div ref={ref} className="scroll-mt-24">
      <div className="panel-accent p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={val} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="8.8.8.8   ·   example.com   ·   https://site/path   ·   <sha256>" className="field flex-1 font-mono" aria-label="IP, domain, URL, or file hash to investigate" />
          <button onClick={() => go()} className="btn-primary" disabled={running}>{running ? "Scanning…" : "Investigate"}</button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-elevated p-0.5">
            {TYPES.map((t) => (<button key={t.k} onClick={() => { setType(t.k); setTouched(true); }} className={["rounded-md px-2.5 py-1 font-mono text-[11px] uppercase transition-colors", type === t.k ? "bg-brand text-onbrand" : "text-muted hover:text-ink"].join(" ")}>{t.label}</button>))}
          </div>
          <span className="font-mono text-[10px] text-faint">auto-detected · IP fans out to all feeds + geolocation · results get a shareable URL</span>
        </div>
      </div>

      {running && <Scanning type={r?.type || type} />}

      {!running && r && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {r._saved && <span className="chip border-info/50 text-info">saved result — no new API calls</span>}
          <button onClick={() => run(r.query, r.type)} className="ml-auto font-mono text-[11px] text-faint transition-colors hover:text-brand">\u21bb re-scan (fresh)</button>
        </div>
      )}

      {!running && verdict && (
        <div className={`mt-4 flex flex-wrap items-center gap-3 rounded-xl border p-4 ${verdict.tone === "bad" ? "border-danger/40 bg-danger/5" : verdict.tone === "warn" ? "border-warn/40 bg-warn/5" : "border-brand/40 bg-brand/5"}`}>
          <Pill tone={verdict.tone === "bad" ? "bad" : verdict.tone === "warn" ? "warn" : "good"}>{verdict.badge}</Pill>
          <span className={`font-mono text-sm font-bold ${verdict.tone === "bad" ? "text-danger" : verdict.tone === "warn" ? "text-warn" : "text-brand"}`}>{verdict.text}</span>
          <span className="ml-auto min-w-0 truncate font-mono text-xs text-faint">{r.query}</span>
        </div>
      )}

      {!running && r && (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <SourceCard name="virustotal · 90+ engines" logo="virustotal" status={cardStatus(r.vt, running)}><VtBody d={r.vt} type={r.type} /></SourceCard>
          {isIp && <SourceCard name="abuseipdb · reputation" logo="abuseipdb" status={cardStatus(r.abuse, running)}><AbuseBody d={r.abuse} /></SourceCard>}
          {isIp && <SourceCard name="shodan · exposed services" logo="shodan" status={cardStatus(r.shodan, running)}><ShodanBody d={r.shodan} /></SourceCard>}
          {isIp && r.hostName && (
            <div className="min-w-0 md:col-span-2">
              <SourceCard name={`virustotal · auto deep-dive on ${r.hostName}`} logo="virustotal" status={cardStatus(r.hostVt, running)}><VtBody d={r.hostVt} type="domain" /></SourceCard>
            </div>
          )}
          {r.urlscan && (
            <div className="min-w-0 md:col-span-2">
              <SourceCard name="urlscan.io · recent page scans" status={cardStatus(r.urlscan, running)}><UrlscanBody d={r.urlscan} /></SourceCard>
            </div>
          )}
          <GeoBlock geo={r.geo} />
        </div>
      )}

      {!r && !running && <p className="mt-4 font-mono text-xs text-faint">▸ feeds: VirusTotal · AbuseIPDB · Shodan InternetDB · ipwho.is geolocation. Shodan is free with no key; the others light up once their API key is set on deploy. Every lookup is cached and rate-limited to protect the free tiers.</p>}
    </div>
  );
}

const ti = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const ANALYST_TOOLS = [
  { to: "/osint/email", title: "Email & Phishing Analyzer", desc: "Originating IP, SPF/DKIM/DMARC, extracted links & domains, phishing language.", icon: (<svg {...ti}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>) },
  { to: "/osint/intel", title: "Intel Radar", desc: "Live exploited CVEs (CISA KEV) + feeds for ransomware, dark web, IOCs and DDoS.", icon: (<svg {...ti}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3" /></svg>) },
  { to: "/osint/domain", title: "Domain Intel", desc: "Registration age, registrar, nameservers, DNS records and a risk score.", icon: (<svg {...ti}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>) },
  { to: "/osint/redirects", title: "URL Redirect Analyzer", desc: "Follow a short link through every hop to its real destination.", icon: (<svg {...ti}><path d="M4 7h12l-3-3M20 17H8l3 3" /></svg>) },
  { to: "/osint/ssl", title: "SSL Inspector", desc: "Live TLS certificate: issuer, expiry, and every hostname it covers.", icon: (<svg {...ti}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>) },
  { to: "/osint/qr", title: "QR Code Scanner", desc: "Decode a QR image and reveal where it points before you scan it.", icon: (<svg {...ti}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7h-7" /></svg>) },
  { to: "/osint/decoder", title: "Decoder Bench", desc: "CyberChef-style: stack Base64 / Hex / URL / ROT13 / JWT and more.", icon: (<svg {...ti}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></svg>) },
];

const SUBPAGES = [
  { to: "/osint/exposure", n: "02", title: "What You're Leaking", desc: "Your live IP, location & fingerprint." },
  { to: "/osint/breach", n: "03", title: "Breach & Password", desc: "Check leaked passwords privately." },
  { to: "/osint/footprint", n: "04", title: "Footprint Audit", desc: "See yourself as an investigator would." },
  { to: "/osint/brokers", n: "05", title: "Data Brokers", desc: "Scrub yourself from people-search sites." },
];

export default function Osint() {
  const { indicator } = useParams();
  const [params] = useSearchParams();
  const initial = indicator ? decodeURIComponent(indicator) : (params.get("q") || "");
  const [history, setHistory] = useState(loadHistory);
  const onResult = useCallback((e) => setHistory((h) => { const n = addEntry(h, e); saveHistory(n); return n; }), []);
  const clearH = () => { clearHistory(); setHistory([]); };
  const presetEntry = initial ? history.find((h) => h.indicator === initial && h.full) : null;

  const howToLd = {
    "@context": "https://schema.org", "@type": "HowTo",
    name: "Investigate an IP, domain, URL or file hash across multiple threat-intel feeds",
    description: "A multi-source OSINT console: query VirusTotal, AbuseIPDB and Shodan in parallel, then geolocate the target.",
    step: [
      { "@type": "HowToStep", name: "Enter an indicator", text: "Paste an IP, domain, URL or file hash." },
      { "@type": "HowToStep", name: "Correlate feeds", text: "Review VirusTotal, AbuseIPDB and Shodan side by side." },
      { "@type": "HowToStep", name: "Geolocate", text: "Plot the resolved IP on the map console with ISP and ASN." },
    ],
  };

  return (
    <div className="surveil-grid">
      <Seo path="/osint/recon" title="Threat Lookup — Check IPs, Domains, URLs & File Hashes for Threats" description="A SOC-grade OSINT console. Correlate VirusTotal, AbuseIPDB and Shodan on any IP, domain, URL or file hash, with live geolocation — free, in your browser." keywords="OSINT console, SOC analyst tool, ip reputation, virustotal, abuseipdb, shodan, threat intelligence lookup, file hash lookup" jsonLd={howToLd} />

      <header className="mx-auto max-w-[1440px] px-4 pb-6 pt-14">
        <div className="mb-3"><Link to="/osint" className="inline-flex items-center gap-2 font-mono text-xs text-faint transition-colors hover:text-brand">← Threat Center</Link></div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/5 px-3 py-1"><span className="font-mono text-[11px] uppercase tracking-wider text-brand">★ Threat Lookup · the Threat Center flagship</span></div>
        <p className="eyebrow mb-3">// soc · threat investigation console</p>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight sm:text-5xl">Investigate. Correlate. <span className="text-brand text-glow">Verdict.</span></h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">A multi-source console for analysts. Drop an <span className="text-ink">IP, domain, URL, or file hash</span> and Cyber Rebels queries VirusTotal, AbuseIPDB and Shodan in parallel — then geolocates it. Every signal on one screen.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <BrandLogo slug="virustotal" name="VirusTotal" size={18} /><BrandLogo slug="abuseipdb" name="AbuseIPDB" size={18} /><BrandLogo slug="shodan" name="Shodan" size={18} />
          <span className="ml-1 font-mono text-[11px] text-faint">+ ipwho.is geolocation · cached &amp; rate-limited</span>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-4" id="investigate"><Investigator key={initial} initialQuery={initial} onResult={onResult} preset={presetEntry ? presetEntry.full : null} /><HistoryList items={history} onClear={clearH} /></section>

      <div className="mx-auto max-w-[1440px] px-4"><AdSlot slot="osint-mid" /></div>

      <section className="mx-auto max-w-[1440px] px-4 py-8">
        <Link to="/osint" className="panel group flex flex-wrap items-center gap-x-3 gap-y-1 p-5 transition-all hover:border-brand hover:shadow-glow">
          <span className="font-mono text-sm font-bold text-ink group-hover:text-brand">← Back to the Threat Center</span>
          <span className="min-w-0 text-sm text-muted">Intel Radar, Domain Intel, Email &amp; Phishing, SSL, QR, Decoder and more — all organized in the hub.</span>
          <span className="ml-auto flex-none font-mono text-xs text-brand">All tools →</span>
        </Link>
      </section>
    </div>
  );
}
