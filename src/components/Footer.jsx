import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

const COLUMNS = [
  { heading: "Tools", links: [["/tools", "All tools"], ["/osint/recon", "Threat Lookup"], ["/am-i-tracked", "Am I Tracked?"], ["/fingerprint", "Fingerprint"]] },
  { heading: "Guides & Blog", links: [["/guides", "All guides"], ["/self-defense", "Self-Defense checklist"], ["/blog", "Blog"]] },
  { heading: "VPNs", links: [["/best-vpns", "Best VPNs"], ["/quantum-vpn-tracker", "Quantum-Safe Tracker"], ["/privacy-tools", "Privacy Tools"], ["/de-google", "De-Google"]] },
  { heading: "Site", links: [["/about", "About"], ["/contact", "Contact"], ["/privacy-policy", "Privacy Policy"], ["/disclaimer", "Disclosure"]] },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-panel">
      <div className="border-b border-line/70 bg-elevated/30">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-faint">
          <span className="inline-flex items-center gap-1.5 text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-slow" /> system nominal</span>
          <span>all checks run in your browser</span>
          <span className="hidden sm:inline">no data stored · no data sold</span>
          <span className="ml-auto hidden md:inline">cyberebels.com</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2.4fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Logo size={24} className="text-brand drop-shadow-[0_0_10px_rgb(var(--c-brand)/0.5)]" />
              <span className="font-mono text-lg font-extrabold">Cyber <span className="text-brand">Rebels</span></span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A free OSINT &amp; privacy toolkit. Investigate suspicious links and IPs, see what
              the web knows about you, and lock it down — plain-English, no fear-mongering.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.heading} className="text-sm">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{col.heading}</div>
                <ul className="space-y-2.5">
                  {col.links.map(([to, label]) => (
                    <li key={to}><Link to={to} className="font-mono text-[13px] text-muted transition-colors hover:text-brand">{label}</Link></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-line/70 pt-6 text-xs leading-relaxed text-faint">
          <p><span className="text-muted">Affiliate disclosure:</span> Some links on this site are affiliate links. If you sign up through them we may earn a commission at no extra cost to you. We only recommend tools we'd use ourselves. <Link to="/disclaimer" className="link-accent">Full disclosure</Link>.</p>
          <p className="mt-2">© {new Date().getFullYear()} Cyber Rebels. Educational privacy tools — all checks run in your browser. We don't store or transmit your results.</p>
        </div>
      </div>
    </footer>
  );
}
