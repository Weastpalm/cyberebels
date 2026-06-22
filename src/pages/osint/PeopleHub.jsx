import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const TOOLS = [
  { to: "/osint/footprint", title: "Public Footprint Audit", tag: "self-recon", desc: "See yourself the way an investigator would — the accounts, names and breadcrumbs tied to you across the open web.", icon: (<svg {...ic}><circle cx="12" cy="12" r="9" /><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>) },
  { to: "/osint/breach", title: "Breach & Password Check", tag: "exposure", desc: "Check privately whether your emails and passwords have turned up in known data breaches.", icon: (<svg {...ic}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" /></svg>) },
  { to: "/osint/brokers", title: "Data Broker Removal", tag: "cleanup", desc: "Find the people-search sites selling your profile — and the opt-out links to scrub yourself from them.", icon: (<svg {...ic}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" /></svg>) },
  { to: "/osint/recon", title: "Investigate Infrastructure", tag: "threat lookup", desc: "Looking up an IP, domain, URL or file hash instead of a person? Jump to Threat Lookup in the Threat Center.", icon: (<svg {...ic}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>) },
];

export default function PeopleHub() {
  const ld = { "@context": "https://schema.org", "@type": "CollectionPage", name: "OSINT — People & Profiles", description: "Open-source intelligence tools for auditing a person's public footprint: username search across platforms, breach exposure, and data-broker removal." };
  return (
    <div className="surveil-grid">
      <Seo path="/osint/people" title="OSINT — People & Public Footprint Tools" description="Open-source intelligence for people and profiles: search a username across dozens of platforms, audit your own public footprint, check breach exposure, and remove yourself from data brokers — free, in your browser." keywords="osint people search, username search, public footprint, data broker removal, breach check, open source intelligence" jsonLd={ld} />
      <PageHeader eyebrow="// osint · people & profiles" title="OSINT" accent="People" intro="Open-source intelligence focused on people and profiles. Start with a username search across platforms — then audit and clean up your own footprint." />

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {/* FEATURED — Username Search */}
        <Link to="/osint/username" className="panel-accent group block overflow-hidden border-brand/50 shadow-glow transition-all hover:-translate-y-0.5">
          <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8">
              <span className="chip border-brand/50 text-brand">★ start here</span>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-lg border border-line bg-elevated text-brand"><svg {...ic} width="26" height="26"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg></span>
                <h2 className="font-mono text-2xl font-bold text-ink group-hover:text-brand sm:text-3xl">Username Search</h2>
              </div>
              <p className="mt-4 max-w-xl text-muted">Enter a single handle and check it across dozens of social, dev and forum platforms at once to map where an online identity exists.</p>
              <span className="btn-primary mt-6 inline-flex">Open Username Search →</span>
            </div>
            <div className="border-t border-line bg-elevated/30 p-6 sm:p-8 md:border-l md:border-t-0">
              <p className="mono-label mb-3">// example</p>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between gap-2 rounded border border-brand/30 bg-brand/5 p-2"><span className="min-w-0 truncate text-ink">github.com/<span className="text-brand">handle</span></span><span className="flex-none text-brand">found</span></div>
                <div className="flex items-center justify-between gap-2 rounded border border-line bg-base/40 p-2"><span className="min-w-0 truncate text-muted">reddit.com/u/<span className="text-ink">handle</span></span><span className="flex-none text-brand">found</span></div>
                <div className="flex items-center justify-between gap-2 rounded border border-line bg-base/40 p-2"><span className="min-w-0 truncate text-muted">instagram.com/<span className="text-ink">handle</span></span><span className="flex-none text-faint">—</span></div>
              </div>
            </div>
          </div>
        </Link>

        {/* TOOLS */}
        <div className="mt-10">
          <div className="mb-4 flex items-baseline gap-3"><span className="font-mono text-sm tabular-nums text-brand">//</span><h2 className="font-mono text-xl font-bold tracking-tight">People &amp; profile tools</h2></div>
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
          <div className="mt-5 rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm text-faint"><span className="font-mono text-muted">// ground rule:</span> use these to audit <strong className="text-muted">your own</strong> footprint or for legitimate, authorized investigations. Profiling other people without consent is surveillance, not what we&apos;re here for.</div>
        </div>
      </section>
    </div>
  );
}
