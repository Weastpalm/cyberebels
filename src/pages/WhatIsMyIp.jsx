import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";
import GeoConsole from "../components/GeoConsole.jsx";
import { AffiliateButton } from "../components/Affiliate.jsx";
import { getIpInfo } from "../lib/detect.js";

function Field({ label, children }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 border-t border-line/50 py-2 font-mono text-[13px]">
      <dt className="w-28 flex-none text-faint">{label}</dt>
      <dd className="min-w-0 flex-1 text-ink">{children || <span className="text-faint">—</span>}</dd>
    </div>
  );
}

export default function WhatIsMyIp() {
  const [info, setInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { let on = true; getIpInfo().then((r) => { if (on) setInfo(r); }); return () => { on = false; }; }, []);

  const loading = info === null;
  const ip = info && info.ok ? info.ip : null;
  const located = info && info.ok && typeof info.lat === "number" && typeof info.lon === "number";
  const place = info && info.ok ? [info.city, info.region, info.country].filter(Boolean).join(", ") : "";

  function copy() {
    if (!ip) return;
    try { navigator.clipboard.writeText(ip); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  const ld = { "@context": "https://schema.org", "@type": "WebApplication", name: "What Is My IP", applicationCategory: "SecurityApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0" } };

  return (
    <div className="surveil-grid">
      <Seo path="/what-is-my-ip" title="What Is My IP Address? — Free IP & Location Lookup" description="Instantly see your public IP address, approximate location (city, region, country), ISP and a live map — free, no sign-up. Plus what your IP reveals about you and how to hide it." keywords="what is my ip, my ip address, ip lookup, ip location, find my ip, public ip address, my ip and location" jsonLd={ld} />
      <PageHeader eyebrow="// live tool · ip & location lookup" title="What Is" accent="My IP?" intro="Your public IP address is the first thing every website, app and server you connect to can see. Here's yours right now — plus the approximate location and network it gives away." />

      <section className="mx-auto max-w-[1440px] px-4 pb-16">
        {/* IP + map */}
        <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,360px)]">
          <div className="panel-accent flex flex-col p-6 sm:p-8">
            <p className="mono-label mb-2">// your public IP address</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="break-all font-mono text-3xl font-extrabold tracking-tight text-brand text-glow sm:text-4xl">{loading ? "detecting…" : ip || "unavailable"}</span>
              {ip && <button onClick={copy} className="btn-ghost px-3 py-1.5 text-xs">{copied ? "copied ✓" : "copy"}</button>}
            </div>
            <dl className="mt-5">
              <Field label="Location">{place}</Field>
              <Field label="ISP / network">{info && info.ok ? info.org : ""}</Field>
              <Field label="ASN">{info && info.ok ? info.asn : ""}</Field>
              <Field label="Timezone">{info && info.ok ? info.timezone : ""}</Field>
              <Field label="Coordinates">{located ? `${info.lat.toFixed(4)}, ${info.lon.toFixed(4)}` : ""}</Field>
            </dl>
            <p className="mt-4 font-mono text-[11px] text-faint">Geolocation is approximate (city-level at best) and comes from your IP via ipwho.is — it isn&apos;t GPS. Nothing here is stored.</p>
          </div>
          <div className="min-w-0">
            {located
              ? <GeoConsole lat={info.lat} lon={info.lon} label={[info.city, info.country].filter(Boolean).join(", ")} sub="↑ approximate location from your IP" />
              : <div className="panel flex h-full min-h-[180px] items-center justify-center p-6 text-center font-mono text-xs text-faint">{loading ? "loading map…" : "No map — location couldn't be resolved (a VPN or privacy network can cause this)."}</div>}
          </div>
        </div>

        {/* Hide your IP CTA (affiliate) */}
        <div className="mt-4 panel flex flex-wrap items-center gap-4 border-brand/30 p-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-mono text-base font-bold text-ink">Want to hide this?</h2>
            <p className="mt-1 text-sm text-muted">A VPN replaces the IP and location above with the server&apos;s, so sites and your ISP can&apos;t tie your browsing back to you. See our honest <Link to="/best-vpns" className="link-accent">VPN comparison with trust scores</Link>.</p>
          </div>
          <AffiliateButton to="nordvpn" className="flex-none">Hide my IP with NordVPN →</AffiliateButton>
        </div>

        <AdSlot slot="ip-mid" />

        {/* EXPLAINER — useful, search-friendly content */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="panel p-6">
            <h2 className="font-mono text-lg font-bold text-ink">What is an IP address?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">An IP (Internet Protocol) address is the unique number your internet connection uses to send and receive data — like a return address for everything you do online. Your <span className="text-ink">public IP</span> is assigned by your internet provider and is visible to every website, app and server you connect to. A separate <span className="text-ink">private IP</span> (like 192.168.x.x) is used only inside your home network and isn&apos;t visible on the public internet.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">There are two formats in use: older <span className="text-ink">IPv4</span> (e.g. 24.183.159.106) and newer, much larger <span className="text-ink">IPv6</span> (e.g. 2001:db8::1). The address shown above is whichever one your connection is currently using to reach this site.</p>
          </div>
          <div className="panel p-6">
            <h2 className="font-mono text-lg font-bold text-ink">What does your IP reveal?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">On its own, your IP can give away your <span className="text-ink">approximate location</span> (usually city or region, not your street), your <span className="text-ink">internet provider</span>, and whether you&apos;re on home broadband, mobile data, or a hosting/VPN network. Sites combine it with cookies and your <Link to="/fingerprint" className="link-accent">browser fingerprint</Link> to recognise you across visits.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">It does <span className="text-ink">not</span> directly reveal your name, exact address, or what&apos;s on your device — but your provider can link the IP to your account, and that record can be requested with legal process. Want the full picture of what leaks? Run <Link to="/am-i-tracked" className="link-accent">Am I Being Tracked?</Link></p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-4 panel p-6">
          <h2 className="font-mono text-lg font-bold text-ink">Common questions</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
            <div><p className="font-mono font-bold text-ink">Is it dangerous if someone has my IP?</p><p className="mt-1">For most people, no — it mainly reveals a rough location and your ISP. The real risks are targeted harassment, DDoS attacks, or being correlated across sites. A VPN removes the easy link by hiding your real IP.</p></div>
            <div><p className="font-mono font-bold text-ink">How do I change or hide my IP?</p><p className="mt-1">Restarting your router sometimes gets you a new one from your ISP. To genuinely hide it, use a <Link to="/best-vpns" className="link-accent">VPN</Link> or the Tor Browser, which route your traffic through another server so sites see that address instead of yours.</p></div>
            <div><p className="font-mono font-bold text-ink">Why is my location wrong?</p><p className="mt-1">IP geolocation is an estimate based on where your provider registers the address — it can be off by a city or more, and it points to your ISP&apos;s hub rather than your home. If you&apos;re on a VPN, it will show the VPN server&apos;s location instead.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
