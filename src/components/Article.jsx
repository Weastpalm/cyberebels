import React from "react";

function inline(text) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m, key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={key++} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>);
    else parts.push(<code key={key++} className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-brand">{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const CALLOUT = {
  warn: { box: "border-danger/40 bg-danger/5", tag: "text-danger", label: "! caution" },
  good: { box: "border-brand/40 bg-brand/5", tag: "text-brand", label: "✓ tip" },
  info: { box: "border-info/40 bg-info/5", tag: "text-info", label: "// note" },
};

function Block({ block }) {
  switch (block.type) {
    case "h2":
      return (<h2 className="mt-12 flex scroll-mt-24 items-center gap-3 font-mono text-2xl font-bold tracking-tight"><span className="h-5 w-[3px] flex-none rounded-full bg-brand" aria-hidden="true" />{inline(block.text)}</h2>);
    case "p":
      return <p className="mt-4 leading-relaxed text-muted">{inline(block.text)}</p>;
    case "ul":
      return (<ul className="mt-4 space-y-2">{block.items.map((it, i) => (<li key={i} className="flex gap-2.5 text-muted"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" /><span className="leading-relaxed">{inline(it)}</span></li>))}</ul>);
    case "ol":
      return (<ol className="mt-4 space-y-2">{block.items.map((it, i) => (<li key={i} className="flex gap-3 text-muted"><span className="font-mono text-sm tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span><span className="leading-relaxed">{inline(it)}</span></li>))}</ol>);
    case "steps":
      return (<div className="mt-5 space-y-3">{block.items.map((s, i) => (<div key={i} className="panel p-4"><div className="flex items-center gap-3"><span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-brand font-mono text-xs font-bold text-onbrand">{String(i + 1).padStart(2, "0")}</span><h3 className="font-mono text-sm font-bold">{inline(s.title)}</h3></div><p className="mt-2 pl-10 text-sm leading-relaxed text-muted">{inline(s.text)}</p></div>))}</div>);
    case "callout": {
      const c = CALLOUT[block.tone] || CALLOUT.info;
      return (<div className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed text-muted ${c.box}`}><span className={`mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] ${c.tag}`}>{c.label}</span>{inline(block.text)}</div>);
    }
    case "links":
      return (<div className="mt-5 grid gap-2 sm:grid-cols-2">{block.items.map((it, i) => (<a key={i} href={it.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-xl border border-line bg-elevated/40 p-3 transition-all hover:border-brand hover:shadow-glow-sm"><span className="font-mono text-sm font-bold text-ink group-hover:text-brand">{it.label} ↗</span>{it.note && <span className="mt-1 text-xs text-muted">{it.note}</span>}</a>))}</div>);
    case "code":
      return (<div className="mt-4 overflow-hidden rounded-xl border border-line"><div className="console-bar"><span className="console-dot bg-danger/80" /><span className="console-dot bg-warn/80" /><span className="console-dot bg-brand/80" /><span className="ml-2 font-mono text-[11px] text-faint">snippet</span></div><pre className="overflow-x-auto bg-elevated p-4 font-mono text-xs text-ink">{block.text}</pre></div>);
    case "quote":
      return (<blockquote className="mt-6 rounded-r-lg border-l-2 border-brand bg-elevated/30 py-2 pl-4 italic text-muted">{inline(block.text)}</blockquote>);
    default:
      return null;
  }
}

export default function Article({ body }) {
  return (<div>{body.map((block, i) => (<Block key={i} block={block} />))}</div>);
}
