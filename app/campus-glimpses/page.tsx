import { PageHero } from "@/components/layout/PageHero";
import { GlimpseRail } from "@/components/home/GlimpseRail";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Section";
import { gallery, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/campus-glimpses");

export default function CampusGlimpsesPage() {
  // One full-screen card per category, so the sequence tours the whole campus.
  const showcase = gallery.categories
    .map((c) => gallery.items.find((i) => i.category === c))
    .filter((i): i is (typeof gallery.items)[number] => Boolean(i));

  return (
    <>
      <PageHero
        crumbs={[{ label: "Campus" }, { label: "Campus Glimpses" }]}
        kicker="Campus"
        title="Glimpses of Our Campus"
        text="A visual tour of classrooms, laboratories, events and everyday life at the college."
        image={gallery.items.find((i) => i.category === "Campus")?.image}
      >
        <div className="btn-row">
          <LinkButton href="/gallery" variant="premium">
            View Campus Gallery
          </LinkButton>
        </div>
      </PageHero>

      <section className="section section--ivory glimpses-section" aria-labelledby="glim-rail-title">
        <div className="container">
          <SectionHead
            id="glim-rail-title"
            kicker="Scroll through"
            title="Around the campus"
            text="Swipe or use the arrows to move through the photographs."
            action={
              <LinkButton href="/gallery" variant="outline-dark">
                View Campus Gallery
              </LinkButton>
            }
          />
        </div>
        <GlimpseRail items={gallery.items} />
      </section>

      <section className="glim-stack" aria-labelledby="glim-stack-title">
        <h2 id="glim-stack-title" className="sr-only">
          Campus highlights
        </h2>
        <ol className="glim-stack__list">
          {showcase.map((g, i) => (
            <li key={g.id} className="glim-stack__item">
              <figure className="glim-card">
                <Img src={g.image} alt={g.caption} width={2000} sizes="(max-width: 700px) 220vw, (orientation: portrait) 160vw, 100vw" />
                <figcaption className="glim-card__body container">
                  <span className="glim-card__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")} <span>/ {String(showcase.length).padStart(2, "0")}</span>
                  </span>
                  <span className="glim-card__rule" aria-hidden="true" />
                  <span className="glim-card__cat">{g.category}</span>
                  <span className="glim-card__caption">{g.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </section>

      <section className="section section--navy-grad" aria-labelledby="glim-cta-title">
        <div className="container glim-cta reveal">
          <span className="kicker">Gallery</span>
          <h2 id="glim-cta-title">See every photograph</h2>
          <p>The gallery collects photos by category with a full-screen viewer. Older albums remain on the current college website.</p>
          <div className="btn-row">
            <LinkButton href="/gallery" variant="premium">
              View Campus Gallery
            </LinkButton>
            <LinkButton href={site.externalLinks.campusGlimpses} variant="outline" external>
              Campus glimpses on the current site
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
