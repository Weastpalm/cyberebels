import { useEffect, useState } from "react";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

const enc = (s) => new TextEncoder().encode(s);
function b64encode(s) { try { return btoa(String.fromCharCode(...enc(s))); } catch { return "⚠ encode failed"; } }
function b64decode(s) { try { const t = s.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/"); return new TextDecoder().decode(Uint8Array.from(atob(t), (c) => c.charCodeAt(0))); } catch { return "⚠ not valid base64"; } }
function toHex(s) { return [...enc(s)].map((b) => b.toString(16).padStart(2, "0")).join(" "); }
function fromHex(s) { try { const b = s.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, ""); const arr = b.match(/.{1,2}/g) || []; return new TextDecoder().decode(Uint8Array.from(arr.map((h) => parseInt(h, 16)))); } catch { return "⚠ not valid hex"; } }
function toBin(s) { return [...enc(s)].map((b) => b.toString(2).padStart(8, "0")).join(" "); }
function fromBin(s) { try { const bits = s.replace(/[^01]/g, ""); const bytes = bits.match(/.{1,8}/g) || []; return new TextDecoder().decode(Uint8Array.from(bytes.map((b) => parseInt(b, 2)))); } catch { return "⚠ not valid binary"; } }
function rot13(s) { return s.replace(/[a-z]/gi, (c) => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)); }
function fromCharcode(s) { return (s.split(/[^0-9]+/).filter(Boolean).map((n) => String.fromCharCode(+n)).join("")) || "⚠ no numbers"; }
function urlDec(s) { try { return decodeURIComponent(s.replace(/\+/g, " ")); } catch { return "⚠ not valid url-encoding"; } }
function jwt(s) {
  try {
    const [h, p] = s.split("."); const dec = (x) => JSON.parse(b64decode(x));
    return "header:\n" + JSON.stringify(dec(h), null, 2) + "\n\npayload:\n" + JSON.stringify(dec(p), null, 2);
  } catch { return "⚠ not a valid JWT"; }
}
async function sha(algo, s) { const buf = await crypto.subtle.digest(algo, enc(s)); return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""); }

const OPS = {
  "From Base64": b64decode, "To Base64": b64encode,
  "From Hex": fromHex, "To Hex": toHex,
  "From Binary": fromBin, "To Binary": toBin,
  "URL Decode": urlDec, "URL Encode": (s) => encodeURIComponent(s),
  "From Charcode": fromCharcode, "ROT13": rot13,
  "Reverse": (s) => [...s].reverse().join(""), "Uppercase": (s) => s.toUpperCase(), "Lowercase": (s) => s.toLowerCase(),
  "JWT Decode": jwt, "SHA-256": (s) => sha("SHA-256", s), "SHA-1": (s) => sha("SHA-1", s),
};
const OP_NAMES = Object.keys(OPS);

export default function DecoderBench() {
  const [input, setInput] = useState("Q3liZXIgUmViZWxz");
  const [recipe, setRecipe] = useState(["From Base64"]);
  const [output, setOutput] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      let v = input;
      try { for (const op of recipe) v = await OPS[op](v); } catch { v = "⚠ operation failed"; }
      if (on) setOutput(v);
    })();
    return () => { on = false; };
  }, [input, recipe]);

  return (
    <div className="surveil-grid">
      <Seo path="/osint/decoder" title="Decoder Bench — Base64, Hex, URL, ROT13 & More" description="A CyberChef-style decoder bench: stack operations like From Base64, From Hex, URL Decode, ROT13, JWT Decode and hashing into a recipe and see the live output. Runs in your browser." keywords="cyberchef alternative, base64 decoder, hex decoder, jwt decoder, rot13, url decode, decoder bench" />
      <PageHeader eyebrow="// threat center · decoder" title="Decoder" accent="Bench" intro="A mini CyberChef. Stack operations into a recipe and your input flows through them top-to-bottom, live. Decode obfuscated payloads, JWTs, hex blobs, and more — nothing leaves your browser." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="panel p-5">
            <span className="mono-label">operations — click to add</span>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {OP_NAMES.map((op) => (<button key={op} onClick={() => setRecipe((r) => [...r, op])} className="rounded-md border border-line bg-elevated/50 px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-brand hover:text-brand">{op}</button>))}
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center justify-between"><span className="mono-label">recipe ({recipe.length})</span>{recipe.length > 0 && <button onClick={() => setRecipe([])} className="font-mono text-[11px] text-faint hover:text-danger">clear</button>}</div>
            {recipe.length === 0 ? <p className="mt-3 font-mono text-xs text-faint">add operations from the left — they run top to bottom.</p> : (
              <ol className="mt-3 space-y-1.5">
                {recipe.map((op, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-md border border-line bg-elevated/40 px-3 py-1.5 font-mono text-xs">
                    <span className="text-brand">{i + 1}</span><span className="flex-1 text-ink">{op}</span>
                    <button onClick={() => setRecipe((r) => r.filter((_, j) => j !== i))} className="text-faint hover:text-danger">✕</button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="panel p-5"><label className="mono-label">input</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={7} className="field mt-2 resize-y font-mono text-sm" /></div>
          <div className="panel p-5"><label className="mono-label">output</label><textarea value={output} readOnly rows={7} className="field mt-2 resize-y bg-elevated/40 font-mono text-sm text-brand" /></div>
        </div>
        <p className="mt-3 font-mono text-xs text-faint">// live · UTF-8 safe · stack ops like a real CyberChef recipe</p>
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
