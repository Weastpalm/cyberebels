import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  SITE_TWITTER,
  SITE_KEYWORDS,
  absUrl,
} from "../lib/site.js";

/**
 * Drop <Seo .../> at the top of any page to give it unique, crawlable metadata.
 *
 * Props:
 *  - title:        page-specific title (we append " — CybeRebels" unless titleFull is set)
 *  - titleFull:    use this EXACT string as the <title> (no suffix)
 *  - description:  meta description (falls back to the site default)
 *  - path:         the route path, e.g. "/fingerprint" — used for canonical + OG url
 *  - keywords:     optional comma string to override default keywords
 *  - image:        optional absolute OG image URL
 *  - type:         "website" (default) or "article"
 *  - noindex:      set true to keep a page out of search results
 *  - jsonLd:       optional object (or array) injected as <script type="application/ld+json">
 */
export default function Seo({
  title,
  titleFull,
  description = SITE_DESCRIPTION,
  path = "/",
  keywords = SITE_KEYWORDS,
  image = SITE_OG_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
}) {
  const canonical = absUrl(path);
  const fullTitle = titleFull || (title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_DESCRIPTION}`);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {SITE_TWITTER ? <meta name="twitter:site" content={SITE_TWITTER} /> : null}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
