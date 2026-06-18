/**
 * AFFILIATE LINKS — single source of truth.
 *
 * Every "Get Deal" / referral link on the site reads from AFFILIATE_LINKS below.
 * They are all PLACEHOLDERS right now (they point to the vendor homepage).
 * Swap in your real affiliate URLs here once and the whole site updates.
 *
 * Tip: keep the keys lowercase and stable so you never have to hunt through pages.
 */
export const AFFILIATE_LINKS = {
  // VPNs
  nordvpn: "https://nordvpn.com/", // PLACEHOLDER — replace with your affiliate link
  surfshark: "https://surfshark.com/", // PLACEHOLDER
  expressvpn: "https://www.expressvpn.com/", // PLACEHOLDER
  protonvpn: "https://protonvpn.com/", // PLACEHOLDER
  mullvad: "https://mullvad.net/", // NOTE: Mullvad has NO affiliate program (by design)

  // Privacy tools
  brave: "https://brave.com/", // PLACEHOLDER
  duckduckgo: "https://duckduckgo.com/",
  firefox: "https://www.mozilla.org/firefox/",
  mullvadbrowser: "https://mullvad.net/browser",
  protonmail: "https://proton.me/mail", // PLACEHOLDER
  tutanota: "https://tuta.com/",
  bitwarden: "https://bitwarden.com/", // PLACEHOLDER
  onepassword: "https://1password.com/", // PLACEHOLDER
  signal: "https://signal.org/",
};

const PLACEHOLDER_NOTE =
  "Placeholder affiliate link — swap in your real link in src/components/Affiliate.jsx";

export function AffiliateButton({ to, children, variant = "primary", className = "" }) {
  const href = AFFILIATE_LINKS[to] || "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      title={PLACEHOLDER_NOTE}
      data-affiliate={to}
      data-placeholder="true"
      className={(variant === "primary" ? "btn-primary" : "btn-ghost") + " " + className}
    >
      {children}
    </a>
  );
}

export function AffiliateLink({ to, children, className = "" }) {
  const href = AFFILIATE_LINKS[to] || "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      title={PLACEHOLDER_NOTE}
      data-affiliate={to}
      data-placeholder="true"
      className={"link-accent " + className}
    >
      {children}
    </a>
  );
}
