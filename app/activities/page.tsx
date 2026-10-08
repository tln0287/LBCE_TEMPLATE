import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { events, programs, type EventItem } from "@/lib/content";
import { formatRange } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/activities");

/** Which calendar entries belong to each activity area (matched on category/title, no extra data needed). */
const MATCH: Record<string, (e: EventItem) => boolean> = {
  technical: (e) => e.category === "Technical",
  cultural: (e) => e.category === "Cultural",
  sports: (e) => e.category === "Sports",
  workshops: (e) => e.category === "Workshop" && !/faculty development|\bfdp\b/i.test(e.title),
  conferences: (e) => /conference/i.test(e.title),
  fdp: (e) => /faculty development|\bfdp\b/i.test(e.title),
  hackathons: (e) => /hackathon/i.test(e.title),
};

const RELATED = [
  { href: "/iic", icon: "Lightbulb", title: "Institution's Innovation Council", text: "Innovation, entrepreneurship and start-up activity on campus." },
  { href: "/capacity-building", icon: "Layers", title: "Capacity Building Programs", text: "Structured training for students and faculty." },
  { href: "/skill-development", icon: "Target", title: "Skill Development", text: "Certifications, soft skills and career readiness." },
];

export default function ActivitiesPage() {
  const acts = programs.activities;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Activities" }]}
        kicker="Activities"
        title="Learning beyond the syllabus"
        text="Technical and cultural events, sports, clubs, workshops, conferences, faculty development and hackathons."
        image={acts[0]?.image}
      />

      <nav className="subnav" aria-label="Activity areas">
        <div className="container">
          <ul>
            {acts.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`}>{a.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="act-list">
        {acts.map((a, i) => {
          const related = MATCH[a.id] ? events.filter(MATCH[a.id]).slice(0, 2) : [];
          return (
            <section key={a.id} id={a.id} className={`act-row ${i % 2 ? "act-row--alt" : ""}`} aria-labelledby={`${a.id}-title`}>
              <div className="container act-row__inner">
                <div className="act-row__media reveal">
                  <div className="img-card act-row__img">
                    <Img src={a.image} alt="" width={1200} sizes="(max-width: 900px) 100vw, 50vw" />
                  </div>
                  <span className="act-row__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="act-row__body reveal" style={{ ["--delay" as string]: "80ms" }}>
                  <span className="icon-badge icon-badge--gold">
                    <Icon name={a.icon} />
                  </span>
                  <h2 id={`${a.id}-title`}>{a.title}</h2>
                  <p className="act-row__text">{a.text}</p>
                  {related.length > 0 && (
                    <div className="act-row__events">
                      <h3>On the calendar</h3>
                      <ul>
                        {related.map((e) => (
                          <li key={e.slug}>
                            <Link href={`/events#${e.slug}`}>
                              <CalendarDays aria-hidden="true" />
                              <span>
                                <strong>{e.title}</strong>
                                <span className="act-row__date">{formatRange(e.date, e.endDate)}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="btn-row">
                    {a.id === "fdp" ? (
                      <LinkButton href="/capacity-building" variant="ghost">
                        Capacity building programs
                      </LinkButton>
                    ) : a.id === "hackathons" ? (
                      <LinkButton href="/iic" variant="ghost">
                        Innovation Council
                      </LinkButton>
                    ) : (
                      <LinkButton href="/events" variant="ghost">
                        Events calendar
                      </LinkButton>
                    )}
                    <LinkButton href="/gallery" variant="ghost">
                      Photos
                    </LinkButton>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="section section--navy-grad" aria-labelledby="act-more-title">
        <div className="container">
          <SectionHead id="act-more-title" kicker="Grow further" title="Programs and innovation" text="Structured programs that build on these activities." />
          <ul className="grid grid--3">
            {RELATED.map((r, i) => (
              <li key={r.href} className="reveal" style={{ ["--delay" as string]: `${i * 70}ms` }}>
                <Link href={r.href} className="act-link accent-top">
                  <span className="icon-badge icon-badge--dark">
                    <Icon name={r.icon} />
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <span className="act-link__go" aria-hidden="true">
                    Learn more <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="act-note">
            <PlaceholderNote>Calendar entries shown under each activity are samples from content/events.json.</PlaceholderNote>
          </div>
        </div>
      </section>
    </>
  );
}
