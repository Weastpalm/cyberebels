import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { AffiliateLink } from "../components/Affiliate.jsx";
import { TOOL_CATEGORIES } from "../data/tools.js";

export default function PrivacyTools() {
  return (
    <div>
      <Seo
        path="/privacy-tools"
        title="Private Alternatives to Big-Tech Apps"
        description="Swap the data-hungry apps you use every day for private alternatives — browsers, search, email, messaging, and password managers that don't sell you out."
        keywords="privacy tools, private browser, private search engine, encrypted email, secure messaging, password manager"
      />
      <PageHeader
        eyebrow="// the swap list"
        title="Private Alternatives to"
        accent="Big Tech"
        intro="For every product that's quietly mining your data, there's a private alternative that works just as well. Here's the swap list, category by category."
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-5">
          {TOOL_CATEGORIES.map((cat, idx) => (
            <div key={cat.category}>
              <div className="panel p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-mono text-xl font-bold">{cat.category}</h2>
                  <span className="font-mono text-xs text-faint">replaces <span className="text-danger line-through">{cat.replaces}</span></span>
                </div>
                <p className="mt-2 text-sm text-muted">{cat.why}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {cat.tools.map((t) => (
                    <div key={t.name} className="flex items-start gap-3 rounded-xl border border-line bg-elevated/50 p-4 transition-colors hover:border-brand/50">
                      <BrandLogo slug={t.logo} name={t.name} size={30} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-mono font-bold text-brand">{t.name}</span>
                          <AffiliateLink to={t.affiliateKey} className="whitespace-nowrap text-xs">Get it →</AffiliateLink>
                        </div>
                        <p className="mt-1.5 text-sm text-muted">{t.blurb}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {idx === 1 && <AdSlot slot="tools-mid" />}
            </div>
          ))}
        </div>

        <div className="panel my-8 p-6 text-sm text-muted">
          New to this? Don't try to switch everything at once — that's how people burn out and give up. Start with the <a href="/de-google" className="link-accent">De-Google guide</a> and change one thing a week.
        </div>
      </div>
    </div>
  );
}
