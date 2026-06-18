export default function GeoConsole({ lat, lon, label, sub }) {
  const W = 320, H = 180;
  const has = typeof lat === "number" && typeof lon === "number";
  const x = has ? ((lon + 180) / 360) * W : W / 2;
  const y = has ? ((90 - lat) / 180) * H : H / 2;
  const vlines = []; for (let l = -150; l <= 150; l += 30) vlines.push(((l + 180) / 360) * W);
  const hlines = []; for (let l = -60; l <= 60; l += 30) hlines.push(((90 - l) / 180) * H);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-glow-sm">
      <div className="console-bar">
        <span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" />
        <span className="ml-2 font-mono text-[11px] text-faint">geo_trace.map</span>
        {has && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-slow" /> locked</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full bg-elevated/30" role="img" aria-label={label ? `Map marker at ${label}` : "Geolocation grid"}>
        {vlines.map((vx, i) => (<line key={"v" + i} x1={vx} y1="0" x2={vx} y2={H} className="stroke-brand/10" strokeWidth="1" />))}
        {hlines.map((hy, i) => (<line key={"h" + i} x1="0" y1={hy} x2={W} y2={hy} className="stroke-brand/10" strokeWidth="1" />))}
        <line x1="0" y1={H / 2} x2={W} y2={H / 2} className="stroke-brand/25" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={W / 2} y1="0" x2={W / 2} y2={H} className="stroke-brand/25" strokeWidth="1" strokeDasharray="3 3" />
        {has && (<g><line x1={x} y1="0" x2={x} y2={H} className="stroke-brand/40" strokeWidth="1" /><line x1="0" y1={y} x2={W} y2={y} className="stroke-brand/40" strokeWidth="1" /><circle cx={x} cy={y} r="14" className="fill-none stroke-brand/40 geo-pulse" strokeWidth="1.5" /><circle cx={x} cy={y} r="7" className="fill-brand/20 stroke-brand" strokeWidth="1.5" /><circle cx={x} cy={y} r="2.5" className="fill-brand" /></g>)}
      </svg>
      <div className="flex items-center justify-between border-t border-line/60 px-3 py-2">
        <span className="truncate font-mono text-xs text-ink">{label || "—"}</span>
        {has && <span className="font-mono text-[10px] tabular-nums text-faint">{lat.toFixed(2)}, {lon.toFixed(2)}</span>}
      </div>
      {sub && <div className="border-t border-line/60 px-3 py-1.5 font-mono text-[10px] text-faint">{sub}</div>}
    </div>
  );
}
