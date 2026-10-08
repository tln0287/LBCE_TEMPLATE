import { Briefcase, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, SectionHead } from "@/components/ui/Section";
import { alumni } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/alumni");

type Profile = { name: string; year?: string | number; program?: string; organization?: string; position?: string; photo?: string };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function AlumniPage() {
  const profiles = alumni.profiles as Profile[];
  return (
    <>
      <PageHero
        kicker="Alumni"
        title="Our Alumni Network"
        text="Graduates working across industry, research and public service. Stay connected, mentor students and hear about reunions."
        crumbs={[{ label: "Alumni" }]}
      >
        <div className="btn-row">
          <LinkButton href={alumni.registrationUrl} variant="premium">
            Alumni Registration
          </LinkButton>
          <LinkButton href={alumni.portalUrl} variant="outline">
            Alumni Portal
          </LinkButton>
        </div>
      </PageHero>

      <section className="section alm" aria-labelledby="alm-title">
        <div className="container">
          <SectionHead id="alm-title" kicker="Alumni stories" title="Where our graduates are" />
          {profiles.length ? (
            <ul className="alm-grid">
              {profiles.map((p) => (
                <li key={p.name + (p.year ?? "")} className="alm-card reveal">
                  <div className="alm-card__photo">
                    {p.photo ? <Img src={p.photo} alt={p.name} width={400} height={400} sizes="160px" /> : <span aria-hidden="true">{initials(p.name)}</span>}
                  </div>
                  <h3 className="alm-card__name">{p.name}</h3>
                  {(p.program || p.year) && (
                    <p className="alm-card__meta">
                      <GraduationCap aria-hidden="true" />
                      {[p.program, p.year && `Class of ${p.year}`].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {(p.position || p.organization) && (
                    <p className="alm-card__job">
                      <Briefcase aria-hidden="true" />
                      <span>
                        {p.position}
                        {p.position && p.organization && " at "}
                        {p.organization && <strong>{p.organization}</strong>}
                      </span>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Alumni profiles are on their way">
              We only publish alumni stories that have been verified with the graduates themselves. Registered alumni can opt in
              through the alumni portal.
            </EmptyState>
          )}
        </div>
      </section>

      <section className="section section--ivory" aria-labelledby="alm-join-title">
        <div className="container alm-join">
          <div className="alm-join__card">
            <span className="kicker">Stay connected</span>
            <h2 id="alm-join-title">Are you an LBCE graduate?</h2>
            <p>Register with the alumni network to stay in touch with the college, mentor current students and hear about reunions and events.</p>
            <div className="btn-row">
              <LinkButton href={alumni.registrationUrl} variant="primary">
                Alumni Registration
              </LinkButton>
              <LinkButton href={alumni.portalUrl} variant="outline-dark">
                Alumni Portal
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
