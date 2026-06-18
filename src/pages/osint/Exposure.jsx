import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import GeoConsole from "../../components/GeoConsole.jsx";
import BackToConsole from "./_back.jsx";
import { getIpInfo } from "../../lib/detect.js";
import { buildFingerprint } from "../../lib/fingerprint.js";

function ExposureRecap() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let on = true;
    (async () => {
      const ip = await getIpInfo();
      const fp = await buildFingerprint();
      if (on) setData({ ip, fp });
    })();
    return () => { on = false; };
  }, []);
  if (!data) return <div className="panel flex h-40 items-center justify-center p-6"><span className="font-mono text-sm text-faint animate-blink">scanning your exposure…</span></div>;
  const { ip, fp } = data;
  const loc = ip.ok && !ip.limited ? [ip.city, ip.region, ip.country].filter(Boolean).join(", ") : "unavailable";
  const rows = [
    ["Public IP", ip.ok ? ip.ip : "unavailable"],
    ["Approx. location", loc],
    ["Internet provider", ip.org || "unavailable"],
    ["Browser fingerprint", fp.fullHash],
    ["Fingerprint rarity", fp.effectivelyUnique ? "effectively unique" : `~1 in ${fp.denominator.toLocaleString()}`],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_340px]">
      <div className="panel p-6">
        <dl className="divide-y divide-line/50">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="truncate text-right font-mono text-sm text-danger">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/am-i-tracked" className="btn-ghost">Full tracking report →</Link>
          <Link to="/fingerprint" className="btn-ghost">Fingerprint detail →</Link>
        </div>
      </div>
      {ip.ok && !ip.limited && typeof ip.lat === "number" && (
        <GeoConsole lat={ip.lat} lon={ip.lon} label={loc} sub="this is you, right now" />
      )}
    </div>
  );
}

export default function Exposure() {
  return (
    <div className="surveil-grid">
      <Seo path="/osint/exposure" title="What You're Leaking Right Now" description="See the IP, location, ISP and browser fingerprint that every website collects the moment you connect — live, in your browser." />
      <PageHeader eyebrow="// osint · self-audit" title="What You're" accent="Leaking Right Now" intro="The data every site collects the second you connect — your live IP, location, ISP, and a browser fingerprint that follows you with no cookies." />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <ExposureRecap />
        <BackToConsole />
      </section>
    </div>
  );
}
