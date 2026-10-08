import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Section";
import { achievements } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/achievements");

type Achievement = { title: string; category: string; date?: string; summary?: string; image?: string };

export default function AchievementsPage() {
  const items = achievements.items as Achievement[];
  const byCat = (id: string) => items.filter((it) => it.category === id).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <>
      <PageHero
        kicker="Activities"
        title="Achievements"
        text="Recognition earned by our students, faculty and the institution, in classrooms, labs, competitions and on the field."
        crumbs={[{ label: "Activities" }, { label: "Achievements" }]}
      >
        <ul className="ach-jump" aria-label="Achievement categories">
          {achievements.categories.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="ach-jump__link">
                <Icon name={c.icon} />
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section section--ivory" aria-label="Achievements by category">
        <div className="container ach-list">
          {achievements.categories.map((c, i) => {
            const list = byCat(c.id);
            return (
              <article key={c.id} id={c.id} className="ach-cat reveal" aria-labelledby={`${c.id}-title`}>
                <header className="ach-cat__head">
                  <span className="ach-cat__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="icon-badge">
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <h2 id={`${c.id}-title`}>{c.title}</h2>
                    <p>{c.text}</p>
                  </div>
                </header>
                {list.length ? (
                  <ul className="grid grid--3">
                    {list.map((it) => (
                      <li key={it.title} className="card ach-item">
                        {it.image && (
                          <div className="ach-item__img">
                            <Img src={it.image} alt="" width={640} height={400} sizes="(max-width: 700px) 100vw, 33vw" />
                          </div>
                        )}
                        {it.date && <time dateTime={it.date}>{formatDate(it.date)}</time>}
                        <h3>{it.title}</h3>
                        {it.summary && <p>{it.summary}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title={`No ${c.title.toLowerCase()} listed yet`}>
                    Verified {c.title.toLowerCase()} will be published here once supplied by the college.
                  </EmptyState>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section" aria-labelledby="ach-cta-title">
        <div className="container acad-cta">
          <div>
            <span className="kicker">Share an achievement</span>
            <h2 id="ach-cta-title">Have something to celebrate?</h2>
            <p>Students and faculty can send verified achievements to their department for publication on this page.</p>
          </div>
          <div className="btn-row">
            <LinkButton href="/research" variant="outline-dark">
              Research &amp; innovation
            </LinkButton>
            <LinkButton href="/contact">Contact us</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
