import { useState } from "react";

// Inline brand marks for logos not on the Simple Icons CDN (rendered monochrome
// like the others, so they match the tile style).
const INLINE = {
  nordpass: (s) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="#2bb6c9" fillRule="evenodd" clipRule="evenodd" aria-hidden="true">
      <path d="M9.5 2a6.5 6.5 0 1 0 6.2 8.5H18v2h2v-2h1.4a.6.6 0 0 0 .6-.6V8.6a.6.6 0 0 0-.6-.6h-6.3A6.5 6.5 0 0 0 9.5 2ZM7 9a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" />
    </svg>
  ),
};

// Real brand logos via the Simple Icons CDN (official monochrome-in-brand-color
// marks). Falls back to a clean monogram tile if a slug is missing or fails.
export default function BrandLogo({ slug, name = "", size = 30, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (slug && INLINE[slug]) {
    return (
      <span
        className={"inline-flex flex-none items-center justify-center rounded-lg border border-line bg-elevated/70 " + className}
        style={{ width: size + 14, height: size + 14 }}
      >
        {INLINE[slug](size)}
      </span>
    );
  }

  if (slug && !failed) {
    return (
      <span
        className={"inline-flex flex-none items-center justify-center rounded-lg border border-line bg-elevated/70 " + className}
        style={{ width: size + 14, height: size + 14 }}
      >
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

  return (
    <span
      className={"inline-flex flex-none items-center justify-center rounded-lg border border-line bg-brand/10 font-mono font-bold text-brand " + className}
      style={{ width: size + 14, height: size + 14, fontSize: size * 0.5 }}
      aria-label={`${name} logo`}
    >
      {(name || "?").charAt(0)}
    </span>
  );
}
