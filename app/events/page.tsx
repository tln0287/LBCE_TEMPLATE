import Link from "next/link";
import { CalendarDays, CalendarPlus, MapPin, Tag } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EventCalendar } from "@/components/campus/EventCalendar";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/ui/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { events, pastEvents, site, upcomingEvents, type EventItem } from "@/lib/content";
import { formatDay, formatMonth, formatRange } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/events");

// Re-render hourly so events move from "Upcoming" to "Past" without a redeploy.
export const revalidate = 3600;

function eventSchema(e: EventItem, past: boolean) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    endDate: e.endDate ?? e.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: `${e.location}, ${site.name}`, address: site.contact.address },
    image: e.image,
    description: e.summary,
    url: `${site.url}/events#${e.slug}`,
    organizer: { "@type": "CollegeOrUniversity", name: site.name, url: site.url },
    ...(past ? {} : e.registerUrl ? { offers: { "@type": "Offer", url: e.registerUrl, availability: "https://schema.org/InStock" } } : {}),
  };
}

/** Google Calendar template link (all-day event; end date is exclusive). */
function calendarLink(e: EventItem) {
  const start = e.date.replace(/-/g, "");
  const endD = new Date(`${e.endDate ?? e.date}T12:00:00Z`);
  endD.setUTCDate(endD.getUTCDate() + 1);
  const end = endD.toISOString().slice(0, 10).replace(/-/g, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${start}/${end}`,
    location: `${e.location}, ${site.name}`,
    details: e.summary,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

function EventDetails({ e, past }: { e: EventItem; past: boolean }) {
  return (
    <div className="evt-actions">
      {!past && e.registerUrl && (
        <LinkButton href={e.registerUrl} variant="primary" size="sm" external>
          Register
        </LinkButton>
      )}
      <details className="evt-details">
        <summary>View details</summary>
        <dl>
          <div>
            <dt>When</dt>
            <dd>{formatRange(e.date, e.endDate)}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>
              {e.location}, {site.shortName} campus
            </dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{e.category}</dd>
          </div>
          <div>
            <dt>About</dt>
            <dd>{e.summary}</dd>
          </div>
          <div>
            <dt>Registration</dt>
            <dd>{past ? "This event has ended." : e.registerUrl ? "Open. Use the Register button." : "Details will be announced by the organising department."}</dd>
          </div>
        </dl>
        {!past && (
          <a className="link-arrow" href={calendarLink(e)} target="_blank" rel="noopener noreferrer">
            <CalendarPlus aria-hidden="true" /> Add to Google Calendar
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </details>
    </div>
  );
}

export default function EventsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = upcomingEvents();
  const past = pastEvents();
  const featured = (upcoming.length ? upcoming : events).filter((e) => e.featured);
  const initialMonth = (upcoming[0]?.date ?? today).slice(0, 7);

  return (
    <>
      <PageHero
        crumbs={[{ label: "News" }, { label: "Events" }]}
        kicker="Events"
        title="Events at LBCE"
        text="Lectures, workshops, festivals, hackathons and sports on the college calendar."
      >
        <div className="btn-row">
          <LinkButton href="#upcoming" variant="premium" arrow={false}>
            Upcoming
          </LinkButton>
          <LinkButton href="#calendar" variant="outline" arrow={false}>
            Calendar
          </LinkButton>
          <LinkButton href="#past" variant="outline" arrow={false}>
            Past events
          </LinkButton>
        </div>
      </PageHero>

      <div className="container evt-note">
        <PlaceholderNote>Sample events show the layout. Replace them in content/events.json with the official calendar.</PlaceholderNote>
      </div>

      {featured.length > 0 && (
        <section className="section evt-featured-section" aria-labelledby="evt-featured-title">
          <div className="container">
            <SectionHead id="evt-featured-title" kicker="Featured" title="Don't miss" />
            <div className="evt-featured-list">
              {featured.map((e) => (
                <Link key={e.slug} href={`#${e.slug}`} className="evt-featured reveal">
                  <div className="evt-featured__img">
                    <Img src={e.image} alt="" width={1400} sizes="(max-width: 900px) 100vw, 60vw" />
                    <span className="evt-featured__flag">Featured</span>
                  </div>
                  <div className="evt-featured__body">
                    <time className="evt-featured__date" dateTime={e.date}>
                      <span>{formatDay(e.date)}</span>
                      {formatMonth(e.date)}
                    </time>
                    <span className="tag">{e.category}</span>
                    <h3>{e.title}</h3>
                    <p>{e.summary}</p>
                    <p className="timeline__meta">
                      <CalendarDays aria-hidden="true" /> {formatRange(e.date, e.endDate)}
                      <MapPin aria-hidden="true" /> {e.location}
                    </p>
                    <span className="link-arrow">View details</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="upcoming" className="section section--sky evt-upcoming" aria-labelledby="evt-up-title">
        <div className="container">
          <SectionHead id="evt-up-title" kicker="Upcoming" title="What's coming up" text={`${upcoming.length} event${upcoming.length === 1 ? "" : "s"} on the calendar.`} />
          {upcoming.length ? (
            <ol className="timeline evt-timeline">
              {upcoming.map((e) => (
                <li key={e.slug} className="timeline__item reveal">
                  <span className="timeline__marker" aria-hidden="true" />
                  <time className="timeline__date" dateTime={e.date}>
                    <span className="timeline__day">{formatDay(e.date)}</span>
                    <span className="timeline__month">{formatMonth(e.date)}</span>
                  </time>
                  <article id={e.slug} className="timeline__card evt-card" aria-labelledby={`${e.slug}-title`}>
                    <div className="timeline__img">
                      <Img src={e.image} alt="" width={600} sizes="(max-width: 640px) 100vw, 220px" />
                    </div>
                    <div className="timeline__body">
                      <span className="tag">
                        {e.category}
                        {e.featured ? <span className="evt-card__featured"> · Featured</span> : null}
                      </span>
                      <h3 id={`${e.slug}-title`}>{e.title}</h3>
                      <p className="timeline__meta">
                        <CalendarDays aria-hidden="true" /> {formatRange(e.date, e.endDate)}
                        <MapPin aria-hidden="true" /> {e.location}
                      </p>
                      <p className="evt-card__summary">{e.summary}</p>
                      <EventDetails e={e} past={false} />
                    </div>
                  </article>
                  <JsonLd data={eventSchema(e, false)} />
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="No upcoming events listed">New events will appear here as departments announce them.</EmptyState>
          )}
        </div>
      </section>

      <section id="calendar" className="section" aria-labelledby="evt-cal-title">
        <div className="container">
          <SectionHead id="evt-cal-title" kicker="Calendar" title="Month view" text="Move between months and select an event to jump to its details." />
          <EventCalendar
            events={events.map((e) => ({ slug: e.slug, title: e.title, date: e.date, endDate: e.endDate, category: e.category, location: e.location }))}
            initialMonth={initialMonth}
            today={today}
          />
        </div>
      </section>

      <section id="past" className="section section--ivory" aria-labelledby="evt-past-title">
        <div className="container">
          <SectionHead
            id="evt-past-title"
            kicker="Archive"
            title="Past events"
            action={
              <LinkButton href="/gallery" variant="outline-dark">
                Event photos
              </LinkButton>
            }
          />
          {past.length ? (
            <ul className="grid grid--3">
              {past.map((e) => (
                <li key={e.slug} className="reveal">
                  <article id={e.slug} className="evt-past" aria-labelledby={`${e.slug}-title`}>
                    <div className="evt-past__img">
                      <Img src={e.image} alt="" width={800} sizes="(max-width: 960px) 100vw, 33vw" />
                      <span className="evt-past__badge">Completed</span>
                    </div>
                    <div className="evt-past__body">
                      <span className="tag">
                        <Tag aria-hidden="true" /> {e.category}
                      </span>
                      <h3 id={`${e.slug}-title`}>{e.title}</h3>
                      <p className="timeline__meta">
                        <CalendarDays aria-hidden="true" /> {formatRange(e.date, e.endDate)}
                        <MapPin aria-hidden="true" /> {e.location}
                      </p>
                      <p className="evt-card__summary">{e.summary}</p>
                      <EventDetails e={e} past />
                    </div>
                  </article>
                  <JsonLd data={eventSchema(e, true)} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No past events yet">Completed events will be archived here.</EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
