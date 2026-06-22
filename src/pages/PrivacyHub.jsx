import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const TOOLS = [
  { to: "/fingerprint", title: "Browser Fingerprint", tag: "tracking", desc: "The exact signals that follow you across the web with no cookies — and how rare your combination really is.", icon: (<svg {...ic}><path d="M12 4a6 6 0 0 0-6 6v3" /><path d="M12 4a6 6 0 0 1 6 6c0 5-1 7-1 7" /><path d="M9 10a3 3 0 0 1 6 0c0 4-1 6-1 8" /><path d="M12 11v4c0 2-.5 3-.5 4" /></svg>) },
  { to: "/osint/exposure", title: "What You're Leaking", tag: "live", desc: "A live readout of the IP, location, device and headers every site you open quietly collects.", icon: (<svg {...ic}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>) },
  { to: "/osint/breach", title: "Breach & Password Check", tag: "exposure", desc: "Check privately whether your emails and passwords have surfaced in known data breaches.", icon: (<svg {...ic}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></svg>) },
  { to: "/osint/brokers", title: "Data Broker Removal", tag: "cleanup", desc: "Find the people-search sites selling your profile — and the opt-out links to scrub yourself from them.", icon: (<svg {...ic}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" /></svg>) },
];

const LOCKDOWN = [
  { to: "/best-vpns", title: "Best VPNs", desc: "Hide your IP and stop ISP logging — compared honestly, with trust scores." },
  { to: "/privacy-tools", title: "Private Swaps", desc: "Big-Tech apps and the private alternatives that replace them." },
  { to: "/de-google", title: "De-Google", desc: "Cut Google out of your daily life, service by service." },
  { to: "/guides", title: "Guides", desc: "Step-by-step hardening: Tor, passwords, browser lockdown." },
];

export default function PrivacyHub() {
  const ld = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Privacy Center", description: "See exactly what you leak online — IP, location, fingerprint and breach exposure — then lock it down with honest VPN picks, private app swaps and step-by-step guides." };
  return (
    <div className="surveil-grid">
      <Seo path="/privacy" title="Privacy Center — See What You Leak, Then Lock It Down" description="A privacy hub: see the IP, location and browser fingerprint every site collects, check your breach exposure, scrub data brokers, and lock it down with honest VPN picks and hardening guides." keywords="privacy tools, browser fingerprint, am i being tracked, data breach check, data broker removal, vpn, online privacy" jsonLd={ld} />
      <PageHeader eyebrow="// privacy · your exposure" title="Privacy" accent="Center" intro="First see exactly what every site knows about you — then shut the leaks. Start with a full tracking report, then work through the tools below." />

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {/* FEATURED — Am I Being Tracked */}
        <Link to="/am-i-tracked" className="panel-accent group block overflow-hidden border-brand/50 shadow-glow transition-all hover:-translate-y-0.5">
          <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8">
              <span className="chip border-brand/50 text-brand">★ start here</span>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-line bg-elevated text-brand"><svg {...ic} width="26" height="26"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></span>
                <h2 className="font-mono text-2xl font-bold text-ink group-hover:text-brand sm:text-3xl">Am I Being Tracked?</h2>
              </div>
              <p className="mt-4 max-w-xl text-muted">A full report on what every site sees the second you connect — your IP, location, device, the data you leak, and a live privacy score.</p>
              <span className="btn-primary mt-6 inline-flex">Run the tracking report →</span>
            </div>
            <div className="border-t border-line bg-elevated/30 p-6 sm:p-8 md:border-l md:border-t-0">
              <p className="mono-label mb-3">// what they see</p>
              <div className="rounded-md border border-warn/40 bg-warn/5 p-4 font-mono">
                <div className="flex items-center justify-between gap-2"><span className="chip flex-none border-warn/50 text-warn">EXPOSED</span><span className="min-w-0 truncate text-xs text-faint">your browser</span></div>
                <p className="mt-2 text-sm font-bold text-warn">IP · location · fingerprint</p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">No login required — every site gets this the moment it loads.</p>
              </div>
            </div>
          </div>
        </Link>

        {/* EXPOSURE TOOLS */}
        <div className="mt-10">
          <div className="mb-4 flex items-baseline gap-3"><span className="font-mono text-sm tabular-nums text-brand">//</span><h2 className="font-mono text-xl font-bold tracking-tight">See your exposure</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
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

        {/* LOCK IT DOWN */}
        <div className="mt-10">
          <div className="mb-4 flex items-baseline gap-3"><span className="font-mono text-sm tabular-nums text-brand">//</span><div><h2 className="font-mono text-xl font-bold tracking-tight">Then lock it down</h2><p className="mt-1 text-sm text-muted">Once you&apos;ve seen the leaks, here&apos;s how to close them.</p></div></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LOCKDOWN.map((s) => (<Link key={s.to} to={s.to} className="panel group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow"><h3 className="font-mono text-base font-bold text-ink group-hover:text-brand">{s.title}</h3><p className="mt-1 flex-1 text-sm leading-snug text-muted">{s.desc}</p><span className="mt-3 font-mono text-xs text-brand">Open →</span></Link>))}
          </div>
        </div>
      </section>
    </div>
  );
}
