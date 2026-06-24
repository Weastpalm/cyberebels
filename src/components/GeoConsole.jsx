export default function GeoConsole({ lat, lon, label, sub, flag, tall }) {
  const has = typeof lat === "number" && typeof lon === "number";
  const d = 0.06;
  const src = has
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lon}`
    : "";
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-glow-sm">
      <div className="console-bar">
        <span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" />
        <span className="ml-2 font-mono text-[11px] text-faint">geo_trace.map</span>
        {has && <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-slow" /> locked</span>}
      </div>
      {has ? (
        <iframe
          title={label ? `Map of ${label}` : "Location map"}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={`geo-map block w-full border-0 bg-elevated/30 ${tall ? "h-[330px] sm:h-[400px]" : "h-[210px]"}`}
        />
      ) : (
        <div className={`flex items-center justify-center bg-elevated/30 font-mono text-xs text-faint ${tall ? "h-[330px] sm:h-[400px]" : "h-[210px]"}`}>no coordinates to map</div>
      )}
      <div className="flex items-center justify-between gap-2 border-t border-line/60 px-3 py-2">
        <span className="min-w-0 truncate font-mono text-xs text-ink">{flag ? flag + " " : ""}{label || "—"}</span>
        {has && <span className="flex-none font-mono text-[10px] tabular-nums text-faint">{lat.toFixed(2)}, {lon.toFixed(2)}</span>}
      </div>
      {sub && <div className="border-t border-line/60 px-3 py-1.5 font-mono text-[10px] text-faint">{sub}</div>}
    </div>
  );
}
