import { useTheme } from "../lib/theme.jsx";

function Icon({ name }) {
  const common = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "light")
    return (<svg {...common} aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
  if (name === "dark")
    return (<svg {...common} aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>);
  return (<svg {...common} aria-hidden="true"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
}

const OPTIONS = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "hacker", label: "Hacker" },
];

export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Color theme" className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-elevated/60 p-0.5">
      {OPTIONS.map((o) => {
        const active = theme === o.key;
        return (
          <button key={o.key} role="radio" aria-checked={active} title={`${o.label} mode`} onClick={() => setTheme(o.key)}
            className={["flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] transition-all", active ? "bg-brand text-onbrand shadow-glow-sm" : "text-muted hover:bg-base/60 hover:text-ink"].join(" ")}>
            <Icon name={o.key} />
            {!compact && <span>{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
