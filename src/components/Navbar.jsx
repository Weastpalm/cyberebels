import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import Logo from "./Logo.jsx";

const THREAT_GROUPS = [
  { heading: "Investigate", links: [["/osint", "Investigate Console"]] },
  { heading: "Phishing & web", links: [["/osint/email", "Email & Phishing"], ["/osint/domain", "Domain Intel"], ["/osint/redirects", "URL Redirects"], ["/osint/ssl", "SSL Inspector"], ["/osint/qr", "QR Scanner"]] },
  { heading: "Feeds", links: [["/osint/intel", "Intel Radar"]] },
  { heading: "Utilities", links: [["/osint/decoder", "Decoder Bench"]] },
];
const OSINT_GROUPS = [
  { heading: "People", links: [["/osint/username", "Username Search"], ["/osint/footprint", "Public Footprint"]] },
];
const PRIVACY_GROUPS = [
  { heading: "Your exposure", links: [["/am-i-tracked", "Am I Tracked?"], ["/fingerprint", "Browser Fingerprint"], ["/osint/exposure", "What You're Leaking"], ["/osint/breach", "Breach & Password"], ["/osint/brokers", "Data Brokers"]] },
];
const PENTEST_GROUPS = [
  { heading: "Toolkit", links: [["/pentest", "All tools"], ["/pentest/subdomains", "Subdomain Scanner"], ["/pentest/nmap", "Nmap Builder"], ["/pentest/hash-id", "Hash Identifier"], ["/pentest/cidr", "CIDR Calculator"]] },
];
const MORE_GROUPS = [
  { heading: "Education", links: [["/learn", "All labs"], ["/anti-detect", "Anti-Detect Lab"], ["/learn/hashing", "Password Hashing"], ["/learn/cracking", "Password Cracking"], ["/learn/ip", "IP Addressing"], ["/learn/traffic", "Traffic Flow"]] },
  { heading: "Learn", links: [["/guides", "Guides"], ["/blog", "Blog"]] },
  { heading: "Recommend", links: [["/best-vpns", "Best VPNs"], ["/privacy-tools", "Privacy Tools"], ["/de-google", "De-Google"], ["/self-defense", "Self-Defense"]] },
  { heading: "Site", links: [["/about", "About"], ["/contact", "Contact"]] },
];
const flat = (g) => g.flatMap((x) => x.links);
const has = (g, p) => flat(g).some(([to]) => to === p);

function Dropdown({ label, groups, active, align = "left" }) {
  return (
    <div className="relative">
      <div className="group">
        <button className={["relative flex items-center gap-1 py-1 font-mono text-[13px] tracking-tight transition-colors", active ? "text-brand" : "text-muted group-hover:text-ink"].join(" ")}>
          {label} <span className="text-[10px]">▾</span>
          {active && <span className="absolute -bottom-[7px] left-0 h-0.5 w-full rounded-full bg-brand" />}
        </button>
        <div className={["invisible absolute top-full z-50 w-64 translate-y-1 rounded-xl border border-line bg-panel p-2 opacity-0 shadow-glow transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100", align === "right" ? "right-0" : "left-0"].join(" ")}>
          {groups.map((grp) => (
            <div key={grp.heading} className="mb-1 last:mb-0">
              <div className="px-2 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">{grp.heading}</div>
              {grp.links.map(([to, l]) => (
                <NavLink key={to} to={to} end={to === "/osint" || to === "/pentest" || to === "/learn"} className={({ isActive }) => ["block rounded-md px-2 py-1.5 font-mono text-[13px] transition-colors", isActive ? "text-brand" : "text-muted hover:bg-elevated hover:text-ink"].join(" ")}>{l}</NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const osintPeople = has(OSINT_GROUPS, pathname);
  const privacyActive = has(PRIVACY_GROUPS, pathname);
  const threatActive = !osintPeople && !privacyActive && (pathname === "/osint" || has(THREAT_GROUPS, pathname) || /^\/osint\/[^/]+$/.test(pathname));
  const pentestActive = pathname === "/pentest" || pathname.startsWith("/pentest/");
  const moreActive = has(MORE_GROUPS, pathname) || pathname.startsWith("/learn") || pathname.startsWith("/guides") || pathname.startsWith("/blog");

  const ALL_MOBILE = [["Threat Center", THREAT_GROUPS], ["OSINT", OSINT_GROUPS], ["Privacy", PRIVACY_GROUPS], ["Pen Test", PENTEST_GROUPS], ["More", MORE_GROUPS]];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo size={26} className="text-brand drop-shadow-[0_0_10px_rgb(var(--c-brand)/0.5)] transition-transform group-hover:scale-110" />
          <span className="font-mono text-lg font-extrabold leading-none text-ink">Cyber <span className="text-brand">Rebels</span></span>
          <span className="hidden border-l border-line pl-2.5 font-mono text-[11px] leading-none text-faint xl:inline">Threat Center &amp; toolkit</span>
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <NavLink to="/" end className={({ isActive }) => ["py-1 font-mono text-[13px] tracking-tight transition-colors", isActive ? "text-brand" : "text-muted hover:text-ink"].join(" ")}>Home</NavLink>
          <Dropdown label="Threat Center" groups={THREAT_GROUPS} active={threatActive} />
          <Dropdown label="OSINT" groups={OSINT_GROUPS} active={osintPeople} />
          <Dropdown label="Privacy" groups={PRIVACY_GROUPS} active={privacyActive} />
          <Dropdown label="Pen Test" groups={PENTEST_GROUPS} active={pentestActive} />
          <Dropdown label="More" groups={MORE_GROUPS} active={moreActive} align="right" />
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-faint xl:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-slow" />checks run local</span>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher compact />
          <button className="btn-ghost px-3 py-2" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>{open ? "✕" : "☰"}</button>
        </div>
      </nav>

      {open && (
        <div className="max-h-[70vh] overflow-y-auto border-t border-line bg-panel lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            <NavLink to="/" end onClick={() => setOpen(false)} className={({ isActive }) => ["border-b border-line/60 py-3 font-mono text-sm", isActive ? "text-brand" : "text-ink"].join(" ")}>Home</NavLink>
            {ALL_MOBILE.map(([title, groups]) => (
              <div key={title}>
                <div className="px-0 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-brand">{title}</div>
                {flat(groups).map(([to, l]) => (
                  <NavLink key={to} to={to} end={to === "/osint" || to === "/pentest" || to === "/learn"} onClick={() => setOpen(false)} className={({ isActive }) => ["border-b border-line/60 py-2.5 font-mono text-sm", isActive ? "text-brand" : "text-muted"].join(" ")}>{l}</NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
