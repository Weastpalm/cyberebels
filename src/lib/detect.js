/**
 * detect.js — everything the "Am I Being Tracked?" page reads.
 * All of this runs in the visitor's own browser. Nothing is sent anywhere.
 */

/* ---------- IP + geolocation ---------- */
// Uses ipwho.is (free, HTTPS, CORS-friendly). Falls back to ipify for the IP alone.
// For RELIABLE VPN/proxy detection in production, swap in a paid IP-reputation API
// (ipinfo.io, ipqualityscore.com, ipapi.com) — client-side detection is heuristic.
export async function getIpInfo() {
  try {
    const res = await fetchWithTimeout("https://ipwho.is/", 6000);
    const data = await res.json();
    if (data && data.success !== false) {
      const org = data.connection?.org || data.connection?.isp || "";
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        countryCode: data.country_code,
        lat: data.latitude,
        lon: data.longitude,
        timezone: data.timezone?.id || data.timezone?.utc || "",
        org,
        asn: data.connection?.asn || "",
        ok: true,
      };
    }
  } catch (e) {
    /* fall through */
  }
  // Fallback: at least get the IP
  try {
    const res = await fetchWithTimeout("https://api.ipify.org?format=json", 6000);
    const data = await res.json();
    return { ip: data.ip, ok: true, limited: true };
  } catch (e) {
    return { ok: false };
  }
}

// Geolocate ANY IP address (not just the caller). Used by the OSINT IP lookup.
export async function getIpGeo(ip) {
  try {
    const res = await fetchWithTimeout(`https://ipwho.is/${encodeURIComponent(ip)}`, 6000);
    const data = await res.json();
    if (data && data.success !== false) {
      return {
        ok: true,
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        countryCode: data.country_code,
        flag: data.flag?.emoji || "",
        lat: data.latitude,
        lon: data.longitude,
        timezone: data.timezone?.id || "",
        isp: data.connection?.isp || "",
        org: data.connection?.org || data.connection?.isp || "",
        asn: data.connection?.asn || "",
      };
    }
    return { ok: false, reason: data?.message || "No geolocation data." };
  } catch (e) {
    return { ok: false, reason: "Lookup failed." };
  }
}

function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

/* ---------- Browser + OS ---------- */
export function getBrowserInfo() {
  const ua = navigator.userAgent;
  const data = navigator.userAgentData; // Chromium client hints
  let name = "Unknown";
  let version = "";

  // Brave exposes a hook; detect it async elsewhere. UA-based first:
  if (/Edg\//.test(ua)) {
    name = "Microsoft Edge";
    version = match(ua, /Edg\/([\d.]+)/);
  } else if (/OPR\/|Opera/.test(ua)) {
    name = "Opera";
    version = match(ua, /OPR\/([\d.]+)/);
  } else if (/Firefox\//.test(ua)) {
    name = "Firefox";
    version = match(ua, /Firefox\/([\d.]+)/);
  } else if (/Chrome\//.test(ua)) {
    name = "Chrome";
    version = match(ua, /Chrome\/([\d.]+)/);
  } else if (/Safari\//.test(ua) && /Version\//.test(ua)) {
    name = "Safari";
    version = match(ua, /Version\/([\d.]+)/);
  }

  // Client Hints can give a cleaner brand list when available
  if (data?.brands?.length) {
    const real = data.brands.find(
      (b) => !/Not.?A.?Brand/i.test(b.brand) && !/Chromium/i.test(b.brand)
    );
    if (real) {
      name = real.brand;
      version = real.version || version;
    }
  }
  return { name, version: version || "—", ua };
}

export function getOsInfo() {
  const ua = navigator.userAgent;
  const plat = navigator.userAgentData?.platform || navigator.platform || "";
  if (/Windows NT 10/.test(ua)) return "Windows 10/11";
  if (/Windows/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android " + match(ua, /Android ([\d.]+)/);
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS " + match(ua, /OS ([\d_]+)/).replace(/_/g, ".");
  if (/Mac OS X/.test(ua)) return "macOS " + match(ua, /Mac OS X ([\d_]+)/).replace(/_/g, ".");
  if (/Linux/.test(ua)) return "Linux";
  return plat || "Unknown";
}

async function detectBrave() {
  try {
    return !!(navigator.brave && (await navigator.brave.isBrave()));
  } catch {
    return false;
  }
}

/* ---------- Environment signals ---------- */
export function getEnvSignals() {
  const dnt =
    navigator.doNotTrack === "1" ||
    window.doNotTrack === "1" ||
    navigator.msDoNotTrack === "1";
  return {
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: dnt,
    dntRaw: navigator.doNotTrack ?? window.doNotTrack ?? "unset",
    language: navigator.language,
    languages: (navigator.languages || []).join(", "),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width} × ${window.screen.height}`,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio || 1,
    platform: navigator.userAgentData?.platform || navigator.platform || "—",
    online: navigator.onLine,
  };
}

/* ---------- WebRTC local-IP leak test ---------- */
// If your browser leaks a local/private IP via WebRTC, sites can use it to help
// correlate you even behind a VPN. Modern browsers often mask this with mDNS (.local).
export function detectWebRTCLeak() {
  return new Promise((resolve) => {
    const result = { supported: true, localIPs: [], leaking: false, mdns: false };
    let pc;
    try {
      pc = new RTCPeerConnection({ iceServers: [] });
    } catch {
      resolve({ supported: false, localIPs: [], leaking: false });
      return;
    }
    const done = () => {
      try { pc.close(); } catch {}
      result.leaking = result.localIPs.some((ip) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip));
      resolve(result);
    };
    const timer = setTimeout(done, 2200);

    pc.createDataChannel("x");
    pc.onicecandidate = (e) => {
      if (!e.candidate) {
        clearTimeout(timer);
        done();
        return;
      }
      const cand = e.candidate.candidate;
      const ipMatch = cand.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
      const mdnsMatch = /\.local/.test(cand);
      if (mdnsMatch) result.mdns = true;
      if (ipMatch && !result.localIPs.includes(ipMatch[1])) {
        result.localIPs.push(ipMatch[1]);
      }
    };
    pc.createOffer()
      .then((o) => pc.setLocalDescription(o))
      .catch(() => { clearTimeout(timer); done(); });
  });
}

/* ---------- VPN / proxy heuristic ---------- */
// Client-side can only GUESS. We compare the browser timezone against the
// timezone reported for your IP, and flag hosting-provider ASNs.
export function vpnHeuristic(ipInfo, envTimezone) {
  if (!ipInfo?.ok || ipInfo.limited) {
    return { status: "unknown", reasons: ["Couldn't fully analyze your connection."] };
  }
  const reasons = [];
  let suspicion = 0;

  if (ipInfo.timezone && envTimezone && ipInfo.timezone !== envTimezone) {
    suspicion += 2;
    reasons.push(`Your device timezone (${envTimezone}) doesn't match your IP location (${ipInfo.timezone}).`);
  }
  const org = (ipInfo.org || "").toLowerCase();
  const hostingHints = ["vpn", "proxy", "hosting", "datacenter", "data center", "ovh", "digitalocean", "linode", "m247", "leaseweb", "choopa", "vultr", "cloudflare warp", "mullvad", "nordvpn", "surfshark", "expressvpn", "proton"];
  if (hostingHints.some((h) => org.includes(h))) {
    suspicion += 2;
    reasons.push(`Your IP looks like it belongs to a hosting/VPN network (${ipInfo.org}).`);
  }

  if (suspicion >= 2) {
    return { status: "vpn-likely", reasons };
  }
  return {
    status: "residential",
    reasons: ["Your connection looks like a normal residential ISP — which also means it's tied to you."],
  };
}

/* ---------- Privacy score ---------- */
// Returns { score 0-100, grade, level: good|warn|bad, items: [...] }
export function computePrivacyScore({ env, webrtc, vpn, isBrave }) {
  const items = [];
  let score = 100;

  const ding = (amount, label, level, detail) => {
    score -= amount;
    items.push({ label, level, detail });
  };
  const ok = (label, detail) => items.push({ label, level: "good", detail });

  // VPN
  if (vpn.status === "vpn-likely") ok("Using a VPN/proxy", "Your real IP is masked. Good.");
  else if (vpn.status === "residential") ding(22, "No VPN detected", "bad", "Your ISP can see every site you visit, and sites see your real IP.");
  else items.push({ label: "VPN status unclear", level: "warn", detail: "We couldn't confirm whether you're on a VPN." });

  // WebRTC leak
  if (webrtc.supported && webrtc.leaking) ding(14, "WebRTC is leaking a local IP", "bad", "Sites can read your private network IP to help track you.");
  else if (webrtc.mdns) ok("WebRTC masked (mDNS)", "Your browser hides your local IP. Good.");
  else ok("No WebRTC IP leak", "Your local IP isn't exposed via WebRTC.");

  // Do Not Track
  if (env.doNotTrack) ok("Do Not Track is on", "You're signaling sites not to track you (though many ignore it).");
  else ding(6, "Do Not Track is off", "warn", "Turn it on in your browser settings as a basic signal.");

  // Cookies
  if (env.cookiesEnabled) ding(8, "Third-party cookies allowed", "warn", "Cookies are the classic cross-site tracking tool. Block third-party cookies.");
  else ok("Cookies disabled", "You've shut down the most common tracking method.");

  // Browser hardening
  if (isBrave) ok("Privacy-hardened browser", "Brave blocks trackers and resists fingerprinting out of the box.");
  else ding(8, "Standard browser", "warn", "Consider Brave, Firefox (hardened), or Mullvad Browser to resist fingerprinting.");

  score = Math.max(0, Math.min(100, score));
  let level = "bad";
  let grade = "Exposed";
  if (score >= 80) { level = "good"; grade = "Locked Down"; }
  else if (score >= 55) { level = "warn"; grade = "Partly Exposed"; }

  return { score, grade, level, items };
}

function match(str, re) {
  const m = str.match(re);
  return m ? m[1] : "";
}

export { detectBrave };
