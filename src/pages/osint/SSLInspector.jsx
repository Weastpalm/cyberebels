import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";
import { sslInspect } from "../../lib/osint.js";

const dotS = { good: "text-brand", warn: "text-warn", bad: "text-danger", mute: "text-faint" };
function sslScore(s) {
  let v = 60; const reasons = [];
  const add = (d, t, m) => { v += d; reasons.push([t, m]); };
  if (s.daysLeft == null) add(-10, "mute", "Expiry date not parsed");
  else if (s.daysLeft < 0) add(-50, "bad", "Certificate has expired");
  else if (s.daysLeft < 15) add(-15, "warn", `Expires in ${s.daysLeft} days`);
  else add(12, "good", `Valid for ${s.daysLeft} more days`);
  const selfSigned = !s.issuer || (s.subject && s.issuer && s.subject === s.issuer);
  if (selfSigned) add(-30, "bad", "Self-signed / no trusted issuer"); else add(10, "good", `Issued by ${s.issuer}`);
  if (s.san && s.san.length) add(5, "good", `Covers ${s.san.length} hostname${s.san.length > 1 ? "s" : ""}`);
  v = Math.max(0, Math.min(100, Math.round(v)));
  const tone = v >= 70 ? "good" : v >= 45 ? "warn" : "bad";
  const label = v >= 70 ? "Healthy" : v >= 45 ? "Needs attention" : "Problem";
  return { v, tone, label, reasons };
}
function ScoreBanner({ sc }) {
  return (
    <div className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${sc.tone === "bad" ? "border-danger/40" : sc.tone === "good" ? "border-brand/40" : "border-warn/40"}`}>
      <div className="flex items-center gap-4">
        <div className={`font-mono text-4xl font-extrabold tabular-nums ${dotS[sc.tone]}`}>{sc.v}</div>
        <div><div className="font-mono text-[10px] uppercase tracking-wider text-faint">certificate score</div><div className={`font-mono text-sm font-bold ${dotS[sc.tone]}`}>{sc.label}</div></div>
      </div>
      <ul className="flex-1 space-y-1 sm:border-l sm:border-line sm:pl-4">
        {sc.reasons.map((r, i) => (<li key={i} className="flex items-center gap-2 font-mono text-[11px]"><span className={dotS[r[0]]}>{r[0] === "good" ? "+" : r[0] === "bad" ? "−" : r[0] === "warn" ? "!" : "·"}</span><span className="text-muted">{r[1]}</span></li>))}
      </ul>
    </div>
  );
}

export default function SSLInspector() {
  const [val, setVal] = useState("");
  const [s, setS] = useState({ status: "idle" });
  async function run() {
    if (!val.trim()) return;
    setS({ status: "loading" });
    setS({ status: "done", ...(await sslInspect(val.trim())) });
  }
  const expired = s.daysLeft != null && s.daysLeft < 0;
  const soon = s.daysLeft != null && s.daysLeft >= 0 && s.daysLeft < 15;
  return (
    <div className="surveil-grid">
      <Seo path="/osint/ssl" title="SSL / TLS Certificate Inspector" description="Inspect any site's TLS certificate with a health score: issuer, validity dates, days remaining, and all the hostnames it covers (SAN) — straight from the live handshake." keywords="ssl checker, tls certificate inspector, certificate expiry, san check, ssl score" />
      <PageHeader eyebrow="// threat center · tls" title="SSL Certificate" accent="Inspector" intro="Pull the live TLS certificate for any host and get a health score: who issued it, when it expires, and every domain it covers. Mismatches and self-signed certs are red flags." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="example.com" className="field flex-1 font-mono" />
            <button onClick={run} className="btn-primary" disabled={s.status === "loading"}>{s.status === "loading" ? "Inspecting…" : "Inspect"}</button>
          </div>
        </div>
        {s.status === "loading" && <p className="mt-4 font-mono text-sm text-faint animate-blink">opening TLS handshake…</p>}
        {s.status === "done" && s.state === "unreachable" && <p className="mt-4 font-mono text-sm text-warn">Feed offline — runs on the deployed site / netlify dev.</p>}
        {s.status === "done" && s.ok === false && <p className="mt-4 font-mono text-sm text-warn">{s.error || "Couldn't read a certificate from that host."}</p>}
        {s.status === "done" && s.ok && (
          <div className="mt-6 space-y-4">
            <ScoreBanner sc={sslScore(s)} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="panel p-5">
                <span className="mono-label">certificate</span>
                <dl className="mt-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between gap-3"><dt className="text-faint">subject</dt><dd className="min-w-0 truncate text-right text-ink">{s.subject || "—"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-faint">issuer</dt><dd className="min-w-0 truncate text-right text-muted">{s.issuer || "—"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-faint">valid from</dt><dd className="text-muted">{s.validFrom || "—"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-faint">valid to</dt><dd className="text-muted">{s.validTo || "—"}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-faint">days left</dt><dd className={expired ? "font-bold text-danger" : soon ? "text-warn" : "text-brand"}>{s.daysLeft != null ? s.daysLeft : "—"}{expired ? " · EXPIRED" : soon ? " · expiring" : ""}</dd></div>
                </dl>
                {s.fingerprint && <p className="mt-3 break-all font-mono text-[10px] text-faint">sha256 {s.fingerprint}</p>}
              </div>
              <div className="panel p-5">
                <span className="mono-label">covers (SAN · {s.san ? s.san.length : 0})</span>
                <div className="mt-3 flex flex-wrap gap-1.5">{s.san && s.san.length ? s.san.map((d) => <span key={d} className="chip">{d}</span>) : <span className="font-mono text-xs text-muted">—</span>}</div>
              </div>
            </div>
            <div className="rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm text-muted">New to this? <Link to="/guides/ssl-certificates-explained" className="link-accent">What a certificate proves — and what it doesn't →</Link></div>
          </div>
        )}
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
