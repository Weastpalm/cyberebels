import Seo from "../components/Seo.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdSlot from "../components/AdSlot.jsx";
import {
  getIpInfo, getBrowserInfo, getOsInfo, getEnvSignals,
  detectWebRTCLeak, vpnHeuristic, computePrivacyScore, detectBrave,
} from "../lib/detect.js";

const LEVEL_COLOR = {
  good: "text-brand",
  warn: "text-warn",
  bad: "text-danger",
};
const DOT = {
  good: "bg-brand",
  warn: "bg-warn",
  bad: "bg-danger",
};

function Row({ label, value, level = "neutral", mono = true }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/50 py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={
          "text-right text-sm " +
          (mono ? "font-mono " : "") +
          (LEVEL_COLOR[level] || "text-ink")
        }
      >
        {value}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="panel p-6">
      <h2 className="mb-2 font-mono text-sm font-bold uppercase tracking-wider text-muted">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

function ScoreGauge({ score }) {
  const color =
    score.level === "good" ? "rgb(var(--c-brand))" : score.level === "warn" ? "rgb(var(--c-warn))" : "rgb(var(--c-danger))";
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - score.score / 100);
  return (
    <div className="panel flex flex-col items-center justify-center p-8 text-center sm:flex-row sm:gap-8 sm:text-left">
      <div className="relative h-32 w-32 flex-none">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(var(--c-line))" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-extrabold" style={{ color }}>
            {score.score}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-faint">/ 100</span>
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <p className="mono-label">Privacy score</p>
        <p className="font-mono text-2xl font-bold" style={{ color }}>{score.grade}</p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          {score.level === "good"
            ? "Solid. You've shut down most of the common tracking vectors. Keep it up."
            : score.level === "warn"
            ? "Halfway there. A few changes below would close the biggest gaps."
            : "Wide open. Right now almost any site can identify and follow you. Let's fix that."}
        </p>
      </div>
    </div>
  );
}

export default function AmITracked() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const browser = getBrowserInfo();
      const os = getOsInfo();
      const env = getEnvSignals();
      const isBrave = await detectBrave();
      const [ip, webrtc] = await Promise.all([getIpInfo(), detectWebRTCLeak()]);
      if (cancelled) return;
      const vpn = vpnHeuristic(ip, env.timezone);
      const score = computePrivacyScore({ env, webrtc, vpn, isBrave });
      setState({ loading: false, browser, os, env, isBrave, ip, webrtc, vpn, score });
    })();
    return () => { cancelled = true; };
  }, []);

  if (state.loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
        <div className="font-mono text-brand">
          <span className="animate-pulse">scanning your connection…</span>
        </div>
        <p className="mt-3 text-sm text-faint">Running locally in your browser. Nothing is uploaded.</p>
      </div>
    );
  }

  const { browser, os, env, isBrave, ip, webrtc, vpn, score } = state;
  const loc =
    ip.ok && !ip.limited
      ? [ip.city, ip.region, ip.country].filter(Boolean).join(", ")
      : "Unavailable";

  return (
    <div className="surveil-grid">
      <Seo
        path="/am-i-tracked"
        title="Am I Being Tracked? Live Privacy Report"
        description="Run a free, live report on what every website sees the moment you connect: your IP, location, ISP, WebRTC leaks, and an honest privacy score. Runs entirely in your browser."
        keywords="am i being tracked, what is my IP, privacy test, webrtc leak test, browser privacy check"
      />
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-14">
        <p className="mono-label mb-3">// live trace · runs in your browser</p>
        <h1 className="font-mono text-3xl font-extrabold tracking-tight sm:text-5xl">
          Am I Being <span className="text-danger">Tracked?</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          You didn't log in. You didn't type anything. Here's what this page pulled
          about you the instant you arrived — exactly what every site you visit can see.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <ScoreGauge score={score} />

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Section title="Your Connection">
            <Row label="IP address" value={ip.ok ? ip.ip : "Unavailable"} level={vpn.status === "vpn-likely" ? "good" : "bad"} />
            <Row label="Location" value={loc} level="bad" />
            <Row label="Network / ISP" value={ip.org || "Unknown"} mono={false} />
            <Row
              label="VPN / proxy"
              value={vpn.status === "vpn-likely" ? "Likely detected ✓" : vpn.status === "residential" ? "None detected" : "Unclear"}
              level={vpn.status === "vpn-likely" ? "good" : vpn.status === "residential" ? "bad" : "warn"}
            />
          </Section>

          <Section title="Your Browser">
            <Row label="Browser" value={`${browser.name} ${browser.version}`} />
            <Row label="Operating system" value={os} />
            <Row label="Hardened browser" value={isBrave ? "Brave ✓" : "Standard"} level={isBrave ? "good" : "warn"} />
            <Row label="Platform" value={env.platform} />
          </Section>

          <Section title="Your Device">
            <Row label="Screen" value={env.screen} />
            <Row label="Viewport" value={env.viewport} />
            <Row label="Pixel ratio" value={`${env.pixelRatio}x`} />
            <Row label="Timezone" value={env.timezone} />
            <Row label="Language" value={env.languages || env.language} />
          </Section>

          <Section title="Tracking Signals">
            <Row
              label="Cookies enabled"
              value={env.cookiesEnabled ? "Yes" : "No"}
              level={env.cookiesEnabled ? "warn" : "good"}
            />
            <Row
              label="Do Not Track"
              value={env.doNotTrack ? "On" : "Off"}
              level={env.doNotTrack ? "good" : "warn"}
            />
            <Row
              label="JavaScript"
              value="Enabled"
              level="warn"
            />
            <Row
              label="WebRTC local-IP leak"
              value={webrtc.leaking ? "Leaking ⚠" : webrtc.mdns ? "Masked (mDNS) ✓" : "No leak ✓"}
              level={webrtc.leaking ? "bad" : "good"}
            />
          </Section>
        </div>

        {/* Findings */}
        <div className="panel mt-5 p-6">
          <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-wider text-muted">
            What this means for you
          </h2>
          <ul className="space-y-2.5">
            {score.items.map((it, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className={"mt-1.5 h-2 w-2 flex-none rounded-full " + DOT[it.level]} />
                <span>
                  <span className="font-semibold text-ink">{it.label}.</span>{" "}
                  <span className="text-muted">{it.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <AdSlot slot="tracked-mid" />

        {/* The hook → conversion */}
        <div className="panel my-8 border-danger/30 p-8 text-center shadow-glow-red">
          <p className="font-mono text-lg text-ink sm:text-xl">
            Think you're anonymous? <span className="text-danger">This is what every
            website sees the moment you land on their page.</span>
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            The good news: most of it is fixable in an afternoon. Start with a VPN to
            hide your IP and location, then swap the worst trackers for private tools.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/best-vpns" className="btn-primary">Fix it — Find a VPN →</Link>
            <Link to="/privacy-tools" className="btn-ghost">Get Private Tools</Link>
            <Link to="/fingerprint" className="btn-ghost">Check My Fingerprint</Link>
          </div>
        </div>

        <p className="pb-10 text-center font-mono text-xs text-faint">
          Every check on this page runs locally in your browser. We don't store,
          log, or transmit any of your results. (Your IP lookup is fetched from a
          public API so we can show your location.)
        </p>
      </div>
    </div>
  );
}
