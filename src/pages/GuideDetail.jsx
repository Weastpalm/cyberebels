import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import Article from "../components/Article.jsx";
import { getGuide, GUIDES } from "../data/guides.js";
import { SITE_URL, SITE_NAME } from "../lib/site.js";

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-28 text-center">
        <Seo path={`/guides/${slug}`} title="Guide not found" noindex />
        <h1 className="font-mono text-2xl font-bold">Guide not found</h1>
        <p className="mt-3 text-muted">That guide doesn't exist (yet).</p>
        <Link to="/guides" className="btn-primary mt-8">All guides →</Link>
      </div>
    );
  }

  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    url: `${SITE_URL}/guides/${guide.slug}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: guide.tags.join(", "),
  };

  return (
    <div className="surveil-grid">
      <Seo
        path={`/guides/${guide.slug}`}
        title={guide.title}
        description={guide.description}
        keywords={guide.tags.join(", ")}
        type="article"
        jsonLd={articleLd}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-14">
        <Link to="/guides" className="font-mono text-xs text-faint hover:text-brand">
          ← all guides
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="chip">{guide.difficulty}</span>
          <span className="font-mono text-[11px] text-faint">{guide.minutes} min read</span>
          <span className="font-mono text-[11px] text-faint">· updated {guide.updated}</span>
        </div>

        <h1 className="mt-3 font-mono text-3xl font-extrabold tracking-tight sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{guide.description}</p>

        <div className="mt-8 border-t border-line/60 pt-6">
          <Article body={guide.body} />
        </div>

        {others.length > 0 && (
          <div className="mt-12 border-t border-line/60 pt-8">
            <h2 className="font-mono text-sm uppercase tracking-wider text-faint">Keep going</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((g) => (
                <Link
                  key={g.slug}
                  to={`/guides/${g.slug}`}
                  className="panel group p-4 transition-all hover:border-brand"
                >
                  <h3 className="font-mono text-sm font-bold group-hover:text-brand">{g.title}</h3>
                  <p className="mt-1 text-xs text-muted">{g.minutes} min · {g.difficulty}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
