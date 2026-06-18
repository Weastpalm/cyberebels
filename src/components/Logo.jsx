// Cyber Rebels mark — a hexagon "shield" containing a terminal prompt ">_".
// Inherits color from `currentColor`, so it themes automatically.
export default function Logo({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="Cyber Rebels logo"
    >
      <path
        d="M16 2.3 27.6 9v14L16 29.7 4.4 23V9L16 2.3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M11.5 12 15.5 16 11.5 20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.8 20.2H21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
