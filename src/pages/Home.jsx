import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import AdSlot from "../components/AdSlot.jsx";
import GeoConsole from "../components/GeoConsole.jsx";
import Logo from "../components/Logo.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { getIpInfo, getBrowserInfo, getOsInfo, getEnvSignals } from "../lib/detect.js";
import { useTheme } from "../lib/theme.jsx";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../lib/site.js";

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const IconRadar = () => (<svg {...ic} aria-hidden="true"><path d="M12 12 19 5" /><path d="M4 12a8 8 0 1 0 8-8" /><path d="M7.5 12a4.5 4.5 0 1 0 4.5-4.5" /><circle cx="12" cy="12" r="1" /></svg>);
const IconEye = () => (<svg {...ic} aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
const IconPrint = () => (<svg {...ic} aria-hidden="true"><path d="M12 4a6 6 0 0 0-6 6v3" /><path d="M12 4a6 6 0 0 1 6 6c0 5-1 7-1 7" /><path d="M9 10a3 3 0 0 1 6 0c0 4-1 6-1 8" /><path d="M12 11v4c0 2-.5 3-.5 4" /></svg>);
const IconMask = () => (<svg {...ic} aria-hidden="true"><path d="M3 6s2 9 9 9 9-9 9-9c-3-1-6-1.5-9-1.5S6 5 3 6Z" /><circle cx="8.5" cy="9" r="1" /><circle cx="15.5" cy="9" r="1" /></svg>);
const si = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

/* --------------- interactive recon console (home hero) --------------- */
function ConsoleLine({ l }) {
  if (l.t === "kv") return (<div><span className="text-faint">&gt;</span> <span className="text-muted">{l.k}</span> <span className="text-faint">{".".repeat(Math.max(2, 13 - l.k.length))}</span> <span className="text-brand">{l.v}</span></div>);
  if (l.t === "alert") return (<div><span className="text-faint">&gt;</span> <span className="text-muted">{l.k}</span> <span className="text-faint">{".".repeat(Math.max(2, 13 - l.k.length))}</span> <span className="font-bold text-danger">{l.v}</span></div>);
  if (l.t === "in") return (<div><span className="text-brand">visitor@cyber-rebels</span><span className="text-faint">:~$</span> <span className="text-ink">{l.text}</span></div>);
  if (l.t === "ok") return <div className="text-brand">{l.text}</div>;
  if (l.t === "warn") return <div className="text-warn">{l.text}</div>;
  if (l.t === "err") return <div className="text-danger">{l.text}</div>;
  if (l.t === "sys") return <div className="text-faint">{l.text}</div>;
  return <div className="text-muted">{l.text}</div>;
}

function InteractiveConsole() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [out, setOut] = useState([]);
  const [cmd, setCmd] = useState("");
  const [env, setEnv] = useState(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const browser = getBrowserInfo();
      const os = getOsInfo();
      const sig = getEnvSignals();
      const ip = await getIpInfo();
      if (cancelled) return;
      setEnv({ browser, os, sig, ip });
      const loc = ip.ok && !ip.limited ? [ip.city, ip.region, ip.country].filter(Boolean).join(", ") : "—";
      const seq = [
        { t: "sys", text: "cyber_rebels recon shell — type `help` for commands" },
        { t: "kv", k: "IP ADDRESS", v: ip.ok ? ip.ip : "unavailable" },
        { t: "kv", k: "LOCATION", v: loc },
        { t: "kv", k: "ISP", v: ip.org || "—" },
        { t: "kv", k: "BROWSER", v: `${browser.name} ${browser.version}` },
        { t: "kv", k: "OS", v: os },
        { t: "kv", k: "SCREEN", v: sig.screen },
        { t: "kv", k: "TIMEZONE", v: sig.timezone },
        { t: "kv", k: "LANGUAGES", v: sig.languages || sig.language },
        { t: "kv", k: "DO-NOT-TRACK", v: sig.doNotTrack ? "enabled" : "OFF" },
        { t: "alert", k: "STATUS", v: "NOT ANONYMOUS" },
      ];
      seq.forEach((l, i) => setTimeout(() => { if (!cancelled) setOut((pr) => [...pr, l]); }, 150 * (i + 1)));
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [out]);

  function print(...lines) { setOut((pr) => [...pr, ...lines]); }
  function run(raw) {
    const c = raw.trim();
    if (!c) return;
    print({ t: "in", text: c });
    const lc = c.toLowerCase();
    const goto = (path, msg) => { print({ t: "ok", text: msg }); setTimeout(() => navigate(path), 480); };
    if (lc === "help" || lc === "?") {
      print({ t: "out", text: "commands: lookup · osint · vpn · tracked · fingerprint · guides · whoami · neofetch · clear" });
      print({ t: "out", text: "tip: type a tool name to jump there — and a few commands are hidden…" });
    } else if (lc === "lookup" || lc === "investigate" || lc === "scan" || lc === "recon" || lc === "threat lookup") goto("/osint/recon", "> launching Threat Lookup…");
    else if (lc === "osint" || lc === "threat center" || lc === "threatcenter" || lc === "threat" || lc === "center") goto("/osint", "> opening the Threat Center…");
    else if (lc === "vpn" || lc === "vpns") goto("/best-vpns", "> opening VPN comparison…");
    else if (lc === "tracked" || lc === "am-i-tracked") goto("/am-i-tracked", "> running tracking report…");
    else if (lc === "fingerprint" || lc === "fp") goto("/fingerprint", "> reading your fingerprint…");
    else if (lc === "guides" || lc === "docs") goto("/guides", "> opening the guides…");
    else if (lc === "anti-detect" || lc === "antidetect") goto("/anti-detect", "> opening the anti-detect lab…");
    else if (lc === "whoami") {
      if (!env) { print({ t: "warn", text: "still scanning… give it a second and retry." }); return; }
      print({ t: "out", text: `${env.os} · ${env.browser.name} ${env.browser.version}` });
      print({ t: "out", text: `ip ${env.ip.ok ? env.ip.ip : "unknown"} · ${env.sig.timezone} · ${env.sig.screen}` });
      print({ t: "warn", text: "you are NOT anonymous — which is exactly the point." });
    } else if (lc === "clear" || lc === "cls") setOut([]);
    else if (lc === "matrix" || lc === "hacker") { setTheme("hacker"); print({ t: "ok", text: "> wake up, Neo… hacker mode engaged." }); }
    else if (lc.startsWith("sudo")) print({ t: "err", text: "nice try. nobody has root on the surveillance state." });
    else if (lc === "ls") print({ t: "out", text: "osint/  am-i-tracked/  fingerprint/  anti-detect/  guides/  best-vpns/" });
    else if (lc === "hello" || lc === "hi" || lc === "hey") print({ t: "out", text: "hey. stay paranoid out there." });
    else if (lc === "echo" || lc.startsWith("echo ")) print({ t: "out", text: c.slice(4).trim() });
    else if (lc === "date" || lc === "time") print({ t: "out", text: new Date().toString() });
    else if (lc === "pwd") print({ t: "out", text: "/home/rebel/secure" });
    else if (lc === "about" || lc === "cyber rebels" || lc === "cyberrebels") print({ t: "out", text: "Cyber Rebels — a free privacy & OSINT toolkit. The tools the watchers would rather you never found." });
    else if (lc === "neofetch") { print({ t: "ok", text: "rebel@cyber-rebels" }); print({ t: "out", text: "os " + (env ? env.os : "-") + " · shell recon.sh · uptime: always watching" }); print({ t: "out", text: "ip " + (env && env.ip.ok ? env.ip.ip : "-") + " · privacy: in your hands" }); }
    else if (lc === "nmap" || lc.startsWith("nmap ")) { print({ t: "out", text: "starting recon scan…" }); print({ t: "out", text: "22/tcp open ssh · 443/tcp open https · 8080/tcp filtered" }); print({ t: "warn", text: "(simulated — run Threat Lookup on a real IP for live ports)" }); }
    else if (lc === "ping" || lc.startsWith("ping ")) print({ t: "out", text: "PONG · you are online, and so is everyone watching you." });
    else if (lc === "coffee" || lc === "brew") print({ t: "out", text: "c[_] brewing… stay caffeinated, stay paranoid." });
    else if (lc === "42") print({ t: "out", text: "the answer to life, the universe, and your threat model." });
    else if (lc === "joke") print({ t: "out", text: "i would tell you a UDP joke, but you might not get it." });
    else if (lc === "flip" || lc === "coin") print({ t: "out", text: Math.random() < 0.5 ? "heads — trust no one." : "tails — verify everything." });
    else if (lc === "roll" || lc === "dice") print({ t: "out", text: "you rolled a " + (1 + Math.floor(Math.random() * 20)) + " (d20)." });
    else if (lc === "hack" || lc === "hack the planet") print({ t: "ok", text: "access granted… kidding. real hacking is reading the docs — try `guides`." });
    else if (lc.startsWith("rm -rf")) print({ t: "err", text: "permission denied. the rebellion protects its own." });
    else if (lc === "exit" || lc === "quit" || lc === "logout") print({ t: "warn", text: "no logging out of the surveillance economy — but you can fight it. type `lookup`." });
    else if (lc === "konami") print({ t: "ok", text: "up up down down left right left right B A — +30 privacy lives." });
    else if (lc === "banner") { print({ t: "ok", text: "[ C Y B E R ]" }); print({ t: "ok", text: "[ R E B E L S ]" }); }
    else print({ t: "err", text: `command not found: ${c} — type 'help'` });
  }
  function onSubmit(e) { e.preventDefault(); run(cmd); setCmd(""); }

  const located = env && env.ip && env.ip.ok && !env.ip.limited && typeof env.ip.lat === "number";

  return (
    <div className="space-y-3">
      <div className="panel-accent overflow-hidden font-mono text-[12px] sm:text-[13px]">
        <div className="console-bar">
          <span className="console-dot bg-danger/80" />
          <span className="console-dot bg-warn/80" />
          <span className="console-dot bg-brand/80" />
          <span className="ml-2 min-w-0 flex-1 truncate text-xs text-faint">what_every_site_sees.sh — interactive</span>
        </div>
        <div ref={bodyRef} onClick={() => inputRef.current?.focus()} className="h-[340px] cursor-text space-y-1 overflow-y-auto overflow-x-hidden break-words p-3 sm:p-5" aria-live="polite">
          {out.map((l, i) => <div key={i} className="animate-fade-up break-words">{<ConsoleLine l={l} />}</div>)}
          <form onSubmit={onSubmit} className="flex items-center gap-2 pt-1">
            <span className="flex-none text-brand">visitor@cyber-rebels<span className="text-faint">:~$</span></span>
            <input ref={inputRef} value={cmd} onChange={(e) => setCmd(e.target.value)} spellCheck="false" autoCapitalize="off" autoComplete="off" aria-label="Console command" placeholder="try: help, whoami, hacker" className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-faint/60" />
          </form>
        </div>
      </div>
      {located && <GeoConsole flag={env.ip.flag} lat={env.ip.lat} lon={env.ip.lon} label={[env.ip.city, env.ip.country].filter(Boolean).join(", ")} sub="↑ that's you — no login, no clicks" />}
    </div>
  );
}

const TRUST = ["Runs in your browser", "No sign-up, no logging", "Open-source friendly", "Every tool free"];

const STEPS = [
  { n: "01", title: "Expose", to: "/am-i-tracked", label: "privacy", icon: (<svg {...si} aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>), desc: "See the IP, location, and fingerprint every site grabs the second you connect — and a live privacy score." },
  { n: "02", title: "Investigate", to: "/osint/recon", label: "osint", icon: (<svg {...si} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>), desc: "Run any IP, domain, URL, or file hash through a multi-source SOC console before you click or trust it." },
  { n: "03", title: "Lock down", to: "/guides", label: "defense", icon: (<svg {...si} aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>), desc: "Plain-English guides and honest VPN picks to shut the leaks: Tor, passwords, browser hardening, de-Google." },
];

const TOOLS = [
  { to: "/what-is-my-ip", tag: "live", title: "What Is My IP?", Icon: IconRadar, desc: "Instantly see your public IP, approximate location and a live map — and what it quietly reveals about you." },
  { to: "/am-i-tracked", tag: "live", title: "Am I Being Tracked?", Icon: IconEye, desc: "A full report on what every site sees the moment you connect — IP, location, leaks, and a live privacy score." },
  { to: "/fingerprint", tag: "live", title: "Browser Fingerprint", Icon: IconPrint, desc: "The exact signals that follow you across the web with no cookies — and how rare your combination really is." },
  { to: "/anti-detect", tag: "lab", title: "Anti-Detect Lab", Icon: IconMask, desc: "Build and visualize fingerprint profiles, then learn how to actually stop trackers from recognizing you." },
];

const SECONDARY = [
  { to: "/guides", title: "Guides", desc: "12 step-by-step guides: access Tor safely, strong passwords, the dark web, and more." },
  { to: "/blog", title: "Blog", desc: "Plain-English explainers — fingerprinting, data brokers, and how to learn ethical hacking." },
  { to: "/best-vpns", title: "Best VPNs", desc: "Hide your IP and stop your ISP logging you. Top picks, compared honestly." },
  { to: "/quantum-vpn-tracker", title: "Quantum-Safe VPN Tracker", desc: "Which VPNs have actually deployed post-quantum encryption — sourced and dated." },
  { to: "/privacy-tools", title: "Private Swaps", desc: "Big-Tech apps and the private alternatives that replace them." },
];

export default function Home() {
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/osint?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="surveil-grid">
      <Seo path="/" jsonLd={websiteLd} />

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-16 z-0 opacity-[0.05]">
          <Logo size={420} className="text-brand" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/3 top-0 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-8 pt-12 sm:pt-16">
          <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/5 px-3 py-1">
                <Logo size={15} className="text-brand" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-brand">Free privacy &amp; OSINT toolkit</span>
              </div>

              <h1 className="font-mono text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
                Your free
                <br />
                cyber toolkit.
                <br />
                <span className="text-brand text-glow">Investigate. Expose. Defend.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg text-muted">
                <span className="font-semibold text-ink">{SITE_NAME} is a free cybersecurity toolkit.</span>{" "}
                See exactly what the web knows about you, investigate sketchy links and IPs with a
                pro-grade OSINT console, and lock yourself down — no jargon, no sign-up, all in your browser.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/osint" className="btn-primary">Threat Center →</Link>
                <Link to="/am-i-tracked" className="btn-ghost">See what they know</Link>
                <Link to="/best-vpns" className="btn-ghost">Best VPNs</Link>
              </div>
              <p className="mt-4 font-mono text-xs text-faint">
                ▸ talk to the console: try <span className="text-brand">whoami</span>, <span className="text-brand">lookup</span>, <span className="text-brand">vpn</span>, or <span className="text-brand">hacker</span> →
              </p>
            </div>

            <InteractiveConsole />
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 bg-panel px-4 py-3 font-mono text-xs text-muted">
                <span className="text-brand">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== EXPLORE (three pillars) ===================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-mono text-2xl font-bold tracking-tight">Everything in <span className="text-brand">three places.</span></h2>
          <span className="font-mono text-xs text-faint">// tools · guides · articles</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/tools" className="panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
            <div className="flex items-center justify-between"><span className="text-brand"><svg {...si} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg></span><span className="chip border-brand/50 text-brand">20+ live</span></div>
            <h3 className="mt-4 font-mono text-lg font-bold text-ink group-hover:text-brand">Tools</h3>
            <p className="mt-2 flex-1 text-sm text-muted">Interactive, instant-result utilities — threat lookups, tracker &amp; fingerprint checks, the Quantum-Safe VPN Tracker, pen-test helpers and labs.</p>
            <span className="mt-4 font-mono text-sm text-brand">Open the directory →</span>
          </Link>
          <Link to="/guides" className="panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
            <div className="flex items-center justify-between"><span className="text-brand"><svg {...si} aria-hidden="true"><path d="M4 5h10a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4Z" /><path d="M20 5h-3a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h4Z" /></svg></span><span className="chip">16 guides</span></div>
            <h3 className="mt-4 font-mono text-lg font-bold text-ink group-hover:text-brand">Guides</h3>
            <p className="mt-2 flex-1 text-sm text-muted">Step-by-step, plain-English how-tos: access Tor safely, build uncrackable passwords, harden your browser and phone, spot phishing.</p>
            <span className="mt-4 font-mono text-sm text-brand">Read the guides →</span>
          </Link>
          <Link to="/blog" className="panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
            <div className="flex items-center justify-between"><span className="text-brand"><svg {...si} aria-hidden="true"><path d="M4 4h16v14H7l-3 3Z" /><path d="M8 9h8M8 13h5" /></svg></span><span className="chip">7 articles</span></div>
            <h3 className="mt-4 font-mono text-lg font-bold text-ink group-hover:text-brand">Blog</h3>
            <p className="mt-2 flex-1 text-sm text-muted">Timely explainers and commentary — fingerprinting, data brokers, where to report cybercrime, and how to learn ethical hacking.</p>
            <span className="mt-4 font-mono text-sm text-brand">Read the blog →</span>
          </Link>
        </div>
      </section>

      {/* ===================== WHAT YOU CAN DO HERE ===================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-mono text-2xl font-bold tracking-tight">Three moves, <span className="text-brand">one toolkit.</span></h2>
          <span className="font-mono text-xs text-faint">// expose → investigate → lock down</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <Link key={s.n} to={s.to} className="panel group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-elevated text-brand transition-colors group-hover:border-brand">{s.icon}</span>
                <span className="font-mono text-[11px] tabular-nums text-faint">{s.n}</span>
                <span className="ml-auto rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint group-hover:border-brand group-hover:text-brand">{s.label}</span>
              </div>
              <h3 className="mt-4 font-mono text-lg font-bold text-ink group-hover:text-brand">{s.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-snug text-muted">{s.desc}</p>
              <span className="mt-4 font-mono text-xs text-brand">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== OSINT (one option, still prominent) ===================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-8">
        <Link to="/osint/recon" className="panel-accent group block overflow-hidden transition-all hover:shadow-glow">
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="text-brand"><IconRadar /></span>
                <h2 className="font-mono text-xl font-bold text-ink group-hover:text-brand sm:text-2xl">OSINT &amp; Threat Console</h2>
                <span className="hidden rounded bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand sm:inline">for analysts</span>
              </div>
              <p className="mt-4 max-w-xl text-muted">Going deeper? The OSINT console correlates VirusTotal, AbuseIPDB and Shodan on any IP, domain, URL, or file hash — with live geolocation. A SOC-grade investigation tool, free.</p>
              <ul className="mt-5 grid gap-2 font-mono text-sm text-muted sm:grid-cols-2">
                <li className="flex items-center gap-2"><span className="text-brand">›</span> Multi-source verdict</li>
                <li className="flex items-center gap-2"><span className="text-brand">›</span> Open ports &amp; CVEs (Shodan)</li>
                <li className="flex items-center gap-2"><span className="text-brand">›</span> Abuse score &amp; scanner intel</li>
                <li className="flex items-center gap-2"><span className="text-brand">›</span> Live IP geolocation map</li>
              </ul>
              <span className="btn-primary mt-7 inline-flex">Open Threat Lookup →</span>
            </div>
            <div className="border-t border-line bg-elevated/30 p-6 sm:p-8 md:border-l md:border-t-0">
              <p className="mono-label mb-3">// sample verdict</p>
              <div className="rounded-md border border-danger/40 bg-danger/5 p-4 font-mono">
                <div className="flex items-center justify-between"><span className="chip border-danger/50 text-danger">MALICIOUS</span><span className="truncate text-xs text-faint">185.220.101.4</span></div>
                <p className="mt-2 text-sm font-bold text-danger">Flagged across 3 feeds</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded border border-line bg-base/40 p-2 text-center"><div className="text-lg font-bold tabular-nums text-danger">11</div><div className="text-[9px] uppercase tracking-wider text-faint">VT hits</div></div>
                  <div className="rounded border border-line bg-base/40 p-2 text-center"><div className="text-lg font-bold tabular-nums text-danger">100%</div><div className="text-[9px] uppercase tracking-wider text-faint">Abuse</div></div>
                  <div className="rounded border border-line bg-base/40 p-2 text-center"><div className="text-lg font-bold tabular-nums text-warn">7</div><div className="text-[9px] uppercase tracking-wider text-faint">Ports</div></div>
                </div>
              </div>
              <p className="mt-3 font-mono text-[11px] text-faint">Live data from VirusTotal · AbuseIPDB · Shodan.</p>
            </div>
          </div>
        </Link>
      </section>

      {/* intelligence sources */}
      <section className="mx-auto max-w-[1440px] px-4 py-6">
        <div className="panel flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">// intelligence sources</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <BrandLogo slug="virustotal" name="VirusTotal" size={22} />
            <BrandLogo slug="abuseipdb" name="AbuseIPDB" size={22} />
            <BrandLogo slug="shodan" name="Shodan" size={22} />
            <BrandLogo slug="haveibeenpwned" name="Have I Been Pwned" size={22} />
            <BrandLogo name="ipwho.is" size={22} />
          </div>
        </div>
      </section>

      {/* ===================== TRUSTED & RECOMMENDED ===================== */}
      <section className="mx-auto max-w-[1440px] px-4 pb-16">
        <div className="panel p-6 sm:p-8">
          <h2 className="font-mono text-2xl font-bold tracking-tight">Tools we <span className="text-brand">trust &amp; recommend</span></h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">Cyber Rebels stays free partly because a couple of the tools we genuinely recommend are affiliate-supported — using these links costs you nothing extra and helps keep every tool on this site free, and we only list products we would actually run ourselves. The live threat intelligence here is powered by trusted public sources, and we point you to the same authoritative security frameworks and government resources that professional analysts rely on every day.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <a href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=151110&url_id=902" target="_blank" rel="sponsored noopener noreferrer" className="panel-accent group relative flex flex-col overflow-hidden border-brand/50 p-5 shadow-glow transition-all hover:-translate-y-0.5">
              <span className="absolute right-0 top-0 rounded-bl-lg bg-brand px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-onbrand">★ Editor&apos;s choice</span>
              <div className="flex items-center gap-3"><BrandLogo slug="nordvpn" name="NordVPN" size={30} /><h3 className="font-mono text-lg font-bold text-ink group-hover:text-brand">NordVPN</h3><span className="chip border-brand/50 text-brand">95/100</span></div>
              <p className="mt-2 flex-1 text-sm text-muted">Our <span className="text-ink">#1 VPN pick</span> — independently-audited no-logs, thousands of RAM-only servers worldwide, and built-in Threat Protection that blocks malware, trackers and malicious sites before they load. Hide your IP and stop your ISP logging every site you visit.</p>
              <span className="btn-primary mt-4 w-full">Get the NordVPN deal →</span>
            </a>
            <a href="https://go.nordpass.io/aff_c?offer_id=488&aff_id=151110&url_id=9356" target="_blank" rel="sponsored noopener noreferrer" className="panel-accent group relative flex flex-col overflow-hidden border-brand/40 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
              <span className="absolute right-0 top-0 rounded-bl-lg bg-elevated px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">Nord Security</span>
              <div className="flex items-center gap-3"><BrandLogo slug="nordpass" name="NordPass" size={30} /><h3 className="font-mono text-lg font-bold text-ink group-hover:text-brand">NordPass</h3></div>
              <p className="mt-2 flex-1 text-sm text-muted">The password manager from the makers of NordVPN — <span className="text-ink">zero-knowledge</span> vault, passkeys, a built-in data-breach scanner and secure sharing, with unique strong passwords synced across all your devices.</p>
              <span className="btn-ghost mt-4 w-full">Get NordPass →</span>
            </a>
          </div>
          <div className="mt-6">
            <p className="mono-label mb-2">// trusted sources, frameworks &amp; government resources</p>
            <div className="flex flex-wrap gap-2">
              {[["VirusTotal", "https://www.virustotal.com/"], ["Shodan", "https://www.shodan.io/"], ["AbuseIPDB", "https://www.abuseipdb.com/"], ["Have I Been Pwned", "https://haveibeenpwned.com/"], ["MITRE ATT&CK", "https://attack.mitre.org/"], ["CIS Benchmarks", "https://www.cisecurity.org/cis-benchmarks"], ["CISA", "https://www.cisa.gov/"], ["FBI IC3", "https://www.ic3.gov/"]].map(([n, u]) => (
                <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="chip hover:border-brand hover:text-brand">{n} ↗</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE REST OF THE TOOLKIT ===================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-mono text-2xl font-bold tracking-tight">The rest of the <span className="text-brand">arsenal.</span></h2>
          <span className="font-mono text-xs text-faint">// everything runs in your browser</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((c) => (
            <Link key={c.to} to={c.to} className="panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="text-brand">{<c.Icon />}</span>
                <span className="ml-auto rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint group-hover:border-brand group-hover:text-brand">{c.tag}</span>
              </div>
              <h3 className="mt-4 font-mono text-lg font-bold text-ink group-hover:text-brand">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{c.desc}</p>
              <span className="mt-4 font-mono text-sm text-brand">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4"><AdSlot slot="home-mid" /></div>

      {/* ============================== WHY ============================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="panel p-8 sm:p-10">
          <h2 className="font-mono text-2xl font-bold tracking-tight">You&apos;re not paranoid. You&apos;re <span className="text-brand">profiled.</span></h2>
          <p className="mt-4 max-w-3xl text-muted">Every site you open quietly collects your IP, location, device, and a fingerprint unique enough to follow you across the web — no login required. We&apos;re not here to scare you. We&apos;re here to hand you the same tools the privacy-obsessed already use, in language that actually makes sense.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/am-i-tracked" className="btn-primary">See what they get</Link>
            <Link to="/guides/access-tor-safely" className="btn-ghost">Start with a guide</Link>
          </div>
        </div>
      </section>

      {/* ===================== SECONDARY ===================== */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 pb-16">
        <div className="mb-6">
          <h2 className="font-mono text-2xl font-bold tracking-tight">Then <span className="text-brand">lock it down</span></h2>
          <p className="mt-2 max-w-2xl text-muted">Once you&apos;ve seen the problem, here&apos;s how to fix it — real guides, honest reviews, and the swaps that ditch the trackers baked into your daily apps.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SECONDARY.map((c) => (
            <Link key={c.to} to={c.to} className="panel group flex flex-col p-6 transition-all hover:border-brand">
              <h3 className="font-mono text-[1rem] font-bold text-ink group-hover:text-brand">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{c.desc}</p>
              <span className="mt-4 font-mono text-xs text-brand">Open →</span>
            </Link>
          ))}
        </div>
      </section>


    </div>
  );
}
