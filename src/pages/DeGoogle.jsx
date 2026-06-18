import Seo from "../components/Seo.jsx";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import { AffiliateLink } from "../components/Affiliate.jsx";

const STEPS = [
  { title: "Switch your search engine", replace: "Google Search → DuckDuckGo or Brave Search", logo: "duckduckgo", why: "This is the single biggest tracker in most people's lives, and the easiest to drop. Your searches reveal what you're thinking about buying, who you're worried about, what you're sick with. Change the default in your browser settings and you've cut the cord in 30 seconds.", tool: "duckduckgo", toolLabel: "Get DuckDuckGo" },
  { title: "Change your browser", replace: "Chrome → Brave or hardened Firefox", logo: "brave", why: "Chrome is the data funnel. Brave blocks trackers and ads by default and imports your bookmarks and passwords in one click, so the switch is painless. Firefox is the move if you like to tinker.", tool: "brave", toolLabel: "Get Brave" },
  { title: "Move your email", replace: "Gmail → Proton Mail or Tuta", logo: "protonmail", why: "Your inbox is a map of your entire life — receipts, tickets, medical results, every account you own. Free encrypted email exists. Start a new address for new sign-ups, then migrate the important stuff over a few weekends.", tool: "protonmail", toolLabel: "Get Proton Mail" },
  { title: "Get a real password manager", replace: "Saved-in-Chrome passwords → Bitwarden", logo: "bitwarden", why: "Reused passwords are how one breach becomes ten hacked accounts. A password manager makes every login unique and strong, and it's free. This also breaks your dependence on 'Sign in with Google.'", tool: "bitwarden", toolLabel: "Get Bitwarden" },
  { title: "Replace Google Drive & Docs", replace: "Google Drive → Proton Drive / local files", logo: "proton", why: "Everything you upload to Drive is scannable. Proton Drive gives you encrypted cloud storage; for sensitive files, nothing beats an encrypted drive you physically control.", tool: "protonmail", toolLabel: "See Proton" },
  { title: "Ditch Google Maps for daily use", replace: "Google Maps → Organic Maps / Apple Maps", logo: "duckduckgo", why: "Maps quietly builds a timeline of everywhere you go. Organic Maps works offline with no tracking. Keep Google Maps on a separate browser for the rare times you truly need its reviews.", tool: "duckduckgo", toolLabel: "Browse tools" },
  { title: "Lock the back door: your phone & accounts", replace: "Default settings → privacy-hardened settings", logo: "signal", why: "Turn off ad personalization in your Google account, delete your location and activity history, switch messaging to Signal, and put a VPN on the device so your ISP stops logging everything. This is the step that makes all the others stick.", tool: "signal", toolLabel: "Get Signal" },
];

export default function DeGoogle() {
  return (
    <div>
      <Seo
        path="/de-google"
        title="How to De-Google Your Life in 7 Steps"
        description="A plain-English, no-tinfoil-hat guide to replacing Google's tracking-heavy services with private tools — search, email, browser, maps, and more."
        keywords="de-google, degoogle, quit google, google alternatives, privacy without google"
      />
      <PageHeader
        eyebrow="// beginner guide"
        title="De-Google Your Life in"
        accent="7 Steps"
        intro="You don't have to go full hermit. Do these in order, one a week, and in under two months Google goes from owning your data to barely knowing you exist."
      />

      <div className="mx-auto max-w-3xl px-4">
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={i}>
              <div className="panel p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-brand/40 bg-brand/10 font-mono text-lg font-bold text-brand">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-mono text-lg font-bold leading-tight">{s.title}</h2>
                    <p className="mt-1 font-mono text-xs text-faint">{s.replace}</p>
                  </div>
                  <BrandLogo slug={s.logo} name={s.toolLabel} size={26} className="hidden sm:inline-flex" />
                </div>
                <p className="mt-4 text-muted">{s.why}</p>
                <div className="mt-4"><AffiliateLink to={s.tool} className="font-mono text-sm">{s.toolLabel} →</AffiliateLink></div>
              </div>
              {i === 2 && <div className="mt-4"><AdSlot slot="degoogle-mid" /></div>}
            </li>
          ))}
        </ol>

        <div className="panel my-8 p-7 text-center">
          <h2 className="font-mono text-xl font-bold">The one step that ties it together</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">A VPN sits underneath all of this and stops your internet provider from logging the sites you visit in the first place.</p>
          <Link to="/best-vpns" className="btn-primary mt-5">Find the Best VPN →</Link>
        </div>
      </div>
    </div>
  );
}
