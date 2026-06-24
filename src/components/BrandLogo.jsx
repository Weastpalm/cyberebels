import { useState } from "react";

// Fallback brand marks for logos not on the Simple Icons CDN (monochrome, brand-tinted).
const INLINE = {
  nordpass: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="#2bb6c9" fillRule="evenodd" clipRule="evenodd" aria-hidden="true">
      <path d="M9.5 2a6.5 6.5 0 1 0 6.2 8.5H18v2h2v-2h1.4a.6.6 0 0 0 .6-.6V8.6a.6.6 0 0 0-.6-.6h-6.3A6.5 6.5 0 0 0 9.5 2ZM7 9a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" />
    </svg>
  ),
  abuseipdb: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#1f6feb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.5 3 7.6 7 8.9 4-1.3 7-4.4 7-8.9V6Z" /><path d="M12 8.4v3.7M12 15.3h.01" />
    </svg>
  ),
  ipqualityscore: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 16a8 8 0 0 1 16 0" /><path d="m12 16 4.4-3.1" /><circle cx="12" cy="16" r="1.3" fill="#2563eb" stroke="none" />
    </svg>
  ),
};

// Real brand logos via the Simple Icons CDN; falls back to an inline mark, then a monogram.
export default function BrandLogo({ slug, name = "", size = 30, className = "" }) {
  const [failed, setFailed] = useState(false);
  const tile = "inline-flex flex-none items-center justify-center rounded-lg border border-line bg-elevated/70 " + className;
  const box = { width: size + 14, height: size + 14 };

  if (slug && !failed) {
    return (
      <span className={tile} style={box}>
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={`${name} logo`}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: size, height: size }}
        />
      </span>
    );
  }
  if (slug && INLINE[slug]) {
    return <span className={tile} style={box}>{INLINE[slug](size)}</span>;
  }
  return (
    <span
      className={"inline-flex flex-none items-center justify-center rounded-lg border border-line bg-brand/10 font-mono font-bold text-brand " + className}
      style={{ ...box, fontSize: size * 0.5 }}
      aria-label={`${name} logo`}
    >
      {(name || "?").charAt(0)}
    </span>
  );
}
