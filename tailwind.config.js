/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: v("--c-base"),
        panel: v("--c-panel"),
        elevated: v("--c-elevated"),
        line: v("--c-line"),
        brand: v("--c-brand"),
        "brand-dim": v("--c-brand-dim"),
        onbrand: v("--c-onbrand"),
        info: v("--c-info"),
        danger: v("--c-danger"),
        warn: v("--c-warn"),
        ink: v("--c-ink"),
        muted: v("--c-muted"),
        faint: v("--c-faint"),
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--c-brand) / 0.32), 0 10px 40px -8px rgb(var(--c-brand) / 0.5)",
        "glow-red": "0 0 0 1px rgb(var(--c-danger) / 0.34), 0 10px 40px -8px rgb(var(--c-danger) / 0.55)",
        "glow-sm": "0 0 0 1px rgb(var(--c-brand) / 0.26), 0 0 18px -6px rgb(var(--c-brand) / 0.45)",
        elevate: "0 1px 2px rgb(0 0 0 / 0.45), 0 18px 46px -26px rgb(0 0 0 / 0.85)",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: 1 }, "50%,100%": { opacity: 0 } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100vh)" } },
        "fade-up": { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "pulse-slow": { "0%,100%": { opacity: 0.5 }, "50%": { opacity: 1 } },
        sweep: { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(240%)" } },
      },
      animation: {
        blink: "blink 1.05s step-end infinite",
        scan: "scan 8s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-slow": "pulse-slow 2.6s ease-in-out infinite",
        sweep: "sweep 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
