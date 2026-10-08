import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Section";
import { facilities } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/facilities");

export default function FacilitiesPage() {
  const heroImage = facilities.find((f) => f.id === "library")?.image ?? facilities[0].image;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Campus" }, { label: "Facilities" }]}
        kicker="Campus"
        title="Facilities"
        text="Classrooms, laboratories, library, hostels, sports, transport and more: the spaces that support learning, making and living on campus."
        image={heroImage}
      />

      <nav className="subnav" aria-label="Facilities on this page">
        <div className="container">
          <ul>
            {facilities.map((f) => (
              <li key={f.id}>
                <a href={`#${f.id}`}>{f.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section fac-page" aria-labelledby="fac-page-title">
        <div className="container">
          <SectionHead
            id="fac-page-title"
            kicker="On campus"
            title="Spaces built for engineers"
            text={`${facilities.length} facilities support teaching, practical work, research, residence and wellbeing.`}
          />
          <ul className="fac-page-grid">
            {facilities.map((f, i) => (
              <li key={f.id} className="fac-page-grid__item reveal" style={{ ["--delay" as string]: `${(i % 3) * 60}ms` }}>
                <article id={f.id} className="img-card fac-page-card" aria-labelledby={`${f.id}-title`}>
                  <Img src={f.image} alt="" width={1400} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 66vw" />
                  <div className="img-card__body fac-page-card__body">
                    <span className="fac-page-card__top">
                      <span className="fac-page-card__icon">
                        <Icon name={f.icon} />
                      </span>
                      <span className="fac-page-card__num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="img-card__rule" />
                    <h3 id={`${f.id}-title`}>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--ivory" aria-labelledby="fac-more-title">
        <div className="container fac-page-cta reveal">
          <div>
            <span className="kicker">See it for yourself</span>
            <h2 id="fac-more-title">Explore the campus</h2>
            <p>Browse photographs of the campus or plan a visit with the admissions office.</p>
          </div>
          <div className="btn-row">
            <LinkButton href="/gallery" variant="primary">
              View Campus Gallery
            </LinkButton>
            <LinkButton href="/campus-life" variant="outline-dark">
              Campus Life
            </LinkButton>
            <LinkButton href="/contact" variant="outline-dark">
              Plan a visit
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
