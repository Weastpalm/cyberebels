import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function Disclaimer() {
  return (
    <div>
      <Seo
        path="/disclaimer"
        title="Affiliate Disclosure & Disclaimer"
        description="Our affiliate relationships and the limits of the information on CybeRebels, in plain language."
      />
      <PageHeader eyebrow="// legal" title="Disclosure &" accent="Disclaimer" />

      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16">
        <section className="panel p-7">
          <h2 className="font-mono text-lg font-bold">Affiliate disclosure</h2>
          <div className="mt-3 space-y-3 text-sm text-muted">
            <p>
              CybeRebels is a participant in various affiliate programs. This means
              some of the outbound links on this site are affiliate links: if you
              click one and sign up for or purchase a product, we may earn a
              commission — at <strong className="text-ink">no extra cost to you</strong>.
            </p>
            <p>
              These commissions help keep the site free. They do not influence our
              recommendations: we rate tools on their merits, and we'll happily tell
              you when an excellent option (such as the Mullvad VPN and browser) has
              no affiliate program at all. Where a link is sponsored, it's marked as
              such in the underlying code.
            </p>
            <p>
              This disclosure is made in accordance with the U.S. Federal Trade
              Commission's guidelines on endorsements and testimonials.
            </p>
          </div>
        </section>

        <section className="panel p-7">
          <h2 className="font-mono text-lg font-bold">Not professional advice</h2>
          <div className="mt-3 space-y-3 text-sm text-muted">
            <p>
              The guides, tools, and recommendations on CybeRebels are for general
              educational purposes only. They are not legal, security, or financial
              advice, and they can't account for your specific situation or threat
              model.
            </p>
            <p>
              Our interactive checks (tracking report, fingerprint, OSINT, password
              check) are best-effort estimates produced in your browser, not
              guarantees. A "good" score doesn't make you anonymous, and our VPN
              detection and fingerprint-uniqueness figures are heuristics, clearly
              labeled as such. For high-stakes privacy needs, consult a qualified
              professional.
            </p>
          </div>
        </section>

        <section className="panel p-7">
          <h2 className="font-mono text-lg font-bold">External links</h2>
          <div className="mt-3 space-y-3 text-sm text-muted">
            <p>
              We link to third-party sites and tools we think are useful, but we
              don't control them and aren't responsible for their content, pricing,
              or practices. Always review a provider's own terms and privacy policy
              before signing up.
            </p>
            <p>
              Questions about any of this? <Link to="/contact" className="link-accent">Contact us</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
