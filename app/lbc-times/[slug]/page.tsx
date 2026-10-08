import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { articlesByDate, isSampleArticle } from "@/components/campus/news";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderNote } from "@/components/ui/Section";
import { getArticle, news, site } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { imgUrl } from "@/lib/img";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return news.articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMeta(`/lbc-times/${a.slug}`, { title: a.title, description: a.excerpt, image: imgUrl(a.image, 1200) });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const sample = isSampleArticle(a);
  const sorted = articlesByDate();
  const sameCat = sorted.filter((x) => x.slug !== a.slug && x.category === a.category);
  const related = [...sameCat, ...sorted.filter((x) => x.slug !== a.slug && x.category !== a.category)].slice(0, 3);
  const url = `${site.url}/lbc-times/${a.slug}`;

  return (
    <>
      <PageHero crumbs={[{ label: "LBC Times", href: "/lbc-times" }, { label: a.title }]} kicker={a.category} title={a.title}>
        <p className="lbct-hero-meta">
          <CalendarDays aria-hidden="true" />
          <time dateTime={a.date}>{formatDate(a.date)}</time>
          <Tag aria-hidden="true" />
          {a.category}
        </p>
      </PageHero>

      <section className="section section--ivory lbct-article-section">
        <div className="container">
          <article className="lbct-article">
            <figure className="lbct-article__img">
              <Img src={a.image} alt="" width={1600} sizes="(max-width: 900px) 100vw, 820px" priority />
            </figure>
            <div className="lbct-article__body">
              {sample && <PlaceholderNote>This is a sample story that shows the article layout. Replace it in content/news.json with a real story.</PlaceholderNote>}
              <p className="lbct-article__lede">{a.excerpt}</p>
              <div className="prose">
                {a.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="lbct-article__foot">
                <Link href="/lbc-times" className="link-arrow lbct-back">
                  <ArrowLeft aria-hidden="true" /> All stories
                </Link>
                <LinkButton href={site.externalLinks.lbcTimes} variant="ghost" external>
                  LBC Times archive
                </LinkButton>
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <div className="lbct-related">
              <h2>More from LBC Times</h2>
              <ul className="lbct-grid">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/lbc-times/${r.slug}`} className="lbct-card">
                      <div className="lbct-card__img">
                        <Img src={r.image} alt="" width={700} sizes="(max-width: 640px) 100vw, 33vw" />
                      </div>
                      <div className="lbct-card__body">
                        <span className="lbct-card__cat">
                          {r.category}
                          {isSampleArticle(r) && <span className="lbct-sample">Sample</span>}
                        </span>
                        <h3>{r.title}</h3>
                        <time dateTime={r.date}>{formatDate(r.date)}</time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: a.title,
          description: a.excerpt,
          image: [imgUrl(a.image, 1200)],
          datePublished: a.date,
          dateModified: a.date,
          articleSection: a.category,
          articleBody: a.body.join("\n\n"),
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          url,
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@type": "CollegeOrUniversity", name: site.name, url: site.url },
        }}
      />
    </>
  );
}
