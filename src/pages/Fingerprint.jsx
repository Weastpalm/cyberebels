import Seo from "../components/Seo.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdSlot from "../components/AdSlot.jsx";
import { AffiliateLink } from "../components/Affiliate.jsx";
import { buildFingerprint } from "../lib/fingerprint.js";

function fmt(n) {
  return n.toLocaleString("en-US");
}

function CompRow({ label, value, bits }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/50 py-2.5 last:border-0">
      <div className="min-w-0">
        <div className="text-sm text-muted">{label}</div>
      </div>
      <div className="flex items-center gap-3 text-right">
        <span className="break-all font-mono text-sm text-ink">{value}</span>
        <span className="hidden w-16 flex-none font-mono text-xs text-faint sm:block">
          {bits > 0 ? `${bits.toFixed(1)} bits` : "—"}
        </span>
      </div>
    </div>
  );
}

export default function Fingerprint() {
  const [fp, setFp] = useState(null);

  useEffect(() => {
    let cancelled = false;
    buildFingerprint().then((res) => {
      if (!cancelled) setFp(res);
    });
    return () => { cancelled = true; };
  }, []);

  if (!fp) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1440px] flex-col items-center justify-center px-4 text-center">
        <span className="animate-pulse font-mono text-brand">computing your fingerprint…</span>
        <p className="mt-3 text-sm text-faint">Drawing to canvas, probing WebGL & audio. All local.</p>
      </div>
    );
  }

  return (
    <div className="surveil-grid">
      <Seo
        path="/fingerprint"
        title="Browser Fingerprint Test"
        description="See your unique browser fingerprint — canvas, WebGL, audio, fonts and more — and roughly how identifiable you are across the web with no cookies needed."
        keywords="browser fingerprint, fingerprint test, canvas fingerprint, am i unique, device fingerprint, anti-fingerprinting"
      />
      <header className="mx-auto max-w-[1440px] px-4 pb-6 pt-14">
        <p className="mono-label mb-3">// canvas · webgl · audio · fonts</p>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight sm:text-5xl">
          Your Browser <span className="text-brand">Fingerprint</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Even with cookies blocked and a VPN on, the combination of your device's
          quirks forms a fingerprint that can follow you across sites. Here's yours.
        </p>
      </header>

      <div className="mx-auto max-w-[1440px] px-4">
        {/* Uniqueness headline */}
        <div className="panel p-8 text-center shadow-glow">
          <p className="mono-label">Estimated distinctiveness</p>
          {fp.effectivelyUnique ? (
            <p className="mt-3 font-mono text-2xl font-bold leading-tight text-danger sm:text-3xl">
              You appear effectively unique
            </p>
          ) : (
            <p className="mt-3 font-mono text-3xl font-extrabold leading-tight text-brand sm:text-5xl">
              1 in {fmt(fp.denominator)}
            </p>
          )}
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
            Your detected signals carry about{" "}
            <span className="font-mono text-ink">{fp.bits} bits</span> of identifying
            entropy. {fp.effectivelyUnique
              ? "That's more than enough to single you out from everyone else online — websites can re-identify you without a single cookie."
              : "The higher this gets, the easier you are to pick out of a crowd without cookies."}
          </p>
          <p className="mx-auto mt-3 max-w-xl font-mono text-xs text-faint">
            Note: this is an estimate from the entropy of your signals, not a lookup
            against a live database of real visitors — that would mean collecting
            everyone's fingerprint, which is exactly what we're against.
          </p>
        </div>

        {/* Components */}
        <div className="panel mt-5 p-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
              Your fingerprint signals
            </h2>
            <span className="hidden font-mono text-xs text-faint sm:block">entropy</span>
          </div>
          {fp.components.map((c) => (
            <CompRow key={c.key} label={c.key} value={c.value} bits={c.bits} />
          ))}
          <div className="mt-4 rounded-md border border-line bg-elevated/50 p-3">
            <div className="mono-label">Combined fingerprint hash</div>
            <div className="mt-1 break-all font-mono text-sm text-brand">{fp.fullHash}</div>
          </div>
        </div>

        {/* Detail cards */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted">Graphics (WebGL)</h3>
            <p className="mt-2 break-words font-mono text-sm text-ink">{fp.webgl.renderer}</p>
            <p className="mt-1 font-mono text-xs text-faint">{fp.webgl.vendor}</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
              Detected fonts ({fp.fonts.length})
            </h3>
            <p className="mt-2 text-sm text-muted">{fp.fonts.join(", ") || "None detected"}</p>
          </div>
        </div>

        <AdSlot slot="fp-mid" />

        {/* Explainer */}
        <div className="panel my-8 p-7 sm:p-9">
          <h2 className="font-mono text-xl font-bold">What is browser fingerprinting?</h2>
          <div className="mt-4 space-y-3 text-muted">
            <p>
              Cookies are the tracking method everyone knows about. Fingerprinting is
              the one they don't. Instead of storing a file on your device, a site
              measures dozens of tiny details — how your graphics card draws an
              invisible image, which fonts you have installed, your screen size, your
              audio stack — and combines them into a near-unique ID.
            </p>
            <p>
              Because it's built from things you can't easily change, it survives
              clearing cookies, incognito mode, and even switching IPs with a VPN.
              That's what makes it powerful, and why so few people realize it's
              happening to them.
            </p>
            <p className="text-ink">
              The fix isn't one setting — it's a browser built to fight back. Brave
              randomizes fingerprintable values, and Mullvad Browser makes everyone
              look identical so you blend into the crowd.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <AffiliateLink to="brave" className="font-mono text-sm">Get Brave →</AffiliateLink>
            <AffiliateLink to="mullvadbrowser" className="font-mono text-sm">Get Mullvad Browser →</AffiliateLink>
            <Link to="/best-vpns" className="font-mono text-sm link-accent">Add a VPN too →</Link>
          </div>
        </div>

        <p className="pb-10 text-center font-mono text-xs text-faint">
          Computed entirely in your browser. Nothing here is saved or sent anywhere.
        </p>
      </div>
    </div>
  );
}
