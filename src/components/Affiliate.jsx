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
  nordvpn: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=151110&url_id=902", // NordVPN affiliate
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

  // Nord Security affiliate
  nordpass: "https://go.nordpass.io/aff_c?offer_id=488&aff_id=151110&url_id=9356",
};

const PLACEHOLDER_NOTE = "Affiliate link — we may earn a commission at no extra cost to you.";

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
