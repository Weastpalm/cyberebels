import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { POSTS } from "../data/posts.js";
import { SITE_URL } from "../lib/site.js";

const GLYPHS = ["☉", "⌬", "⏚", "✶"];

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d;
  }
}

function Thumb({ i }) {
  const hues = ["from-brand/20", "from-warn/15", "from-danger/15", "from-brand/15"];
  return (
    <div className={"relative flex h-40 items-center justify-center overflow-hidden rounded-md border border-line bg-gradient-to-br to-elevated " + hues[i % 4]}>
      <div className="surveil-grid absolute inset-0 opacity-60" />
      <span className="relative font-mono text-4xl text-brand">{GLYPHS[i % GLYPHS.length]}</span>
    </div>
  );
}

export default function Blog() {
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The CybeRebels Blog",
    url: `${SITE_URL}/blog`,
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <div>
      <Seo
        path="/blog"
        title="The Privacy Blog"
        description="Breakdowns and plain-English explainers on online privacy, tracking, fingerprinting, VPNs, data brokers, and taking back control of your data."
        keywords="privacy blog, online privacy guides, anti-surveillance, tracking explained, fingerprinting"
        jsonLd={blogLd}
      />
      <PageHeader
        eyebrow="// field notes"
        title="The"
        accent="Blog"
        intro="Deep dives, teardowns, and practical explainers on privacy, surveillance, and taking back control."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="panel group flex flex-col overflow-hidden p-5 transition-all hover:border-brand hover:shadow-glow"
            >
              <Thumb i={i} />
              <div className="mt-4 flex items-center gap-3 font-mono text-xs text-faint">
                <span className="rounded-sm bg-brand/10 px-2 py-0.5 text-brand">{p.tags[0]}</span>
                <span>{fmtDate(p.date)}</span>
                <span>· {p.readMins} min</span>
              </div>
              <h2 className="mt-3 font-mono text-lg font-bold leading-snug group-hover:text-brand">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted">{p.description}</p>
              <span className="mt-4 font-mono text-sm text-brand">Read article →</span>
            </Link>
          ))}
        </div>

        <AdSlot slot="blog-mid" />
      </div>
    </div>
  );
}
