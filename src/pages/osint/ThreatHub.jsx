import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BrandLogo from "../../components/BrandLogo.jsx";

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const GROUPS = [
  {
    heading: "Investigate",
    note: "Pull intel on infrastructure and the live threat landscape.",
    tools: [
      { to: "/osint/intel", title: "Intel Radar", tag: "live", desc: "Live exploited CVEs (CISA KEV) plus ransomware, dark-web, IOC & DDoS feeds — and where to report cybercrime.", icon: (<svg {...ic}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3" /></svg>) },
      { to: "/osint/domain", title: "Domain Intel", tag: "whois", desc: "Registration age, registrar, nameservers, DNS records and a quick risk score for any domain.", icon: (<svg {...ic}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>) },
    ],
  },
  {
    heading: "Phishing & web",
    note: "Vet links, mail and certificates before you trust them.",
    tools: [
      { to: "/osint/email", title: "Email & Phishing Analyzer", tag: "headers", desc: "Originating IP, SPF/DKIM/DMARC, extracted links & domains, and an overall phishing score.", icon: (<svg {...ic}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>) },
      { to: "/osint/redirects", title: "URL Redirect Analyzer", tag: "links", desc: "Follow a short link through every hop to its real destination — without clicking it.", icon: (<svg {...ic}><path d="M4 7h12l-3-3M20 17H8l3 3" /></svg>) },
      { to: "/osint/ssl", title: "SSL Inspector", tag: "tls", desc: "Live TLS certificate: issuer, expiry, and every hostname the cert covers.", icon: (<svg {...ic}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>) },
      { to: "/osint/qr", title: "QR Code Scanner", tag: "decode", desc: "Decode a QR image and reveal where it really points before you scan it.", icon: (<svg {...ic}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7h-7" /></svg>) },
    ],
  },
  {
    heading: "Utilities",
    note: "The bench tools you reach for mid-investigation.",
    tools: [
      { to: "/osint/decoder", title: "Decoder Bench", tag: "cyberchef", desc: "Stack Base64 / Hex / URL / ROT13 / JWT and more — decode layered payloads step by step.", icon: (<svg {...ic}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></svg>) },
      { to: "/osint/username", title: "Username Search", tag: "people", desc: "Check a handle across dozens of platforms at once to map an online presence.", icon: (<svg {...ic}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>) },
    ],
  },
];

const EXPOSURE = [
  { to: "/osint/exposure", title: "What You're Leaking", desc: "Your live IP, location & fingerprint." },
  { to: "/osint/breach", title: "Breach & Password", desc: "Check leaked passwords privately." },
  { to: "/osint/footprint", title: "Footprint Audit", desc: "See yourself as an investigator would." },
  { to: "/osint/brokers", title: "Data Brokers", desc: "Scrub yourself from people-search sites." },
];

export default function ThreatHub() {
  const ld = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "Threat Center", description: "A SOC-style toolkit: a multi-source recon console plus focused modules for phishing, domains, certificates, decoding and live threat intel.",
  };
  return (
    <div className="surveil-grid">
      <Seo path="/osint" title="Threat Center — OSINT & Investigation Toolkit" description="A SOC-style Threat Center. Start with the Threat Lookup to investigate any IP, domain, URL or file hash across VirusTotal, AbuseIPDB and Shodan, then use focused modules for phishing, domains, SSL, decoding and live threat intel." keywords="threat center, osint toolkit, soc analyst tools, recon console, ip lookup, domain intel, phishing analyzer, intel radar" jsonLd={ld} />
      <PageHeader eyebrow="// threat center · investigation toolkit" title="Threat" accent="Center" intro="Every investigation tool in one place. Start with the Threat Lookup for any IP, domain, URL or file hash — then drop into the focused modules below." />

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {/* FEATURED — Threat Lookup (biggest tile) */}
        <Link to="/osint/recon" className="panel-accent group block overflow-hidden border-brand/50 shadow-glow transition-all hover:-translate-y-0.5">
          <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8">
              <span className="chip border-brand/50 text-brand">★ start here</span>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-line bg-elevated text-brand"><svg {...ic} width="26" height="26"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg></span>
                <h2 className="font-mono text-2xl font-bold text-ink group-hover:text-brand sm:text-3xl">Threat Lookup</h2>
              </div>
              <p className="mt-4 max-w-xl text-muted">Drop any <span className="text-ink">IP, domain, URL, or file hash</span> and correlate VirusTotal, AbuseIPDB and Shodan in parallel — with live geolocation and one clear verdict. The flagship of the Threat Center.</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <BrandLogo slug="virustotal" name="VirusTotal" size={18} />
                <BrandLogo slug="abuseipdb" name="AbuseIPDB" size={18} />
                <BrandLogo slug="shodan" name="Shodan" size={18} />
                <span className="font-mono text-[11px] text-faint">+ geolocation</span>
              </div>
              <span className="btn-primary mt-6 inline-flex">Open Threat Lookup →</span>
            </div>
            <div className="border-t border-line bg-elevated/30 p-6 sm:p-8 md:border-l md:border-t-0">
              <p className="mono-label mb-3">// sample verdict</p>
              <div className="rounded-md border border-danger/40 bg-danger/5 p-4 font-mono">
                <div className="flex items-center justify-between gap-2"><span className="chip flex-none border-danger/50 text-danger">MALICIOUS</span><span className="min-w-0 truncate text-xs text-faint">185.220.101.4</span></div>
                <p className="mt-2 text-sm font-bold text-danger">Flagged across 3 feeds</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded border border-line bg-base/40 p-2 text-center"><div className="text-lg font-bold tabular-nums text-danger">11</div><div className="text-[9px] uppercase tracking-wider text-faint">VT hits</div></div>
                  <div className="rounded border border-line bg-base/40 p-2 text-center"><div className="text-lg font-bold tabular-nums text-danger">100%</div><div className="text-[9px] uppercase tracking-wider text-faint">Abuse</div></div>
                  <div className="rounded border border-line bg-base/40 p-2 text-center"><div className="text-lg font-bold tabular-nums text-warn">7</div><div className="text-[9px] uppercase tracking-wider text-faint">Ports</div></div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* MODULE GROUPS */}
        {GROUPS.map((g) => (
          <div key={g.heading} className="mt-10">
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm tabular-nums text-brand">//</span>
              <h2 className="font-mono text-xl font-bold tracking-tight">{g.heading}</h2>
              <span className="font-mono text-xs text-faint">{g.note}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.tools.map((t) => (
                <Link key={t.to} to={t.to} className="panel group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-elevated text-brand transition-colors group-hover:border-brand">{t.icon}</span>
                    <h3 className="min-w-0 flex-1 font-mono text-base font-bold text-ink group-hover:text-brand">{t.title}</h3>
                    <span className="flex-none rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint group-hover:border-brand group-hover:text-brand">{t.tag}</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-snug text-muted">{t.desc}</p>
                  <span className="mt-3 font-mono text-xs text-brand">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* EXPOSURE */}
        <div className="mt-10">
          <div className="mb-4 flex items-baseline gap-3"><span className="font-mono text-sm tabular-nums text-brand">//</span><div><h2 className="font-mono text-xl font-bold tracking-tight">Audit your own exposure</h2><p className="mt-1 text-sm text-muted">Investigation is for infrastructure. These turn the lens on you — each on its own page.</p></div></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EXPOSURE.map((s) => (<Link key={s.to} to={s.to} className="panel group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow"><h3 className="font-mono text-base font-bold text-ink group-hover:text-brand">{s.title}</h3><p className="mt-1 flex-1 text-sm leading-snug text-muted">{s.desc}</p><span className="mt-3 font-mono text-xs text-brand">Open →</span></Link>))}
          </div>
          <div className="mt-5 rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm text-faint"><span className="font-mono text-muted">// ground rule:</span> investigate <strong className="text-muted">infrastructure</strong> (IPs, domains, links, hashes) freely — that&apos;s defense. The exposure tools above are for auditing <strong className="text-muted">your own</strong> footprint. Profiling other people without consent is surveillance, not what we&apos;re here for.</div>
        </div>
      </section>
    </div>
  );
}
