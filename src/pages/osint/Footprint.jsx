import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

function FootprintAudit() {
  const [handle, setHandle] = useState("");
  const [links, setLinks] = useState(null);
  function build() {
    const h = handle.trim().replace(/^@/, "");
    if (!h) return;
    const q = encodeURIComponent(h);
    setLinks([
      ["Google (exact match)", `https://www.google.com/search?q=%22${q}%22`],
      ["Google (broad)", `https://www.google.com/search?q=${q}`],
      ["X / Twitter", `https://x.com/${h}`],
      ["Instagram", `https://www.instagram.com/${h}/`],
      ["GitHub", `https://github.com/${h}`],
      ["Reddit", `https://www.reddit.com/user/${h}`],
      ["TikTok", `https://www.tiktok.com/@${h}`],
      ["LinkedIn search", `https://www.linkedin.com/search/results/all/?keywords=${q}`],
    ]);
  }
  return (
    <div className="panel p-6">
      <h3 className="font-mono text-lg font-bold">Find your own <span className="text-brand">footprint</span></h3>
      <p className="mt-2 text-sm text-muted">Enter a username you use and we'll open the exact searches an investigator would run — so you can see what's public about <strong className="text-ink">you</strong> and clean it up.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input value={handle} onChange={(e) => setHandle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && build()} placeholder="your_username" className="field flex-1 font-mono" />
        <button onClick={build} className="btn-primary">Audit my handle</button>
      </div>
      {links && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between rounded-lg border border-line bg-elevated/40 px-3 py-2 font-mono text-xs text-muted hover:border-brand hover:text-brand">
              <span>{label}</span><span>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Footprint() {
  return (
    <div className="surveil-grid">
      <Seo path="/osint/footprint" title="Footprint Audit" description="See yourself the way an investigator would. Enter a username and open the exact OSINT searches that surface your public profiles — so you can clean them up." />
      <PageHeader eyebrow="// osint · self-audit" title="Your Public" accent="Footprint" intro="See yourself the way an investigator would, then clean it up. Nothing is logged — these just open the searches in new tabs." />
      <section className="mx-auto max-w-[1440px] px-4 pb-16">
        <FootprintAudit />
        <BackToConsole />
      </section>
    </div>
  );
}
