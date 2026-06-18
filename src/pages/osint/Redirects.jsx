import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";
import { checkRedirects } from "../../lib/osint.js";

function hostOf(u) { try { return new URL(u).hostname; } catch { return u; } }

export default function Redirects() {
  const [val, setVal] = useState("");
  const [s, setS] = useState({ status: "idle" });
  async function run() {
    if (!val.trim()) return;
    setS({ status: "loading" });
    setS({ status: "done", ...(await checkRedirects(val.trim())) });
  }
  const finalHost = s.final ? hostOf(s.final) : null;
  return (
    <div className="surveil-grid">
      <Seo path="/osint/redirects" title="URL Redirect Analyzer — Trace Short Links" description="Follow a URL through every redirect hop and reveal where a short link or tracking URL actually ends up — before you click it." keywords="url redirect checker, expand short url, unshorten link, redirect chain analyzer" />
      <PageHeader eyebrow="// threat center · url redirects" title="URL Redirect" accent="Analyzer" intro="Short links and tracking URLs hide their real destination. Paste one and watch every hop it takes — so you know where it lands before you go there." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="https://bit.ly/xxxxx" className="field flex-1 font-mono" />
            <button onClick={run} className="btn-primary" disabled={s.status === "loading"}>{s.status === "loading" ? "Following…" : "Trace"}</button>
          </div>
        </div>
        {s.status === "loading" && <p className="mt-4 font-mono text-sm text-faint animate-blink">following redirects…</p>}
        {s.status === "done" && s.state === "unreachable" && <p className="mt-4 font-mono text-sm text-warn">Feed offline — runs on the deployed site / netlify dev.</p>}
        {s.status === "done" && s.chain && (
          <div className="mt-6 panel p-5">
            <div className="mb-3 flex items-center justify-between"><span className="mono-label">redirect chain · {s.chain.length} hop{s.chain.length !== 1 ? "s" : ""}</span>{finalHost && <Link to={`/osint/${encodeURIComponent(finalHost)}`} className="font-mono text-[11px] link-accent">investigate final domain ↗</Link>}</div>
            <ol className="space-y-2">
              {s.chain.map((h, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-xs">
                  <span className="text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`chip ${h.status >= 400 ? "border-danger/50 text-danger" : h.status >= 300 ? "border-warn/50 text-warn" : "border-brand/50 text-brand"}`}>{h.status}</span>
                  <span className="break-all text-muted">{h.url}</span>
                </li>
              ))}
            </ol>
            {s.error && <p className="mt-3 font-mono text-[11px] text-warn">{s.error}</p>}
            {s.chain.length > 3 && <p className="mt-3 font-mono text-[11px] text-warn">⚠ Several hops — common for trackers and cloaking. Check the final destination carefully.</p>}
          </div>
        )}
        <div className="mt-6 rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm text-muted">New to this? <Link to="/guides/url-redirects-explained" className="link-accent">How redirects work and which are suspicious →</Link></div>
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
