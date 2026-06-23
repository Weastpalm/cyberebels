import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { AffiliateButton } from "../components/Affiliate.jsx";
import { getBrowserInfo, getOsInfo, getEnvSignals } from "../lib/detect.js";
import { buildFingerprint } from "../lib/fingerprint.js";

const STORAGE = "cyberebels-antidetect-profiles";

/* ---------------------------- option pools ---------------------------- */
const UA_PRESETS = [
  ["Windows · Chrome", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"],
  ["macOS · Safari", "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"],
  ["Linux · Firefox", "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0"],
  ["Windows · Edge", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"],
  ["Android · Chrome", "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36"],
  ["iPhone · Safari", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"],
];
const PLATFORMS = ["Win32", "MacIntel", "Linux x86_64", "iPhone", "Linux armv8l"];
const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Europe/Paris", "Asia/Tokyo", "Asia/Singapore", "Australia/Sydney", "UTC"];
const LANGS = ["en-US", "en-GB", "de-DE", "fr-FR", "es-ES", "pt-BR", "ja-JP", "zh-CN"];
const SCREENS = ["1920×1080", "2560×1440", "1366×768", "1440×900", "3840×2160", "390×844"];
const DEPTHS = [24, 30, 16];
const CORES = [2, 4, 8, 12, 16];
const MEM = [2, 4, 8, 16];
const GL_VENDORS = ["Google Inc. (Intel)", "Google Inc. (NVIDIA)", "Google Inc. (AMD)", "Apple", "Qualcomm"];
const GL_RENDERERS = [
  "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)",
  "ANGLE (AMD, AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0)",
  "Apple GPU",
  "Adreno (TM) 740",
];
const WEBRTC = ["Default (may leak local IP)", "Disabled (no leak)", "Public IP only"];

const pick = (a) => a[Math.floor(Math.random() * a.length)];

function randomProfile(label) {
  const ua = pick(UA_PRESETS);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2),
    label: label || "Profile " + Math.floor(Math.random() * 900 + 100),
    uaPreset: ua[0],
    userAgent: ua[1],
    platform: pick(PLATFORMS),
    timezone: pick(TIMEZONES),
    language: pick(LANGS),
    screen: pick(SCREENS),
    colorDepth: pick(DEPTHS),
    cores: pick(CORES),
    memory: pick(MEM),
    glVendor: pick(GL_VENDORS),
    glRenderer: pick(GL_RENDERERS),
    canvasSpoof: Math.random() > 0.4,
    webrtc: pick(WEBRTC),
    dnt: Math.random() > 0.5,
  };
}

/* --------- rough, honestly-labeled rarity estimate from choices --------- */
function rarityBits(p) {
  let b = 0;
  b += /Windows|Macintosh/.test(p.userAgent) ? 3 : 6;
  b += ["America/New_York", "America/Chicago", "Europe/London", "Europe/Berlin"].includes(p.timezone) ? 5 : 8;
  b += ["1920×1080", "1366×768"].includes(p.screen) ? 2 : 4;
  b += p.language === "en-US" ? 2 : 4;
  b += /Intel/.test(p.glRenderer) ? 3 : 5;
  b += [4, 8].includes(p.cores) ? 1.5 : 3;
  b += p.memory === 8 ? 1 : 2.5;
  b += p.colorDepth === 24 ? 0.5 : 2;
  b += 2; // platform
  b += p.canvasSpoof ? 2 : 1.5;
  b += p.dnt ? 1 : 0.3;
  return b;
}

async function hashProfile(p) {
  const str = [p.userAgent, p.platform, p.timezone, p.language, p.screen, p.colorDepth, p.cores, p.memory, p.glVendor, p.glRenderer, p.canvasSpoof, p.webrtc, p.dnt].join("|");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

/* -------------------------------- field UI -------------------------------- */
function Select({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-faint">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field font-mono text-xs">
        {options.map((o) => (
          <option key={String(o)} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function Toggle({ label, on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} className="flex items-center justify-between rounded-md border border-line bg-elevated/40 px-3 py-2.5 text-left">
      <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-brand" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-base transition-all ${on ? "left-4" : "left-0.5"}`} />
      </span>
    </button>
  );
}

/* ================================ page ================================ */
export default function AntiDetect() {
  const [profiles, setProfiles] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) { const p = JSON.parse(raw); if (Array.isArray(p) && p.length) return p; }
    } catch { /* ignore */ }
    return [randomProfile("Demo profile")];
  });
  const [activeId, setActiveId] = useState(() => null);
  const [real, setReal] = useState(null);
  const [hash, setHash] = useState("········");

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(profiles)); } catch { /* ignore */ }
  }, [profiles]);

  useEffect(() => {
    if (!activeId && profiles[0]) setActiveId(profiles[0].id);
  }, [profiles, activeId]);

  useEffect(() => {
    (async () => {
      const env = getEnvSignals();
      const fp = await buildFingerprint();
      setReal({
        userAgent: getBrowserInfo().ua,
        os: getOsInfo(),
        platform: env.platform,
        timezone: env.timezone,
        language: env.language,
        screen: env.screen.replace(/\s/g, ""),
        glRenderer: fp.webgl?.renderer || "—",
        hash: fp.fullHash,
      });
    })();
  }, []);

  const active = profiles.find((p) => p.id === activeId) || profiles[0];

  useEffect(() => {
    if (active) hashProfile(active).then(setHash);
  }, [active]);

  const rarity = useMemo(() => {
    if (!active) return null;
    const bits = rarityBits(active);
    const denom = Math.min(Math.pow(2, bits), 5_000_000_000);
    return { bits, denom, unique: bits > 33 };
  }, [active]);

  function update(field, value) {
    setProfiles((ps) => ps.map((p) => (p.id === active.id ? { ...p, [field]: value } : p)));
  }
  function setUaPreset(name) {
    const found = UA_PRESETS.find((u) => u[0] === name);
    setProfiles((ps) => ps.map((p) => (p.id === active.id ? { ...p, uaPreset: name, userAgent: found ? found[1] : p.userAgent } : p)));
  }
  function addProfile() {
    const np = randomProfile();
    setProfiles((ps) => [...ps, np]);
    setActiveId(np.id);
  }
  function duplicate() {
    const np = { ...active, id: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2), label: active.label + " copy" };
    setProfiles((ps) => [...ps, np]);
    setActiveId(np.id);
  }
  function randomizeActive() {
    const np = randomProfile(active.label);
    np.id = active.id;
    setProfiles((ps) => ps.map((p) => (p.id === active.id ? np : p)));
  }
  function remove(id) {
    setProfiles((ps) => {
      const next = ps.filter((p) => p.id !== id);
      if (id === activeId) setActiveId(next[0]?.id || null);
      return next.length ? next : [randomProfile("Demo profile")];
    });
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is an antidetect browser?", acceptedAnswer: { "@type": "Answer", text: "An antidetect browser is desktop software that gives each browser profile its own spoofed fingerprint and proxy, so websites see each profile as a separate device. Legitimate uses include privacy and managing genuinely separate business accounts." } },
      { "@type": "Question", name: "Does this tool hide my browser from websites?", acceptedAnswer: { "@type": "Answer", text: "No. This is a design lab that builds and visualizes what a fingerprint profile would look like. It cannot change what other websites see, because that requires browser-engine-level software. To actually browse under a profile you need a real antidetect browser or automation framework." } },
      { "@type": "Question", name: "How do I actually reduce my fingerprint?", acceptedAnswer: { "@type": "Answer", text: "Use a browser built to resist fingerprinting: Brave randomizes key signals per site, while Tor Browser and Mullvad Browser make everyone look identical. These protect a single real identity, which is what most people actually want." } },
    ],
  };

  if (!active) return null;

  return (
    <div className="surveil-grid">
      <Seo
        path="/anti-detect"
        title="Anti-Detect Lab: Build & Visualize a Browser Fingerprint"
        description="An interactive lab to design fingerprint profiles — edit user-agent, timezone, screen, WebGL and more, and watch the resulting fingerprint and rarity change. Plus honest guidance on what antidetect browsers can and can't do."
        keywords="antidetect browser, anti-detect profile, browser fingerprint spoofing, dolphin anty alternative, fingerprint randomizer"
        jsonLd={faqLd}
      />

      <header className="mx-auto max-w-[1440px] px-4 pb-4 pt-14">
        <p className="mono-label mb-3">// anti-detect · fingerprint lab</p>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight sm:text-5xl">
          The Anti-Detect <span className="text-brand">Lab.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Build fingerprint profiles like an antidetect browser would — change the
          user-agent, timezone, screen, hardware and WebGL, and watch the resulting
          fingerprint and its rarity shift in real time.
        </p>
      </header>

      {/* HONESTY BANNER — prominent, on purpose */}
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="rounded-md border border-warn/40 bg-warn/5 p-4">
          <p className="font-mono text-sm font-bold text-warn">⚠ Read this first — what this lab is, and isn't</p>
          <p className="mt-2 text-sm text-muted">
            This is a <strong className="text-ink">design and visualization tool</strong>. It builds what a
            fingerprint profile would look like and computes the resulting hash — but it does
            <strong className="text-ink"> not</strong> change what real websites see about you. That's impossible
            from a normal web page: true fingerprint spoofing happens at the browser-engine level, in
            dedicated desktop software. To actually browse under these profiles you'd need a real antidetect
            browser or an automation framework. Use that power for legitimate privacy and separation — not to
            evade bans or run fraud.
          </p>
        </div>
      </div>

      {/* THE LAB */}
      <div className="mx-auto mt-8 max-w-[1440px] px-4">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* profile sidebar */}
          <aside className="panel h-fit p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-faint">Profiles</span>
              <span className="chip">{profiles.length}</span>
            </div>
            <div className="space-y-1.5">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left font-mono text-xs transition-colors ${p.id === active.id ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:border-brand/50 hover:text-ink"}`}
                >
                  <span className="truncate">{p.label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); remove(p.id); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); remove(p.id); } }}
                    className="ml-2 text-faint hover:text-danger"
                    aria-label={`Delete ${p.label}`}
                  >
                    ✕
                  </span>
                </button>
              ))}
            </div>
            <button onClick={addProfile} className="btn-primary mt-3 w-full text-xs">+ New profile</button>
            <button onClick={duplicate} className="btn-ghost mt-2 w-full text-xs">Duplicate active</button>
          </aside>

          {/* editor + readout */}
          <div className="space-y-6">
            {/* computed fingerprint readout */}
            <div className="panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-faint">Resulting fingerprint</span>
                  <div className="mt-1 font-mono text-2xl font-bold text-brand">{hash}</div>
                </div>
                <button onClick={randomizeActive} className="btn-ghost text-xs">⟳ Randomize</button>
              </div>
              {rarity && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-line bg-elevated/40 p-3">
                    <div className="font-mono text-lg font-bold text-ink">{rarity.unique ? "unique" : `~1 in ${Math.round(rarity.denom).toLocaleString()}`}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">est. rarity</div>
                  </div>
                  <div className="rounded-md border border-line bg-elevated/40 p-3">
                    <div className="font-mono text-lg font-bold text-ink">{rarity.bits.toFixed(1)} bits</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">entropy est.</div>
                  </div>
                  <div className="rounded-md border border-line bg-elevated/40 p-3">
                    <div className={`font-mono text-lg font-bold ${rarity.bits > 33 ? "text-danger" : "text-brand"}`}>{rarity.bits > 33 ? "stands out" : "blends in"}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">verdict</div>
                  </div>
                </div>
              )}
              <p className="mt-3 font-mono text-[11px] text-faint">
                Rarity is an estimate from your choices — lower is better. Common values (en-US, 1920×1080, Intel)
                help you blend in; rare combinations make a profile easier to single out.
              </p>
            </div>

            {/* editor */}
            <div className="panel p-5">
              <label className="block">
                <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-faint">Profile name</span>
                <input value={active.label} onChange={(e) => update("label", e.target.value)} className="field font-mono text-sm" />
              </label>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Select label="User-agent preset" value={active.uaPreset} options={[...UA_PRESETS.map((u) => u[0])]} onChange={setUaPreset} />
                <Select label="Platform" value={active.platform} options={PLATFORMS} onChange={(v) => update("platform", v)} />
              </div>
              <label className="mt-3 block">
                <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-faint">User-agent string (editable)</span>
                <textarea value={active.userAgent} onChange={(e) => update("userAgent", e.target.value)} rows={2} className="field font-mono text-[11px] leading-relaxed" />
              </label>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Select label="Timezone" value={active.timezone} options={TIMEZONES} onChange={(v) => update("timezone", v)} />
                <Select label="Language" value={active.language} options={LANGS} onChange={(v) => update("language", v)} />
                <Select label="Screen" value={active.screen} options={SCREENS} onChange={(v) => update("screen", v)} />
                <Select label="Color depth" value={active.colorDepth} options={DEPTHS} onChange={(v) => update("colorDepth", Number(v))} />
                <Select label="CPU cores" value={active.cores} options={CORES} onChange={(v) => update("cores", Number(v))} />
                <Select label="Device memory (GB)" value={active.memory} options={MEM} onChange={(v) => update("memory", Number(v))} />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Select label="WebGL vendor" value={active.glVendor} options={GL_VENDORS} onChange={(v) => update("glVendor", v)} />
                <Select label="WebRTC policy" value={active.webrtc} options={WEBRTC} onChange={(v) => update("webrtc", v)} />
              </div>
              <Select label="WebGL renderer" value={active.glRenderer} options={GL_RENDERERS} onChange={(v) => update("glRenderer", v)} />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Toggle label="Spoof canvas / audio" on={active.canvasSpoof} onChange={(v) => update("canvasSpoof", v)} />
                <Toggle label="Send Do-Not-Track" on={active.dnt} onChange={(v) => update("dnt", v)} />
              </div>
            </div>

            {/* diff vs real */}
            {real && (
              <div className="panel p-5">
                <span className="font-mono text-xs uppercase tracking-wider text-faint">Profile vs your real browser</span>
                <div className="mt-3 space-y-2">
                  {[
                    ["User-agent", active.userAgent, real.userAgent],
                    ["Timezone", active.timezone, real.timezone],
                    ["Language", active.language, real.language],
                    ["Screen", active.screen, real.screen],
                    ["Platform", active.platform, real.platform],
                    ["WebGL renderer", active.glRenderer, real.glRenderer],
                  ].map(([k, prof, r]) => {
                    const masked = String(prof) !== String(r);
                    return (
                      <div key={k} className="grid grid-cols-[110px_1fr_auto] items-center gap-2 border-b border-line/40 pb-2 text-xs last:border-0">
                        <span className="text-faint">{k}</span>
                        <span className="truncate font-mono text-muted" title={String(prof)}>{String(prof)}</span>
                        <span className={`chip ${masked ? "border-brand/50 text-brand" : "border-danger/50 text-danger"}`}>{masked ? "masked" : "real"}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 font-mono text-[11px] text-faint">
                  "masked" = the profile differs from your real value. Remember: this is the design — your
                  actual browser still reports your real values to websites right now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4"><AdSlot slot="antidetect-mid" /></div>

      {/* What antidetect browsers really are */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="font-mono text-2xl font-bold tracking-tight">So what's a real antidetect browser?</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Tools like Dolphin&#123;anty&#125; and Multilogin are desktop applications built on a customized
          browser engine. Each profile gets its own spoofed fingerprint <em>and</em> its own proxy, so sites
          treat every profile as a separate, real device. They're used legitimately for privacy, ad
          verification, and managing genuinely separate business accounts — and abused for mass
          multi-accounting and fraud, which is why hosting an operational one would get a site like this
          banned from ad and affiliate networks.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          A web page can't do that job. It can only read and tweak its own environment — never override what
          another tab or site sees. So this lab teaches the mechanics honestly; it doesn't pretend to be the
          engine.
        </p>
      </section>

      {/* Defensive recommendations — the thing most people actually want */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <div className="panel p-6">
          <h2 className="font-mono text-xl font-bold">Want to actually be harder to track?</h2>
          <p className="mt-2 text-sm text-muted">
            For protecting your own single identity — which is what most people need — a privacy browser beats
            any profile spoofing.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-line bg-elevated/40 p-4">
              <h3 className="font-mono text-sm font-bold text-brand">Brave</h3>
              <p className="mt-1 text-xs text-muted">Randomizes key fingerprint signals per site and blocks trackers by default.</p>
              <AffiliateButton to="brave" variant="ghost" className="mt-3 w-full text-xs">Get Brave →</AffiliateButton>
            </div>
            <div className="rounded-md border border-line bg-elevated/40 p-4">
              <h3 className="font-mono text-sm font-bold text-brand">Mullvad Browser</h3>
              <p className="mt-1 text-xs text-muted">Built with the Tor Project to make every user look identical. Pair with a VPN.</p>
              <a href="https://mullvad.net/en/browser" target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full text-xs">Learn more ↗</a>
            </div>
            <div className="rounded-md border border-line bg-elevated/40 p-4">
              <h3 className="font-mono text-sm font-bold text-brand">Tor Browser</h3>
              <p className="mt-1 text-xs text-muted">Maximum anonymity — everyone shares one fingerprint and traffic is onion-routed.</p>
              <Link to="/guides/access-tor-safely" className="btn-ghost mt-3 w-full text-xs">Read the guide →</Link>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/fingerprint" className="btn-primary">Test your real fingerprint →</Link>
            <Link to="/am-i-tracked" className="btn-ghost">See what sites know →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
