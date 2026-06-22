import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";
import { cisaKev } from "../../lib/osint.js";

const sv = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const FEEDS = [
  { tag: "credential leak", title: "FortiBleed Exposure Checker", icon: (<svg {...sv}><circle cx="8" cy="15" r="4" /><path d="m10.85 12.15 8.15-8.15M16 7l3-3M18 9l2-2" /></svg>),
    desc: "SOCRadar's free checker for the June 2026 FortiBleed leak — verify whether your domain or a public IP appears in the dataset of ~75,000 compromised Fortinet FortiGate VPN credentials.",
    links: [["Check your exposure ↗", "https://socradar.io/free-tools/fortibleed", true]] },
  { tag: "dark web", title: "Dark Web & Breach Exposure", icon: (<svg {...sv}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M5 7c4 2 10 2 14 0M5 17c4-2 10-2 14 0" /></svg>),
    desc: "Find out if your emails and passwords have surfaced in breaches and dark-web dumps. The breach checker on this site is free and private; SOCRadar and Dehashed go deeper.",
    links: [["Run the breach check", "/osint/breach", false], ["Have I Been Pwned ↗", "https://haveibeenpwned.com/", true]] },
  { tag: "ransomware", title: "Ransomware Intel", icon: (<svg {...sv}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></svg>),
    desc: "Track active ransomware gangs and the victims they post on their leak sites — who's being hit, by which group, and when. Updated continuously from public DLS monitoring.",
    links: [["ransomware.live ↗", "https://www.ransomware.live/", true], ["ransomlook.io ↗", "https://www.ransomlook.io/", true]] },
  { tag: "IOC radar", title: "IOC Feeds", icon: (<svg {...sv}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="9" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>),
    desc: "Fresh indicators of compromise — malicious URLs, botnet C2 IPs, and file hashes — from open community feeds. Pivot any indicator straight into the Investigate Console.",
    links: [["abuse.ch URLhaus ↗", "https://urlhaus.abuse.ch/", true], ["ThreatFox ↗", "https://threatfox.abuse.ch/", true], ["AlienVault OTX ↗", "https://otx.alienvault.com/", true]] },
  { tag: "ddos", title: "DDoS & Attack Trends", icon: (<svg {...sv}><path d="M3 12h3l2-7 4 14 2-7h3" /><path d="M19 12h2" /></svg>),
    desc: "Near-real-time global DDoS and attack trends — what's being targeted, attack types, and where traffic anomalies are spiking right now.",
    links: [["Cloudflare Radar ↗", "https://radar.cloudflare.com/security-and-attacks", true], ["Digital Attack Map ↗", "https://www.digitalattackmap.com/", true], ["Zone-H defacements ↗", "https://zone-h.org/", true]] },
  { tag: "frameworks", title: "Frameworks & Benchmarks", icon: (<svg {...sv}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 9h16M9 4v16" /></svg>),
    desc: "The playbooks defenders map against: MITRE ATT&CK for adversary tactics and techniques, and CIS Benchmarks for hardening systems to a known-good baseline.",
    links: [["MITRE ATT&CK ↗", "https://attack.mitre.org/", true], ["CIS Benchmarks ↗", "https://www.cisecurity.org/cis-benchmarks", true]] },
];

const GOV = {
  desc: "Official advisories — and exactly where to report cybercrime. The FBI's IC3 is where individuals and businesses file complaints about fraud, scams and hacking; CISA publishes alerts and takes incident reports; and the MS-ISAC supports U.S. state, local, tribal & territorial government.",
  links: [["⚠ Report to FBI IC3 ↗", "https://www.ic3.gov/", true, true], ["⚠ Report to CISA ↗", "https://www.cisa.gov/report", true, true], ["CISA advisories ↗", "https://www.cisa.gov/news-events/cybersecurity-advisories", true], ["MS-ISAC ↗", "https://www.cisecurity.org/ms-isac", true]],
};

function FeedLinks({ links }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map(([label, to, ext, primary]) => ext
        ? <a key={to} href={to} target="_blank" rel="noopener noreferrer" className={(primary ? "btn-primary" : "btn-ghost") + " px-3 py-2 text-xs"}>{label}</a>
        : <Link key={to} to={to} className="btn-primary px-3 py-2 text-xs">{label}</Link>)}
    </div>
  );
}

export default function IntelRadar() {
  const [kev, setKev] = useState({ status: "loading" });
  useEffect(() => { let on = true; cisaKev().then((r) => { if (on) setKev({ status: "done", ...r }); }); return () => { on = false; }; }, []);

  return (
    <div className="surveil-grid">
      <Seo path="/osint/intel" title="Intel Radar — Exploited CVEs, Ransomware, Dark Web & DDoS" description="A threat-intelligence radar: live actively-exploited CVEs (CISA KEV, ransomware-flagged) plus curated feeds for FortiBleed, dark-web exposure, ransomware gangs, IOCs and DDoS trends." keywords="threat intelligence feeds, cisa kev, actively exploited cve, ransomware tracker, ioc feed, ddos trends, fortibleed" />
      <PageHeader eyebrow="// threat center · intel radar" title="Intel" accent="Radar" intro="A live pulse of what's being exploited right now, plus curated links to the best free threat-intel sources for dark-web, ransomware, IOC and DDoS reporting." />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {/* TOP: Government & Reporting — where to report cybercrime */}
        <div className="panel-accent overflow-hidden border-brand/50 shadow-glow">
          <div className="flex items-center gap-2 border-b border-line bg-danger/5 px-4 py-2.5 sm:px-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-danger">⚠ Victim of cybercrime? Report it here</span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-md border border-line bg-elevated text-brand"><svg {...sv} width="22" height="22"><path d="M3 21h18M5 21V10l7-4 7 4v11M10 21v-5h4v5" /></svg></span>
              <div><h2 className="font-mono text-lg font-bold text-ink">Government &amp; Reporting</h2><span className="font-mono text-[10px] uppercase tracking-wider text-faint">official advisories &amp; where to report</span></div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{GOV.desc}</p>
            <FeedLinks links={GOV.links} />
          </div>
        </div>

        {/* LIVE: CISA KEV */}
        <div className="mt-8" />
        <div className="panel-accent overflow-hidden">
          <div className="console-bar"><span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" /><span className="ml-2 font-mono text-xs text-faint">cisa_kev.live — exploited in the wild</span>{kev.total ? <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-brand">{kev.total.toLocaleString()} known</span> : null}</div>
          <div className="p-4 sm:p-5">
            {kev.status === "loading" && <p className="font-mono text-sm text-faint animate-blink">pulling the CISA Known Exploited Vulnerabilities feed…</p>}
            {kev.status === "done" && kev.state === "unreachable" && <p className="font-mono text-sm text-warn">Live feed runs on the deployed site / netlify dev.</p>}
            {kev.status === "done" && kev.error && <p className="font-mono text-sm text-warn">{kev.error}</p>}
            {kev.status === "done" && kev.items && (
              <ul className="max-h-[26rem] divide-y divide-line/50 overflow-y-auto">
                {kev.items.map((v) => (
                  <li key={v.cve} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 font-mono text-xs">
                    <a href={`https://nvd.nist.gov/vuln/detail/${v.cve}`} target="_blank" rel="noopener noreferrer" className="font-bold text-brand hover:underline">{v.cve}</a>
                    <span className={`chip ${v.ransomware ? "border-danger/50 text-danger" : "border-warn/50 text-warn"}`}>{v.ransomware ? "Critical" : "High"}</span>
                    {v.ransomware && <span className="chip border-danger/50 text-danger">ransomware</span>}
                    <span className="font-semibold text-ink">{v.vendor} {v.product}</span>
                    <span className="min-w-0 flex-1 truncate text-muted">{v.name}</span>
                    <span className="flex-none text-faint">{v.dateAdded}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 font-mono text-[10px] text-faint">// source: CISA KEV catalog (public domain) · updated daily · every entry is actively exploited (High); <span className="text-danger">ransomware</span>-linked CVEs are flagged Critical.</p>
          </div>
        </div>

        {/* curated feeds */}
        <h2 className="mt-10 font-mono text-xl font-bold tracking-tight">Threat-intel feeds</h2>
        <p className="mt-1 text-sm text-muted">The best free sources for each category. We link out so you always get their latest data.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {FEEDS.map((f) => (
            <div key={f.title} className="panel flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-elevated text-brand">{f.icon}</span>
                <div><h3 className="font-mono text-base font-bold text-ink">{f.title}</h3><span className="font-mono text-[10px] uppercase tracking-wider text-faint">{f.tag}</span></div>
              </div>
              <p className="mt-3 flex-1 text-sm leading-snug text-muted">{f.desc}</p>
              <FeedLinks links={f.links} />
            </div>
          ))}
        </div>
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
