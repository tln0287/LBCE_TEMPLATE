import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { DeptMotif } from "@/components/academic/DeptMotif";
import { FacultyCard } from "@/components/academic/FacultyCard";
import { SectionNav } from "@/components/academic/SectionNav";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { departments, facultyMembers, getDepartment, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = getDepartment(slug);
  if (!d) return {};
  return pageMeta(`/departments/${slug}`, {
    title: d.name,
    description: `${d.name} at ${site.shortName}, Visakhapatnam: ${d.summary}`,
    image: `${d.image}?w=1200&h=630&fit=crop&q=70`,
  });
}

const NAV = [
  { id: "about", label: "About the Department" },
  { id: "vision-mission", label: "Vision & Mission" },
  { id: "programs", label: "Programs" },
  { id: "faculty", label: "Faculty" },
  { id: "laboratories", label: "Laboratories" },
  { id: "research", label: "Research" },
  { id: "publications", label: "Publications" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "student-activities", label: "Student Activities" },
  { id: "placements", label: "Placements" },
  { id: "contact", label: "Contact" },
];

const PENDING = "Will be published once the department supplies it.";
const pad = (n: number) => String(n).padStart(2, "0");

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const d = getDepartment(slug);
  if (!d) notFound();

  const faculty = facultyMembers.filter((m) => m.department === d.slug);
  const others = departments.filter((o) => o.slug !== d.slug);
  const hasContact = Boolean(d.contact.email || d.contact.phone);

  return (
    <div className="dept" data-dept={d.code}>
      <PageHero
        kicker="Department"
        title={d.name}
        text={d.summary}
        crumbs={[
          { label: "Departments", href: "/departments" },
          { label: d.code === "CIVIL" || d.code === "MECH" ? d.name.replace(" Engineering", "") : d.code },
        ]}
        image={d.image}
      >
        <div className="dept-hero-meta">
          <span className="dept-hero-meta__code">
            <Icon name={d.icon} />
            {d.code}
          </span>
          {d.programs.map((p) => (
            <span key={p.name}>
              {p.level} · {p.duration}
            </span>
          ))}
        </div>
      </PageHero>

      <SectionNav items={NAV} label={`${d.code} department sections`} />

      {/* About */}
      <section id="about" className="section dept-section dept-about" aria-labelledby="about-title">
        <div className="container dept-about__grid">
          <div className="dept-about__mark reveal" aria-hidden="true">
            <span className="dept-code">{d.code}</span>
            <DeptMotif code={d.code} className="dept-about__motif" />
          </div>
          <div className="dept-about__text">
            <SectionHead id="about-title" kicker="About the Department" title={d.name} />
            <div className="prose reveal">
              <p>{d.about}</p>
            </div>
            <dl className="dept-facts dept-facts--inline reveal">
              <div>
                <dt>Programs</dt>
                <dd>{d.programs.length}</dd>
              </div>
              <div>
                <dt>Intake</dt>
                <dd>{d.programs[0]?.intake ?? "XX"}</dd>
              </div>
              <div>
                <dt>Faculty</dt>
                <dd>{d.faculty}</dd>
              </div>
              <div>
                <dt>Affiliation</dt>
                <dd className="dept-facts__small">Andhra University</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" className="section section--navy-grad dept-section dept-vm" aria-labelledby="vm-title">
        <DeptMotif code={d.code} className="dept-vm__motif" />
        <div className="container">
          <h2 id="vm-title" className="sr-only">
            Vision and Mission
          </h2>
          <div className="dept-vm__grid">
            <figure className="dept-vm__vision reveal">
              <span className="kicker">Vision</span>
              <blockquote>
                <p>{d.vision}</p>
              </blockquote>
            </figure>
            <div className="dept-vm__mission reveal">
              <span className="kicker">Mission</span>
              <ol>
                {d.mission.map((m, i) => (
                  <li key={m}>
                    <span className="dept-vm__num" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="section section--ivory dept-section" aria-labelledby="programs-title">
        <div className="container">
          <SectionHead
            id="programs-title"
            kicker="Programs"
            title="Programs offered"
            action={
              <LinkButton href="/academics#curriculum" variant="ghost">
                Curriculum &amp; regulations
              </LinkButton>
            }
          />
          <div className="grid grid--2">
            {d.programs.map((p) => (
              <article key={p.name} className="card accent-top dept-program reveal">
                <span className="icon-badge">
                  <Icon name="GraduationCap" />
                </span>
                <h3>{p.name}</h3>
                <dl className="dept-program__facts">
                  <div>
                    <dt>Level</dt>
                    <dd>{p.level}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{p.duration}</dd>
                  </div>
                  <div>
                    <dt>Intake</dt>
                    <dd>{p.intake}</dd>
                  </div>
                </dl>
                <LinkButton href="/admissions" variant="ghost">
                  Admission details
                </LinkButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section id="faculty" className="section dept-section" aria-labelledby="faculty-title">
        <div className="container">
          <SectionHead
            id="faculty-title"
            kicker="Faculty"
            title="Faculty members"
            action={
              <LinkButton href="/faculty" variant="ghost">
                Full faculty directory
              </LinkButton>
            }
          />
          {faculty.length ? (
            <div className="fac-dir-grid">
              {faculty.map((m) => (
                <FacultyCard key={m.id} member={m} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Faculty profiles are on their way"
              action={
                <LinkButton href="/faculty" variant="outline-dark" size="sm">
                  Go to faculty directory
                </LinkButton>
              }
            >
              The {d.code} faculty list {PENDING.charAt(0).toLowerCase() + PENDING.slice(1)}
            </EmptyState>
          )}
        </div>
      </section>

      {/* Laboratories */}
      <section id="laboratories" className="section section--sky dept-section" aria-labelledby="labs-title">
        <div className="container">
          <SectionHead id="labs-title" kicker="Laboratories" title="Labs and workshops" text="Hands-on facilities where students put theory into practice." />
          <ol className="dept-labs">
            {d.labs.map((l, i) => (
              <li key={l} className="dept-lab reveal" style={{ ["--delay" as string]: `${i * 60}ms` }}>
                <span className="dept-lab__num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className="dept-lab__icon" aria-hidden="true">
                  <Icon name="FlaskConical" />
                </span>
                <h3>{l}</h3>
              </li>
            ))}
          </ol>
          <div className="dept-section__note">
            <PlaceholderNote>Lab names are listed for the department to confirm; equipment details and photos will follow.</PlaceholderNote>
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="section dept-section" aria-labelledby="research-title">
        <div className="container dept-research">
          <div>
            <SectionHead id="research-title" kicker="Research" title="Research focus areas" text={`Areas in which ${d.code} faculty and students work on projects and publications.`} />
            <LinkButton href="/research" variant="outline-dark">
              Research &amp; innovation
            </LinkButton>
          </div>
          <ul className="dept-research__list">
            {d.research.map((r, i) => (
              <li key={r} className="reveal" style={{ ["--delay" as string]: `${i * 50}ms` }}>
                <Icon name="Atom" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Publications, Projects, Achievements */}
      <section className="section section--ivory dept-section" aria-label="Publications, projects and achievements">
        <div className="container">
          <div className="dept-records">
            <article id="publications" className="dept-record reveal" aria-labelledby="pub-title">
              <span className="icon-badge">
                <Icon name="BookOpen" />
              </span>
              <span className="kicker">Publications</span>
              <h2 id="pub-title" className="dept-record__title">
                Journal &amp; conference papers
              </h2>
              <EmptyState title="No publications listed yet">{PENDING}</EmptyState>
            </article>
            <article id="projects" className="dept-record reveal" aria-labelledby="proj-title">
              <span className="icon-badge">
                <Icon name="Lightbulb" />
              </span>
              <span className="kicker">Projects</span>
              <h2 id="proj-title" className="dept-record__title">
                Student &amp; funded projects
              </h2>
              <EmptyState title="No projects listed yet">{PENDING}</EmptyState>
            </article>
            <article id="achievements" className="dept-record reveal" aria-labelledby="ach-title">
              <span className="icon-badge">
                <Icon name="Trophy" />
              </span>
              <span className="kicker">Achievements</span>
              <h2 id="ach-title" className="dept-record__title">
                Awards &amp; recognitions
              </h2>
              <EmptyState
                title="No achievements listed yet"
                action={
                  <LinkButton href="/achievements" variant="ghost">
                    College achievements
                  </LinkButton>
                }
              >
                {PENDING}
              </EmptyState>
            </article>
          </div>
        </div>
      </section>

      {/* Student activities & placements */}
      <section className="section dept-section" aria-label="Student activities and placements">
        <div className="container grid grid--2">
          <article id="student-activities" className="dept-record reveal" aria-labelledby="act-title">
            <span className="icon-badge">
              <Icon name="Users" />
            </span>
            <span className="kicker">Student Activities</span>
            <h2 id="act-title" className="dept-record__title">
              Clubs, workshops &amp; technical events
            </h2>
            <EmptyState
              title="Department activities are on their way"
              action={
                <div className="btn-row">
                  <LinkButton href="/activities" variant="ghost">
                    College activities
                  </LinkButton>
                  <LinkButton href="/events" variant="ghost">
                    Events calendar
                  </LinkButton>
                </div>
              }
            >
              {PENDING}
            </EmptyState>
          </article>
          <article id="placements" className="dept-record reveal" aria-labelledby="plc-title">
            <span className="icon-badge">
              <Icon name="Briefcase" />
            </span>
            <span className="kicker">Placements</span>
            <h2 id="plc-title" className="dept-record__title">
              {d.code} placement record
            </h2>
            <EmptyState
              title="Department-wise placement figures are awaited"
              action={
                <LinkButton href="/placements" variant="ghost">
                  Training &amp; Placement Cell
                </LinkButton>
              }
            >
              Placement statistics for {d.code} will be published once verified by the Training &amp; Placement Cell.
            </EmptyState>
          </article>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section section--navy dept-section dept-contact" aria-labelledby="contact-title">
        <div className="container dept-contact__grid">
          <div>
            <span className="kicker">Contact</span>
            <h2 id="contact-title">Get in touch with {d.code}</h2>
          </div>
          {hasContact ? (
            <ul className="dept-contact__list">
              {d.contact.email && (
                <li>
                  <Mail aria-hidden="true" />
                  <a href={`mailto:${d.contact.email}`}>{d.contact.email}</a>
                </li>
              )}
              {d.contact.phone && (
                <li>
                  <Phone aria-hidden="true" />
                  <a href={`tel:${d.contact.phone.replace(/[^\d+]/g, "")}`}>{d.contact.phone}</a>
                </li>
              )}
            </ul>
          ) : (
            <EmptyState
              title="Department contact details are on their way"
              action={
                <LinkButton href="/contact" variant="outline" size="sm">
                  Contact the college
                </LinkButton>
              }
            >
              {PENDING} Until then, reach the college office for any department queries.
            </EmptyState>
          )}
        </div>
      </section>

      {/* Other departments */}
      <section className="section dept-section" aria-labelledby="others-title">
        <div className="container">
          <SectionHead id="others-title" kicker="Explore" title="Other departments" />
          <ul className="dept-others">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/departments/${o.slug}`} className="dept-other accent-top" data-dept={o.code}>
                  <span className="dept-other__code" aria-hidden="true">
                    {o.code}
                  </span>
                  <span className="dept-other__name">{o.name}</span>
                  <Icon name="ArrowRight" className="dept-other__arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: `Department of ${d.name}`,
          description: d.about,
          url: new URL(`/departments/${d.slug}`, site.url).toString(),
          parentOrganization: { "@type": "CollegeOrUniversity", name: site.name, url: site.url },
        }}
      />
    </div>
  );
}
