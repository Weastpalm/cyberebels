/**
 * Post-quantum (PQC) status of consumer VPNs.
 * tier: 1 = deployed (live in the app today), 2 = groundwork / partial, 3 = no public PQC
 * Keep entries factual + sourced, not promotional either direction.
 * Update PQC_VERIFIED whenever you re-check — this space moves fast.
 */
export const PQC_VERIFIED = "2026-06-22";

export const PQC_VPNS = [
  // ---------- TIER 1 — DEPLOYED ----------
  { name: "NordVPN", logo: "nordvpn", affiliateKey: "nordvpn", tier: 1,
    algo: "ML-KEM (hybrid)", protocol: "NordLynx (WireGuard-based)",
    platforms: "Linux, Windows, macOS, iOS, Android, Android TV, tvOS",
    hybrid: true,
    note: "Manual toggle under Settings → Connections. Works only on NordLynx — post-quantum is disabled on dedicated IP, Meshnet, obfuscated servers, and other protocols.",
    source: "https://nordsecurity.com/press-area/nordvpn-launches-post-quantum-encryption-across-all-its-applications", sourceLabel: "Nord Security" },
  { name: "ExpressVPN", logo: "expressvpn", tier: 1,
    algo: "ML-KEM (NIST Security Level 5)", protocol: "Lightway (wolfSSL)",
    platforms: "All major platforms",
    hybrid: true,
    note: "Migrated from an earlier experimental Kyber build to wolfSSL's finalized ML-KEM, using the largest NIST key sizes (Level 5).",
    source: "https://www.expressvpn.com/blog/ml-kem-lightway-upgrade/", sourceLabel: "ExpressVPN" },
  { name: "Surfshark", logo: "surfshark", tier: 1,
    algo: "Post-quantum key exchange", protocol: "Dausos (proprietary) + WireGuard",
    platforms: "macOS, Linux, Android — more rolling out",
    hybrid: true,
    note: "Worth a caveat: TechRadar found the new Dausos protocol failed on some residential fiber connections; Surfshark patched it in v4.27.1. 'Deployed' doesn't mean flawless from day one.",
    source: "https://www.techradar.com/vpn/vpn-services/surfshark-fixes-broken-post-quantum-vpn-protocol-after-techradar-investigation", sourceLabel: "TechRadar" },
  { name: "Mullvad", logo: "mullvad", tier: 1,
    algo: "Classic McEliece + ML-KEM (hybrid PSK)", protocol: "WireGuard",
    platforms: "All WireGuard servers; default on desktop, rolling out to mobile",
    hybrid: true,
    note: "A long-standing early adopter — quantum-resistant tunnels on all servers since 2022, made the default on desktop in 2025.",
    source: "https://mullvad.net/en/blog/quantum-resistant-tunnels-are-now-the-default-on-desktop", sourceLabel: "Mullvad" },
  { name: "Windscribe", logo: "windscribe", tier: 1,
    algo: "X25519 + ML-KEM-768 (hybrid)", protocol: "WireGuard",
    platforms: "Desktop, iOS, Android — out of the box",
    hybrid: true,
    note: "Shipped late 2025 (Desktop 2.17.9, Android 3.93.x, iOS 3.9.4). The pre-shared key is rotated on each login; log out and back in after updating to enable it.",
    source: "https://windscribe.com/blog/post-quantum-vpn/", sourceLabel: "Windscribe" },
  { name: "IVPN", logo: "ivpn", tier: 1,
    algo: "Post-quantum KEM via WireGuard PSK (hybrid)", protocol: "WireGuard",
    platforms: "All platforms — enabled by default",
    hybrid: true,
    note: "Quantum-resistant connections on by default since the 2023 beta graduated. Pre-shared key rotation is configurable from 1 to 30 days.",
    source: "https://www.ivpn.net/blog/quantum-resistant-wireguard-connections-ivpn-apps/", sourceLabel: "IVPN" },
  { name: "NymVPN", logo: "nymtech", tier: 1,
    algo: "Post-quantum key exchange (hybrid)", protocol: "Lewes Protocol (over WireGuard)",
    platforms: "Fast Mode — enabled by default",
    hybrid: true,
    note: "Phase one of a phased rollout: protection for mix-node communication and the anonymous mixnet mode is still to come. Decentralized provider.",
    source: "https://www.techradar.com/vpn/vpn-services/decentralized-nymvpn-rolls-out-post-quantum-protections-as-standard-alongside-a-massive-redesign", sourceLabel: "TechRadar" },

  // ---------- TIER 2 — GROUNDWORK / PARTIAL ----------
  { name: "Proton VPN", logo: "protonvpn", tier: 2,
    algo: "NIST PQC — planned", protocol: "New client-side WireGuard core (beta)",
    platforms: "Groundwork — WireGuard core in beta on Android & Windows",
    hybrid: null,
    note: "Proton's 2026 roadmap explicitly builds the foundation for post-quantum handshakes via a new WireGuard codebase. Not deployed yet — groundwork is not the same as live.",
    source: "https://protonvpn.com/blog/2026-spring-summer-roadmap", sourceLabel: "Proton VPN" },
  { name: "PureVPN", logo: "purevpn", tier: 2,
    algo: "Quantum-generated keys (Quantinuum) — not a PQC algorithm", protocol: "—",
    platforms: "Windows, macOS, iOS, Android (select regions)",
    hybrid: false,
    note: "Read the fine print: PureVPN markets 'quantum-resistant keys' produced by a quantum random-number source — that is NOT a post-quantum key-exchange algorithm like ML-KEM. A transition to NIST PQC algorithms is still described as planned.",
    source: "https://www.purevpn.com/blog/purevpn-quantum-resistant-encryption/", sourceLabel: "PureVPN" },

  // ---------- TIER 3 — NO PUBLIC PQC ----------
  { name: "CyberGhost", logo: "cyberghost", tier: 3,
    algo: "—", protocol: "WireGuard / OpenVPN / IKEv2",
    platforms: "—",
    hybrid: null,
    note: "No verified consumer post-quantum option as of the date below. Some marketing references 'quantum-resistant,' but no NIST-PQC deployment is documented.",
    source: "https://ruby-doc.org/blog/post-quantum-vpn-encryption-arrived-in-2025-most-providers-still-dont-have-it", sourceLabel: "industry roundup" },
  { name: "Private Internet Access", logo: "privateinternetaccess", tier: 3,
    algo: "—", protocol: "WireGuard / OpenVPN",
    platforms: "—",
    hybrid: null,
    note: "No public post-quantum roadmap found as of the date below.",
    source: "https://ruby-doc.org/blog/post-quantum-vpn-encryption-arrived-in-2025-most-providers-still-dont-have-it", sourceLabel: "industry roundup" },
];

export const PQC_TIERS = {
  1: { key: "deployed", label: "Deployed", blurb: "Post-quantum encryption is live in the app today.", tone: "good" },
  2: { key: "groundwork", label: "In progress", blurb: "Groundwork laid or partial — not fully deployed.", tone: "warn" },
  3: { key: "none", label: "No PQC", blurb: "No public post-quantum option or roadmap.", tone: "bad" },
};
