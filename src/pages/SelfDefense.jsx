import Seo from "../components/Seo.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";

const ITEMS = [
  { t: "Install a VPN on your phone and laptop", d: "Stops your ISP and public Wi-Fi from logging every site you open.", to: "/best-vpns", link: "Pick one →" },
  { t: "Switch your default search to DuckDuckGo or Brave", d: "Kills the biggest single source of profiling about you.", to: "/privacy-tools", link: "How →" },
  { t: "Turn on a password manager and fix reused passwords", d: "One breach should never unlock your other accounts.", to: "/privacy-tools", link: "Get Bitwarden →" },
  { t: "Enable two-factor authentication on email & banking", d: "A stolen password alone shouldn't be enough to get in.", to: null },
  { t: "Block third-party cookies in your browser", d: "Shuts down the classic cross-site tracking method in one setting.", to: "/am-i-tracked", link: "Check yours →" },
  { t: "Move sensitive chats to Signal", d: "End-to-end encrypted, and it barely keeps any metadata about you.", to: "/privacy-tools", link: "Get Signal →" },
  { t: "Audit and revoke app permissions", d: "That flashlight app does not need your contacts, mic, and location.", to: null },
  { t: "Delete your Google location & activity history", d: "Then turn off ad personalization while you're in there.", to: "/de-google", link: "Walkthrough →" },
  { t: "Check how unique your browser fingerprint is", d: "Cookies aren't the only way you're tracked — see the invisible one.", to: "/fingerprint", link: "Run the check →" },
  { t: "Cover your webcam and review smart-device mics", d: "Cheap, paranoid-looking, occasionally exactly right.", to: null },
];

const KEY = "cyberebels_checklist_v1";

export default function SelfDefense() {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch { /* private mode — fine, just won't persist */ }
  }, []);

  const toggle = (i) => {
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const count = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((count / ITEMS.length) * 100);

  return (
    <div>
      <Seo
        path="/self-defense"
        title="Digital Self-Defense: 10 Quick Wins"
        description="Ten things you can do in the next ten minutes to shrink your digital footprint — from locking down accounts to killing trackers. Beginner-friendly."
        keywords="digital self defense, online privacy tips, protect your privacy, reduce digital footprint, privacy checklist"
      />
      <PageHeader
        eyebrow="// checklist · bookmark this"
        title="10 Things to Do"
        accent="Right Now"
        intro="No theory. A checklist you can knock out today. Tap each one as you go — your progress saves on this device."
      />

      <div className="mx-auto max-w-3xl px-4">
        {/* Progress */}
        <div className="panel sticky top-[68px] z-20 mb-6 p-4">
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="text-muted">Locked down</span>
            <span className={pct === 100 ? "text-brand" : "text-ink"}>
              {count}/{ITEMS.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: pct + "%" }}
            />
          </div>
          {pct === 100 && (
            <p className="mt-2 font-mono text-xs text-brand">
              ⚡ All ten done. You're harder to track than 95% of people online.
            </p>
          )}
        </div>

        <ul className="space-y-3">
          {ITEMS.map((item, i) => {
            const on = !!checked[i];
            return (
              <li key={i}>
                <div
                  className={
                    "panel flex items-start gap-4 p-5 transition-colors " +
                    (on ? "border-brand/50 bg-brand/[0.04]" : "")
                  }
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    aria-label={`Mark "${item.t}" as done`}
                    className={
                      "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md border font-mono text-sm transition-all " +
                      (on
                        ? "border-brand bg-brand text-onbrand"
                        : "border-line text-faint hover:border-brand")
                    }
                  >
                    {on ? "✓" : i + 1}
                  </button>
                  <div className="flex-1">
                    <p className={"font-semibold " + (on ? "text-muted line-through" : "text-ink")}>
                      {item.t}
                    </p>
                    <p className="mt-1 text-sm text-muted">{item.d}</p>
                    {item.to && (
                      <Link to={item.to} className="link-accent mt-1 inline-block font-mono text-xs">
                        {item.link}
                      </Link>
                    )}
                  </div>
                </div>
                {i === 4 && <div className="mt-3"><AdSlot slot="defense-mid" /></div>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
