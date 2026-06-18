import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const sv = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const LABS = [
  { to: "/learn/hashing", title: "Password Hashing Lab", tag: "crypto", desc: "Hash text live with SHA-1/256/512, add a salt, and watch why two identical passwords end up with totally different hashes.", icon: (<svg {...sv}><path d="M4 7h16M4 12h16M4 17h10" /><circle cx="18" cy="17" r="2" /></svg>) },
  { to: "/learn/cracking", title: "Password Crack Lab", tag: "offense", desc: "Estimate how long a password survives a brute-force attack as you change length and character sets — and see what a dictionary attack eats instantly.", icon: (<svg {...sv}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0" /></svg>) },
  { to: "/learn/ip", title: "IP Addressing Lesson", tag: "networking", desc: "Break any IPv4 into octets and binary, classify it (public, private, loopback…), and explore subnets with a live CIDR slider.", icon: (<svg {...sv}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>) },
  { to: "/learn/traffic", title: "Traffic Flow Simulator", tag: "networking", desc: "Animate a request from your device to a server and see exactly what your ISP, a VPN, and the site can read — toggle VPN and HTTPS on and off.", icon: (<svg {...sv}><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>) },
  { to: "/anti-detect", title: "Anti-Detect Lab", tag: "fingerprint", desc: "Build and visualize browser fingerprint profiles, then learn how trackers actually identify you with no cookies.", icon: (<svg {...sv}><path d="M3 6s2 9 9 9 9-9 9-9c-3-1-6-1.5-9-1.5S6 5 3 6Z" /><circle cx="8.5" cy="9" r="1" /><circle cx="15.5" cy="9" r="1" /></svg>) },
];

export default function LearnHub() {
  return (
    <div className="surveil-grid">
      <Seo path="/learn" title="Education — Interactive Security Labs" description="Hands-on, interactive labs that teach how security really works: password hashing and salts, password cracking, IP addressing, network traffic flow, and browser fingerprinting." keywords="learn cybersecurity interactive, password hashing lab, password cracking, ip addressing, networking simulation, fingerprint lab" />
      <PageHeader eyebrow="// education · hands-on labs" title="Learn by" accent="doing." intro="No slideshows. Each lab is a live, interactive tool that runs entirely in your browser — change the inputs and watch the concept move." />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LABS.map((l) => (
            <Link key={l.to} to={l.to} className="panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-line bg-elevated text-brand transition-colors group-hover:border-brand">{l.icon}</span>
                <span className="ml-auto rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint group-hover:border-brand group-hover:text-brand">{l.tag}</span>
              </div>
              <h2 className="mt-4 font-mono text-lg font-bold text-ink group-hover:text-brand">{l.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-snug text-muted">{l.desc}</p>
              <span className="mt-4 font-mono text-xs text-brand">Open lab →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
