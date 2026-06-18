import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";
import { subdomainScan } from "../../lib/osint.js";

export default function Subdomains() {
  const [val, setVal] = useState("");
  const [s, setS] = useState({ status: "idle" });
  async function run() {
    const d = val.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    if (!d) return;
    setS({ status: "loading" });
    setS({ status: "done", ...(await subdomainScan(d)) });
  }
  return (
    <div className="surveil-grid">
      <Seo path="/pentest/subdomains" title="Subdomain Scanner — Passive Recon" description="Discover a domain's subdomains from public certificate-transparency logs (crt.sh) — passive recon with no active scanning." keywords="subdomain scanner, subdomain finder, crt.sh, certificate transparency, passive recon" />
      <PageHeader eyebrow="// pen test · recon" title="Subdomain" accent="Scanner" intro="Pulls subdomains from public certificate-transparency logs — passive recon, no packets sent to the target. Great for mapping an attack surface you're authorized to test." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="example.com" className="field flex-1 font-mono" />
            <button onClick={run} className="btn-primary" disabled={s.status === "loading"}>{s.status === "loading" ? "Scanning…" : "Scan"}</button>
          </div>
          <p className="mt-2 font-mono text-[10px] text-faint">passive · source: crt.sh certificate transparency · only scan domains you own or are authorized to test.</p>
        </div>
        {s.status === "loading" && <p className="mt-4 font-mono text-sm text-faint animate-blink">querying certificate-transparency logs…</p>}
        {s.status === "done" && s.state === "unreachable" && <p className="mt-4 font-mono text-sm text-warn">Feed offline — runs on the deployed site / netlify dev.</p>}
        {s.status === "done" && s.error && <p className="mt-4 font-mono text-sm text-warn">{s.error}</p>}
        {s.status === "done" && s.subdomains && (
          <div className="mt-6 panel p-5">
            <span className="mono-label">found · {s.count}</span>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {s.subdomains.map((d) => (
                <Link key={d} to={`/osint/${encodeURIComponent(d)}`} className="flex items-center justify-between rounded-md border border-line bg-elevated/40 px-3 py-1.5 font-mono text-xs text-muted hover:border-brand hover:text-brand">
                  <span className="truncate">{d}</span><span className="ml-2 flex-none text-[10px]">investigate ↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        <BackToConsole />
      </section>
    </div>
  );
}
