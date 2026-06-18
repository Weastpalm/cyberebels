/**
 * VPN comparison data.
 *
 * ⚠️ PRICES CHANGE OFTEN. Verify each on the vendor page before you launch.
 * affiliateKey maps to AFFILIATE_LINKS in src/components/Affiliate.jsx.
 * logo = Simple Icons slug (rendered via cdn.simpleicons.org).
 */
export const VPNS = [
  { name: "NordVPN", logo: "nordvpn", affiliateKey: "nordvpn", price: "$3.39/mo", priceNote: "2-year plan", noLogs: "Yes — independently audited", speed: 9, bestFor: "Best all-rounder: fast, huge server network, strong apps", bestPick: true },
  { name: "Surfshark", logo: "surfshark", affiliateKey: "surfshark", price: "$2.19/mo", priceNote: "2-year plan", noLogs: "Yes — independently audited", speed: 8, bestFor: "Best value: unlimited devices on one account", bestPick: false },
  { name: "ExpressVPN", logo: "expressvpn", affiliateKey: "expressvpn", price: "$4.99/mo", priceNote: "12-month plan", noLogs: "Yes — independently audited", speed: 9, bestFor: "Easiest to use + best for streaming/unblocking", bestPick: false },
  { name: "Proton VPN", logo: "protonvpn", affiliateKey: "protonvpn", price: "$4.49/mo", priceNote: "2-year plan · free tier available", noLogs: "Yes — Swiss jurisdiction, audited, open source", speed: 8, bestFor: "Privacy purists who also want a usable free tier", bestPick: false },
  { name: "Mullvad", logo: "mullvad", affiliateKey: "mullvad", price: "€5/mo flat", priceNote: "no discounts, ever", noLogs: "Yes — no email or account needed to sign up", speed: 8, bestFor: "Maximum anonymity — anonymous accounts, cash accepted", bestPick: false, noAffiliate: true },
];
