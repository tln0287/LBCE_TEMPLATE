import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, SectionHead } from "@/components/ui/Section";
import { accreditation, getInstitutionPage, home, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/profile");

const GOVERNANCE = [
  { slug: "governing-body", icon: "Gavel" },
  { slug: "academic-council", icon: "Landmark" },
  { slug: "board-of-studies", icon: "BookOpen" },
  { slug: "iqac", icon: "ClipboardCheck" },
];

export default function ProfilePage() {
  const [history, approach] = home.intro.paragraphs;
  const facts = [
    { label: "Established", value: String(site.established), icon: "CalendarDays" },
    { label: "Location", value: "Visakhapatnam, Andhra Pradesh", icon: "MapPin" },
    { label: "Affiliation", value: "Andhra University", icon: "Landmark" },
    { label: "Approval", value: "AICTE, New Delhi", icon: "ShieldCheck" },
    { label: "EAPCET code", value: site.eapcetCode, icon: "GraduationCap" },
  ];

  return (
    <>
      <PageHero
        kicker="About LBCE"
        title="College Profile"
        text={`${site.name}: ${site.tagline.replace(/ • /g, ", ")}. ${site.affiliation}.`}
        crumbs={[{ label: "College Profile" }]}
        image={home.intro.image}
        imageAlt=""
      />

      <nav className="subnav" aria-label="On this page">
        <div className="container">
          <ul>
            {[
              ["history", "History"],
              ["vision", "Vision & Mission"],
              ["philosophy", "Academic Philosophy"],
              ["leadership", "Leadership"],
              ["governance", "Governance"],
              ["accreditation", "Accreditation"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* History */}
      <section id="history" className="section" aria-labelledby="history-title">
        <div className="container prof-history">
          <div className="prof-history__body">
            <SectionHead id="history-title" kicker="Our story" title="Engineering education in Visakhapatnam since 2010" />
            <div className="prose reveal">
              <p>{history}</p>
              {approach && <p>{approach}</p>}
            </div>
          </div>
          <dl className="prof-facts reveal">
            {facts.map((f) => (
              <div key={f.label} className="prof-fact">
                <span className="icon-badge" aria-hidden="true">
                  <Icon name={f.icon} />
                </span>
                <div>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Vision, Mission */}
      <section id="vision" className="section section--ivory" aria-labelledby="vm-title">
        <div className="container">
          <SectionHead id="vm-title" kicker="Purpose" title="Vision & Mission" />
          <div className="prof-vm">
            {home.intro.pillars
              .filter((p) => p.title !== "Philosophy")
              .map((p, i) => (
                <article key={p.title} className="prof-vm__card reveal" style={{ ["--delay" as string]: `${i * 80}ms` }}>
                  <span className="icon-badge icon-badge--gold" aria-hidden="true">
                    <Icon name={p.icon} />
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="section section--navy-grad" aria-labelledby="phil-title">
        <div className="container prof-phil">
          <SectionHead id="phil-title" kicker="Academic philosophy" title={home.intro.title} />
          <div className="prof-phil__grid">
            {home.intro.pillars.map((p, i) => (
              <div key={p.title} className="prof-phil__item reveal" style={{ ["--delay" as string]: `${i * 80}ms` }}>
                <span className="icon-badge icon-badge--dark" aria-hidden="true">
                  <Icon name={p.icon} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section" aria-labelledby="lead-title">
        <div className="container">
          <SectionHead id="lead-title" kicker="Leadership" title="Leadership" text="The people who guide the college's academic and administrative direction." />
          <div className="prof-lead">
            <div className="prof-lead__card reveal">
              <span className="prof-lead__avatar" aria-hidden="true">
                <Icon name="UserCheck" />
              </span>
              <span className="prof-lead__role">Principal</span>
              <span className="prof-lead__name">Profile to be published</span>
              <a href={`mailto:${site.contact.email}`} className="link-arrow">
                {site.contact.email}
              </a>
            </div>
          <EmptyState title="Leadership profiles are on their way">
            Names, photographs and messages from the college leadership will be published once they are supplied by the college
            office.
          </EmptyState>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section id="governance" className="section section--sky" aria-labelledby="gov-title">
        <div className="container">
          <SectionHead
            id="gov-title"
            kicker="Governance"
            title="How the college is governed"
            action={
              <LinkButton href="/committees" variant="outline-dark">
                All committees
              </LinkButton>
            }
          />
          <ul className="grid grid--4">
            {GOVERNANCE.map((g, i) => {
              const p = getInstitutionPage(g.slug);
              if (!p) return null;
              return (
                <li key={g.slug} className="reveal" style={{ ["--delay" as string]: `${i * 60}ms` }}>
                  <Link href={`/${g.slug}`} className="card accent-top prof-gov">
                    <span className="icon-badge" aria-hidden="true">
                      <Icon name={g.icon} />
                    </span>
                    <h3>{p.title}</h3>
                    <p>{p.intro}</p>
                    <span className="link-arrow">
                      Open <ArrowRight aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Accreditation strip */}
      <section id="accreditation" className="section section--ivory" aria-labelledby="prof-accr-title">
        <div className="container">
          <SectionHead id="prof-accr-title" kicker="Accreditation" title="Accreditation & compliance" text={`${site.affiliation}.`} />
          <ul className="accr-grid">
            {accreditation.bodies.map((b, i) => (
              <li key={b.slug} className="reveal" style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }}>
                <Link href={`/${b.slug}`} className="accr-card">
                  <span className="accr-card__icon">
                    <Icon name={b.icon} />
                  </span>
                  <span className="accr-card__name">{b.name}</span>
                  <span className="accr-card__full">{b.full}</span>
                  <span className="accr-card__meta">
                    View details <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
