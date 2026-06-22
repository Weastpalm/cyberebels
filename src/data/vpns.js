/**
 * VPN comparison data.
 *
 * ⚠️ PRICES CHANGE OFTEN. Verify each on the vendor page before you launch.
 * affiliateKey maps to AFFILIATE_LINKS in src/components/Affiliate.jsx.
 * logo = Simple Icons slug (rendered via cdn.simpleicons.org).
 * trust = our editorial 0-100 score (audits + jurisdiction + track record). trustReason explains it.
 */
export const VPNS = [
  { name: "NordVPN", logo: "nordvpn", affiliateKey: "nordvpn", price: "$3.39/mo", priceNote: "2-year plan", noLogs: "Yes — independently audited", speed: 9, bestFor: "Best all-rounder: fast, huge server network, strong apps", bestPick: true,
    trust: 95, trustReason: "No-logs policy independently audited multiple times, RAM-only servers, Panama jurisdiction outside intelligence-sharing alliances, plus built-in malware/tracker blocking." },
  { name: "Surfshark", logo: "surfshark", affiliateKey: "surfshark", price: "$2.19/mo", priceNote: "2-year plan", noLogs: "Yes — independently audited", speed: 8, bestFor: "Best value: unlimited devices on one account", bestPick: false,
    trust: 89, trustReason: "Audited no-logs and RAM-only servers with unlimited devices; based in the Netherlands, but no mandatory data-retention law applies to VPNs there." },
  { name: "ExpressVPN", logo: "expressvpn", affiliateKey: "expressvpn", price: "$4.99/mo", priceNote: "12-month plan", noLogs: "Yes — independently audited", speed: 9, bestFor: "Easiest to use + best for streaming/unblocking", bestPick: false,
    trust: 87, trustReason: "Audited no-logs with RAM-only 'TrustedServer' tech and British Virgin Islands jurisdiction; mature, polished apps." },
  { name: "Proton VPN", logo: "protonvpn", affiliateKey: "protonvpn", price: "$4.49/mo", priceNote: "2-year plan · free tier available", noLogs: "Yes — Swiss jurisdiction, audited, open source", speed: 8, bestFor: "Privacy purists who also want a usable free tier", bestPick: false,
    trust: 93, trustReason: "Strong Swiss privacy law, fully open-source apps, independent audits, and a genuinely usable free tier with no logging." },
  { name: "Mullvad", logo: "mullvad", affiliateKey: "mullvad", price: "€5/mo flat", priceNote: "no discounts, ever", noLogs: "Yes — no email or account needed to sign up", speed: 8, bestFor: "Maximum anonymity — anonymous accounts, cash accepted", bestPick: false, noAffiliate: true,
    trust: 96, trustReason: "Sign up with no email, pay in cash, audited and minimal data by design — a 2023 police visit reportedly found nothing to seize." },
];
