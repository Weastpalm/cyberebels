import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

const BROKERS = [
  ["Spokeo", "https://www.spokeo.com/optout"],
  ["Whitepages", "https://www.whitepages.com/suppression-requests"],
  ["BeenVerified", "https://www.beenverified.com/app/optout/search"],
  ["Intelius", "https://www.intelius.com/opt-out/"],
  ["Radaris", "https://radaris.com/page/how-to-remove"],
  ["MyLife", "https://www.mylife.com/ccpa/index.pubview"],
];

export default function Brokers() {
  return (
    <div className="surveil-grid">
      <Seo path="/osint/brokers" title="Scrub Yourself From Data Brokers" description="People-search sites resell your personal info. Here are direct opt-out links for the biggest data brokers — opting out is free." />
      <PageHeader eyebrow="// osint · self-audit" title="Scrub Yourself From" accent="Data Brokers" intro="People-search sites resell your name, address, and phone number. Opting out is free — here are the direct links." />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="panel p-6">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {BROKERS.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between rounded-lg border border-line bg-elevated/40 px-3 py-2.5 font-mono text-sm text-muted hover:border-brand hover:text-brand">
                <span>{name}</span><span className="text-xs">opt out ↗</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-faint">Doing this by hand takes an afternoon and they often re-list you. Services like DeleteMe or EasyOptOuts automate it if your time is worth more than the fee.</p>
        </div>
        <BackToConsole />
      </section>
    </div>
  );
}
