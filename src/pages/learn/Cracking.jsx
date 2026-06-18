import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const COMMON = ["123456","password","123456789","12345678","qwerty","abc123","password1","111111","hunter2","letmein","iloveyou","admin","welcome","monkey","dragon","football","000000","qwerty123","sunshine","princess","admin123","letmein123","root","toor"];

const RATES = [
  { label: "Online (throttled)", r: 1e2, note: "form with rate-limiting" },
  { label: "Online (no limit)", r: 1e6, note: "leaked login endpoint" },
  { label: "Offline · GPU", r: 1e10, note: "fast hash on a rig" },
  { label: "Offline · cluster", r: 1e12, note: "serious attacker" },
];

function charset(pw) {
  let n = 0;
  if (/[a-z]/.test(pw)) n += 26;
  if (/[A-Z]/.test(pw)) n += 26;
  if (/[0-9]/.test(pw)) n += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) n += 33;
  return n;
}
function fmt(log10s) {
  if (log10s < 0) return "instantly";
  const L = (x) => Math.log10(x);
  if (log10s < L(60)) return Math.max(1, Math.round(10 ** log10s)) + " seconds";
  if (log10s < L(3600)) return Math.round(10 ** (log10s - L(60))) + " minutes";
  if (log10s < L(86400)) return Math.round(10 ** (log10s - L(3600))) + " hours";
  if (log10s < L(31557600)) return Math.round(10 ** (log10s - L(86400))) + " days";
  const ly = log10s - L(31557600);
  if (ly < 6) return Math.round(10 ** ly).toLocaleString() + " years";
  if (ly < 100) return "10^" + Math.round(ly) + " years";
  return "longer than the universe has existed";
}

export default function Cracking() {
  const [pw, setPw] = useState("Tr0ub4dor");
  const [rate, setRate] = useState(RATES[2]);
  const cs = charset(pw);
  const len = pw.length;
  const entropy = len ? len * Math.log2(cs || 1) : 0;
  const inDict = COMMON.includes(pw.toLowerCase());
  const log10s = (entropy - 1) * Math.log10(2) - Math.log10(rate.r);
  const time = inDict ? "instantly" : fmt(log10s);
  const strong = entropy >= 70 && !inDict;
  const tone = inDict || entropy < 40 ? "text-danger" : entropy < 70 ? "text-warn" : "text-brand";

  return (
    <div className="surveil-grid">
      <Seo path="/learn/cracking" title="Password Crack Lab" description="Interactive estimator: see how long a password survives a brute-force attack as you change its length and character sets, and how a dictionary attack cracks common ones instantly. Educational — nothing is sent anywhere." />
      <PageHeader eyebrow="// lab · offensive basics" title="Password Crack" accent="Lab" intro="How long would your password actually last? Type one in and watch the estimate move. Nothing leaves your browser — this is a teaching tool, not a cracker." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel p-6">
          <label className="mono-label">test a password</label>
          <input value={pw} onChange={(e) => setPw(e.target.value)} className="field mt-2 font-mono" placeholder="type a password…" autoComplete="off" />

          <div className="mt-5 flex flex-wrap gap-2">
            {RATES.map((x) => (
              <button key={x.label} onClick={() => setRate(x)} className={["rounded-md border px-3 py-1.5 font-mono text-[11px] transition-colors", rate.label === x.label ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-ink"].join(" ")}>{x.label}</button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] text-faint">attacker: {rate.note} · ~{rate.r.toLocaleString()} guesses/sec</p>

          <div className="mt-5 rounded-xl border border-line bg-elevated/40 p-5 text-center">
            <div className="font-mono text-[11px] uppercase tracking-wider text-faint">estimated time to crack</div>
            <div className={`mt-1 font-mono text-3xl font-extrabold ${tone}`}>{time}</div>
            {inDict && <div className="mt-2 font-mono text-xs text-danger">⚠ found in common-password lists — cracked before brute force even starts.</div>}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="rounded border border-line bg-base/40 p-3 text-center"><div className="text-lg font-bold text-ink">{len}</div><div className="text-faint">length</div></div>
            <div className="rounded border border-line bg-base/40 p-3 text-center"><div className="text-lg font-bold text-ink">{cs}</div><div className="text-faint">charset size</div></div>
            <div className="rounded border border-line bg-base/40 p-3 text-center"><div className={`text-lg font-bold ${tone}`}>{Math.round(entropy)}</div><div className="text-faint">bits entropy</div></div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-brand">Length &gt; complexity</h3><p className="mt-2 text-sm text-muted">Each extra character multiplies the work far more than swapping a letter for a symbol. A long passphrase beats a short cryptic mess.</p></div>
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-brand">Dictionaries come first</h3><p className="mt-2 text-sm text-muted">Attackers try known leaked passwords and word lists before brute force. &quot;Complex-looking&quot; but common patterns fall instantly.</p></div>
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-warn">The real fix</h3><p className="mt-2 text-sm text-muted">Unique random passwords from a manager, plus a slow hash on the server side. You can&apos;t remember 100 strong passwords — so don&apos;t try.</p></div>
        </div>
      </section>
    </div>
  );
}
