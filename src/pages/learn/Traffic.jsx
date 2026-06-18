import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";

function Node({ label, sub }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-elevated font-mono text-[10px] uppercase text-brand">{label}</div>
      <span className="font-mono text-[10px] text-faint">{sub}</span>
    </div>
  );
}

export default function Traffic() {
  const [vpn, setVpn] = useState(false);
  const [https, setHttps] = useState(true);

  const ispSees = vpn
    ? "Only that you're connected to a VPN — the destination and content are encrypted."
    : https
    ? "Your IP and which site/domain you visit — but not the page content."
    : "Everything: your IP, the site, AND the full page content in plaintext.";
  const serverSees = vpn ? "The VPN server's IP — not your real one." : "Your real IP address.";
  const contentSafe = https ? "Encrypted in transit (HTTPS)." : "Readable by anyone on the path (no HTTPS).";

  return (
    <div className="surveil-grid">
      <Seo path="/learn/traffic" title="Traffic Flow Simulator" description="Interactive network simulation: watch a request travel from your device to a server and see exactly what your ISP, a VPN, and the destination can read. Toggle VPN and HTTPS." />
      <PageHeader eyebrow="// lab · networking" title="Traffic Flow" accent="Simulator" intro="Every request hops through several hands before it reaches a site. Toggle a VPN and HTTPS below and watch what each hop can actually see." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <style>{`@keyframes crpkt{0%{left:2%}100%{left:98%}}.crpkt{animation:crpkt 2.6s linear infinite}@media(prefers-reduced-motion:reduce){.crpkt{animation:none;left:50%}}`}</style>

        <div className="panel p-6">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setVpn((v) => !v)} className={["rounded-md border px-3 py-1.5 font-mono text-xs transition-colors", vpn ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-ink"].join(" ")}>VPN: {vpn ? "ON" : "OFF"}</button>
            <button onClick={() => setHttps((v) => !v)} className={["rounded-md border px-3 py-1.5 font-mono text-xs transition-colors", https ? "border-brand bg-brand/10 text-brand" : "border-warn/60 bg-warn/10 text-warn"].join(" ")}>HTTPS: {https ? "ON" : "OFF"}</button>
          </div>

          {/* path */}
          <div className="relative mt-8 mb-2">
            <div className="absolute left-0 right-0 top-6 h-0.5 -translate-y-1/2 bg-line" />
            <div className={`crpkt absolute top-6 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${https ? "bg-brand" : "bg-warn"}`} style={{ boxShadow: "0 0 12px 2px currentColor" }} />
            <div className="relative flex items-start justify-between">
              <Node label="You" sub="device" />
              <Node label="ISP" sub={vpn ? "sees ciphertext" : https ? "sees domain" : "sees all"} />
              {vpn && <Node label="VPN" sub="your tunnel" />}
              <Node label="Web" sub="internet" />
              <Node label="Site" sub={vpn ? "sees VPN IP" : "sees your IP"} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Row who="Your ISP sees" tone={vpn ? "good" : https ? "warn" : "danger"} text={ispSees} />
            <Row who="The destination site sees" tone={vpn ? "good" : "warn"} text={serverSees} />
            <Row who="Content in transit" tone={https ? "good" : "danger"} text={contentSafe} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-brand">HTTPS protects content</h3><p className="mt-2 text-sm text-muted">The padlock encrypts <em>what</em> you send and receive, so the network can&apos;t read it — but it still sees <em>which</em> sites you reach.</p></div>
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-brand">A VPN hides the destination</h3><p className="mt-2 text-sm text-muted">It wraps everything in a tunnel to the VPN server, so your ISP only sees the tunnel and sites see the VPN&apos;s IP — not yours. You&apos;re trusting the VPN instead of the ISP.</p></div>
        </div>
      </section>
    </div>
  );
}

function Row({ who, tone, text }) {
  const c = { good: "border-brand/40 bg-brand/5 text-brand", warn: "border-warn/40 bg-warn/5 text-warn", danger: "border-danger/40 bg-danger/5 text-danger" }[tone];
  return (
    <div className={`rounded-xl border p-3 ${c}`}>
      <span className="font-mono text-[11px] uppercase tracking-wider">{who}</span>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </div>
  );
}
