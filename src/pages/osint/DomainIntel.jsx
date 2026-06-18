import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";
import { domainIntel, dnsRecords } from "../../lib/osint.js";

function fmtDate(d) { if (!d) return "—"; try { return new Date(d).toISOString().slice(0, 10); } catch { return d; } }

function ScanLoader() {
  const lines = ["resolving target", "querying RDAP registry", "reading DNS records", "scoring signals"];
  return (
    <div className="panel-accent mt-4 overflow-hidden">
      <div className="console-bar"><span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" /><span className="ml-2 font-mono text-xs text-faint">domain_recon.sh</span></div>
      <div className="p-5 font-mono text-sm">
        {lines.map((l, i) => (<div key={l} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${i * 130}ms` }}><span className="text-brand">▸</span><span className="text-muted">{l}</span><span className="text-faint animate-blink">_</span></div>))}
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded bg-elevated"><div className="absolute inset-y-0 w-1/3 rounded bg-brand animate-sweep" /></div>
        <div className="mt-2 text-faint">// correlating WHOIS + DNS</div>
      </div>
    </div>
  );
}

function score(info, dns) {
  let s = 55; const reasons = [];
  if (info && info.found) {
    const age = info.ageDays;
    if (age == null) { s -= 5; reasons.push(["warn", "Registration age unknown"]); }
    else if (age < 30) { s -= 40; reasons.push(["bad", `Registered ${age} days ago — very new`]); }
    else if (age < 90) { s -= 25; reasons.push(["warn", `Registered ${age} days ago — recent`]); }
    else if (age < 365) { s -= 4; reasons.push(["mute", `About ${Math.round(age / 30)} months old`]); }
    else { s += 20; reasons.push(["good", `Established — ${(age / 365).toFixed(1)} years old`]); }
    if (info.nameservers && info.nameservers.length) { s += 4; reasons.push(["good", "Has authoritative nameservers"]); }
    if ((info.statuses || []).map((x) => String(x).toLowerCase()).some((x) => /hold|pendingdelete|inactive/.test(x))) { s -= 20; reasons.push(["bad", "Registry status flagged (hold / pendingDelete)"]); }
  } else { s -= 10; reasons.push(["warn", "No registration record found"]); }
  if (dns) {
    if (dns.MX && dns.MX.length) { s += 6; reasons.push(["good", "Has MX records (real mail domain)"]); } else reasons.push(["mute", "No MX records"]);
    if ((dns.TXT || []).some((t) => /v=spf1/i.test(t))) { s += 6; reasons.push(["good", "Publishes an SPF record"]); }
    if (!((dns.A || []).length || (dns.AAAA || []).length)) { s -= 5; reasons.push(["warn", "No A/AAAA records — not resolving"]); }
  }
  s = Math.max(0, Math.min(100, Math.round(s)));
  const tone = s >= 70 ? "good" : s >= 45 ? "warn" : "bad";
  const label = s >= 70 ? "Likely legitimate" : s >= 45 ? "Mixed signals" : "High risk / new";
  return { s, tone, label, reasons };
}
const dot = { good: "text-brand", warn: "text-warn", bad: "text-danger", mute: "text-faint" };

export default function DomainIntel() {
  const [val, setVal] = useState("");
  const [st, setSt] = useState({ status: "idle" });

  async function run() {
    const d = val.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    if (!d) return;
    setSt({ status: "loading" });
    const [info, dns] = await Promise.all([domainIntel(d), dnsRecords(d)]);
    setSt({ status: "done", info, dns, domain: d });
  }

  const { info, dns } = st;
  const young = info && info.ageDays != null && info.ageDays < 90;
  const sc = st.status === "done" ? score(info, dns) : null;

  return (
    <div className="surveil-grid">
      <Seo path="/osint/domain" title="Domain Intel — WHOIS Age, Registrar, DNS & Risk Score" description="Look up a domain's registration age, registrar, expiry, nameservers and DNS records, with a risk score. Newly-registered domains are a top phishing signal." keywords="domain age lookup, whois, registrar lookup, dns records, domain risk score, rdap, spf record" />
      <PageHeader eyebrow="// threat center · domain intel" title="Domain" accent="Intel" intro="Registration age, registrar, nameservers, DNS records and a risk score for any domain. A domain registered last week is one of the strongest phishing tells there is." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="example.com" className="field flex-1 font-mono" />
            <button onClick={run} className="btn-primary" disabled={st.status === "loading"}>{st.status === "loading" ? "Looking up…" : "Look up"}</button>
          </div>
        </div>

        {st.status === "loading" && <ScanLoader />}

        {st.status === "done" && (
          <div className="mt-6 space-y-4">
            {sc && (
              <div className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${sc.tone === "bad" ? "border-danger/40" : sc.tone === "good" ? "border-brand/40" : "border-warn/40"}`}>
                <div className="flex items-center gap-4">
                  <div className={`font-mono text-4xl font-extrabold tabular-nums ${dot[sc.tone]}`}>{sc.s}</div>
                  <div><div className="font-mono text-[10px] uppercase tracking-wider text-faint">domain score</div><div className={`font-mono text-sm font-bold ${dot[sc.tone]}`}>{sc.label}</div></div>
                </div>
                <ul className="flex-1 space-y-1 sm:border-l sm:border-line sm:pl-4">
                  {sc.reasons.map((r, i) => (<li key={i} className="flex items-center gap-2 font-mono text-[11px]"><span className={dot[r[0]]}>{r[0] === "good" ? "+" : r[0] === "bad" ? "−" : r[0] === "warn" ? "!" : "·"}</span><span className="text-muted">{r[1]}</span></li>))}
                </ul>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="panel p-5">
                <div className="mb-3 flex items-center justify-between"><span className="mono-label">registration (RDAP)</span><Link to={`/osint/${encodeURIComponent(st.domain)}`} className="font-mono text-[11px] link-accent">investigate ↗</Link></div>
                {info && info.state === "unreachable" ? <p className="font-mono text-xs text-muted">Feed offline — runs on the deployed site / netlify dev.</p>
                : info && info.error ? <p className="font-mono text-xs text-warn">{info.error}</p>
                : info && info.found === false ? <p className="font-mono text-xs text-muted">No RDAP record found for this domain.</p>
                : info ? (
                  <dl className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between gap-3"><dt className="text-faint">age</dt><dd className={young ? "font-bold text-danger" : "text-ink"}>{info.ageDays != null ? `${info.ageDays.toLocaleString()} days` : "—"}{young ? " · NEW" : ""}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-faint">registered</dt><dd className="text-muted">{fmtDate(info.created)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-faint">expires</dt><dd className="text-muted">{fmtDate(info.expires)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-faint">registrar</dt><dd className="truncate text-right text-muted">{info.registrar || "—"}</dd></div>
                    {info.nameservers && info.nameservers.length > 0 && <div className="flex justify-between gap-3"><dt className="text-faint">nameservers</dt><dd className="truncate text-right text-muted">{info.nameservers.slice(0, 3).join(", ")}</dd></div>}
                  </dl>
                ) : null}
              </div>
              <div className="panel p-5">
                <span className="mono-label">DNS records</span>
                {dns ? (
                  <div className="mt-3 space-y-2 font-mono text-xs">
                    {["A", "AAAA", "MX", "NS", "TXT"].map((t) => (
                      <div key={t}><div className="text-faint">{t}{t === "TXT" ? " (SPF/verification)" : ""}</div>{dns[t] && dns[t].length ? dns[t].slice(0, 6).map((r, i) => <div key={i} className="min-w-0 break-all text-muted">{r}</div>) : <div className="text-faint/60">none</div>}</div>
                    ))}
                  </div>
                ) : <p className="mt-2 font-mono text-xs text-faint">—</p>}
              </div>
            </div>
            <div className="rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm text-muted">New to this? <Link to="/guides/domain-intel-explained" className="link-accent">What these fields mean and how to spot a malicious domain →</Link></div>
          </div>
        )}
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
