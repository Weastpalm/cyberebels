import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";

function classify(o) {
  const [a, b] = o;
  if (a === 127) return { k: "Loopback", t: "info", d: "Points back at your own machine (localhost)." };
  if (a === 10) return { k: "Private", t: "good", d: "RFC 1918 private range — not routable on the public internet." };
  if (a === 172 && b >= 16 && b <= 31) return { k: "Private", t: "good", d: "RFC 1918 private range (172.16–172.31)." };
  if (a === 192 && b === 168) return { k: "Private", t: "good", d: "RFC 1918 private range — your home network lives here." };
  if (a === 169 && b === 254) return { k: "Link-local", t: "warn", d: "Self-assigned when DHCP fails (APIPA)." };
  if (a >= 224 && a <= 239) return { k: "Multicast", t: "info", d: "One-to-many delivery (224.0.0.0/4)." };
  if (a >= 240) return { k: "Reserved", t: "warn", d: "Reserved/experimental space." };
  return { k: "Public", t: "danger", d: "Routable on the public internet — this is what sites see." };
}
const TONE = { good: "text-brand", info: "text-info", warn: "text-warn", danger: "text-danger" };

export default function IpLesson() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState(24);
  const octets = ip.split(".").map((n) => parseInt(n, 10));
  const valid = octets.length === 4 && octets.every((n) => Number.isInteger(n) && n >= 0 && n <= 255);
  const cls = valid ? classify(octets) : null;
  const hosts = Math.max(0, Math.pow(2, 32 - prefix) - 2);

  return (
    <div className="surveil-grid">
      <Seo path="/learn/ip" title="IP Addressing Lesson" description="Interactive lesson: break an IPv4 address into octets and binary, classify it (public, private, loopback), and explore subnet sizes with a live CIDR slider." />
      <PageHeader eyebrow="// lab · networking" title="IP Addressing" accent="Lesson" intro="An IPv4 address is four 8-bit numbers — 32 bits total. Type one below to see its binary, what class it belongs to, and how subnets carve it up." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel p-6">
          <label className="mono-label">IPv4 address</label>
          <input value={ip} onChange={(e) => setIp(e.target.value)} className="field mt-2 font-mono" placeholder="e.g. 8.8.8.8" />
          {!valid && <p className="mt-2 font-mono text-xs text-warn">enter four numbers 0–255, separated by dots.</p>}

          {valid && (
            <>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {octets.map((o, i) => (
                  <div key={i} className="rounded-md border border-line bg-elevated/50 p-3 text-center">
                    <div className="font-mono text-2xl font-bold tabular-nums text-ink">{o}</div>
                    <div className="mt-1 font-mono text-[11px] text-brand">{o.toString(2).padStart(8, "0")}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-wider text-faint">octet {i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`chip ${TONE[cls.t]} border-current`}>{cls.k}</span>
                <span className="text-sm text-muted">{cls.d}</span>
              </div>
              <div className="mt-4 font-mono text-xs text-faint">binary · {octets.map((o) => o.toString(2).padStart(8, "0")).join(".")}</div>
            </>
          )}
        </div>

        <div className="mt-6 panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold">Subnet explorer — <span className="text-brand">/{prefix}</span></h3>
            <span className="font-mono text-xs text-muted">{hosts.toLocaleString()} usable hosts</span>
          </div>
          <input type="range" min="8" max="32" value={prefix} onChange={(e) => setPrefix(+e.target.value)} className="mt-4 w-full accent-brand" />
          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs sm:grid-cols-4">
            <div className="rounded border border-line bg-elevated/40 p-2 text-center"><div className="text-brand">/{prefix}</div><div className="text-faint">prefix</div></div>
            <div className="rounded border border-line bg-elevated/40 p-2 text-center"><div className="text-ink">{prefix}</div><div className="text-faint">network bits</div></div>
            <div className="rounded border border-line bg-elevated/40 p-2 text-center"><div className="text-ink">{32 - prefix}</div><div className="text-faint">host bits</div></div>
            <div className="rounded border border-line bg-elevated/40 p-2 text-center"><div className="text-ink tabular-nums">{hosts.toLocaleString()}</div><div className="text-faint">hosts</div></div>
          </div>
          <p className="mt-3 text-sm text-muted">The prefix says how many leading bits identify the <span className="text-ink">network</span>; the rest identify <span className="text-ink">hosts</span>. Smaller prefix = bigger network. A home router is usually /24 (254 hosts).</p>
        </div>
      </section>
    </div>
  );
}
