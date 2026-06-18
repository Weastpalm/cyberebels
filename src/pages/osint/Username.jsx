import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";
import { checkUsername } from "../../lib/osint.js";

const BADGE = {
  found: ["border-brand/50 text-brand", "✓ exists"],
  notfound: ["border-line text-faint", "✗ not found"],
  unknown: ["border-warn/50 text-warn", "? unsure"],
  link: ["border-info/50 text-info", "open ↗"],
};

export default function Username() {
  const [name, setName] = useState("");
  const [state, setState] = useState({ status: "idle" });

  async function run() {
    const u = name.trim().replace(/^@/, "");
    if (!u) return;
    setState({ status: "loading" });
    const res = await checkUsername(u);
    setState({ status: "done", ...res });
  }

  const found = state.results ? state.results.filter((r) => r.status === "found") : [];

  return (
    <div className="surveil-grid">
      <Seo path="/osint/username" title="Username Search — Find Accounts by Handle" description="Check whether a username exists on GitHub, Reddit, GitLab, Steam, Twitch, Keybase and more — a fast OSINT footprint check that runs server-side." keywords="username search, find accounts by username, osint username, sherlock alternative, social media username lookup" />
      <PageHeader eyebrow="// osint · accounts" title="Username" accent="Search" intro="Enter a handle and Cyber Rebels checks where it exists across the web. Useful for auditing your own footprint or vetting a contact. Results are best-effort — always confirm by opening the profile." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-5 sm:p-6">
          <label className="mono-label">username / handle</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="e.g. torvalds" className="field flex-1 font-mono" />
            <button onClick={run} className="btn-primary" disabled={state.status === "loading"}>{state.status === "loading" ? "Searching…" : "Search"}</button>
          </div>
          <p className="mt-2 font-mono text-[10px] text-faint">checks GitHub · GitLab · Reddit · Steam · Twitch · Keybase · Telegram (+ manual links). Runs server-side.</p>
        </div>

        {state.status === "loading" && (
          <div className="panel-accent mt-4 overflow-hidden">
            <div className="console-bar"><span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" /><span className="ml-2 font-mono text-xs text-faint">probing accounts…</span></div>
            <div className="p-5 font-mono text-sm text-muted">
              <div className="flex items-center gap-2"><span className="text-brand">▸</span> querying platforms <span className="animate-blink text-faint">_</span></div>
              <div className="relative mt-4 h-1 w-full overflow-hidden rounded bg-elevated"><div className="absolute inset-y-0 w-1/3 rounded bg-brand animate-sweep" /></div>
            </div>
          </div>
        )}

        {state.status === "done" && state.state === "unreachable" && (
          <p className="mt-4 font-mono text-sm text-warn">The username service runs through a serverless function that&apos;s live on the deployed site (or via <code className="rounded bg-elevated px-1 text-brand">netlify dev</code>). It isn&apos;t available in a plain Vite preview.</p>
        )}

        {state.status === "done" && state.results && state.results.length > 0 && (
          <>
            {found.length > 0 && <p className="mt-5 font-mono text-sm text-brand">✓ found on {found.length} platform{found.length > 1 ? "s" : ""}</p>}
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {state.results.map((r) => {
                const [cls, label] = BADGE[r.status] || BADGE.unknown;
                return (
                  <a key={r.site} href={r.url} target="_blank" rel="noopener noreferrer nofollow" className={`panel flex items-center justify-between p-4 transition-all hover:border-brand ${r.status === "found" ? "border-brand/40" : ""}`}>
                    <span className="font-mono text-sm text-ink">{r.site}</span>
                    <span className={`chip ${cls}`}>{label}</span>
                  </a>
                );
              })}
            </div>
            <p className="mt-4 font-mono text-xs text-faint">// &quot;unsure&quot; = the site couldn&apos;t be auto-checked (anti-bot or JS-only). Open it to confirm. Manual-link sites (X, Instagram…) block automated checks — click to look.</p>
          </>
        )}
        <BackToConsole />
      </section>
    </div>
  );
}
