/**
 * fingerprint.js — the "Browser Fingerprint Checker" engine.
 *
 * These are the exact techniques trackers use to identify you WITHOUT cookies.
 * Everything runs locally; we show you the result so you understand the threat.
 *
 * The uniqueness number is an ESTIMATE derived from the entropy of the signals
 * we detect — NOT a lookup against a live database of real visitors (that would
 * require a backend collecting fingerprints, which would defeat the point).
 */

async function sha256Short(str) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 16);
  } catch {
    // Fallback: simple non-crypto hash if SubtleCrypto is unavailable (e.g. non-HTTPS)
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
    return (h >>> 0).toString(16).padStart(8, "0");
  }
}

/* ---------- Canvas ---------- */
export async function canvasFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "16px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(2, 2, 90, 24);
    ctx.fillStyle = "#069";
    ctx.fillText("CybeRebels \u26A1 fp", 6, 6);
    ctx.fillStyle = "rgba(102,200,0,0.7)";
    ctx.fillText("CybeRebels \u26A1 fp", 8, 18);
    ctx.strokeStyle = "rgba(120,80,200,0.6)";
    ctx.beginPath();
    ctx.arc(150, 30, 20, 0, Math.PI * 2);
    ctx.stroke();
    const data = canvas.toDataURL();
    return { hash: await sha256Short(data), supported: true };
  } catch {
    return { hash: "blocked", supported: false };
  }
}

/* ---------- WebGL ---------- */
export function webglInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { renderer: "Not available", vendor: "—", supported: false };
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    return { renderer: String(renderer), vendor: String(vendor), supported: true };
  } catch {
    return { renderer: "Blocked", vendor: "—", supported: false };
  }
}

/* ---------- Audio ---------- */
export async function audioFingerprint() {
  try {
    const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Ctx) return { hash: "unsupported", supported: false };
    const ctx = new Ctx(1, 5000, 44100);
    const osc = ctx.createOscillator();
    const comp = ctx.createDynamicsCompressor();
    osc.type = "triangle";
    osc.frequency.value = 10000;
    comp.threshold.value = -50;
    comp.knee.value = 40;
    comp.ratio.value = 12;
    comp.attack.value = 0;
    comp.release.value = 0.25;
    osc.connect(comp);
    comp.connect(ctx.destination);
    osc.start(0);
    const buffer = await ctx.startRendering();
    const channel = buffer.getChannelData(0);
    let sum = 0;
    for (let i = 4000; i < 5000; i++) sum += Math.abs(channel[i]);
    return { hash: await sha256Short(sum.toString()), supported: true };
  } catch {
    return { hash: "blocked", supported: false };
  }
}

/* ---------- Font enumeration (estimated) ---------- */
const TEST_FONTS = [
  "Arial", "Arial Black", "Calibri", "Cambria", "Comic Sans MS", "Consolas",
  "Courier New", "Georgia", "Helvetica", "Impact", "Lucida Console",
  "Palatino Linotype", "Segoe UI", "Tahoma", "Times New Roman", "Trebuchet MS",
  "Verdana", "Roboto", "Ubuntu", "Cantarell", "DejaVu Sans", "Liberation Sans",
  "Menlo", "Monaco", "Geneva", "Optima", "Futura", "Gill Sans", "Baskerville",
  "Andale Mono", "Courier", "Garamond", "Bookman", "Avenir",
];

export function detectFonts() {
  const baseFonts = ["monospace", "sans-serif", "serif"];
  const testString = "mmmmmmmmmmlli";
  const testSize = "72px";
  const span = document.createElement("span");
  span.style.cssText = "position:absolute;left:-9999px;font-size:" + testSize + ";";
  span.textContent = testString;
  document.body.appendChild(span);

  const baseline = {};
  for (const base of baseFonts) {
    span.style.fontFamily = base;
    baseline[base] = { w: span.offsetWidth, h: span.offsetHeight };
  }

  const detected = [];
  for (const font of TEST_FONTS) {
    let matched = false;
    for (const base of baseFonts) {
      span.style.fontFamily = `'${font}',${base}`;
      if (span.offsetWidth !== baseline[base].w || span.offsetHeight !== baseline[base].h) {
        matched = true;
        break;
      }
    }
    if (matched) detected.push(font);
  }
  document.body.removeChild(span);
  return detected;
}

/* ---------- Hardware ---------- */
export function hardwareInfo() {
  return {
    cores: navigator.hardwareConcurrency || "unknown",
    memory: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "hidden",
    touch: navigator.maxTouchPoints || 0,
  };
}

/* ---------- Assemble + estimate uniqueness ---------- */
// Rough entropy weights (bits) informed by EFF Cover Your Tracks / Panopticlick research.
export async function buildFingerprint() {
  const [canvas, audio] = await Promise.all([canvasFingerprint(), audioFingerprint()]);
  const webgl = webglInfo();
  const fonts = detectFonts();
  const hw = hardwareInfo();

  const components = [
    { key: "User agent", value: navigator.userAgent, bits: 6 },
    { key: "Canvas hash", value: canvas.hash, bits: canvas.supported ? 9 : 0 },
    { key: "WebGL renderer", value: webgl.renderer, bits: webgl.supported ? 6 : 0 },
    { key: "Audio hash", value: audio.hash, bits: audio.supported ? 5 : 0 },
    { key: "Fonts", value: `${fonts.length} detected`, bits: Math.min(8, fonts.length * 0.4) },
    { key: "Screen", value: `${screen.width}×${screen.height} @${window.devicePixelRatio}x`, bits: 4 },
    { key: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone, bits: 3 },
    { key: "Languages", value: (navigator.languages || []).join(","), bits: 2 },
    { key: "CPU cores", value: String(hw.cores), bits: 1.5 },
    { key: "Device memory", value: hw.memory, bits: hw.memory === "hidden" ? 0 : 1.5 },
    { key: "Platform", value: navigator.platform, bits: 2 },
  ];

  const totalBits = components.reduce((s, c) => s + c.bits, 0);
  const rawDenominator = Math.pow(2, totalBits);
  const GLOBAL_USERS = 5_500_000_000; // ~internet population, our honesty cap
  const denominator = Math.min(rawDenominator, GLOBAL_USERS);
  const effectivelyUnique = rawDenominator >= GLOBAL_USERS;

  const fullHash = await sha256Short(
    components.map((c) => c.value).join("|")
  );

  return {
    components,
    fonts,
    webgl,
    canvas,
    audio,
    hardware: hw,
    fullHash,
    bits: Math.round(totalBits * 10) / 10,
    denominator: Math.round(denominator),
    effectivelyUnique,
  };
}
