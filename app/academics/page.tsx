import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SectionNav } from "@/components/academic/SectionNav";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { DocList } from "@/components/ui/DocCard";
import { EmptyState, SectionHead } from "@/components/ui/Section";
import { academics, departments, type Doc } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/academics");

const NAV = [
  { id: "programs", label: "Programs" },
  { id: "calendar", label: "Academic Calendar" },
  { id: "regulations", label: "Regulations" },
  { id: "curriculum", label: "Curriculum" },
  { id: "examination", label: "Examination" },
  { id: "academic-bodies", label: "Academic Bodies" },
];

const PENDING = "Will be published once the college supplies the official document.";

function DocBlock({ id, kicker, title, text, icon, docs, emptyTitle }: { id: string; kicker: string; title: string; text: string; icon: string; docs: Doc[]; emptyTitle: string }) {
  return (
    <article id={id} className="acad-doc-block reveal" aria-labelledby={`${id}-title`}>
      <header className="acad-doc-block__head">
        <span className="icon-badge">
          <Icon name={icon} />
        </span>
        <div>
          <span className="kicker">{kicker}</span>
          <h2 id={`${id}-title`}>{title}</h2>
          <p>{text}</p>
        </div>
      </header>
      {docs.length ? <DocList docs={docs} /> : <EmptyState title={emptyTitle}>{PENDING}</EmptyState>}
    </article>
  );
}

export default function AcademicsPage() {
  const calendar = academics.calendar as Doc[];
  const regulations = academics.regulations as Doc[];
  const curriculum = academics.curriculum as Doc[];
  const examDocs = academics.examination.documents as Doc[];

  return (
    <>
      <PageHero
        kicker="Academics"
        title="Academics"
        text="Programs, the academic calendar, regulations, curriculum and examinations, following Andhra University norms."
        crumbs={[{ label: "Academics" }]}
      />
      <SectionNav items={NAV} label="Academics sections" />

      <div className="acad">
        {/* Programs */}
        <section id="programs" className="section acad-section" aria-labelledby="programs-title">
          <div className="container">
            <SectionHead id="programs-title" kicker="Programs" title="Programs offered" text="Undergraduate engineering through five departments, with postgraduate and diploma pathways." />
            <div className="acad-programs">
              {academics.programs.map((p, i) => (
                <article key={p.name} className="card accent-top acad-program reveal" style={{ ["--delay" as string]: `${i * 70}ms` }}>
                  <div className="acad-program__top">
                    <span className="icon-badge">
                      <Icon name={p.icon} />
                    </span>
                    <span className="acad-program__level">{p.level}</span>
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <p className="acad-program__duration">
                    <Icon name="Clock" />
                    {p.duration}
                  </p>
                </article>
              ))}
            </div>

            <div className="acad-btech reveal">
              <div className="acad-btech__head">
                <h3>B.Tech specializations</h3>
                <Link href="/departments" className="link-arrow">
                  All departments <Icon name="ArrowRight" />
                </Link>
              </div>
              <ul className="acad-btech__list">
                {departments.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/departments/${d.slug}`} className="acad-btech__item">
                      <span className="acad-btech__code">{d.code}</span>
                      <span className="acad-btech__name">{d.programs[0]?.name ?? d.name}</span>
                      <span className="acad-btech__meta">
                        {d.programs[0]?.duration} · Intake {d.programs[0]?.intake ?? "XX"}
                      </span>
                      <Icon name="ArrowRight" className="acad-btech__arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Calendar / Regulations / Curriculum */}
        <section className="section acad-section acad-section--docs" aria-label="Calendar, regulations and curriculum">
          <div className="container acad-docs">
            <DocBlock
              id="calendar"
              kicker="Academic Calendar"
              title="Academic calendar"
              text="Semester start and end dates, examinations and holidays for the year."
              icon="CalendarDays"
              docs={calendar}
              emptyTitle="The academic calendar is on its way"
            />
            <DocBlock
              id="regulations"
              kicker="Regulations"
              title="Academic regulations"
              text="Rules on attendance, credits, evaluation and promotion for each batch."
              icon="Scale"
              docs={regulations}
              emptyTitle="Regulations are on their way"
            />
            <DocBlock
              id="curriculum"
              kicker="Curriculum"
              title="Curriculum & syllabus"
              text="Course structure and syllabi for every program and semester."
              icon="Layers"
              docs={curriculum}
              emptyTitle="Syllabus documents are on their way"
            />
          </div>
        </section>

        {/* Examination */}
        <section id="examination" className="section acad-section acad-exam" aria-labelledby="exam-title">
          <div className="container">
            <div className="acad-exam__grid">
            <div className="reveal">
              <span className="kicker">Examination</span>
              <h2 id="exam-title">Examinations</h2>
              <p className="acad-exam__text">{academics.examination.text}</p>
            </div>
            <div className="reveal">
              {examDocs.length ? (
                <DocList docs={examDocs} />
              ) : (
                <EmptyState title="No examination notices yet">
                  Schedules, notifications and results will be listed here as they are issued.
                </EmptyState>
              )}
            </div>
            </div>
          </div>
        </section>

        {/* Academic bodies */}
        <section id="academic-bodies" className="section acad-section" aria-labelledby="bodies-title">
          <div className="container">
            <SectionHead id="bodies-title" kicker="Academic Bodies" title="Academic governance" text="The bodies that shape curriculum, regulations and academic quality." />
            <div className="grid grid--2">
              <Link href="/academic-council" className="card accent-top acad-body reveal">
                <span className="icon-badge">
                  <Icon name="Landmark" />
                </span>
                <h3>Academic Council</h3>
                <p>Composition, responsibilities and minutes of the Academic Council.</p>
                <span className="link-arrow">
                  View Academic Council <Icon name="ArrowRight" />
                </span>
              </Link>
              <Link href="/board-of-studies" className="card accent-top acad-body reveal">
                <span className="icon-badge">
                  <Icon name="BookOpen" />
                </span>
                <h3>Board of Studies</h3>
                <p>Department-wise Boards of Studies that review courses and syllabi.</p>
                <span className="link-arrow">
                  View Boards of Studies <Icon name="ArrowRight" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section acad-section acad-section--cta" aria-labelledby="acad-cta-title">
          <div className="container acad-cta">
            <div>
              <span className="kicker">Admissions</span>
              <h2 id="acad-cta-title">Ready to apply?</h2>
              <p>Check eligibility, the admission process and fees for the coming academic year.</p>
            </div>
            <div className="btn-row">
              <LinkButton href="/departments" variant="outline-dark">
                Departments
              </LinkButton>
              <LinkButton href="/admissions">Admissions</LinkButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
