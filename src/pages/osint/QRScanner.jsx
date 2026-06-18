import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import jsQR from "jsqr";
import Seo from "../../components/Seo.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import BackToConsole from "./_back.jsx";

function hostOf(u) { try { return new URL(u).hostname; } catch { return null; } }

export default function QRScanner() {
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const canvasRef = useRef(null);

  function handleFile(file) {
    setErr(""); setRes(null);
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const max = 1000; let { width: w, height: h } = img;
      if (w > max || h > max) { const r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
      const cv = canvasRef.current; cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      const code = jsQR(data.data, w, h);
      if (code && code.data) setRes(code.data); else setErr("No QR code found in that image. Try a clearer, tighter crop.");
    };
    img.onerror = () => setErr("Couldn't read that image file.");
    img.src = URL.createObjectURL(file);
  }

  const isUrl = res && /^https?:\/\//i.test(res);
  const host = isUrl ? hostOf(res) : null;

  return (
    <div className="surveil-grid">
      <Seo path="/osint/qr" title="QR Code Safety Scanner" description="Upload a QR code image to reveal exactly what it contains before you scan it with your phone — and investigate the destination if it's a link. Decoded in your browser." keywords="qr code scanner, qr safety, decode qr, quishing, malicious qr code" />
      <PageHeader eyebrow="// threat center · qr safety" title="QR Code" accent="Scanner" intro="&quot;Quishing&quot; hides malicious links inside QR codes. Upload a screenshot or photo of one and Cyber Rebels decodes it here — so you see where it really points before your phone ever does." />
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="panel-accent p-6">
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-line p-8 text-center transition-colors hover:border-brand">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            <span className="font-mono text-sm text-muted">drop or <span className="text-brand">choose a QR image</span> to decode</span>
            <p className="mt-1 font-mono text-[11px] text-faint">PNG / JPG · decoded locally, nothing uploaded</p>
          </label>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {err && <p className="mt-4 font-mono text-sm text-warn">{err}</p>}

        {res && (
          <div className="mt-6 panel p-5">
            <span className="mono-label">decoded contents</span>
            <p className="mt-2 break-all rounded-lg border border-line bg-elevated/40 p-3 font-mono text-sm text-ink">{res}</p>
            {isUrl ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/osint?q=${encodeURIComponent(res)}`} className="btn-primary">Scan this URL →</Link>
                {host && <Link to={`/osint/${encodeURIComponent(host)}`} className="btn-ghost">Investigate {host}</Link>}
                <Link to="/osint/redirects" className="btn-ghost">Trace redirects</Link>
              </div>
            ) : <p className="mt-3 font-mono text-xs text-faint">// not a URL — plain text / data payload.</p>}
            {isUrl && <p className="mt-3 font-mono text-[11px] text-warn">⚠ don&apos;t open it on your phone until you&apos;ve checked the destination above.</p>}
          </div>
        )}
        <BackToConsole label="the Threat Center" />
      </section>
    </div>
  );
}
