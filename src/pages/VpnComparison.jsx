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

      <div className="mx-auto max-w-6xl px-4">
        {/* Desktop table */}
        <div className="panel hidden overflow-hidden lg:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-elevated font-mono text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4">VPN</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">No-logs</th>
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
            We weight four things, in this order: a <span className="text-ink">no-logs policy that's actually been audited</span> by an outside firm (a promise isn't proof); <span className="text-ink">jurisdiction</span> (where the company is based decides who can legally demand your data); <span className="text-ink">real-world speed</span> on everyday connections; and <span className="text-ink">honest pricing</span> without renewal traps. We don't rank by who pays the biggest commission — Mullvad is on this list and runs no affiliate program at all.
          </p>
        </div>
      </div>
    </div>
  );
}
