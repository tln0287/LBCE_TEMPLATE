import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/campus/GalleryGrid";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { events as allEvents, gallery, programs, upcomingEvents } from "@/lib/content";
import { formatRange } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/campus-life", {
  title: "Experience Campus Life",
  description: "Student life, events, technical and cultural activities, sports, clubs, festivals and workshops at the college.",
});

const activityImage = (id: string) => programs.activities.find((a) => a.id === id)?.image ?? gallery.items[0].image;
const galleryImage = (id: string) => gallery.items.find((g) => g.id === id)?.image ?? gallery.items[0].image;

export default function CampusLifePage() {
  const tiles = [
    { title: "Student Life", text: "Classes, labs, library hours and the friendships in between.", image: galleryImage("g2"), href: "/gallery" },
    { title: "Events", text: "Guest lectures, orientations and celebrations on the college calendar.", image: galleryImage("g4"), href: "/events" },
    { title: "Technical Activities", text: "Project expos, coding contests and paper presentations.", image: activityImage("technical"), href: "/activities#technical" },
    { title: "Cultural Activities", text: "Music, dance, drama and the annual cultural festival.", image: activityImage("cultural"), href: "/activities#cultural" },
    { title: "Sports", text: "Tournaments and the annual sports meet.", image: activityImage("sports"), href: "/activities#sports" },
    { title: "Clubs", text: "Coding, robotics, literary and arts clubs and student chapters.", image: activityImage("clubs"), href: "/activities#clubs" },
    { title: "Festivals", text: "Days the whole campus comes together.", image: galleryImage("g7"), href: "/events" },
    { title: "Workshops", text: "Hands-on sessions and expert lectures.", image: activityImage("workshops"), href: "/activities#workshops" },
  ];
  const upcoming = upcomingEvents();
  const eventList = (upcoming.length ? upcoming : allEvents).slice(0, 3);
  const lifeItems = gallery.items.filter((g) => g.category !== "Campus");
  const lifeCategories = gallery.categories.filter((c) => c !== "Campus");

  return (
    <>
      <PageHero
        crumbs={[{ label: "Campus" }, { label: "Campus Life" }]}
        kicker="Campus life"
        title={
          <>
            Experience <span className="gold">Campus Life</span>
          </>
        }
        text="Clubs, festivals, sports and a calendar full of things to build, play and perform."
        image={activityImage("cultural")}
      />

      {/* Cinematic grid */}
      <section className="cl-cine" aria-labelledby="cl-cine-title">
        <div className="cl-cine__bg" aria-hidden="true">
          <Img src={galleryImage("g5")} alt="" width={2000} />
        </div>
        <div className="container">
          <div className="section-head on-dark reveal">
            <span className="kicker">Beyond the classroom</span>
            <h2 id="cl-cine-title">Eight ways to be part of it</h2>
            <p>Every part of campus life has a place to start. Choose one to learn more.</p>
          </div>
          <ul className="cl-cine__grid">
            {tiles.map((t, i) => (
              <li key={t.title} className={`cl-cine__tile cl-cine__tile--${i} reveal`} style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }}>
                <Link href={t.href} className="img-card cl-cine__card">
                  <Img src={t.image} alt="" width={1000} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 40vw" />
                  <div className="img-card__body">
                    <span className="img-card__rule" />
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                    <span className="cl-cine__more" aria-hidden="true">
                      Explore <ArrowRight />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Full-width statement band */}
      <section className="cl-band" aria-label="Campus life statement">
        <div className="cl-band__bg" aria-hidden="true">
          <Img src={activityImage("sports")} alt="" width={2000} />
        </div>
        <div className="container cl-band__inner reveal">
          <span className="cl-band__rule" aria-hidden="true" />
          <p className="cl-band__text">
            Learn in the lab. Lead in the clubs. <span className="gold">Perform on the stage.</span>
          </p>
          <div className="btn-row">
            <LinkButton href="/activities" variant="premium">
              All activities
            </LinkButton>
            <LinkButton href="/campus-glimpses" variant="outline">
              Campus glimpses
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Interactive masonry */}
      <section className="section section--ivory" aria-labelledby="cl-moments-title">
        <div className="container">
          <SectionHead
            id="cl-moments-title"
            kicker="Moments"
            title="Life on campus, in pictures"
            text="Filter by activity and open any photo full screen."
            action={
              <LinkButton href="/gallery" variant="outline-dark">
                View Campus Gallery
              </LinkButton>
            }
          />
          <GalleryGrid items={lifeItems} categories={lifeCategories} label="Campus life photo categories" />
        </div>
      </section>

      {/* What's on */}
      <section className="section" aria-labelledby="cl-events-title">
        <div className="container">
          <SectionHead
            id="cl-events-title"
            kicker="What's on"
            title={upcoming.length ? "Coming up on campus" : "Recent events"}
            action={
              <LinkButton href="/events" variant="outline-dark">
                Full calendar
              </LinkButton>
            }
          />
          <ul className="grid grid--3">
            {eventList.map((e, i) => (
              <li key={e.slug} className="reveal" style={{ ["--delay" as string]: `${i * 70}ms` }}>
                <Link href={`/events#${e.slug}`} className="news-card cl-event">
                  <div className="news-card__img">
                    <Img src={e.image} alt="" width={800} sizes="(max-width: 960px) 100vw, 33vw" />
                  </div>
                  <div className="news-card__body">
                    <span className="tag">{e.category}</span>
                    <h3>{e.title}</h3>
                    <p className="timeline__meta">
                      <CalendarDays aria-hidden="true" /> {formatRange(e.date, e.endDate)}
                      <MapPin aria-hidden="true" /> {e.location}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="cl-note">
            <PlaceholderNote>Sample events show the layout. Replace them in content/events.json with the official calendar.</PlaceholderNote>
          </div>
        </div>
      </section>
    </>
  );
}
