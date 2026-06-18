export default function PageHeader({ eyebrow, title, accent, intro }) {
  return (
    <header className="relative mx-auto max-w-6xl px-4 pb-8 pt-16">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="font-mono text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
        {title} {accent && <span className="text-brand text-glow">{accent}</span>}
      </h1>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      <div className="mt-8 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-brand/60 via-line to-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">// cyber rebels</span>
      </div>
    </header>
  );
}
