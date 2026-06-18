import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import Article from "../components/Article.jsx";
import { getPost, POSTS } from "../data/posts.js";
import { SITE_URL, SITE_NAME } from "../lib/site.js";

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return d;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-28 text-center">
        <Seo path={`/blog/${slug}`} title="Post not found" noindex />
        <h1 className="font-mono text-2xl font-bold">Post not found</h1>
        <p className="mt-3 text-muted">That post doesn't exist (yet).</p>
        <Link to="/blog" className="btn-primary mt-8">All posts →</Link>
      </div>
    );
  }

  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: post.tags.join(", "),
  };

  return (
    <div className="surveil-grid">
      <Seo
        path={`/blog/${post.slug}`}
        title={post.title}
        description={post.description}
        keywords={post.tags.join(", ")}
        type="article"
        jsonLd={articleLd}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-14">
        <Link to="/blog" className="font-mono text-xs text-faint hover:text-brand">
          ← all posts
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-faint">{fmtDate(post.date)}</span>
          <span className="font-mono text-[11px] text-faint">· {post.readMins} min read</span>
          {post.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>

        <h1 className="mt-3 font-mono text-3xl font-extrabold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{post.description}</p>

        <div className="mt-8 border-t border-line/60 pt-6">
          <Article body={post.body} />
        </div>

        {others.length > 0 && (
          <div className="mt-12 border-t border-line/60 pt-8">
            <h2 className="font-mono text-sm uppercase tracking-wider text-faint">Read next</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="panel group p-4 transition-all hover:border-brand"
                >
                  <h3 className="font-mono text-sm font-bold group-hover:text-brand">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted">{p.readMins} min read</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
