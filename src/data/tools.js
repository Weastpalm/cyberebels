/**
 * Privacy tools: private alternatives to Big Tech, grouped by category.
 * affiliateKey maps to AFFILIATE_LINKS in src/components/Affiliate.jsx (where one exists).
 * logo = Simple Icons slug (rendered via cdn.simpleicons.org).
 */
export const TOOL_CATEGORIES = [
  {
    category: "Search Engines",
    replaces: "Google Search",
    why: "Google logs your searches and ties them to your profile to sell ads.",
    tools: [
      { name: "DuckDuckGo", logo: "duckduckgo", affiliateKey: "duckduckgo", blurb: "No tracking, no search history, clean results — the easiest switch." },
      { name: "Brave Search", logo: "brave", affiliateKey: "brave", blurb: "Independent index, no profiling, built by the Brave team." },
    ],
  },
  {
    category: "Browsers",
    replaces: "Google Chrome",
    why: "Chrome feeds your browsing habits straight into Google's ad machine.",
    tools: [
      { name: "Brave", logo: "brave", affiliateKey: "brave", blurb: "Blocks ads and trackers by default and resists fingerprinting." },
      { name: "Firefox", logo: "firefoxbrowser", affiliateKey: "firefox", blurb: "Open source, highly configurable, strong anti-tracking when hardened." },
      { name: "Mullvad Browser", logo: "mullvad", affiliateKey: "mullvadbrowser", blurb: "Tor Browser's anti-fingerprinting, without the Tor network — pair with a VPN." },
    ],
  },
  {
    category: "Email",
    replaces: "Gmail",
    why: "Free email isn't free — your inbox is scanned to build your ad profile.",
    tools: [
      { name: "Proton Mail", logo: "protonmail", affiliateKey: "protonmail", blurb: "End-to-end encrypted, Swiss-based, generous free tier." },
      { name: "Tuta (Tutanota)", logo: "tutanota", affiliateKey: "tutanota", blurb: "Encrypted email and calendar, green-energy powered, German privacy law." },
    ],
  },
  {
    category: "Password Managers",
    replaces: "LastPass / browser-saved passwords",
    why: "Reused passwords and breached managers are how accounts get drained.",
    tools: [
      { name: "NordPass", logo: "nordpass", affiliateKey: "nordpass", blurb: "From the Nord Security team — zero-knowledge vault with passkeys, a data-breach scanner, and secure sharing." },
      { name: "Bitwarden", logo: "bitwarden", affiliateKey: "bitwarden", blurb: "Open source, audited, free for unlimited passwords across devices." },
      { name: "1Password", logo: "1password", affiliateKey: "onepassword", blurb: "Polished, family-friendly, great for non-technical households." },
    ],
  },
  {
    category: "Messaging",
    replaces: "WhatsApp / SMS",
    why: "Metadata (who you talk to, when) is just as revealing as message content.",
    tools: [
      { name: "Signal", logo: "signal", affiliateKey: "signal", blurb: "Gold-standard end-to-end encryption, non-profit, collects almost no metadata." },
    ],
  },
];
