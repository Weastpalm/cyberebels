import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { GUIDES } from "../data/guides.js";
import { SITE_URL } from "../lib/site.js";

export default function Guides() {
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/guides/${g.slug}`,
      name: g.title,
    })),
  };

  return (
    <div>
      <Seo
        path="/guides"
        title="Privacy Guides — Step-by-Step"
        description="Real, practical privacy guides: how to access Tor safely, build uncrackable passwords, harden your browser, and lock down your phone."
        keywords="privacy guides, how to use tor safely, strong password guide, browser hardening, phone privacy settings"
        jsonLd={listLd}
      />
      <PageHeader
        eyebrow="// field manual"
        title="Privacy"
        accent="guides."
        intro="No fluff, no fear-mongering — just step-by-step instructions you can actually follow. Pick one and get it done today."
      />

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="panel group flex flex-col p-6 transition-all hover:border-brand hover:shadow-glow"
            >
              <div className="flex items-center gap-2">
                <span className="chip">{g.difficulty}</span>
                <span className="font-mono text-[11px] text-faint">{g.minutes} min</span>
              </div>
              <h2 className="mt-3 font-mono text-lg font-bold text-ink group-hover:text-brand">
                {g.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted">{g.description}</p>
              <span className="mt-4 font-mono text-sm text-brand">Read guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
