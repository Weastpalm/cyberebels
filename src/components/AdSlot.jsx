export default function AdSlot({ slot = "ad", label = "Advertisement", className = "" }) {
  return (
    <div className={"my-8 flex min-h-[110px] w-full items-center justify-center rounded-xl border border-dashed border-line bg-elevated/30 " + className} data-ad-slot={slot} aria-label="Advertisement placeholder">
      <div className="text-center">
        <div className="mono-label">{label}</div>
        <div className="mt-1 font-mono text-[11px] text-faint">ad slot · {slot}</div>
      </div>
    </div>
  );
}
