import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { NewsBrowser } from "@/components/campus/NewsBrowser";
import { articlesByDate, isSampleArticle, newsArchive } from "@/components/campus/news";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { news, site } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/lbc-times");

export default function LbcTimesPage() {
  const sorted = articlesByDate();
  const featured = sorted.find((a) => a.featured) ?? sorted[0];
  const rest = sorted.filter((a) => a.slug !== featured?.slug);
  const archive = newsArchive();

  return (
    <>
      <PageHero
        crumbs={[{ label: "News" }, { label: "LBC Times" }]}
        kicker="LBC Times"
        title="News and stories from campus"
        text="Announcements, achievements, research and events from across the college."
      />

      <section className="section section--ivory lbct" aria-labelledby="lbct-featured-title">
        <div className="container">
          <h2 id="lbct-featured-title" className="sr-only">
            Featured story
          </h2>
          {featured && (
            <Link href={`/lbc-times/${featured.slug}`} className="lbct-featured reveal">
              <div className="lbct-featured__img">
                <Img src={featured.image} alt="" width={1600} sizes="(max-width: 960px) 100vw, 60vw" priority />
              </div>
              <div className="lbct-featured__body">
                <span className="lbct-featured__flag">Featured</span>
                <span className="lbct-card__cat">{featured.category}</span>
                <h3>{featured.title}</h3>
                <p>{featured.excerpt}</p>
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span className="link-arrow" aria-hidden="true">
                  Read story <ArrowRight />
                </span>
              </div>
            </Link>
          )}

          <div className="split lbct-split">
            <div>
              <SectionHead kicker="Latest" title="Latest news" id="lbct-latest-title" />
              <NewsBrowser
                articles={rest.map((a) => ({
                  slug: a.slug,
                  title: a.title,
                  category: a.category,
                  date: a.date,
                  image: a.image,
                  excerpt: a.excerpt,
                  sample: isSampleArticle(a),
                }))}
                categories={news.categories}
              />
              <div className="lbct-note">
                <PlaceholderNote>Only the first two stories reflect real notices; stories marked “Sample” show the layout and should be replaced in content/news.json.</PlaceholderNote>
              </div>
            </div>

            <aside className="split__aside" aria-label="LBC Times archive and categories">
              <nav className="lbct-panel" aria-labelledby="lbct-archive-title">
                <h2 id="lbct-archive-title">Archive</h2>
                {archive.map((g) => (
                  <details key={g.key} className="lbct-archive" open={g.key === archive[0].key}>
                    <summary>
                      {g.label} <span className="gal__count">{g.items.length}</span>
                    </summary>
                    <ul>
                      {g.items.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/lbc-times/${a.slug}`}>{a.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </nav>
              <div className="lbct-panel">
                <h2>Categories</h2>
                <ul className="lbct-cats">
                  {news.categories.map((c) => {
                    const n = news.articles.filter((a) => a.category === c).length;
                    return (
                      <li key={c}>
                        <span>{c}</span>
                        <span className="gal__count">{n}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="info-panel info-panel--navy">
                <h3>Earlier editions</h3>
                <p>Past issues of LBC Times remain on the current college website.</p>
                <LinkButton href={site.externalLinks.lbcTimes} variant="premium" size="sm" external>
                  LBC Times archive
                </LinkButton>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
