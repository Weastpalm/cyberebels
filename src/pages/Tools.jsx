import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";

const sv = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const ti = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONS = {
  search: <svg {...ti}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>,
  radar: <svg {...ti}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3" /></svg>,
  mail: <svg {...ti}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
  globe: <svg {...ti}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>,
  lock: <svg {...ti}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
  redirect: <svg {...ti}><path d="M4 7h12l-3-3M20 17H8l3 3" /></svg>,
  qr: <svg {...ti}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7h-7" /></svg>,
  code: <svg {...ti}><path d="m8 9-3 3 3 3M16 9l3 3-3 3M13 7l-2 10" /></svg>,
  pin: <svg {...ti}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  eye: <svg {...ti}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  finger: <svg {...ti}><path d="M12 4a6 6 0 0 0-6 6v3" /><path d="M12 4a6 6 0 0 1 6 6c0 5-1 7-1 7" /><path d="M9 10a3 3 0 0 1 6 0c0 4-1 6-1 8" /></svg>,
  mask: <svg {...ti}><path d="M3 6s2 9 9 9 9-9 9-9c-3-1-6-1.5-9-1.5S6 5 3 6Z" /><circle cx="8.5" cy="9" r="1" /><circle cx="15.5" cy="9" r="1" /></svg>,
  drop: <svg {...ti}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>,
  key: <svg {...ti}><circle cx="8" cy="15" r="4" /><path d="m10.8 12.2 8.2-8.2M16 7l3-3M18 9l2-2" /></svg>,
  trash: <svg {...ti}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>,
  user: <svg {...ti}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  users: <svg {...ti}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M16 5.5a3.5 3.5 0 0 1 0 7M22 21a6.5 6.5 0 0 0-5-6.3" /></svg>,
  phone: <svg {...ti}><path d="M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2Z" /></svg>,
  network: <svg {...ti}><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M6 16v-2h12v2" /></svg>,
  terminal: <svg {...ti}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></svg>,
  hash: <svg {...ti}><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" /></svg>,
  calc: <svg {...ti}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" /></svg>,
  shield: <svg {...ti}><path d="M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6Z" /></svg>,
  atom: <svg {...ti}><circle cx="12" cy="12" r="1.6" /><ellipse cx="12" cy="12" rx="9" ry="4" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" /></svg>,
  swap: <svg {...ti}><path d="M4 8h13l-3-3M20 16H7l3 3" /></svg>,
  ban: <svg {...ti}><circle cx="12" cy="12" r="9" /><path d="m5 5 14 14" /></svg>,
  beaker: <svg {...ti}><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M7.5 14h9" /></svg>,
};

const CATS = [
  { heading: "Threat investigation", hub: "/osint", hubLabel: "Threat Center",
    icon: (<svg {...sv}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
    tools: [
      ["/osint/recon", "Threat Lookup", "Check any IP, domain, URL or file hash across VirusTotal, AbuseIPDB & Shodan.", "search"],
      ["/osint/intel", "Intel Radar", "Live exploited CVEs (CISA KEV) plus ransomware, dark-web & DDoS feeds.", "radar"],
      ["/osint/email", "Email & Phishing Analyzer", "Headers, SPF/DKIM/DMARC, extracted links and a phishing score.", "mail"],
      ["/osint/domain", "Domain Intel", "Registration age, registrar, nameservers, DNS and a risk score.", "globe"],
      ["/osint/ssl", "SSL Inspector", "Live TLS certificate: issuer, expiry and every hostname covered.", "lock"],
      ["/osint/redirects", "URL Redirect Analyzer", "Follow a short link through every hop to its real destination.", "redirect"],
      ["/osint/qr", "QR Code Scanner", "Decode a QR image and reveal where it points before you scan.", "qr"],
      ["/osint/decoder", "Decoder Bench", "Stack Base64 / Hex / URL / ROT13 / JWT and more.", "code"],
    ] },
  { heading: "Your privacy & exposure", hub: "/privacy", hubLabel: "Privacy Center",
    icon: (<svg {...sv}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>),
    tools: [
      ["/what-is-my-ip", "What Is My IP?", "Your public IP address, approximate location and a live map of where it points.", "pin"],
      ["/am-i-tracked", "Am I Being Tracked?", "What every site sees the second you connect — IP, location, leaks, privacy score.", "eye"],
      ["/fingerprint", "Browser Fingerprint", "The signals that follow you across the web with no cookies.", "finger"],
      ["/anti-detect", "Anti-Detect Lab", "Build and visualize fingerprint profiles, then learn to stop trackers.", "mask"],
      ["/osint/exposure", "What You're Leaking", "Your live IP, location and fingerprint in one readout.", "drop"],
      ["/osint/breach", "Breach & Password Check", "Check leaked passwords and emails privately.", "key"],
      ["/osint/brokers", "Data Broker Removal", "Find people-search sites selling you — and the opt-out links.", "trash"],
    ] },
  { heading: "People & profiles (OSINT)", hub: null, hubLabel: null,
    icon: (<svg {...sv}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>),
    tools: [
      ["/osint/username", "Username Search", "Check a handle across dozens of platforms at once.", "user"],
      ["/osint/phone", "Phone Number Search", "Detect a number's country, then pivot to reverse-lookup & spam-report services.", "phone"],
      ["/osint/footprint", "Public Footprint Audit", "See yourself the way an investigator would.", "users"],
    ] },
  { heading: "Pen testing", hub: "/pentest", hubLabel: "Pen Test Toolkit",
    icon: (<svg {...sv}><path d="M14.5 4.5 19 9 8 20l-4.5.5L4 16 14.5 4.5Z" /><path d="m13 6 5 5" /></svg>),
    tools: [
      ["/pentest/subdomains", "Subdomain Scanner", "Map a domain's subdomains from certificate-transparency logs.", "network"],
      ["/pentest/nmap", "Nmap Command Builder", "Compose an Nmap scan from a form and copy the command.", "terminal"],
      ["/pentest/hash-id", "Hash Identifier", "Identify a hash's likely algorithm before cracking.", "hash"],
      ["/pentest/cidr", "CIDR / Subnet Calculator", "Network, broadcast, host range and counts for any CIDR.", "calc"],
    ] },
  { heading: "VPN & quantum", hub: "/best-vpns", hubLabel: "Best VPNs",
    icon: (<svg {...sv}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>),
    tools: [
      ["/best-vpns", "Best VPNs", "Top VPNs compared honestly, with a 0–100 trust score and reason.", "shield"],
      ["/quantum-vpn-tracker", "Quantum-Safe VPN Tracker", "Which VPNs have actually deployed post-quantum encryption — sourced & dated.", "atom"],
      ["/privacy-tools", "Private Swaps", "Big-Tech apps and the private alternatives that replace them.", "swap"],
      ["/de-google", "De-Google Your Life", "Cut Google out, service by service.", "ban"],
    ] },
  { heading: "Interactive labs", hub: "/learn", hubLabel: "Education hub",
    icon: (<svg {...sv}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>),
    tools: [
      ["/learn/hashing", "Password Hashing Lab", "Watch salts and hashes work, hands-on.", "beaker"],
      ["/learn/cracking", "Password Cracking Lab", "See how attackers crack weak passwords.", "beaker"],
      ["/learn/ip", "IP Addressing Lesson", "How IPs and networks actually work.", "network"],
      ["/learn/traffic", "Traffic Flow Simulator", "Visualize how your data travels the internet.", "redirect"],
    ] },
];

export default function Tools() {
  const total = CATS.reduce((n, c) => n + c.tools.length, 0);
  const ld = { "@context": "https://schema.org", "@type": "CollectionPage", name: "All Tools — Cyber Rebels", description: "Every free, in-browser security and privacy tool on Cyber Rebels, organized by category." };
  return (
    <div className="surveil-grid">
      <Seo path="/tools" title="All Tools — Free Security & Privacy Toolkit" description="Every free, in-browser tool on Cyber Rebels in one directory: threat investigation, privacy & exposure checks, OSINT, pen-test helpers, VPN comparisons and interactive labs." keywords="free security tools, privacy tools, osint tools, threat lookup, vpn comparison, online toolkit" jsonLd={ld} />
      <PageHeader eyebrow="// directory · everything in one place" title="All" accent="Tools" intro={`Every interactive tool on the site — ${total} of them — grouped by what you're trying to do. All free, all in your browser, no sign-up.`} />

      <section className="mx-auto max-w-[1440px] px-4 pb-16">
        {CATS.map((c) => (
          <div key={c.heading} className="mt-10 first:mt-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-line bg-elevated text-brand">{c.icon}</span>
              <h2 className="font-mono text-xl font-bold tracking-tight">{c.heading}</h2>
              {c.hub && <Link to={c.hub} className="ml-auto font-mono text-xs text-faint transition-colors hover:text-brand">{c.hubLabel} hub →</Link>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {c.tools.map(([to, title, desc, icon]) => (
                <Link key={to} to={to} className="panel group flex min-w-0 flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md border border-line bg-elevated/70 text-brand transition-colors group-hover:border-brand">{ICONS[icon]}</span>
                    <h3 className="min-w-0 font-mono text-sm font-bold text-ink group-hover:text-brand">{title}</h3>
                  </div>
                  <p className="mt-2 flex-1 text-[13px] leading-snug text-muted">{desc}</p>
                  <span className="mt-3 font-mono text-[11px] text-brand">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
