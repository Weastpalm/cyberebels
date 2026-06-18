import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { SITE_NAME } from "../lib/site.js";

function Block({ title, children }) {
  return (
    <section className="panel p-7">
      <h2 className="font-mono text-lg font-bold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div>
      <Seo
        path="/privacy-policy"
        title="Privacy Policy"
        description="How CybeRebels handles data: our tools run in your browser, we don't store your results, and we're transparent about third-party services, advertising cookies, and affiliate links."
      />
      <PageHeader eyebrow="// legal" title="Privacy" accent="Policy" />

      <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16">
        <p className="font-mono text-xs text-faint">Last updated: June 2026</p>

        <Block title="The short version">
          <p>
            {SITE_NAME} is a privacy site, so we try to practice what we preach. Our
            interactive tools run inside your browser and we don't store the results.
            We don't sell your data. The main data-collecting parts of this site are
            standard third-party services — advertising and basic hosting — described
            below.
          </p>
        </Block>

        <Block title="Information we collect">
          <p>
            <strong className="text-ink">From our tools:</strong> when you use the
            tracking report, fingerprint checker, OSINT self-check, or password
            check, the analysis happens in your browser. We do not transmit your
            results to a server we control, and we do not save them.
          </p>
          <p>
            <strong className="text-ink">Automatically:</strong> like almost every
            website, our host and our ad and analytics providers may automatically
            receive standard technical data — your IP address, browser type, device
            type, referring page, and pages viewed — through cookies and similar
            technologies.
          </p>
          <p>
            <strong className="text-ink">When you contact us:</strong> if you email
            us, we receive whatever you choose to send (your email address and
            message). We use it only to reply.
          </p>
        </Block>

        <Block title="Third-party services we rely on">
          <p>
            <strong className="text-ink">IP geolocation:</strong> the tracking tools
            call public IP-lookup APIs (such as ipwho.is and ipify) to show you your
            own approximate location and network. Your browser contacts those
            services directly; see their respective privacy policies.
          </p>
          <p>
            <strong className="text-ink">Breached-password check:</strong> the
            password checker uses the Have I Been Pwned range API with a
            k-anonymity model. Your password is hashed in your browser and only the
            first five characters of that hash are sent — your actual password is
            never transmitted.
          </p>
          <p>
            <strong className="text-ink">Fonts:</strong> we load web fonts from
            Google Fonts, which may receive your IP address as part of serving them.
          </p>
        </Block>

        <Block title="Advertising & cookies">
          <p>
            We display ads through Google AdSense. Third-party vendors, including
            Google, use cookies to serve ads based on your prior visits to this and
            other websites. Google's use of advertising cookies enables it and its
            partners to serve ads to you based on your visit to our site and/or other
            sites on the internet.
          </p>
          <p>
            You can opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="link-accent">Google Ads Settings</a>.
            You can also opt out of third-party vendor cookies at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="link-accent">aboutads.info/choices</a>.
            If you're in the EEA/UK, we will request consent for non-essential
            cookies where required.
          </p>
        </Block>

        <Block title="Affiliate links">
          <p>
            Some outbound links on this site are affiliate links. If you sign up for
            a product through one, we may earn a commission at no additional cost to
            you. This never changes our recommendations. See our{" "}
            <Link to="/disclaimer" className="link-accent">full disclosure</Link>.
          </p>
        </Block>

        <Block title="Your rights (GDPR / CCPA)">
          <p>
            Depending on where you live, you may have the right to access, correct,
            or delete personal data held about you, and to opt out of the "sale" or
            sharing of personal information. Because we don't build profiles on you
            ourselves, most such requests relate to our advertising partners — but
            you can always email us and we'll help you exercise these rights or point
            you to the right place.
          </p>
        </Block>

        <Block title="Children">
          <p>
            This site is not directed to children under 13 (or the equivalent
            minimum age in your country), and we do not knowingly collect data from
            them.
          </p>
        </Block>

        <Block title="Changes & contact">
          <p>
            We may update this policy as the site evolves; the date at the top will
            change when we do. Questions? Reach us via the{" "}
            <Link to="/contact" className="link-accent">contact page</Link>.
          </p>
          <p className="rounded-md border border-line/70 bg-elevated/40 p-3 text-xs text-faint">
            This policy is a starting template, not legal advice. Once your final ad,
            analytics, and email setup is in place, have it reviewed against the laws
            that apply to you (GDPR, CCPA/CPRA, etc.).
          </p>
        </Block>
      </div>
    </div>
  );
}
