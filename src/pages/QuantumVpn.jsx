import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { AffiliateLink } from "../components/Affiliate.jsx";
import { PQC_VPNS, PQC_TIERS, PQC_VERIFIED } from "../data/pqcVpns.js";

const TONE = { good: "border-brand/50 text-brand", warn: "border-warn/50 text-warn", bad: "border-danger/50 text-danger" };
const DOT = { good: "bg-brand", warn: "bg-warn", bad: "bg-danger" };

function fmt(d) { try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; } }

function TierBadge({ tier }) {
  const t = PQC_TIERS[tier];
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${TONE[t.tone]}`}><span className={`h-1.5 w-1.5 rounded-full ${DOT[t.tone]}`} />{t.label}</span>;
}

function Row({ label, children }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5 border-t border-line/50 py-1.5 font-mono text-[12px]">
      <dt className="w-24 flex-none text-faint">{label}</dt>
      <dd className="min-w-0 flex-1 text-muted">{children}</dd>
    </div>
  );
}

function Card({ v }) {
  const t = PQC_TIERS[v.tier];
  return (
    <div className={`panel flex min-w-0 flex-col p-5 ${v.tier === 1 ? "border-brand/30" : ""}`}>
      <div className="flex items-center gap-3">
        <BrandLogo slug={v.logo} name={v.name} size={26} />
        <h3 className="min-w-0 flex-1 truncate font-mono text-base font-bold text-ink">{v.name}</h3>
        <TierBadge tier={v.tier} />
      </div>
      <dl className="mt-3">
        <Row label="Algorithm">{v.algo}{v.hybrid === true && <span className="ml-2 rounded border border-brand/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-brand">hybrid ✓</span>}{v.hybrid === false && <span className="ml-2 rounded border border-warn/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-warn">not PQC algo</span>}</Row>
        <Row label="Protocol">{v.protocol}</Row>
        <Row label="Platforms">{v.platforms}</Row>
        <Row label="Notes">{v.note}</Row>
      </dl>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line/50 pt-3">
        <a href={v.source} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] link-accent">Source: {v.sourceLabel} ↗</a>
        {v.affiliateKey && <AffiliateLink to={v.affiliateKey} className="font-mono text-[11px] font-bold">Get {v.name} ↗</AffiliateLink>}
        <span className="ml-auto font-mono text-[10px] text-faint">as of {fmt(PQC_VERIFIED)}</span>
      </div>
    </div>
  );
}

export default function QuantumVpn() {
  const [filter, setFilter] = useState(0); // 0 = all
  const counts = { 1: 0, 2: 0, 3: 0 };
  PQC_VPNS.forEach((v) => { counts[v.tier]++; });
  const shown = filter ? PQC_VPNS.filter((v) => v.tier === filter) : PQC_VPNS;
  const tiersToRender = filter ? [filter] : [1, 2, 3];

  const ld = {
    "@context": "https://schema.org", "@type": "ItemList", name: "Quantum-Safe VPN Tracker",
    description: "Which consumer VPNs have actually deployed NIST post-quantum encryption (ML-KEM) versus those still talking about it.",
    itemListElement: PQC_VPNS.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.name })),
  };

  return (
    <div className="surveil-grid">
      <Seo path="/quantum-vpn-tracker" title="Quantum-Safe VPN Tracker — Who Actually Has Post-Quantum Encryption" description="A live, sourced tracker of which consumer VPNs have deployed NIST post-quantum encryption (ML-KEM) today, which are laying groundwork, and which have no public roadmap. Updated and dated, with an honest methodology." keywords="quantum-safe VPN, post-quantum VPN, ML-KEM VPN, quantum resistant VPN, NordVPN post quantum, ExpressVPN Lightway ML-KEM, harvest now decrypt later" jsonLd={ld} />
      <PageHeader eyebrow="// live tool · post-quantum vpn tracker" title="Quantum-Safe VPN" accent="Tracker" intro="Which VPNs have actually shipped post-quantum encryption — versus which are just talking about it. Sourced, tiered, and dated, because this space moves fast." />

      <section className="mx-auto max-w-[1440px] px-4 pb-16">
        {/* WHY THIS MATTERS */}
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="panel p-5 sm:p-6">
            <h2 className="font-mono text-lg font-bold text-ink">Why this matters before quantum computers exist</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">The threat is called <span className="font-semibold text-ink">&ldquo;harvest now, decrypt later.&rdquo;</span> An adversary records your encrypted VPN traffic <em>today</em> — even though they can&apos;t read it — and simply stores it. The day a cryptographically-relevant quantum computer arrives, they go back and decrypt the whole archive at once. Anything with a long shelf life (identity documents, medical and financial records, source code, anything you&apos;d still want private in ten years) is already exposed if it&apos;s only protected by classical encryption.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">In August 2024 NIST finalized the first post-quantum standards — <span className="text-ink">ML-KEM (FIPS 203)</span> for key exchange, plus ML-DSA (204) and SLH-DSA (205) for signatures. A VPN is &ldquo;quantum-safe&rdquo; when its key exchange uses one of these, so the data you send now stays unreadable later.</p>
          </div>

          {/* HONESTY CAVEAT — prominent, not buried */}
          <div className="panel border-warn/40 bg-warn/[0.04] p-5 sm:p-6">
            <div className="mb-2 flex items-center gap-2"><span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-warn">! read this first</span></div>
            <h2 className="font-mono text-base font-bold text-ink">No one can fully verify these claims yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Without a working quantum computer to test against, nobody can truly prove a VPN is quantum-proof. What we <em>can</em> track is whether a provider adopted <span className="text-ink">NIST-standardized algorithms</span> (ML-KEM, ML-DSA, SLH-DSA) versus proprietary &ldquo;trust us&rdquo; math.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted"><span className="text-brand">Hybrid</span> implementations — classical <span className="text-faint">+</span> post-quantum together — are the credible signal: if the new math fails, the proven classical layer still protects you. A provider leaning on novel, unaudited PQC math <span className="text-danger">alone</span> is a red flag, not a strength.</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button onClick={() => setFilter(0)} className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${filter === 0 ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-ink"}`}>All <span className="text-faint">({PQC_VPNS.length})</span></button>
          {[1, 2, 3].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${filter === t ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-ink"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[PQC_TIERS[t].tone]}`} />{PQC_TIERS[t].label} <span className="text-faint">({counts[t]})</span>
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] text-faint">verified as of {fmt(PQC_VERIFIED)}</span>
        </div>

        {/* TIERS */}
        {tiersToRender.map((tier) => (
          <div key={tier} className="mt-8">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-mono text-xl font-bold tracking-tight">Tier {tier} — {PQC_TIERS[tier].label}</h2>
              <span className="font-mono text-xs text-faint">{PQC_TIERS[tier].blurb}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shown.filter((v) => v.tier === tier).map((v) => <Card key={v.name} v={v} />)}
            </div>
          </div>
        ))}

        <AdSlot slot="quantum-mid" />

        {/* METHODOLOGY */}
        <div className="mt-8 rounded-xl border border-line/70 bg-elevated/40 p-5 text-sm leading-relaxed text-faint">
          <p className="mono-label mb-2 text-muted">// methodology</p>
          We tier providers on a single question: <strong className="text-muted">is a NIST post-quantum key-exchange algorithm live in the consumer app today?</strong> Tier 1 = yes, shipping now. Tier 2 = public groundwork or a partial/marketing claim that isn&apos;t a deployed PQC algorithm. Tier 3 = no public option or roadmap. We link every claim to a primary source and stamp the date — if you&apos;re a provider and your status changed, that&apos;s exactly what the &ldquo;as of&rdquo; date is for. This page is informational, not a ranking, and isn&apos;t sponsored by any provider listed.
          <div className="mt-3"><Link to="/best-vpns" className="font-mono text-xs link-accent">See our full VPN comparison (with trust scores) →</Link></div>
        </div>
      </section>
    </div>
  );
}
