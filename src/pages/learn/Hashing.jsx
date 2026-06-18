import { useEffect, useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";

async function sha(algo, str) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randSalt() {
  const a = crypto.getRandomValues(new Uint8Array(8));
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const ALGOS = ["SHA-1", "SHA-256", "SHA-512"];

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/50 py-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="w-24 flex-none font-mono text-[11px] uppercase tracking-wider text-faint">{label}</span>
      <code className="break-all font-mono text-xs text-brand">{value || "—"}</code>
    </div>
  );
}

export default function Hashing() {
  const [text, setText] = useState("hunter2");
  const [salt, setSalt] = useState("");
  const [plain, setPlain] = useState({});
  const [salted, setSalted] = useState({});

  useEffect(() => {
    let on = true;
    (async () => {
      const p = {}, s = {};
      for (const a of ALGOS) {
        p[a] = await sha(a, text);
        s[a] = await sha(a, salt + text);
      }
      if (on) { setPlain(p); setSalted(s); }
    })();
    return () => { on = false; };
  }, [text, salt]);

  return (
    <div className="surveil-grid">
      <Seo path="/learn/hashing" title="Password Hashing Lab" description="Interactive lab: hash text with SHA-1/256/512, add a salt, and see why salting defeats rainbow tables. Runs entirely in your browser." />
      <PageHeader eyebrow="// lab · cryptography" title="Password Hashing" accent="Lab" intro="A hash is a one-way fingerprint of data. Type below and watch it update live — then add a salt and see why two identical passwords end up completely different." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel p-6">
          <label className="mono-label">input text</label>
          <input value={text} onChange={(e) => setText(e.target.value)} className="field mt-2 font-mono" placeholder="type anything…" />
          <div className="mt-5 space-y-0">
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">unsalted hashes</p>
            {ALGOS.map((a) => <Row key={a} label={a} value={plain[a]} />)}
          </div>

          <div className="mt-6 flex items-end gap-2">
            <div className="flex-1">
              <label className="mono-label">salt</label>
              <input value={salt} onChange={(e) => setSalt(e.target.value)} className="field mt-2 font-mono" placeholder="add a salt…" />
            </div>
            <button onClick={() => setSalt(randSalt())} className="btn-ghost">Generate salt</button>
          </div>
          <div className="mt-5 space-y-0">
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">salted hashes <span className="text-faint">— hash(salt + text)</span></p>
            {ALGOS.map((a) => <Row key={a} label={a} value={salted[a]} />)}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-brand">One-way</h3><p className="mt-2 text-sm text-muted">You can compute the hash from the text, but never the text from the hash. Change one character and the whole output changes.</p></div>
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-brand">Salt defeats tables</h3><p className="mt-2 text-sm text-muted">Attackers precompute hashes of common passwords (rainbow tables). A unique salt per user makes those tables useless — same password, different hash.</p></div>
          <div className="panel p-5"><h3 className="font-mono text-sm font-bold text-warn">Don&apos;t use these for passwords</h3><p className="mt-2 text-sm text-muted">SHA is <em>fast</em>, which helps attackers. Real password storage uses deliberately slow hashes — bcrypt, scrypt, or Argon2 — with a salt baked in.</p></div>
        </div>
      </section>
    </div>
  );
}
