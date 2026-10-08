import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { Ticker } from "@/components/home/Ticker";
import { DepartmentRail } from "@/components/home/DepartmentRail";
import { GlimpseRail } from "@/components/home/GlimpseRail";
import { TiltCard } from "@/components/home/TiltCard";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { EmptyState, PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { PlacementChart } from "@/components/ui/PlacementChart";
import { JsonLd } from "@/components/ui/JsonLd";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  accreditation,
  achievements,
  alumni,
  departments,
  facilities,
  fill,
  gallery,
  home,
  news,
  placements,
  site,
  upcomingEvents,
  events as allEvents,
} from "@/lib/content";
import { formatDate, formatDay, formatMonth, formatRange } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/", {
  title: `${site.name} | Visakhapatnam`,
  description: `${site.name}, Visakhapatnam. ${site.affiliation}. Engineering programs in CSE, Civil, ECE, EEE and Mechanical. Admissions open for ${site.academicYear}.`,
});

export default function HomePage() {
  const slides: HeroSlide[] = home.hero.map((s) => ({
    ...s,
    text: fill(s.text),
    ctas: s.ctas.map((c) => ({ ...c, label: fill(c.label) })),
  }));
  const upcoming = upcomingEvents();
  const eventList = (upcoming.length ? upcoming : allEvents).slice(0, 4);
  const [featured, ...restNews] = [...news.articles].sort((a, b) => Number(b.featured) - Number(a.featured));
  const featuredFacilities = facilities.filter((f) =>
    ["laboratories", "library", "computer-labs", "workshops", "auditorium", "sports", "hostels", "innovation-labs"].includes(f.id),
  );

  return (
    <>
      <HeroCarousel
        slides={slides}
        heading={site.name}
        facts={{ established: site.established, affiliation: site.affiliation, academicYear: site.academicYear, eapcetCode: site.eapcetCode }}
      />
      <Ticker items={home.announcements} />

      {/* Quick access — overlaps the ticker/intro boundary */}
      <section className="quick" aria-label="Quick access">
        <div className="container">
          <div className="quick__search reveal">
            <p className="quick__search-label">What are you looking for?</p>
            <SearchBar suggestions={["Admissions", "Hostel", "Exam results", "CSE labs", "Placements", "Pay fees"]} />
          </div>
          <ul className="quick__grid">
            {home.quickAccess.map((q, i) => (
              <li key={q.label} className="reveal" style={{ ["--delay" as string]: `${i * 50}ms` }}>
                <Link href={q.href} className="quick__card accent-top">
                  <span className="icon-badge">
                    <Icon name={q.icon} />
                  </span>
                  <span className="quick__text">
                    <span className="quick__label">{q.label}</span>
                    <span className="quick__desc">{q.desc}</span>
                  </span>
                  <ArrowRight className="quick__arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Introduction */}
      <section className="section intro" aria-labelledby="intro-title">
        <div className="container intro__grid">
          <div className="intro__media reveal">
            <Img src={home.intro.image} alt={home.intro.alt} width={1200} sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="intro__badge" aria-hidden="true">
              <span className="intro__badge-year">{site.established}</span>
              <span>Established in Visakhapatnam</span>
            </div>
          </div>
          <div className="intro__body">
            <span className="kicker reveal">About the college</span>
            <h2 id="intro-title" className="reveal">
              {home.intro.title}
            </h2>
            {home.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="intro__p reveal">
                {p}
              </p>
            ))}
            <ul className="intro__pillars">
              {home.intro.pillars.map((p, i) => (
                <li key={p.title} className="reveal" style={{ ["--delay" as string]: `${i * 80}ms` }}>
                  <span className="icon-badge">
                    <Icon name={p.icon} />
                  </span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <LinkButton href="/profile" variant="primary">
              Explore College Profile
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section section--navy stats" aria-labelledby="stats-title">
        <div className="stats__grid-bg" aria-hidden="true" />
        <div className="container">
          <h2 id="stats-title" className="sr-only">
            The college in numbers
          </h2>
          <ul className="stats__list">
            {home.stats.map((s) => (
              <li key={s.label} className="stat reveal">
                <span className="stat__value">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="stat__label">{s.label}</span>
              </li>
            ))}
          </ul>
          <PlaceholderNote>{home.statsNote}</PlaceholderNote>
        </div>
      </section>

      {/* Departments */}
      <section className="section section--sky" aria-labelledby="dept-title">
        <div className="container">
          <SectionHead
            id="dept-title"
            kicker="Departments"
            title="Explore Our Engineering Departments"
            text="Five departments, each with its own labs, faculty and industry connections."
            action={
              <LinkButton href="/departments" variant="outline-dark">
                All departments
              </LinkButton>
            }
          />
        </div>
        <DepartmentRail departments={departments} />
      </section>

      {/* Academics */}
      <section className="section section--ivory" aria-labelledby="acad-title">
        <div className="container">
          <SectionHead id="acad-title" kicker="Academics" title="Programs, calendar and examinations" text="Everything you need to plan a semester, in one place." />
          <ul className="grid grid--3">
            {home.academics.map((a, i) => (
              <li key={a.title} className="reveal" style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }}>
                <Link href={a.href} className="card accent-top acad-card">
                  <span className="icon-badge">
                    <Icon name={a.icon} />
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <span className="link-arrow">
                    Open <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Research & Innovation */}
      <section className="section section--navy-grad research" aria-labelledby="research-title">
        <div className="container research__grid">
          <div className="research__intro">
            <SectionHead id="research-title" kicker="Research & Innovation" title={home.research.title} text={home.research.text} />
            <dl className="research__metrics reveal">
              {home.research.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
            <p className="research__note">Figures shown as XX are awaiting verified data.</p>
            <LinkButton href="/research" variant="outline">
              Explore Research
            </LinkButton>
          </div>
          <ul className="research__areas">
            {home.research.areas.map((a, i) => (
              <li key={a.title} className="reveal" style={{ ["--delay" as string]: `${i * 60}ms` }}>
                <TiltCard className="research__card">
                  <span className="icon-badge icon-badge--dark">
                    <Icon name={a.icon} />
                  </span>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Facilities */}
      <section className="section" aria-labelledby="fac-title">
        <div className="container">
          <SectionHead
            id="fac-title"
            kicker="Facilities"
            title="Built for learning by doing"
            text="Labs, workshops and libraries sized for hands-on engineering, plus everything students need to live well on campus."
            action={
              <LinkButton href="/facilities" variant="outline-dark">
                All facilities
              </LinkButton>
            }
          />
          <ul className="fac-grid">
            {featuredFacilities.map((f, i) => (
              <li key={f.id} className={`reveal fac-grid__item fac-grid__item--${i}`}>
                <Link href={`/facilities#${f.id}`} className="img-card">
                  <Img src={f.image} alt="" width={900} sizes="(max-width: 720px) 100vw, 33vw" />
                  <div className="img-card__body">
                    <span className="img-card__rule" />
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Campus life */}
      <section className="campus" aria-labelledby="campus-title">
        <div className="container campus__inner">
          <SectionHead
            id="campus-title"
            kicker="Campus life"
            title="Experience Campus Life"
            text="Clubs, festivals, sports and a calendar full of things to build, play and perform."
            action={
              <LinkButton href="/campus-life" variant="outline-dark">
                Discover Campus Life
              </LinkButton>
            }
          />
          <ul className="campus__mosaic">
            {home.campusLife.map((c, i) => (
              <li key={c.title} className={`reveal campus__tile campus__tile--${i}`}>
                <Link href={c.href} className="img-card">
                  <Img src={c.image} alt="" width={900} sizes="(max-width: 720px) 50vw, 33vw" />
                  <div className="img-card__body">
                    <span className="img-card__rule" />
                    <h3>{c.title}</h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Placements */}
      <section className="section section--navy placements" aria-labelledby="place-title">
        <div className="container placements__grid">
          <div>
            <SectionHead id="place-title" kicker="Placements" title={placements.title} text={placements.text} />
            <ul className="placements__stats">
              {placements.stats.map((s) => (
                <li key={s.label} className="reveal">
                  <span className="stat__value stat__value--sm">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="stat__label">{s.label}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row" style={{ marginTop: 32 }}>
              <LinkButton href="/placements" variant="primary">
                Explore Placements
              </LinkButton>
              <LinkButton href={placements.officialUrl} variant="outline">
                Official placement page
              </LinkButton>
            </div>
          </div>
          <div className="placements__chart reveal">
            <PlacementChart data={placements.byYear} dark />
            <ol className="process">
              {placements.process.map((p) => (
                <li key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section" aria-labelledby="ach-title">
        <div className="container">
          <SectionHead
            id="ach-title"
            kicker="Achievements"
            title="Celebrating Excellence"
            text="Recognition earned by our students, faculty and teams."
            action={
              <LinkButton href="/achievements" variant="outline-dark">
                All achievements
              </LinkButton>
            }
          />
          <ul className="grid grid--3">
            {achievements.categories.map((c, i) => (
              <li key={c.id} className="reveal" style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }}>
                <TiltCard className="ach-card">
                  <Link href={`/achievements#${c.id}`} className="ach-card__link">
                    <span className="icon-badge icon-badge--gold">
                      <Icon name={c.icon} />
                    </span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <span className="ach-card__count">
                      {achievements.items.filter((x: { category?: string }) => x.category === c.id).length || "Awaiting entries"}
                    </span>
                  </Link>
                </TiltCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Events */}
      <section className="section section--sky" aria-labelledby="events-title">
        <div className="container events">
          <SectionHead
            id="events-title"
            kicker="Events"
            title={upcoming.length ? "What's coming up" : "Recent events"}
            text="Lectures, workshops, festivals and sports on the college calendar."
            action={
              <LinkButton href="/events" variant="outline-dark">
                Full calendar
              </LinkButton>
            }
          />
          <ol className="timeline">
            {eventList.map((e) => (
              <li key={e.slug} className="timeline__item reveal">
                <span className="timeline__marker" aria-hidden="true" />
                <time className="timeline__date" dateTime={e.date}>
                  <span className="timeline__day">{formatDay(e.date)}</span>
                  <span className="timeline__month">{formatMonth(e.date)}</span>
                </time>
                <article className="timeline__card">
                  <div className="timeline__img">
                    <Img src={e.image} alt="" width={480} sizes="160px" />
                  </div>
                  <div className="timeline__body">
                    <span className="tag">{e.category}</span>
                    <h3>{e.title}</h3>
                    <p className="timeline__meta">
                      <CalendarDays aria-hidden="true" /> {formatRange(e.date, e.endDate)}
                      <MapPin aria-hidden="true" /> {e.location}
                    </p>
                    <Link href={`/events#${e.slug}`} className="link-arrow">
                      View details <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
                <JsonLd
                  data={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    name: e.title,
                    startDate: e.date,
                    endDate: e.endDate ?? e.date,
                    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                    location: { "@type": "Place", name: `${e.location}, ${site.name}`, address: site.contact.address },
                    image: e.image,
                    description: e.summary,
                    organizer: { "@type": "CollegeOrUniversity", name: site.name, url: site.url },
                  }}
                />
              </li>
            ))}
          </ol>
          <PlaceholderNote>Sample events show the layout. Replace them in content/events.json with the official calendar.</PlaceholderNote>
        </div>
      </section>

      {/* News — LBC Times */}
      <section className="section section--ivory" aria-labelledby="news-title">
        <div className="container">
          <SectionHead
            id="news-title"
            kicker="LBC Times"
            title="News from campus"
            action={
              <LinkButton href="/lbc-times" variant="outline-dark">
                Read LBC Times
              </LinkButton>
            }
          />
          <div className="news-grid">
            {featured && (
              <Link href={`/lbc-times/${featured.slug}`} className="news-card news-card--featured reveal">
                <div className="news-card__img">
                  <Img src={featured.image} alt="" width={1200} sizes="(max-width: 960px) 100vw, 60vw" />
                </div>
                <div className="news-card__body">
                  <span className="news-card__flag">Featured</span>
                  <span className="tag">{featured.category}</span>
                  <h3>{featured.title}</h3>
                  <p>{featured.excerpt}</p>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                </div>
              </Link>
            )}
            <ul className="news-list">
              {restNews.slice(0, 4).map((a) => (
                <li key={a.slug} className="reveal">
                  <Link href={`/lbc-times/${a.slug}`} className="news-card">
                    <div className="news-card__body">
                      <span className="tag">{a.category}</span>
                      <h3>{a.title}</h3>
                      <time dateTime={a.date}>{formatDate(a.date)}</time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Campus glimpses / gallery */}
      <section className="section section--ivory glimpses-section" aria-labelledby="glimpses-title">
        <div className="container">
          <SectionHead
            id="glimpses-title"
            kicker="Gallery"
            title="Glimpses of Our Campus"
            action={
              <LinkButton href="/gallery" variant="premium">
                View Campus Gallery
              </LinkButton>
            }
          />
        </div>
        <GlimpseRail items={gallery.items.slice(0, 10)} />
      </section>

      {/* Alumni */}
      <section className="section" aria-labelledby="alumni-title">
        <div className="container alumni">
          <SectionHead id="alumni-title" kicker="Alumni" title="Our Alumni Network" text="Graduates working across industry, research and public service. Stay connected, mentor students and hear about reunions." />
          {alumni.profiles.length === 0 ? (
            <div className="alumni__empty reveal">
              <EmptyState title="Alumni profiles are on their way">
                We only publish alumni stories that have been verified with the graduates themselves. Registered alumni can
                opt in through the portal.
              </EmptyState>
              <div className="alumni__actions">
                <LinkButton href={alumni.registrationUrl} variant="primary">
                  Alumni Registration
                </LinkButton>
                <LinkButton href={alumni.portalUrl} variant="outline-dark">
                  Alumni Portal
                </LinkButton>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Accreditation & institutional bodies */}
      <section className="section section--ivory" aria-labelledby="accr-title">
        <div className="container">
          <SectionHead id="accr-title" kicker="Accreditation" title="Accreditation & Institutional Excellence" text={site.affiliation + "."} />
          <ul className="accr-grid">
            {accreditation.bodies.map((b, i) => (
              <li key={b.slug} className="reveal" style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }}>
                <Link href={`/${b.slug}`} className="accr-card">
                  <span className="accr-card__icon">
                    <Icon name={b.icon} />
                  </span>
                  <span className="accr-card__name">{b.name}</span>
                  <span className="accr-card__full">{b.full}</span>
                  <span className="accr-card__meta">
                    {b.documents.length ? `${b.documents.length} document${b.documents.length > 1 ? "s" : ""}` : "View details"}
                    <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="key-docs reveal">
            <h3>Key documents</h3>
            <div className="key-docs__list">
              <SmartLink href={site.externalLinks.nirf2026FunctionalAddress} className="key-doc">
                <Icon name="FileText" /> NIRF 2026 Functional Address
              </SmartLink>
              <SmartLink href={site.externalLinks.ugcMandate} className="key-doc">
                <Icon name="FileText" /> UGC Mandate 2025–26
              </SmartLink>
              <Link href="/governing-body" className="key-doc">
                <Icon name="Gavel" /> Governing Body
              </Link>
              <Link href="/committees" className="key-doc">
                <Icon name="Network" /> Committees
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta__card">
            <div className="cta__lines" aria-hidden="true" />
            <div className="cta__inner">
              <h2 id="cta-title">
                <span>{home.cta.title[0]}</span>
                <span className="gold">{home.cta.title[1]}</span>
              </h2>
              <div className="cta__side">
                <p>{fill(home.cta.text)}</p>
                <div className="btn-row">
                  {home.cta.ctas.map((c) => (
                    <LinkButton key={c.label} href={c.href} variant={c.variant} external={c.external}>
                      {c.label}
                    </LinkButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact-strip" aria-labelledby="contact-title">
        <div className="container contact-strip__grid">
          <div>
            <SectionHead id="contact-title" kicker="Contact" title="Visit or reach us" />
            <ul className="contact-list">
              <li>
                <span className="icon-badge">
                  <MapPin />
                </span>
                <div>
                  <h3>Address</h3>
                  <p>{site.contact.address}</p>
                  <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                    Get directions <Navigation aria-hidden="true" />
                  </a>
                </div>
              </li>
              <li>
                <span className="icon-badge">
                  <Phone />
                </span>
                <div>
                  <h3>Phone</h3>
                  <p>
                    <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}>{site.contact.phone}</a>
                  </p>
                </div>
              </li>
              <li>
                <span className="icon-badge">
                  <Mail />
                </span>
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="contact-strip__map reveal">
            <iframe
              title={`Map showing ${site.name}`}
              src={site.contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
