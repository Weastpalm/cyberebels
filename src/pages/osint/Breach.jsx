import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

async function checkPwnedPassword(pw) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-1", enc);
  const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  const prefix = hash.slice(0, 5), suffix = hash.slice(5);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { "Add-Padding": "true" }, signal: ctrl.signal }).finally(() => clearTimeout(t));
  const text = await res.text();
  for (const line of text.split("\n")) {
    const [suf, count] = line.trim().split(":");
    if (suf === suffix) return { found: true, count: parseInt(count, 10) || 0 };
  }
  return { found: false, count: 0 };
}

function PwnedChecker() {
  const [pw, setPw] = useState("");
  const [state, setState] = useState({ status: "idle" });
  async function run() {
    if (!pw) return;
    setState({ status: "loading" });
    try { setState({ status: "done", ...(await checkPwnedPassword(pw)) }); }
    catch { setState({ status: "error" }); }
  }
  return (
    <div className="panel p-6">
      <h3 className="font-mono text-lg font-bold">Has your password leaked? <span className="text-brand">Check privately.</span></h3>
      <p className="mt-2 text-sm text-muted">Hashed in your browser — only the first 5 hash characters are sent, so your actual password <strong className="text-ink">never leaves this device</strong>.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="enter a password to test" autoComplete="off" className="field flex-1 font-mono" />
        <button onClick={run} className="btn-primary" disabled={state.status === "loading"}>{state.status === "loading" ? "Checking…" : "Check"}</button>
      </div>
      {state.status === "done" && state.found && (
        <div className="mt-4 rounded-xl border border-danger/40 bg-danger/5 p-4"><p className="font-mono text-sm font-bold text-danger">⚠ Found in {state.count.toLocaleString()} breaches.</p><p className="mt-1 text-sm text-muted">Stop using it everywhere and switch to a unique password from a manager.</p></div>
      )}
      {state.status === "done" && !state.found && (
        <div className="mt-4 rounded-xl border border-brand/40 bg-brand/5 p-4"><p className="font-mono text-sm font-bold text-brand">✓ Not found in known breaches.</p><p className="mt-1 text-sm text-muted">Good — but still use a long, unique password per account.</p></div>
      )}
      {state.status === "error" && <p className="mt-4 text-sm text-warn">Couldn't reach the breach database. Try again in a moment.</p>}
      <p className="mt-3 font-mono text-[11px] text-faint">Have I Been Pwned range API · k-anonymity · nothing stored.</p>
    </div>
  );
}

export default function Breach() {
  return (
    <div className="surveil-grid">
      <Seo path="/osint/breach" title="Breach & Password Check" description="Check whether your password has leaked in a breach — privately, using k-anonymity, so it never leaves your browser. Plus an email breach lookup." />
      <PageHeader eyebrow="// osint · credentials" title="Breach &" accent="Password Check" intro="Find out if your credentials are already circulating — without ever sending your actual password anywhere." />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <PwnedChecker />
          <div className="panel flex flex-col p-6">
            <h3 className="font-mono text-lg font-bold">Has your email been breached?</h3>
            <p className="mt-2 flex-1 text-sm text-muted">Have I Been Pwned tracks billions of accounts exposed in breaches. Enter your email on their site to see which breaches caught you. We link out rather than handle your email here.</p>
            <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4 self-start">Check on Have I Been Pwned ↗</a>
          </div>
        </div>
        <BackToConsole />
      </section>
    </div>
  );
}
