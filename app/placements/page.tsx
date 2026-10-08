import Link from "next/link";
import { ArrowRight, Building, CheckCircle2, GraduationCap, Handshake, Info } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Section";
import { PlacementChart } from "@/components/ui/PlacementChart";
import { placements, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/placements");

type Recruiter = { name: string; logo?: string; url?: string };

const isNumber = (v: string) => /^\d/.test(v);

/** Hero visual: a floating, layered "placement snapshot" that reads like a live dashboard. */
function PlacementSnapshot() {
  const awaiting = placements.stats.some((s) => !isNumber(s.value));
  return (
    <div className="pl-snap" aria-label="Placement snapshot">
      <div className="pl-snap__main">
        <div className="pl-snap__head">
          <span className="pl-snap__dot" aria-hidden="true" />
          <span>Placement snapshot, {site.academicYear}</span>
          {awaiting && <span className="pl-snap__badge">Awaiting verified data</span>}
        </div>
        <dl className="pl-snap__stats">
          {placements.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="pl-snap__chart" aria-hidden="true">
          {[38, 52, 46, 64, 72, 84].map((h, i) => (
            <span key={i} style={{ ["--h" as string]: `${h}%`, ["--i" as string]: i }} />
          ))}
        </div>
        <p className="pl-snap__note">Year-wise chart appears here once the T&amp;P Cell publishes figures.</p>
      </div>

      <div className="pl-snap__float pl-snap__float--steps">
        <span className="pl-snap__label">Placement process</span>
        <ol>
          {placements.process.slice(0, 3).map((p) => (
            <li key={p.title}>
              <CheckCircle2 aria-hidden="true" />
              {p.title}
            </li>
          ))}
          <li className="pl-snap__more">+{placements.process.length - 3} more steps</li>
        </ol>
      </div>

      <div className="pl-snap__float pl-snap__float--cell">
        <span className="pl-snap__icon">
          <Handshake aria-hidden="true" />
        </span>
        <span>
          <strong>Training &amp; Placement Cell</strong>
          <small>Training, internships and campus drives</small>
        </span>
      </div>
    </div>
  );
}

export default function PlacementsPage() {
  const recruiters = placements.recruiters as Recruiter[];
  const [lead, ...restTraining] = placements.training;
  const hasYearData = placements.byYear.length > 0;

  return (
    <>
      <PageHero
        kicker="Training & Placement Cell"
        title={placements.title}
        text={placements.text}
        crumbs={[{ label: "Placements" }]}
        aside={<PlacementSnapshot />}
      >
        <div className="btn-row">
          <LinkButton href="#process" variant="primary">
            How placements work
          </LinkButton>
          <LinkButton href={placements.officialUrl} variant="outline-dark">
            Official placement page
          </LinkButton>
        </div>
      </PageHero>

      <nav className="subnav" aria-label="On this page">
        <div className="container">
          <ul>
            {[
              ["process", "Process"],
              ["training", "Training"],
              ["statistics", "Statistics"],
              ["recruiters", "Recruiters"],
              ["career", "Students & recruiters"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Process — a roadmap whose line draws in as it scrolls into view */}
      <section id="process" className="section" aria-labelledby="pl-process-title">
        <div className="container">
          <SectionHead
            id="pl-process-title"
            kicker="Placement process"
            title="From registration to offer letter"
            text="Every final-year student follows the same five steps with the Training & Placement Cell."
          />
          <ol className="pl-road reveal">
            {placements.process.map((p, i) => (
              <li key={p.title} className="pl-road__step" style={{ ["--i" as string]: i }}>
                <span className="pl-road__node" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="pl-road__card">
                  <span className="pl-road__step-label">Step {i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Training — bento grid */}
      <section id="training" className="section section--ivory" aria-labelledby="pl-training-title">
        <div className="container">
          <SectionHead
            id="pl-training-title"
            kicker="Training"
            title="Training that prepares students for selection"
            text="Preparation runs alongside the final-year curriculum, so students reach recruitment drives ready for each round."
          />
          <ul className="pl-bento">
            <li className="pl-bento__lead reveal">
              <span className="pl-bento__icon">
                <Icon name={lead.icon} />
              </span>
              <h3>{lead.title}</h3>
              <p>{lead.text}</p>
              <div className="pl-bento__rounds" aria-hidden="true">
                <span>Aptitude test</span>
                <span>Group discussion</span>
                <span>Technical round</span>
                <span>HR interview</span>
              </div>
            </li>
            {restTraining.map((t) => (
              <li key={t.title} className="pl-bento__tile reveal">
                <span className="pl-bento__icon">
                  <Icon name={t.icon} />
                </span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </li>
            ))}
          </ul>
          <div className="pl-bento__more">
            <Link href="/skill-development" className="link-arrow">
              See all skill development programs <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section id="statistics" className="section" aria-labelledby="pl-stats-title">
        <div className="container pl-stats">
          <div className="pl-stats__intro">
            <SectionHead id="pl-stats-title" kicker="Statistics" title="Placement results" />
            <ul className="pl-stats__list">
              {placements.stats.map((s) => (
                <li key={s.label} className="reveal">
                  <span className="pl-stats__value">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="pl-stats__label">{s.label}</span>
                </li>
              ))}
            </ul>
            {!hasYearData && (
              <p className="pl-stats__note">
                <Info aria-hidden="true" />
                Figures shown as XX are awaiting verified data from the Training &amp; Placement Cell. The official page has the
                current record.
              </p>
            )}
            <LinkButton href={placements.officialUrl} variant="outline-dark" size="sm">
              Official placement page
            </LinkButton>
          </div>
          <div className="pl-stats__chart reveal">
            <PlacementChart data={placements.byYear} />
          </div>
        </div>
      </section>

      {/* Recruiters — logo wall */}
      <section id="recruiters" className="section section--sky" aria-labelledby="pl-rec-title">
        <div className="container">
          <SectionHead id="pl-rec-title" kicker="Recruiters" title="Companies that recruit on campus" />
          {recruiters.length ? (
            <ul className="pl-logos">
              {recruiters.map((r) => (
                <li key={r.name}>
                  {r.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.logo} alt={r.name} loading="lazy" />
                  ) : (
                    <span>{r.name}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="pl-logos pl-logos--empty">
              <ul aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <li key={i} style={{ ["--i" as string]: i }}>
                    <Building />
                  </li>
                ))}
              </ul>
              <div className="pl-logos__msg">
                <h3>Recruiter list coming soon</h3>
                <p>Logos appear here once the Training &amp; Placement Cell verifies the list of companies.</p>
                <LinkButton href={placements.officialUrl} variant="primary" size="sm">
                  See the official placement page
                </LinkButton>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Students & recruiters */}
      <section id="career" className="section" aria-labelledby="pl-career-title">
        <div className="container">
          <SectionHead id="pl-career-title" kicker="Get started" title="For students and recruiters" />
          <div className="pl-split">
            <article className="pl-split__card pl-split__card--students reveal">
              <span className="pl-split__icon">
                <GraduationCap aria-hidden="true" />
              </span>
              <h3>Students</h3>
              <ul className="ticks">
                <li>Register with the Training &amp; Placement Cell in your final year.</li>
                <li>Attend aptitude, communication and technical training.</li>
                <li>Apply for internships to build industry experience.</li>
                <li>Watch notices for pre-placement talks and drive schedules.</li>
              </ul>
              <div className="btn-row">
                <LinkButton href="/skill-development" variant="primary" size="sm">
                  Skill development
                </LinkButton>
                <LinkButton href="/contact" variant="outline-dark" size="sm">
                  Contact the college
                </LinkButton>
              </div>
            </article>
            <article className="pl-split__card pl-split__card--recruiters reveal">
              <span className="pl-split__icon">
                <Handshake aria-hidden="true" />
              </span>
              <h3>Recruiters</h3>
              <p>
                Companies interested in campus recruitment or internships can contact the Training &amp; Placement Cell to schedule
                a pre-placement talk and selection rounds.
              </p>
              <div className="btn-row">
                <LinkButton href="/contact" variant="premium" size="sm">
                  Partner with LBCE
                </LinkButton>
                <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Campus recruitment enquiry")}`} className="btn btn--outline btn--sm">
                  Email the college
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
