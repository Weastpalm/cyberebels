# CybeRebels.com

A deployable privacy/anti-surveillance affiliate site. React + Vite + Tailwind CSS v3.

Branded as **CybeRebels — "The Rebellion"** against being tracked. The site leads with **four in-browser tools** as the primary engagement hook — **Am I Tracked?**, **Browser Fingerprint**, the **Anti-Detect Lab**, and **OSINT & Threat Lookup** (investigate any domain/IP/URL, with automatic IP geolocation) — with VPNs, guides, and the blog kept but pushed out of focus (under a "More" menu and the footer). It ships with a **three-way theme switcher** (Light / Dark / **Hacker** with a Matrix-rain background), a library of **real guides and blog posts**, full per-route SEO, and the AdSense-required pages (About, Contact, Privacy Policy, Disclosure).

---

## What's new in this version

- **Three themes (`Light` / `Dark` / `Hacker`).** A switcher in the navbar flips the whole site instantly; the choice is saved to `localStorage` and applied before first paint (no flash). **Hacker** mode adds a falling-glyph **Matrix-rain background**. Default is Dark. Respects `prefers-reduced-motion`.
- **Tools are the front door.** The homepage and nav lead with the four live tools. Best VPNs / Privacy Tools / De-Google / Self-Defense / Guides / Blog are kept but moved into a **"More" dropdown** and the footer.
- **Anti-Detect Lab (`/anti-detect`)** — an interactive fingerprint-profile playground: create, name, save, and delete profiles; edit user-agent, platform, timezone, language, screen, hardware, WebGL and canvas/WebRTC/DNT; and watch the resulting fingerprint hash, a rarity estimate, and a live diff against your real browser. **Honest by design** — see the dedicated section below on what it is and isn't.
- **OSINT & Threat Lookup (`/osint`)** — investigation-first. Section 01 is a **Domain / IP / URL reputation scanner** (VirusTotal, 90+ engines) for vetting suspicious infrastructure; **IP addresses are geolocated automatically** (city/ISP/ASN + an on-brand map console, no API key needed). Below it: your own live exposure, a privacy-preserving **breached-password checker** (Have I Been Pwned k-anonymity — your password never leaves the browser), a username-footprint self-audit, and data-broker opt-outs.
- **Real Guides (12) and Blog (6 posts).** Genuinely useful, original content with their own detail pages (`/guides/:slug`, `/blog/:slug`) and Article structured data — not placeholders. Guides span **beginner → expert** (access Tor safely, strong passwords, browser hardening, lock down your phone, **how people grab your IP**, **access the dark web safely**, spot phishing, threat modeling, harden your home network, anti-doxxing, compartmentalization, verifying downloads). The blog includes **how to learn ethical hacking** (TryHackMe, Hack The Box, PortSwigger, OverTheWire, picoCTF) and **bug bounties** — both with prominent legal/authorization framing.
- **About / Contact / Privacy Policy / Disclosure** pages — required for AdSense and most affiliate programs.
- **SEO overhaul** — see the SEO section below.

---

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to /dist
npm run preview  # preview the production build
```

> The privacy/fingerprint/OSINT tools use browser APIs (WebRTC, canvas, WebGL, audio, Web Crypto) that require a **secure context** — they work on the real **HTTPS** deployment and on `http://localhost`, but are limited inside sandboxes or on plain `http://`.

---

## What's where (so you can customize fast)

| You want to change… | Edit this file |
|---|---|
| Affiliate links (all of them, one place) | `src/components/Affiliate.jsx` |
| VPN table data + prices | `src/data/vpns.js` |
| Privacy tool alternatives | `src/data/tools.js` |
| **Blog posts** (content) | `src/data/posts.js` |
| **Guides** (content) | `src/data/guides.js` |
| **Theme colors** (all 3 palettes) | `src/index.css` (the `[data-theme]` blocks) |
| Theme tokens / fonts / shadows | `tailwind.config.js` |
| **Theme switcher behavior** | `src/lib/theme.jsx` + `src/components/ThemeSwitcher.jsx` |
| **Matrix-rain background** | `src/components/MatrixRain.jsx` |
| **VirusTotal proxy** (OSINT scanner) | `netlify/functions/vt-lookup.js` |
| Ad placeholders | `src/components/AdSlot.jsx` (and the `<AdSlot>` tags on each page) |
| Pages | `src/pages/*.jsx` |

**All affiliate links and ad units are clearly marked placeholders** (`data-placeholder="true"` / `data-ad-slot`). Swap your real links into `AFFILIATE_LINKS` and the whole site updates.

---

## Theme system (Light / Dark / Hacker)

The three themes are driven by **CSS variables**, so every `bg-*`, `text-*`, and `border-*` utility re-themes instantly with zero per-component changes.

- **Palettes** live in `src/index.css` as `[data-theme="dark"]`, `[data-theme="light"]`, and `[data-theme="hacker"]` blocks. Each defines the same token names (`--c-base`, `--c-panel`, `--c-brand`, `--c-onbrand`, etc.) as space-separated RGB channels so Tailwind opacity modifiers (`bg-base/85`) keep working.
- **Tailwind** maps those variables in `tailwind.config.js` via `rgb(var(--c-x) / <alpha-value>)`. To add or recolor a theme, copy a `[data-theme]` block and change the channels — nothing else.
- **Switching** is handled by `src/lib/theme.jsx` (context + `localStorage` under `cyberebels-theme`) and the `ThemeSwitcher` control in the navbar. A tiny inline script in `index.html` sets the saved theme **before first paint** so there's no flash.
- **Hacker mode** mounts `src/components/MatrixRain.jsx` (a throttled `<canvas>` of falling glyphs) behind the content. It reads the theme's brand color and **bails entirely under `prefers-reduced-motion`** (which also hides the scanline). Default theme is Dark.

---

## Deploy to Netlify (free)

`netlify.toml` and `public/_redirects` are already set up (build → `dist`, SPA routing handled).

### Option A — Git (recommended, auto-deploys on every push)
1. Push this folder to a GitHub repo.
2. Go to **app.netlify.com → Add new site → Import an existing project → GitHub**, pick the repo.
3. Netlify reads `netlify.toml` automatically. Confirm: build command `npm run build`, publish directory `dist`. Click **Deploy**.

### Option B — Drag and drop (fastest, no Git)
1. Run `npm run build`.
2. Go to **app.netlify.com/drop** and drag the **`dist`** folder onto the page.

You'll get a live `your-site-name.netlify.app` URL in seconds.

### Point CybeRebels.com at it
1. In your Netlify site → **Domain management → Add a domain** → enter `cyberebels.com`.
2. Netlify will show you the **exact DNS records to use** — follow those (don't hardcode IPs from a blog, they change). You have two routes:
   - **Easiest — Netlify DNS:** Netlify gives you 4 nameservers. Log in to your domain registrar (wherever you bought cyberebels.com), and replace its nameservers with Netlify's. Propagation takes anywhere from minutes to a few hours.
   - **Keep your registrar's DNS:** add the records Netlify shows — typically an `A` (or `ALIAS`/`ANAME`) record for the apex `cyberebels.com` and a `CNAME` for `www` → `your-site-name.netlify.app`.
3. Once DNS resolves, Netlify auto-provisions a free **Let's Encrypt HTTPS** certificate. Toggle **Force HTTPS** on.

---

## VirusTotal scanner setup (one step — REQUIRED for the OSINT domain/IP tool)

The OSINT page's **Domain / IP / URL reputation** scanner calls VirusTotal through a Netlify serverless function (`netlify/functions/vt-lookup.js`) that keeps your API key server-side. Everything is wired — you just add the key:

1. Get a **free API key** at **https://www.virustotal.com/gui/my-apikey** (sign up, copy the key).
2. In Netlify: **Site settings → Environment variables → Add a variable** → name `VIRUSTOTAL_API_KEY`, value = your key.
3. **Redeploy** (Deploys → Trigger deploy). Done — the scanner now works.

Notes:
- Until the key is set, the tool shows friendly "add your API key" instructions instead of breaking.
- The function is reachable at `/.netlify/functions/vt-lookup` and also via the alias `/api/vt` (both wired in `netlify.toml`).
- The free key is rate-limited (~4 requests/min, 500/day) — plenty for a tool, but don't expect bulk scanning.
- It only runs on the deployed site (or `netlify dev` locally with the key set), not in a plain `npm run dev` preview.

---

## SEO overhaul (what's wired in)

Everything below is already implemented — the one thing **you** must do is set your real domain in **`src/lib/site.js`** (`SITE_URL`) and in **`public/robots.txt`** + **`public/sitemap.xml`** before deploy.

- **Per-route `<title>` + meta description** — every page sets its own via a reusable `<Seo>` component (`src/components/Seo.jsx`, powered by `react-helmet-async`). No more one-title-fits-all.
- **Canonical URLs** — each route emits a `<link rel="canonical">` so Google doesn't split ranking across query-string/trailing-slash variants.
- **Open Graph + Twitter Card tags** — proper title/description/image/URL on every page, so links unfurl correctly on social and in chats. Drop a **1200×630 `og-cover.png`** into `public/` (referenced as `SITE_OG_IMAGE` in `site.js`).
- **Structured data (JSON-LD)** — `WebSite` on the homepage, `FAQPage` on Anti-Detect, `HowTo` on OSINT, `Organization` on About, plus `Article`-style schema on content pages. This is what earns rich results in search.
- **`sitemap.xml`** (`public/sitemap.xml`) — lists all 33 indexable routes (tools, guides, blog posts, recommendations, info) with priorities; **`robots.txt`** allows crawling and points at the sitemap.
- **404 handling** — an unknown URL renders a real `NotFound` page that is marked **`noindex`**, so junk URLs don't get indexed.
- **Semantic headings** — one `<h1>` per page via `PageHeader`/`<Seo>`, descriptive `<h2>`/`<h3>` structure throughout.

### Next-level upgrade (optional, when you want max ranking)
This is a client-rendered SPA, so crawlers must run JavaScript to see content. Google does this fine, but for the strongest SEO you can **pre-render to static HTML** at build time with **`vite-react-ssg`** or **`react-snap`** — every route then ships fully-rendered HTML. It's a meaningful add and worth doing once the content is final; ask and I'll wire it in.

---

## Before you turn on ads or apply to affiliate programs

Most ad networks and affiliate programs **reject thin or empty sites**. The groundwork is done — keep building on it:
- The **blog (6 posts) and guides (12 guides)** ship as real, full articles — your main organic-traffic play. Keep adding to `src/data/posts.js` and `src/data/guides.js`; more genuinely useful long-form content is what pulls Google traffic.
- A **Privacy Policy**, **About**, and **Contact** page are included — AdSense and most affiliate programs require them.
- Make sure your **affiliate disclosure** is visible (it's already in the footer — keep it).

---

## Google AdSense setup

1. Apply at **adsense.google.com** (needs real content + the pages above).
2. Once approved, paste your AdSense script in `index.html` (there's a commented placeholder in `<head>`).
3. Replace the placeholder markup inside `src/components/AdSlot.jsx` with your real `<ins class="adsbygoogle">` unit. Every ad position on the site is already marked with an `<AdSlot>` — you don't have to hunt for spots.

---

## Top 5 affiliate programs in this niche

> Rates pulled **June 2026** — programs change them often, so **confirm the current numbers on each program's page when you sign up.** Most run through networks like **Impact** or **CJ**.

| Program | Commission (verify on signup) | Notes |
|---|---|---|
| **NordVPN** | **100%** of a 1-month new signup; **40%** on 6/12/24-month new signups; **30%** on renewals | No minimum payout. Highest-converting brand in the niche. Apply via NordVPN partners / Impact. |
| **Surfshark** | **~40%** per sale, 30-day cookie | Sister company to Nord, cheaper plans = easy conversions. Via Impact. |
| **ExpressVPN** | **Flat bounty per sale**, tiered by plan length | Premium brand, strong for streaming audiences. Confirm current dollar amounts on signup. |
| **Proton (VPN + Mail)** | **Recurring** commission on new sales **and** renewals; **~20%** on Proton Mail | Best fit for your privacy-purist brand; one program covers VPN *and* encrypted email. |
| **Private Internet Access (PIA)** | **Recurring** commission model | Budget-friendly, good for "best cheap VPN" content. Confirm current rate on signup. |

**Heads-up on Mullvad:** it's in your comparison table for credibility, but **Mullvad runs no affiliate program by design** — you won't earn commission on it. Keeping it there (and saying so) actually makes the rest of your recommendations look more trustworthy.

---

## Honest notes on the tools (so you can speak to them accurately)

- **"Am I Tracked?" really works.** It fetches your real public IP (ipwho.is, with an ipify fallback) and reads your real browser, OS, screen, timezone, and WebRTC signals to compute a live privacy score. The one soft spot is **VPN/proxy detection**, which is a **client-side heuristic** (timezone-vs-IP mismatch + hosting-network name matching) — directionally useful but not authoritative. For reliable detection, plug a paid IP-reputation API (ipinfo.io, ipqualityscore.com, or ipapi.com) into `getIpInfo()` in `src/lib/detect.js`.
- **Fingerprint uniqueness** is an **entropy estimate** derived from the signals detected on the device, capped at the internet population — it is *not* a lookup against a database of real visitors (collecting that would defeat the site's purpose). This is the same honest framing EFF's Cover Your Tracks uses. The number is meaningful for education without overclaiming.
- **OSINT is genuinely functional.** The Domain/IP/URL scanner is real (VirusTotal), and **IP geolocation works without any API key** (ipwho.is). The breached-password checker uses the **Have I Been Pwned range API with k-anonymity** — your password is SHA-1 hashed in the browser and only the first 5 hash characters are ever sent, so the full password never leaves the device. The email/username audits generate search links for *your own* identifiers; nothing is logged.
- **The Domain / IP / URL scanner is real**, backed by VirusTotal's 90+ engines through your serverless function (see the VirusTotal setup section). "No record found" means VirusTotal hasn't analyzed that target — treat it as *unknown*, not *safe*.
- Nothing from these tools is stored on a server. The only outbound calls are the public IP lookup, the k-anonymity password-prefix check, and (when you enable it) the VirusTotal lookup via your own function.

---

## Why the Anti-Detect Lab designs fingerprints but doesn't actually spoof your browser

You asked for something like **Dolphin{anty}** — to build profiles and "actually change these factors." What shipped is an **interactive Anti-Detect Lab**: you create, save, and edit fingerprint profiles, and it computes the resulting fingerprint hash, a rarity estimate, and a live diff against your real browser. What it deliberately does **not** do is change what real websites see. Here's the honest reasoning, so you can stand behind it:

1. **A web page physically can't spoof for other sites.** A real antidetect browser alters the fingerprint that *other* websites see, per profile — that happens at the browser-engine level (a patched Chromium). A React page can only read and tweak *its own* environment; it cannot change what `instagram.com` or an ad network sees in another tab. So the Lab visualizes and teaches the mechanics honestly instead of pretending to be the engine.
2. **The operational version would sink your monetization.** The mass-multi-account use case (running dozens of identities to evade per-account bans) crosses into ban-evasion/fraud territory. Hosting a working tool for that is a fast track to **AdSense rejection and affiliate-program termination** — the opposite of the goal. So the Lab intentionally omits proxy assignment/rotation, real per-site injection, and multi-session orchestration.
3. **The honest version is better for SEO and trust.** The page ranks for the antidetect keyword with evenhanded, credible content (legit privacy uses vs. abuse), an engaging interactive lab, and a pivot to real, recommendable defenses (Brave, Mullvad Browser, Tor). That's what Google and affiliate programs reward.

If you ever want to monetize the antidetect *keyword* harder, the safe play is **editorial coverage** — an honest "best antidetect browsers compared" review with affiliate links to the legitimate vendors — rather than hosting a tool. Say the word and I'll build that page.
