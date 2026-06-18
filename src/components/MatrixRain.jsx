import { useEffect, useRef } from "react";

// Falling-glyph "matrix" background. Only rendered in hacker theme.
export default function MatrixRain() {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // CSS also hides it; bail so we don't run the loop

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ0123456789ABCDEF<>/\\[]{}#$%".split("");
    const fontSize = 16;
    let cols = 0;
    let drops = [];
    let raf = 0;
    let last = 0;

    function brand() {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--c-brand").trim();
      return v || "0 255 110";
    }
    let color = brand();

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.floor(Math.random() * -50));
      color = brand();
    }
    resize();
    window.addEventListener("resize", resize);

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - last < 55) return; // throttle ~18fps for that choppy terminal feel
      last = t;

      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // bright leading glyph, dimmer trail
        ctx.fillStyle = `rgb(${color})`;
        ctx.globalAlpha = Math.random() > 0.975 ? 1 : 0.55;
        ctx.fillText(ch, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="matrix-canvas" aria-hidden="true" />;
}
