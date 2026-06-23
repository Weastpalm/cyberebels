import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import Logo from "./Logo.jsx";

const TOOLS_GROUPS = [
  { heading: "Browse", links: [["/tools", "All tools"]] },
  { heading: "By category", links: [["/osint", "Threat investigation"], ["/privacy", "Privacy & exposure"], ["/pentest", "Pen testing"], ["/learn", "Interactive labs"]] },
  { heading: "Popular", links: [["/osint/recon", "Threat Lookup"], ["/what-is-my-ip", "What\u2019s My IP"], ["/am-i-tracked", "Am I Tracked?"], ["/quantum-vpn-tracker", "Quantum-Safe VPNs"]] },
];
const VPN_GROUPS = [
  { heading: "VPN & quantum", links: [["/best-vpns", "Best VPNs"], ["/quantum-vpn-tracker", "Quantum-Safe Tracker"], ["/privacy-tools", "Privacy Tools"], ["/de-google", "De-Google"]] },
];
const MORE_GROUPS = [
  { heading: "Site", links: [["/about", "About"], ["/contact", "Contact"], ["/disclaimer", "Disclosure"], ["/privacy-policy", "Privacy Policy"]] },
];

const REPORT_SVG = (s) => (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>);

function Dropdown({ label, groups, active, align = "left", to }) {
  const cls = ["relative flex items-center gap-1 py-1 font-mono text-[13px] tracking-tight transition-colors", active ? "text-brand" : "text-muted group-hover:text-ink"].join(" ");
  const inner = (<>{label} <span className="text-[10px]">▾</span>{active && <span className="absolute -bottom-[7px] left-0 h-0.5 w-full rounded-full bg-brand" />}</>);
  return (
    <div className="relative">
      <div className="group">
        {to ? <Link to={to} className={cls}>{inner}</Link> : <button className={cls}>{inner}</button>}
        <div className={["invisible absolute top-full z-50 w-64 translate-y-1 rounded-xl border border-line bg-panel p-2 opacity-0 shadow-glow transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100", align === "right" ? "right-0" : "left-0"].join(" ")}>
          {groups.map((grp) => (
            <div key={grp.heading} className="mb-1 last:mb-0">
              <div className="px-2 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">{grp.heading}</div>
              {grp.links.map(([t, l]) => (
                <NavLink key={t} to={t} end={t === "/osint" || t === "/pentest" || t === "/learn" || t === "/tools"} className={({ isActive }) => ["block rounded-md px-2 py-1.5 font-mono text-[13px] transition-colors", isActive ? "text-brand" : "text-muted hover:bg-elevated hover:text-ink"].join(" ")}>{l}</NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopLink({ to, children }) {
  return <NavLink to={to} className={({ isActive }) => ["py-1 font-mono text-[13px] tracking-tight transition-colors", isActive ? "text-brand" : "text-muted hover:text-ink"].join(" ")}>{children}</NavLink>;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isTool = pathname === "/tools" || pathname.startsWith("/tools/")
    || pathname.startsWith("/osint") || pathname.startsWith("/pentest") || pathname.startsWith("/learn")
    || ["/am-i-tracked", "/fingerprint", "/anti-detect", "/privacy"].includes(pathname);
  const vpnActive = ["/best-vpns", "/quantum-vpn-tracker", "/privacy-tools", "/de-google"].includes(pathname);
  const toolsActive = isTool && !vpnActive;
  const guidesActive = pathname.startsWith("/guides") || pathname === "/self-defense";
  const blogActive = pathname.startsWith("/blog");
  const moreActive = ["/about", "/contact", "/disclaimer", "/privacy-policy"].includes(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo size={26} className="text-brand drop-shadow-[0_0_10px_rgb(var(--c-brand)/0.5)] transition-transform group-hover:scale-110" />
          <span className="font-mono text-lg font-extrabold leading-none text-ink">Cyber <span className="text-brand">Rebels</span></span>
          <span className="hidden border-l border-line pl-2.5 font-mono text-[11px] leading-none text-faint xl:inline">Tools · Guides · Blog</span>
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <TopLink to="/">Home</TopLink>
          <Dropdown label="Tools" to="/tools" groups={TOOLS_GROUPS} active={toolsActive} />
          <TopLink to="/guides">Guides</TopLink>
          <TopLink to="/blog">Blog</TopLink>
          <Dropdown label="VPNs" to="/best-vpns" groups={VPN_GROUPS} active={vpnActive} />
          <Dropdown label="More" groups={MORE_GROUPS} active={moreActive} align="right" />
          <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" title="Report cybercrime to the FBI's IC3" className="inline-flex items-center gap-1.5 rounded-md border border-danger/50 bg-danger/5 px-2.5 py-1.5 font-mono text-[12px] font-bold text-danger transition-colors hover:bg-danger/10">
            {REPORT_SVG(13)} Report Crime
          </a>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" aria-label="Report cybercrime (FBI IC3)" title="Report cybercrime (FBI IC3)" className="inline-flex items-center justify-center rounded-md border border-danger/50 bg-danger/5 px-2.5 py-2 text-danger">
            {REPORT_SVG(16)}
          </a>
          <ThemeSwitcher compact />
          <button className="btn-ghost px-3 py-2" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>{open ? "✕" : "☰"}</button>
        </div>
      </nav>

      {open && (
        <div className="max-h-[72vh] overflow-y-auto border-t border-line bg-panel lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col px-4 py-2">
            <NavLink to="/" end onClick={() => setOpen(false)} className={({ isActive }) => ["border-b border-line/60 py-3 font-mono text-sm", isActive ? "text-brand" : "text-ink"].join(" ")}>Home</NavLink>
            <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="my-2 flex items-center justify-center gap-2 rounded-lg border border-danger/50 bg-danger/10 py-3 font-mono text-sm font-bold text-danger">
              {REPORT_SVG(16)} Report Cybercrime ↗
            </a>
            {[["Tools", "/tools", TOOLS_GROUPS], ["VPNs", "/best-vpns", VPN_GROUPS], ["More", null, MORE_GROUPS]].map(([title, hub, groups], idx) => (
              <div key={title}>
                {idx === 1 && (<>
                  <NavLink to="/guides" onClick={() => setOpen(false)} className={({ isActive }) => ["block border-b border-line/60 py-3.5 font-mono text-sm font-bold", isActive ? "text-brand" : "text-ink"].join(" ")}>Guides</NavLink>
                  <NavLink to="/blog" onClick={() => setOpen(false)} className={({ isActive }) => ["block border-b border-line/60 py-3.5 font-mono text-sm font-bold", isActive ? "text-brand" : "text-ink"].join(" ")}>Blog</NavLink>
                </>)}
                <details className="border-b border-line/60">
                  <summary className="flex cursor-pointer items-center justify-between py-3.5 font-mono text-sm font-bold text-ink">
                    <span>{title}</span><span className="text-xs text-faint">▾</span>
                  </summary>
                  <div className="pb-2">
                    {hub && <NavLink to={hub} end onClick={() => setOpen(false)} className={({ isActive }) => ["block rounded-md px-3 py-2.5 font-mono text-sm font-bold", isActive ? "bg-elevated/50 text-brand" : "text-brand"].join(" ")}>{title === "Tools" ? "All tools →" : title + " →"}</NavLink>}
                    {groups.flatMap((g) => g.links).filter(([t]) => t !== hub).map(([t, l]) => (
                      <NavLink key={t} to={t} end={t === "/osint" || t === "/pentest" || t === "/learn"} onClick={() => setOpen(false)} className={({ isActive }) => ["block rounded-md px-3 py-2.5 font-mono text-sm", isActive ? "bg-elevated/50 text-brand" : "text-muted"].join(" ")}>{l}</NavLink>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
