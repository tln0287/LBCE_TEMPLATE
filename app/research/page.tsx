import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { DeptMotif } from "@/components/academic/DeptMotif";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { departments, home } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/research");

const OUTPUTS = [
  { id: "publications", title: "Publications", icon: "BookOpen", text: "Journal and conference papers by faculty and students." },
  { id: "patents", title: "Patents", icon: "BadgeCheck", text: "Intellectual property filed and granted from campus work." },
  { id: "projects", title: "Funded projects", icon: "FlaskConical", text: "Sponsored research, consultancy and seed-funded projects." },
];

export default function ResearchPage() {
  const metrics = home.research.metrics;
  const areaCount = new Set(departments.flatMap((d) => d.research)).size;

  return (
    <>
      <PageHero
        kicker="Research & Innovation"
        title="Research & Innovation"
        text={home.research.text}
        crumbs={[{ label: "Activities" }, { label: "Research & Innovation" }]}
      />

      {/* Metrics band */}
      <section className="section section--navy-grad research-page__band" aria-labelledby="res-metrics-title">
        <div className="container">
          <h2 id="res-metrics-title" className="sr-only">
            Research at a glance
          </h2>
          <dl className="res-metrics">
            {metrics.map((m) => (
              <div key={m.label} className="reveal">
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
            <div className="reveal">
              <dt>Focus areas across {departments.length} departments</dt>
              <dd>{areaCount}</dd>
            </div>
          </dl>
          <PlaceholderNote>Figures shown as XX are awaiting verified data from the departments and the research cell.</PlaceholderNote>
        </div>
      </section>

      {/* Research areas */}
      <section className="section section--ivory" aria-labelledby="res-areas-title" id="areas">
        <div className="container">
          <SectionHead
            id="res-areas-title"
            kicker="Research areas"
            title="Where our departments focus"
            text="Each department pursues projects and publications in the areas below."
          />
          <div className="res-areas">
            {departments.map((d, i) => (
              <article key={d.slug} className="res-area reveal" data-dept={d.code} style={{ ["--delay" as string]: `${i * 60}ms` }}>
                <DeptMotif code={d.code} className="res-area__motif" />
                <header className="res-area__head">
                  <span className="res-area__code">{d.code}</span>
                  <h3>
                    <Link href={`/departments/${d.slug}#research`}>{d.name}</Link>
                  </h3>
                </header>
                <ul className="dept-taglist">
                  {d.research.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="dept-section__note">
            <PlaceholderNote>Research areas are indicative and awaiting confirmation from each department.</PlaceholderNote>
          </div>
        </div>
      </section>

      {/* Outputs */}
      <section className="section" aria-labelledby="res-out-title">
        <div className="container">
          <SectionHead id="res-out-title" kicker="Outputs" title="Publications, patents & projects" />
          <div className="res-outputs">
            {OUTPUTS.map((o, i) => {
              const metric = metrics[i];
              return (
                <article key={o.id} id={o.id} className="dept-record reveal" aria-labelledby={`${o.id}-title`}>
                  <div className="res-output__top">
                    <span className="icon-badge">
                      <Icon name={o.icon} />
                    </span>
                    {metric && (
                      <span className="res-output__value">
                        <span className="sr-only">{metric.label}: </span>
                        {metric.value}
                      </span>
                    )}
                  </div>
                  <h3 id={`${o.id}-title`}>{o.title}</h3>
                  <p className="res-output__text">{o.text}</p>
                  <EmptyState title={`No ${o.title.toLowerCase()} listed yet`}>Will be published once the departments supply verified records.</EmptyState>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* IIC */}
      <section className="section section--navy-grad res-iic" aria-labelledby="res-iic-title">
        <div className="container res-iic__grid">
          <div className="reveal">
            <span className="kicker">Innovation &amp; Entrepreneurship</span>
            <h2 id="res-iic-title">Institution&apos;s Innovation Council</h2>
            <p className="res-iic__text">
              The IIC supports ideation, pre-incubation and entrepreneurship on campus through talks, workshops, challenges and mentoring.
            </p>
            <LinkButton href="/iic" variant="premium">
              Visit IIC
            </LinkButton>
          </div>
          <ul className="res-iic__list reveal">
            {[
              { icon: "Lightbulb", t: "Ideation & hackathons" },
              { icon: "Rocket", t: "Pre-incubation support" },
              { icon: "Users", t: "Mentoring by industry & alumni" },
              { icon: "ShieldCheck", t: "IPR awareness" },
            ].map((x) => (
              <li key={x.t}>
                <span className="icon-badge icon-badge--dark">
                  <Icon name={x.icon} />
                </span>
                <span>{x.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="section" aria-labelledby="res-cta-title">
        <div className="container acad-cta">
          <div>
            <span className="kicker">Collaborate</span>
            <h2 id="res-cta-title">Partner with us on research</h2>
            <p>Industry partners, funding agencies and researchers can reach the college to discuss projects, consultancy and collaboration.</p>
          </div>
          <div className="btn-row">
            <LinkButton href="/achievements#research" variant="outline-dark">
              Research achievements
            </LinkButton>
            <LinkButton href="/contact">Contact us</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
