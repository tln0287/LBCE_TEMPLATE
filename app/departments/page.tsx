import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { DeptMotif } from "@/components/academic/DeptMotif";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { departments } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/departments");

const pad = (n: number) => String(n).padStart(2, "0");

export default function DepartmentsPage() {
  return (
    <>
      <PageHero
        kicker="Academics"
        title="Departments"
        text="Five engineering departments, each with its own laboratories, faculty and research focus, offering four-year B.Tech programs affiliated to Andhra University."
        crumbs={[{ label: "Academics", href: "/academics" }, { label: "Departments" }]}
      >
        <ul className="dept-jump" aria-label="Jump to a department">
          {departments.map((d) => (
            <li key={d.slug}>
              <a href={`#${d.slug}`}>{d.code}</a>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section section--ivory" aria-labelledby="dept-list-title">
        <div className="container">
          <SectionHead
            id="dept-list-title"
            kicker="Engineering at LBCE"
            title="Choose your discipline"
            text="Each department page covers its programs, laboratories, faculty, research areas, student activities and placements."
          />

          <ol className="dept-list">
            {departments.map((d, i) => (
              <li key={d.slug} id={d.slug} className="dept-row reveal" data-dept={d.code}>
                <Link href={`/departments/${d.slug}`} className="dept-row__media" tabIndex={-1} aria-hidden="true">
                  <Img src={d.image} alt="" width={1200} height={800} sizes="(max-width: 900px) 100vw, 50vw" />
                  <span className="dept-row__code">{d.code}</span>
                </Link>
                <div className="dept-row__body">
                  <DeptMotif code={d.code} className="dept-row__motif" />
                  <div className="dept-row__head">
                    <span className="icon-badge">
                      <Icon name={d.icon} />
                    </span>
                    <span className="dept-row__index">
                      {pad(i + 1)} / {pad(departments.length)}
                    </span>
                  </div>
                  <h2 className="dept-row__title">
                    <Link href={`/departments/${d.slug}`}>{d.name}</Link>
                  </h2>
                  <p className="dept-row__summary">{d.summary}</p>

                  <dl className="dept-facts">
                    <div>
                      <dt>Program</dt>
                      <dd>{d.programs.map((p) => p.name.split(" in ")[0]).join(", ")}</dd>
                    </div>
                    <div>
                      <dt>Duration</dt>
                      <dd>{d.programs[0]?.duration ?? "XX"}</dd>
                    </div>
                    <div>
                      <dt>Intake</dt>
                      <dd>{d.programs[0]?.intake ?? "XX"}</dd>
                    </div>
                    <div>
                      <dt>Faculty</dt>
                      <dd>{d.faculty}</dd>
                    </div>
                  </dl>

                  <div className="dept-row__lists">
                    <div>
                      <h3 className="dept-mini-title">Laboratories</h3>
                      <ul className="dept-taglist">
                        {d.labs.slice(0, 4).map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                        {d.labs.length > 4 && <li className="dept-taglist__more">+{d.labs.length - 4} more</li>}
                      </ul>
                    </div>
                    <div>
                      <h3 className="dept-mini-title">Research focus</h3>
                      <ul className="dept-taglist">
                        {d.research.slice(0, 4).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                        {d.research.length > 4 && <li className="dept-taglist__more">+{d.research.length - 4} more</li>}
                      </ul>
                    </div>
                  </div>

                  <LinkButton href={`/departments/${d.slug}`} variant="primary" className="dept-row__cta">
                    Explore department
                    <span className="sr-only">: {d.name}</span>
                  </LinkButton>
                </div>
              </li>
            ))}
          </ol>

          <div className="dept-list__note">
            <PlaceholderNote>
              Intake and faculty figures shown as XX, and the lab and research lists, are awaiting confirmation from each department.
            </PlaceholderNote>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="dept-next-title">
        <div className="container acad-cta">
          <div>
            <span className="kicker">Next steps</span>
            <h2 id="dept-next-title">Programs, regulations and admissions</h2>
            <p>See the academic calendar, regulations and curriculum, or start your application.</p>
          </div>
          <div className="btn-row">
            <LinkButton href="/academics" variant="outline-dark">
              Academics
            </LinkButton>
            <LinkButton href="/admissions">Admissions</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
