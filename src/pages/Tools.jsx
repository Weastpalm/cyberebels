import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";

const sv = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const CATS = [
  { heading: "Threat investigation", hub: "/osint", hubLabel: "Threat Center",
    icon: (<svg {...sv}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
    tools: [
      ["/osint/recon", "Threat Lookup", "Check any IP, domain, URL or file hash across VirusTotal, AbuseIPDB & Shodan."],
      ["/osint/intel", "Intel Radar", "Live exploited CVEs (CISA KEV) plus ransomware, dark-web & DDoS feeds."],
      ["/osint/email", "Email & Phishing Analyzer", "Headers, SPF/DKIM/DMARC, extracted links and a phishing score."],
      ["/osint/domain", "Domain Intel", "Registration age, registrar, nameservers, DNS and a risk score."],
      ["/osint/ssl", "SSL Inspector", "Live TLS certificate: issuer, expiry and every hostname covered."],
      ["/osint/redirects", "URL Redirect Analyzer", "Follow a short link through every hop to its real destination."],
      ["/osint/qr", "QR Code Scanner", "Decode a QR image and reveal where it points before you scan."],
      ["/osint/decoder", "Decoder Bench", "Stack Base64 / Hex / URL / ROT13 / JWT and more."],
    ] },
  { heading: "Your privacy & exposure", hub: "/privacy", hubLabel: "Privacy Center",
    icon: (<svg {...sv}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>),
    tools: [
      ["/what-is-my-ip", "What Is My IP?", "Your public IP address, approximate location and a live map of where it points."],
      ["/am-i-tracked", "Am I Being Tracked?", "What every site sees the second you connect — IP, location, leaks, privacy score."],
      ["/fingerprint", "Browser Fingerprint", "The signals that follow you across the web with no cookies."],
      ["/anti-detect", "Anti-Detect Lab", "Build and visualize fingerprint profiles, then learn to stop trackers."],
      ["/osint/exposure", "What You're Leaking", "Your live IP, location and fingerprint in one readout."],
      ["/osint/breach", "Breach & Password Check", "Check leaked passwords and emails privately."],
      ["/osint/brokers", "Data Broker Removal", "Find people-search sites selling you — and the opt-out links."],
    ] },
  { heading: "People & profiles (OSINT)", hub: null, hubLabel: null,
    icon: (<svg {...sv}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>),
    tools: [
      ["/osint/username", "Username Search", "Check a handle across dozens of platforms at once."],
      ["/osint/footprint", "Public Footprint Audit", "See yourself the way an investigator would."],
    ] },
  { heading: "Pen testing", hub: "/pentest", hubLabel: "Pen Test Toolkit",
    icon: (<svg {...sv}><path d="M14.5 4.5 19 9 8 20l-4.5.5L4 16 14.5 4.5Z" /><path d="m13 6 5 5" /></svg>),
    tools: [
      ["/pentest/subdomains", "Subdomain Scanner", "Map a domain's subdomains from certificate-transparency logs."],
      ["/pentest/nmap", "Nmap Command Builder", "Compose an Nmap scan from a form and copy the command."],
      ["/pentest/hash-id", "Hash Identifier", "Identify a hash's likely algorithm before cracking."],
      ["/pentest/cidr", "CIDR / Subnet Calculator", "Network, broadcast, host range and counts for any CIDR."],
    ] },
  { heading: "VPN & quantum", hub: "/best-vpns", hubLabel: "Best VPNs",
    icon: (<svg {...sv}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>),
    tools: [
      ["/best-vpns", "Best VPNs", "Top VPNs compared honestly, with a 0–100 trust score and reason."],
      ["/quantum-vpn-tracker", "Quantum-Safe VPN Tracker", "Which VPNs have actually deployed post-quantum encryption — sourced & dated."],
      ["/privacy-tools", "Private Swaps", "Big-Tech apps and the private alternatives that replace them."],
      ["/de-google", "De-Google Your Life", "Cut Google out, service by service."],
    ] },
  { heading: "Interactive labs", hub: "/learn", hubLabel: "Education hub",
    icon: (<svg {...sv}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>),
    tools: [
      ["/learn/hashing", "Password Hashing Lab", "Watch salts and hashes work, hands-on."],
      ["/learn/cracking", "Password Cracking Lab", "See how attackers crack weak passwords."],
      ["/learn/ip", "IP Addressing Lesson", "How IPs and networks actually work."],
      ["/learn/traffic", "Traffic Flow Simulator", "Visualize how your data travels the internet."],
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
              {c.tools.map(([to, title, desc]) => (
                <Link key={to} to={to} className="panel group flex min-w-0 flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
                  <h3 className="font-mono text-sm font-bold text-ink group-hover:text-brand">{title}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-snug text-muted">{desc}</p>
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
