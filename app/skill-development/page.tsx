import { PageHero } from "@/components/layout/PageHero";
import { ProgramCard, type ProgramRecord } from "@/components/campus/ProgramCard";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, SectionHead } from "@/components/ui/Section";
import { programs, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/skill-development");

export default function SkillDevelopmentPage() {
  const sd = programs.skillDevelopment;
  const list = sd.programs as ProgramRecord[];
  const legacy = sd.legacyUrl || site.externalLinks.skillDevelopment;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Activities", href: "/activities" }, { label: "Skill Development" }]}
        kicker="Activities"
        title="Skill Development"
        text={sd.intro}
      >
        <div className="btn-row">
          <LinkButton href="#sd-programs" variant="premium">
            Programs
          </LinkButton>
          <LinkButton href="/placements" variant="outline">
            Training &amp; Placement
          </LinkButton>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="sd-areas-title">
        <div className="container">
          <SectionHead id="sd-areas-title" kicker="Focus areas" title="What we train for" text={`${sd.areas.length} areas that run alongside the curriculum, from first year to final placement.`} />
          <ol className="sd-areas">
            {sd.areas.map((a, i) => (
              <li key={a.id} id={`area-${a.id}`} className="sd-area reveal" style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }}>
                <span className="sd-area__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="icon-badge">
                  <Icon name={a.icon} />
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sd-programs" className="section section--ivory" aria-labelledby="sd-programs-title">
        <div className="container">
          <SectionHead
            id="sd-programs-title"
            kicker="Programs"
            title="Skill development programs"
            action={
              <LinkButton href={legacy} variant="outline-dark" external>
                Records on the current site
              </LinkButton>
            }
          />
          {list.length ? (
            <ul className="prog-grid">
              {list.map((p) => (
                <li key={p.id ?? p.title} className="reveal">
                  <ProgramCard program={p} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Program records are being moved to the new website"
              action={
                <LinkButton href={legacy} variant="primary" external>
                  View skill development programs
                </LinkButton>
              }
            >
              Until verified records are added here, details of training programs, certifications and workshops are available on the current college website.
            </EmptyState>
          )}
        </div>
      </section>

      <section className="section section--navy-grad" aria-labelledby="sd-cta-title">
        <div className="container sd-cta reveal">
          <div>
            <span className="kicker">Career readiness</span>
            <h2 id="sd-cta-title">From skills to placements</h2>
            <p>The Training &amp; Placement Cell builds on these programs to prepare students for campus recruitment.</p>
          </div>
          <div className="btn-row">
            <LinkButton href="/placements" variant="premium">
              Placements
            </LinkButton>
            <LinkButton href="/capacity-building" variant="outline">
              Capacity building
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
