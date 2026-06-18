import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

const STORE = "cr-email-raw";
function unfold(raw) { return raw.replace(/\r\n/g, "\n").replace(/\n[ \t]+/g, " "); }
function parseHeaders(raw) {
  const out = [];
  for (const line of unfold(raw).split("\n")) { const m = line.match(/^([^\s:]+):\s?(.*)$/); if (m) out.push([m[1], m[2]]); }
  return out;
}
const getAll = (hs, n) => hs.filter(([k]) => k.toLowerCase() === n.toLowerCase()).map(([, v]) => v);
const get1 = (hs, n) => { const a = getAll(hs, n); return a.length ? a[0] : ""; };
function authVal(hs, mech) { const ar = getAll(hs, "Authentication-Results").join(" ; "); const m = ar.match(new RegExp(mech + "\\s*=\\s*([a-z]+)", "i")); return m ? m[1].toLowerCase() : null; }
function isPublic(ip) { const o = ip.split(".").map(Number); if (o.length !== 4 || o.some((n) => isNaN(n) || n < 0 || n > 255)) return false; if (o[0] === 10 || o[0] === 127 || o[0] === 0) return false; if (o[0] === 192 && o[1] === 168) return false; if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return false; if (o[0] === 169 && o[1] === 254) return false; return true; }
function originatingIp(hs) {
  const recs = getAll(hs, "Received"); const ipRe = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g;
  for (let i = recs.length - 1; i >= 0; i--) { const ips = recs[i].match(ipRe) || []; for (const ip of ips) if (isPublic(ip)) return ip; }
  const xo = get1(hs, "X-Originating-IP") || get1(hs, "X-Sender-IP"); const m = (xo.match(ipRe) || [])[0]; return m && isPublic(m) ? m : null;
}

const COMMON = ["gmail.com","google.com","googlemail.com","googleusercontent.com","yahoo.com","yahoodns.net","ymail.com","microsoft.com","outlook.com","hotmail.com","live.com","office365.com","exchangelabs.com","icloud.com","apple.com","me.com","proton.me","protonmail.com","pm.me","amazonses.com","amazonaws.com","sendgrid.net","mailgun.org","mcsv.net","mcdlv.net","list-manage.com","sparkpostmail.com","sendinblue.com","mailchimp.com","constantcontact.com","aol.com","zoho.com","fastmail.com"];
function isCommon(d) { return COMMON.some((c) => d === c || d.endsWith("." + c)); }
function rootish(d) { return d.replace(/^www\./, "").replace(/[.,;:)\]}>'"]+$/, ""); }

const PHISH_TERMS = ["urgent","immediately","act now","final notice","verify your account","verify your identity","confirm your password","account suspended","account locked","unusual activity","suspicious activity","unauthorized","click here","update your billing","payment failed","past due","invoice attached","wire transfer","gift card","bitcoin","crypto","you have won","claim your","limited time","within 24 hours","reset your password","confirm your details","validate your account","security alert"];

const MEANING = {
  spf: { pass: ["good", "The sending server is authorized to send for this domain."], fail: ["bad", "The server is NOT authorized — a strong sign of spoofing."], softfail: ["warn", "The server probably isn't authorized — treat with suspicion."], neutral: ["warn", "The domain neither permits nor denies this server."], none: ["mute", "The domain has no SPF record, so this can't be verified."] },
  dkim: { pass: ["good", "Cryptographically signed by the domain and not altered in transit."], fail: ["bad", "The signature didn't validate — the message was altered or forged."], none: ["mute", "Not DKIM-signed, so integrity can't be verified."] },
  dmarc: { pass: ["good", "Aligns with the domain's published policy — strongly authenticated."], fail: ["bad", "Failed the domain's DMARC policy — treat as suspicious."], none: ["mute", "The domain publishes no DMARC policy."] },
};
const toneClass = { good: "border-brand/50 text-brand", bad: "border-danger/50 text-danger", warn: "border-warn/50 text-warn", mute: "border-line text-faint" };
function AuthCard({ name, value }) {
  const v = value || "none"; const [tone, text] = (MEANING[name] && MEANING[name][v]) || ["mute", "No result found in the headers."];
  return (
    <div className={`rounded-xl border p-4 ${tone === "good" ? "border-brand/40 bg-brand/5" : tone === "bad" ? "border-danger/40 bg-danger/5" : tone === "warn" ? "border-warn/40 bg-warn/5" : "border-line bg-elevated/30"}`}>
      <div className="flex items-center justify-between"><span className="font-mono text-xs uppercase tracking-wider text-faint">{name}</span><span className={`chip ${toneClass[tone]}`}>{value || "missing"}</span></div>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </div>
  );
}

const SAMPLE = `Received: from mail.sender.com (mail.sender.com. [203.0.113.55]) by mx.example.com\nAuthentication-Results: mx.example.com; spf=pass smtp.mailfrom=sender.com; dkim=pass header.d=sender.com; dmarc=pass\nFrom: "Billing" <billing@sender.com>\nReturn-Path: <bounce@sender.com>\nSubject: Urgent: your account will be suspended - verify your account now\nDate: Mon, 1 Jan 2026 09:00:00 -0800\nMessage-ID: <abc@sender.com>\n\nPlease click here https://sender-verify.example-login.com/verify to confirm your details immediately.`;

function emailScore({ spf, dkim, dmarc, mismatch, phishCount, ip }) {
  let v = 50; const reasons = [];
  const add = (d, t, m) => { v += d; reasons.push([t, m]); };
  if (spf === "pass") add(15, "good", "SPF pass"); else if (spf === "fail") add(-25, "bad", "SPF fail \u2014 spoofing sign"); else if (spf === "softfail") add(-10, "warn", "SPF softfail"); else add(-5, "mute", "No SPF result");
  if (dkim === "pass") add(15, "good", "DKIM pass \u2014 signed & unaltered"); else if (dkim === "fail") add(-20, "bad", "DKIM fail \u2014 altered/forged"); else add(-5, "mute", "No DKIM result");
  if (dmarc === "pass") add(20, "good", "DMARC pass \u2014 aligned"); else if (dmarc === "fail") add(-25, "bad", "DMARC fail"); else add(-5, "mute", "No DMARC policy");
  if (mismatch) add(-15, "bad", "From and Return-Path domains differ");
  if (phishCount > 0) add(Math.max(-20, -3 * phishCount), "warn", phishCount + " phishing-language phrase" + (phishCount > 1 ? "s" : ""));
  if (!ip) add(-3, "mute", "No originating IP found");
  v = Math.max(0, Math.min(100, Math.round(v)));
  const tone = v >= 70 ? "good" : v >= 40 ? "warn" : "bad";
  const label = v >= 70 ? "Looks legitimate" : v >= 40 ? "Suspicious \u2014 verify before trusting" : "High risk \u2014 likely phishing";
  return { v, tone, label, reasons };
}
const dotE = { good: "text-brand", warn: "text-warn", bad: "text-danger", mute: "text-faint" };
function ScoreBanner({ sc }) {
  return (
    <div className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${sc.tone === "bad" ? "border-danger/40" : sc.tone === "good" ? "border-brand/40" : "border-warn/40"}`}>
      <div className="flex items-center gap-4">
        <div className={`font-mono text-4xl font-extrabold tabular-nums ${dotE[sc.tone]}`}>{sc.v}</div>
        <div><div className="font-mono text-[10px] uppercase tracking-wider text-faint">overall score</div><div className={`font-mono text-sm font-bold ${dotE[sc.tone]}`}>{sc.label}</div></div>
      </div>
      <ul className="flex-1 space-y-1 sm:border-l sm:border-line sm:pl-4">
        {sc.reasons.map((r, i) => (<li key={i} className="flex items-center gap-2 font-mono text-[11px]"><span className={dotE[r[0]]}>{r[0] === "good" ? "+" : r[0] === "bad" ? "\u2212" : r[0] === "warn" ? "!" : "\u00b7"}</span><span className="text-muted">{r[1]}</span></li>))}
      </ul>
    </div>
  );
}

export default function EmailHeaders() {
  const [raw, setRaw] = useState(() => { try { return localStorage.getItem(STORE) || ""; } catch { return ""; } });
  function update(v) { setRaw(v); try { localStorage.setItem(STORE, v); } catch (e) {} }

  const hs = raw.trim() ? parseHeaders(raw) : null;
  const spf = hs ? (authVal(hs, "spf") || (/(pass)/i.test(get1(hs, "Received-SPF")) ? "pass" : /(fail)/i.test(get1(hs, "Received-SPF")) ? "fail" : null)) : null;
  const dkim = hs ? authVal(hs, "dkim") : null;
  const dmarc = hs ? authVal(hs, "dmarc") : null;
  const ip = hs ? originatingIp(hs) : null;
  const fields = hs ? [["From", get1(hs, "From")], ["Return-Path", get1(hs, "Return-Path")], ["Reply-To", get1(hs, "Reply-To")], ["Subject", get1(hs, "Subject")], ["Date", get1(hs, "Date")]].filter(([, v]) => v) : [];
  const hops = hs ? getAll(hs, "Received") : [];
  const fromDom = hs ? rootish((get1(hs, "From").match(/@([a-z0-9.-]+\.[a-z]{2,})/i) || [])[1] || "") : "";
  const retDom = hs ? rootish((get1(hs, "Return-Path").match(/@([a-z0-9.-]+\.[a-z]{2,})/i) || [])[1] || "") : "";
  const mismatch = !!(fromDom && retDom && fromDom !== retDom && !fromDom.endsWith("." + retDom) && !retDom.endsWith("." + fromDom));

  // phishing extraction
  const urls = raw ? [...new Set((raw.match(/https?:\/\/[^\s"'<>)\]}]+/gi) || []).map((u) => u.replace(/[.,;:)\]}>'"]+$/, "")))].slice(0, 25) : [];
  const domSet = new Set();
  if (raw) {
    urls.forEach((u) => { try { domSet.add(new URL(u).hostname.toLowerCase()); } catch {} });
    (raw.match(/@([a-z0-9.-]+\.[a-z]{2,})/gi) || []).forEach((m) => domSet.add(rootish(m.slice(1).toLowerCase())));
    (raw.match(/\bd=([a-z0-9.-]+\.[a-z]{2,})/gi) || []).forEach((m) => domSet.add(rootish(m.slice(2).toLowerCase())));
  }
  const domains = [...domSet].map(rootish).filter((d) => d && !isCommon(d)).slice(0, 20);
  const phishHits = raw ? PHISH_TERMS.filter((t) => raw.toLowerCase().includes(t)) : [];

  return (
    <div className="surveil-grid">
      <Seo path="/osint/email" title="Email Checker — Is This Email Real or Phishing?" description="Free email checker: paste an email's raw source to find out if it's genuine or a phishing/spoofing attempt — originating IP, SPF/DKIM/DMARC, suspicious links and language. Runs in your browser." keywords="email checker, check if email is real, is this email a scam, phishing email checker, email header analyzer, verify email sender, spf dkim dmarc check" />
      <PageHeader eyebrow="// threat center · email forensics" title="Email Checker" accent="& Phishing Analyzer" intro="Is this email genuine, or a phishing / spoofing attempt? Paste its raw source and Cyber Rebels checks the real sender, anti-spoofing (SPF/DKIM/DMARC), the links inside, and the language — all in your browser." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <details className="panel mb-4 p-5">
          <summary className="cursor-pointer font-mono text-sm font-bold text-brand">How to get the raw email / headers ▾</summary>
          <div className="mt-3 space-y-1.5 text-sm text-muted">
            <p><span className="font-mono text-ink">Gmail:</span> open email → ⋮ → <span className="text-ink">Show original</span> → Copy to clipboard.</p>
            <p><span className="font-mono text-ink">Outlook desktop:</span> open the email → <span className="text-ink">File → Properties</span> → copy &quot;Internet headers&quot;.</p>
            <p><span className="font-mono text-ink">Outlook.com:</span> open email → ⋯ → <span className="text-ink">View → View message source</span>.</p>
            <p><span className="font-mono text-ink">Yahoo Mail:</span> open email → ⋯ (More) → <span className="text-ink">View raw message</span>.</p>
            <p><span className="font-mono text-ink">Proton Mail:</span> open email → ⋯ (top-right) → <span className="text-ink">View headers</span> (or View HTML / Export).</p>
            <p><span className="font-mono text-ink">iCloud Mail (web):</span> open email → the gear / reply menu → <span className="text-ink">View Message → All Headers / Raw</span>.</p>
            <p><span className="font-mono text-ink">Apple Mail (Mac):</span> select email → <span className="text-ink">View → Message → Raw Source</span>.</p>
          </div>
        </details>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <label className="mono-label">paste raw email / headers <span className="text-faint/70">(auto-saved)</span></label>
            <div className="flex gap-3"><button onClick={() => update(SAMPLE)} className="font-mono text-[11px] text-faint hover:text-brand">load sample →</button><button onClick={() => update("")} className="font-mono text-[11px] text-faint hover:text-danger">clear</button></div>
          </div>
          <textarea value={raw} onChange={(e) => update(e.target.value)} rows={8} placeholder="Received: from ...&#10;Authentication-Results: ...&#10;From: ...&#10;&#10;(body with links)" className="field mt-2 resize-y font-mono text-xs" />
        </div>

        {hs && (
          <div className="mt-6 space-y-6">
            <ScoreBanner sc={emailScore({ spf, dkim, dmarc, mismatch, phishCount: phishHits.length, ip })} />
            <div className="grid gap-3 sm:grid-cols-3"><AuthCard name="spf" value={spf} /><AuthCard name="dkim" value={dkim} /><AuthCard name="dmarc" value={dmarc} /></div>

            <div className="panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><span className="mono-label">originating IP</span><div className="mt-1 font-mono text-2xl font-bold text-ink">{ip || "—"}</div></div>
                {ip && <Link to={`/osint/${encodeURIComponent(ip)}`} className="btn-primary">Investigate this IP →</Link>}
              </div>
              <p className="mt-3 text-sm text-muted">The earliest public IP in the <code className="rounded bg-elevated px-1 text-brand">Received</code> chain — usually the true sending server. Run it through the console for reputation and location.</p>
            </div>

            {(domains.length > 0 || urls.length > 0) && (
              <div className="grid gap-4 md:grid-cols-2">
                {domains.length > 0 && (
                  <div className="panel p-5">
                    <span className="mono-label">domains to investigate <span className="text-faint/70">(common mail providers hidden)</span></span>
                    <div className="mt-3 space-y-1.5">
                      {domains.map((d) => (<Link key={d} to={`/osint/${encodeURIComponent(d)}`} className="flex items-center justify-between gap-2 overflow-hidden rounded-md border border-line bg-elevated/40 px-3 py-1.5 font-mono text-xs text-muted hover:border-brand hover:text-brand"><span className="min-w-0 flex-1 truncate">{d}</span><span className="ml-2 flex-none text-[10px]">investigate ↗</span></Link>))}
                    </div>
                  </div>
                )}
                {urls.length > 0 && (
                  <div className="panel p-5">
                    <span className="mono-label">links found ({urls.length})</span>
                    <div className="mt-3 space-y-1.5">
                      {urls.map((u, i) => (<Link key={i} to={`/osint?q=${encodeURIComponent(u)}`} className="flex items-center justify-between gap-2 overflow-hidden rounded-md border border-line bg-elevated/40 px-3 py-1.5 font-mono text-[11px] text-muted hover:border-brand hover:text-brand"><span className="min-w-0 flex-1 truncate">{u}</span><span className="flex-none text-[10px]">scan ↗</span></Link>))}
                    </div>
                    <p className="mt-2 font-mono text-[10px] text-faint">never open these directly — scan them first.</p>
                  </div>
                )}
              </div>
            )}

            {phishHits.length > 0 && (
              <div className="rounded-xl border border-warn/40 bg-warn/5 p-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-warn">⚠ phishing language detected ({phishHits.length})</span>
                <div className="mt-2 flex flex-wrap gap-1.5">{phishHits.map((t) => <span key={t} className="chip border-warn/50 text-warn">{t}</span>)}</div>
                <p className="mt-2 text-sm text-muted">Urgency and credential-bait phrasing like this is a hallmark of phishing. On its own it isn't proof — weigh it with the auth results and the sending domain.</p>
              </div>
            )}

            {fields.length > 0 && (
              <div className="panel p-5"><span className="mono-label">key fields</span>
                <dl className="mt-3 divide-y divide-line/50">{fields.map(([k, v]) => (<div key={k} className="flex flex-col gap-1 py-2 sm:flex-row sm:gap-4"><dt className="w-28 flex-none font-mono text-[11px] uppercase text-faint">{k}</dt><dd className="break-all font-mono text-xs text-muted">{v}</dd></div>))}</dl>
                <p className="mt-3 text-xs text-faint">If the <span className="text-muted">From</span> and <span className="text-muted">Return-Path</span> domains don't match, be suspicious — a classic spoofing tell.</p>
              </div>
            )}

            {hops.length > 0 && (
              <details className="panel p-5"><summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-faint">delivery hops ({hops.length}) ▾</summary>
                <ol className="mt-3 space-y-2">{hops.map((h, i) => (<li key={i} className="flex gap-3 font-mono text-[11px]"><span className="text-brand">{String(hops.length - i).padStart(2, "0")}</span><span className="break-all text-muted">{h.slice(0, 220)}</span></li>))}</ol>
              </details>
            )}

            <div className="rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm text-muted">
              <span className="font-mono text-ink">What to do:</span> if any of SPF / DKIM / DMARC says <span className="text-danger">fail</span>, the originating IP looks wrong, or phishing language is flagged — treat the email as likely spoofed. Don't click links or open attachments; verify with the sender another way.{" "}
              <Link to="/guides/reading-email-headers" className="link-accent">Learn how to read these results →</Link>
            </div>
          </div>
        )}
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
