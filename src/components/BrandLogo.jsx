import { useState } from "react";

// Real brand logos via the Simple Icons CDN (official monochrome-in-brand-color
// marks). Falls back to a clean monogram tile if a slug is missing or fails.
export default function BrandLogo({ slug, name = "", size = 30, className = "" }) {
  const [failed, setFailed] = useState(false);

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
