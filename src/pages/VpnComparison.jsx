import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { AffiliateButton } from "../components/Affiliate.jsx";
import { VPNS } from "../data/vpns.js";

function Speed({ n }) {
  return (
    <span className="inline-flex gap-0.5" title={`${n}/10`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={"h-3 w-1 rounded-sm " + (i < n ? "bg-brand" : "bg-line")} />
      ))}
    </span>
  );
}

function BestPick() {
  return (
    <span className="rounded-sm bg-brand px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-onbrand shadow-glow">
      ★ Best Pick
    </span>
  );
}

function TrustScore({ n, size = "sm" }) {
  const tone = n >= 90 ? "border-brand/50 text-brand" : n >= 80 ? "border-info/50 text-info" : "border-warn/50 text-warn";
  const pad = size === "lg" ? "px-2.5 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-baseline gap-0.5 rounded-md border font-mono font-bold ${pad} ${tone}`} title={`Trust score ${n}/100`}>
      {n}<span className="text-[10px] font-normal text-faint">/100</span>
    </span>
  );
}

export default function VpnComparison() {
  return (
    <div>
      <Seo
        path="/best-vpns"
        title="Best VPNs of 2026, Compared Honestly"
        description="The top VPNs for hiding your IP and stopping your ISP from logging your traffic — compared on speed, privacy, price, and logging policy. No hype, just the trade-offs."
        keywords="best VPN 2026, VPN comparison, NordVPN vs Surfshark, no-log VPN, cheap VPN, fastest VPN"
      />
      <PageHeader
        eyebrow="// the shortlist"
        title="The Best VPNs,"
        accent="Compared Honestly"
        intro="A VPN hides your IP and stops your ISP from logging every site you visit. Here are the five we'd actually pay for — no filler, no 47-item list to pad affiliate links."
      />

      <div className="mx-auto max-w-[1440px] px-4">
        {/* Editor's choice — NordVPN advertisement */}
        <div className="panel-accent relative mb-8 overflow-hidden border-brand/50 p-6 shadow-glow sm:p-8">
          <span className="absolute right-0 top-0 rounded-bl-lg bg-brand px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-onbrand">★ Editor&apos;s choice</span>
          <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <BrandLogo slug="nordvpn" name="NordVPN" size={34} />
                <h2 className="font-mono text-2xl font-bold">NordVPN</h2>
                <TrustScore n={95} size="lg" />
              </div>
              <p className="mt-3 max-w-xl text-muted">Our #1 pick. Independently-audited no-logs, thousands of RAM-only servers across 110+ countries, and built-in <span className="text-ink">Threat Protection</span> that blocks malware, trackers and malicious sites before they load. One account covers up to 10 devices.</p>
              <ul className="mt-4 grid gap-2 font-mono text-sm text-muted sm:grid-cols-2">
                <li className="flex items-center gap-2"><span className="text-brand">✓</span> Audited no-logs policy</li>
                <li className="flex items-center gap-2"><span className="text-brand">✓</span> Blocks malware &amp; trackers</li>
                <li className="flex items-center gap-2"><span className="text-brand">✓</span> Fast NordLynx protocol</li>
                <li className="flex items-center gap-2"><span className="text-brand">✓</span> 30-day money-back guarantee</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <AffiliateButton to="nordvpn" className="w-full">Get the NordVPN deal →</AffiliateButton>
              <AffiliateButton to="nordpass" variant="ghost" className="w-full">+ Add NordPass password manager</AffiliateButton>
              <p className="text-center font-mono text-[10px] text-faint">Affiliate links — they support Cyber Rebels at no extra cost to you.</p>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="panel hidden overflow-hidden lg:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-elevated font-mono text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4">VPN</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">No-logs</th>
                <th className="px-5 py-4">Trust</th>
                <th className="px-5 py-4">Speed</th>
                <th className="px-5 py-4">Best for</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {VPNS.map((v) => (
                <tr key={v.name} className={"border-b border-line/60 align-top " + (v.bestPick ? "bg-brand/[0.04]" : "")}>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <BrandLogo slug={v.logo} name={v.name} size={26} />
                      <span className="font-mono text-[1rem] font-bold">{v.name}</span>
                    </div>
                    {v.bestPick && <div className="mt-2"><BestPick /></div>}
                  </td>
                  <td className="px-5 py-5">
                    <div className="font-mono font-semibold text-brand">{v.price}</div>
                    <div className="text-xs text-faint">{v.priceNote}</div>
                  </td>
                  <td className="px-5 py-5 text-muted">{v.noLogs}</td>
                  <td className="px-5 py-5"><TrustScore n={v.trust} /><div className="mt-1.5 max-w-[15rem] text-xs leading-snug text-faint">{v.trustReason}</div></td>
                  <td className="px-5 py-5"><Speed n={v.speed} /></td>
                  <td className="px-5 py-5 text-muted">{v.bestFor}</td>
                  <td className="px-5 py-5">
                    {v.noAffiliate ? (
                      <a href="https://mullvad.net/" target="_blank" rel="noopener noreferrer" className="btn-ghost whitespace-nowrap" title="Mullvad runs no affiliate program — this is a plain link">Visit Site</a>
                    ) : (
                      <AffiliateButton to={v.affiliateKey} className="whitespace-nowrap">Get Deal</AffiliateButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 lg:hidden">
          {VPNS.map((v) => (
            <div key={v.name} className={"panel p-5 " + (v.bestPick ? "shadow-glow" : "")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BrandLogo slug={v.logo} name={v.name} size={26} />
                  <span className="font-mono text-lg font-bold">{v.name}</span>
                </div>
                {v.bestPick && <BestPick />}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div><div className="mono-label">Price</div><div className="font-mono font-semibold text-brand">{v.price}</div><div className="text-xs text-faint">{v.priceNote}</div></div>
                <div><div className="mono-label">Speed</div><Speed n={v.speed} /></div>
              </div>
              <div className="mt-3 text-sm"><div className="mono-label">Trust score</div><TrustScore n={v.trust} /><div className="mt-1.5 text-xs leading-snug text-faint">{v.trustReason}</div></div>
              <div className="mt-3 text-sm"><div className="mono-label">No-logs</div><div className="text-muted">{v.noLogs}</div></div>
              <div className="mt-3 text-sm"><div className="mono-label">Best for</div><div className="text-muted">{v.bestFor}</div></div>
              <div className="mt-4">
                {v.noAffiliate ? (
                  <a href="https://mullvad.net/" target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">Visit Site</a>
                ) : (
                  <AffiliateButton to={v.affiliateKey} className="w-full">Get Deal</AffiliateButton>
                )}
              </div>
            </div>
          ))}
        </div>

        <AdSlot slot="vpn-mid" />

        <div className="panel my-8 p-7 sm:p-9">
          <h2 className="font-mono text-xl font-bold">How We Choose</h2>
          <p className="mt-3 max-w-3xl text-muted">
            We weight four things, in this order: a <span className="text-ink">no-logs policy that's actually been audited</span> by an outside firm (a promise isn't proof); <span className="text-ink">jurisdiction</span> (where the company is based decides who can legally demand your data); <span className="text-ink">real-world speed</span> on everyday connections; and <span className="text-ink">honest pricing</span> without renewal traps. The <span className="text-ink">trust score</span> on each VPN rolls those factors into a single 0&ndash;100 number so you can compare at a glance. We don't rank by who pays the biggest commission — Mullvad is on this list and runs no affiliate program at all.
          </p>
          <p className="mt-4 text-sm text-muted">Future-proofing matters too: see our <a href="/quantum-vpn-tracker" className="link-accent">Quantum-Safe VPN Tracker</a> for which providers have actually deployed post-quantum (ML-KEM) encryption.</p>
        </div>
      </div>
    </div>
  );
}
