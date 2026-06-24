import { useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

// Country calling codes (subset, longest-prefix match). [code, iso, name]
const CODES = [
  ["1","US","United States / Canada"],["7","RU","Russia / Kazakhstan"],["20","EG","Egypt"],["27","ZA","South Africa"],
  ["30","GR","Greece"],["31","NL","Netherlands"],["32","BE","Belgium"],["33","FR","France"],["34","ES","Spain"],
  ["36","HU","Hungary"],["39","IT","Italy"],["40","RO","Romania"],["41","CH","Switzerland"],["43","AT","Austria"],
  ["44","GB","United Kingdom"],["45","DK","Denmark"],["46","SE","Sweden"],["47","NO","Norway"],["48","PL","Poland"],
  ["49","DE","Germany"],["51","PE","Peru"],["52","MX","Mexico"],["54","AR","Argentina"],["55","BR","Brazil"],
  ["56","CL","Chile"],["57","CO","Colombia"],["58","VE","Venezuela"],["60","MY","Malaysia"],["61","AU","Australia"],
  ["62","ID","Indonesia"],["63","PH","Philippines"],["64","NZ","New Zealand"],["65","SG","Singapore"],["66","TH","Thailand"],
  ["81","JP","Japan"],["82","KR","South Korea"],["84","VN","Vietnam"],["86","CN","China"],["90","TR","Turkey"],
  ["91","IN","India"],["92","PK","Pakistan"],["94","LK","Sri Lanka"],["98","IR","Iran"],
  ["212","MA","Morocco"],["213","DZ","Algeria"],["234","NG","Nigeria"],["251","ET","Ethiopia"],["254","KE","Kenya"],
  ["255","TZ","Tanzania"],["256","UG","Uganda"],["260","ZM","Zambia"],["263","ZW","Zimbabwe"],
  ["233","GH","Ghana"],["237","CM","Cameroon"],
  ["351","PT","Portugal"],["352","LU","Luxembourg"],["353","IE","Ireland"],["354","IS","Iceland"],["358","FI","Finland"],
  ["359","BG","Bulgaria"],["370","LT","Lithuania"],["371","LV","Latvia"],["372","EE","Estonia"],["380","UA","Ukraine"],
  ["381","RS","Serbia"],["385","HR","Croatia"],["386","SI","Slovenia"],["420","CZ","Czechia"],["421","SK","Slovakia"],
  ["852","HK","Hong Kong"],["853","MO","Macau"],["886","TW","Taiwan"],["880","BD","Bangladesh"],["977","NP","Nepal"],
  ["971","AE","United Arab Emirates"],["972","IL","Israel"],["966","SA","Saudi Arabia"],["974","QA","Qatar"],
  ["973","BH","Bahrain"],["965","KW","Kuwait"],["962","JO","Jordan"],["961","LB","Lebanon"],["964","IQ","Iraq"],
  ["968","OM","Oman"],["970","PS","Palestine"],
].sort((a, b) => b[0].length - a[0].length);

const flagOf = (cc) => (cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "📞");

function parse(raw) {
  const hadPlus = raw.trim().startsWith("+") || raw.trim().startsWith("00");
  const digits = raw.replace(/\D/g, "").replace(/^00/, "");
  if (digits.length < 6) return null;
  let match = null;
  if (hadPlus) {
    for (const [code, iso, name] of CODES) { if (digits.startsWith(code)) { match = { code, iso, name, national: digits.slice(code.length) }; break; } }
  }
  return { digits, e164: "+" + digits, hadPlus, match };
}

function Pivot({ href, name, note }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="panel group flex flex-col p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-glow">
      <span className="font-mono text-sm font-bold text-ink group-hover:text-brand">{name} ↗</span>
      <span className="mt-1 text-[13px] leading-snug text-muted">{note}</span>
    </a>
  );
}

export default function Phone() {
  const [val, setVal] = useState("");
  const p = parse(val);
  const e164 = p ? p.e164 : "";
  const digits = p ? p.digits : "";
  const region = p && p.match ? p.match.iso : "";
  const national = p && p.match ? p.match.national : digits;

  const pivots = p ? [
    { name: "Google", href: `https://www.google.com/search?q=%22${encodeURIComponent(e164)}%22`, note: "Exact-match web search for the number." },
    { name: "Bing", href: `https://www.bing.com/search?q=%22${encodeURIComponent(e164)}%22`, note: "Second opinion across a different index." },
    { name: "Truecaller", href: region ? `https://www.truecaller.com/search/${region.toLowerCase()}/${national}` : "https://www.truecaller.com/", note: "Crowd-sourced caller ID & spam reports." },
    { name: "Sync.me", href: `https://sync.me/search/?number=${encodeURIComponent(e164)}`, note: "Caller ID and reverse-lookup directory." },
    { name: "WhatsApp", href: `https://wa.me/${digits}`, note: "See if the number has a WhatsApp account & photo." },
    { name: "800notes", href: `https://800notes.com/Phone.aspx/${digits}`, note: "Community spam / scam complaint reports." },
    { name: "WhoCallsMe", href: `https://whocallsme.com/Phone-Number.aspx/${digits}`, note: "Reverse lookup & nuisance-call reports." },
  ] : [];

  return (
    <div className="surveil-grid">
      <Seo path="/osint/phone" title="Phone Number Search — Reverse Lookup & OSINT Pivots" description="Look up a phone number: detect its country and format, then pivot to reverse-lookup, caller-ID and spam-report services. A privacy-respecting OSINT helper — no private databases." keywords="phone number search, reverse phone lookup, phone osint, caller id lookup, who called me, phone number country code" />
      <PageHeader eyebrow="// osint · phone numbers" title="Phone Number" accent="Search" intro="Enter a number in international format and Cyber Rebels identifies its country, formats it, and hands you the best free reverse-lookup and spam-report services to check it against." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-5 sm:p-6">
          <label className="mono-label">phone number (international format)</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="+1 415 555 0132" inputMode="tel" className="field flex-1 font-mono" aria-label="Phone number" />
          </div>
          <p className="mt-2 font-mono text-[10px] text-faint">Tip: include the country code (e.g. +44, +91). Everything runs in your browser — the number is never sent anywhere.</p>
        </div>

        {p && (
          <div className="mt-4 panel p-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm">
              <div><span className="text-faint">formatted </span><span className="font-bold text-brand">{e164}</span></div>
              {p.match
                ? <div><span className="text-faint">country </span><span className="text-ink">{flagOf(p.match.iso)} {p.match.name}</span> <span className="text-faint">(+{p.match.code})</span></div>
                : <div className="text-warn">{p.hadPlus ? "country code not recognized" : "add a + and country code to detect the country"}</div>}
              {p.match && <div><span className="text-faint">national </span><span className="text-muted">{national}</span></div>}
            </div>
          </div>
        )}

        {p && (
          <>
            <h2 className="mt-6 font-mono text-lg font-bold tracking-tight">Reverse-lookup &amp; OSINT pivots</h2>
            <p className="mt-1 text-sm text-muted">Open these to check the number against public caller-ID, search and spam-report services.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pivots.map((pv) => <Pivot key={pv.name} {...pv} />)}
            </div>
          </>
        )}

        {!p && <p className="mt-4 font-mono text-xs text-faint">▸ enter a number above to detect its country and generate lookup links.</p>}

        <div className="mt-6 rounded-xl border border-line/70 bg-elevated/40 p-4 text-sm leading-relaxed text-faint">
          <span className="font-mono text-muted">// note:</span> this tool detects the country and formats the number, then links you to third-party services — it has no private database and reveals nothing on its own. Use it to vet a suspicious caller or audit your own number. Looking someone up without a legitimate reason is harassment, not research.
        </div>
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
