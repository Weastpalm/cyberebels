import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { SITE_URL, SITE_NAME } from "../lib/site.js";

export default function About() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "CybeRebels publishes free privacy tools and plain-English guides that help everyday people understand online tracking and take back control of their data.",
  };

  return (
    <div>
      <Seo
        path="/about"
        title="About CybeRebels"
        description="Who we are and why we built CybeRebels: free, no-nonsense privacy tools and guides for people who don't want to be tracked. No fear-mongering, no tinfoil hats."
        jsonLd={orgLd}
      />
      <PageHeader
        eyebrow="// about"
        title="Privacy for"
        accent="actual humans."
        intro="No fear-mongering. No tinfoil hats. Just the tools and the plain-English explanations the privacy-obsessed already use — handed to everyone else."
      />

      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16">
        <section className="panel p-7">
          <h2 className="font-mono text-xl font-bold">Why this exists</h2>
          <p className="mt-3 text-muted">
            Every website you open quietly collects your IP, your location, your
            device details, and a fingerprint unique enough to follow you across the
            internet — no login required. Most people have no idea, because the whole
            thing is invisible by design. CybeRebels makes it visible, then hands you
            the fix. We think privacy shouldn't require a computer science degree.
          </p>
        </section>

        <section className="panel p-7">
          <h2 className="font-mono text-xl font-bold">Who it's for</h2>
          <p className="mt-3 text-muted">
            Not hackers. Not corporations. The journalist who needs to protect a
            source, the parent who doesn't want their kid profiled, the small
            business owner tired of being the product — and honestly, anyone who's
            ever felt a little uneasy about how much the internet seems to know. If
            that's you, you're in the right place.
          </p>
        </section>

        <section className="panel p-7">
          <h2 className="font-mono text-xl font-bold">How our tools work</h2>
          <p className="mt-3 text-muted">
            Every checker on this site runs <strong className="text-ink">entirely
            in your browser</strong>. When you run the tracking report or fingerprint
            check, we read what your own browser exposes and show it back to you. We
            don't store your results, we don't send them to a server we control, and
            there's no account to create.
          </p>
          <p className="mt-3 text-muted">
            Two honest caveats so you can trust what you see: our VPN detection is a
            best-guess heuristic (a browser can't see VPN headers directly), and our
            fingerprint "uniqueness" is a mathematical estimate, not a lookup in a
            real database of visitors. We label both clearly wherever they appear.
          </p>
        </section>

        <section className="panel p-7">
          <h2 className="font-mono text-xl font-bold">How we make money</h2>
          <p className="mt-3 text-muted">
            CybeRebels is free, and we keep it that way with two things: display ads,
            and affiliate commissions. When we recommend a tool like a VPN and you
            sign up through our link, we may earn a commission at no extra cost to
            you. We only point you toward tools we'd actually use, and we tell you
            when a great option (like Mullvad) has no affiliate program at all.
            Read the full{" "}
            <Link to="/disclaimer" className="link-accent">affiliate disclosure</Link>.
          </p>
        </section>

        <section className="panel p-7">
          <h2 className="font-mono text-xl font-bold">Get in touch</h2>
          <p className="mt-3 text-muted">
            Spotted something wrong, want a tool reviewed, or just have a question?{" "}
            <Link to="/contact" className="link-accent">Reach out here</Link> — we
            read everything.
          </p>
        </section>
      </div>
    </div>
  );
}
