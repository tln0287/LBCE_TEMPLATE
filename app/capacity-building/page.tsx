import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ProgramCard, type ProgramRecord } from "@/components/campus/ProgramCard";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState, SectionHead } from "@/components/ui/Section";
import { programs, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/capacity-building");

const RELATED = [
  { href: "/skill-development", icon: "Target", title: "Skill Development", text: "Certifications, technical and soft skills." },
  { href: "/activities#fdp", icon: "BookOpen", title: "Faculty Development", text: "FDPs and training for faculty." },
  { href: "/activities#workshops", icon: "Presentation", title: "Workshops & Seminars", text: "Hands-on sessions and expert lectures." },
];

export default function CapacityBuildingPage() {
  const cb = programs.capacityBuilding;
  const list = cb.programs as ProgramRecord[];
  const legacy = cb.legacyUrl || site.externalLinks.capacityBuilding;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Activities", href: "/activities" }, { label: "Capacity Building" }]}
        kicker="Activities"
        title="Capacity Building Programs"
        text={cb.intro}
      />

      <section className="section section--ivory" aria-labelledby="cb-title">
        <div className="container">
          <SectionHead
            id="cb-title"
            kicker="Programs"
            title="Programs conducted"
            text="Each program lists its dates, organiser, participants, photos and report."
            action={
              <LinkButton href={legacy} variant="outline-dark" external>
                Records on the current site
              </LinkButton>
            }
          />
          {list.length ? (
            <ul className="prog-grid">
              {list.map((p, i) => (
                <li key={p.id ?? p.title} className="reveal" style={{ ["--delay" as string]: `${(i % 2) * 70}ms` }}>
                  <ProgramCard program={p} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Program records are being moved to the new website"
              action={
                <LinkButton href={legacy} variant="primary" external>
                  View capacity building programs
                </LinkButton>
              }
            >
              Until verified records are added here, the full list of capacity building programs, with reports and photos, is available on the current college website.
            </EmptyState>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="cb-related-title">
        <div className="container">
          <SectionHead id="cb-related-title" kicker="Related" title="More ways to build skills" />
          <ul className="grid grid--3">
            {RELATED.map((r) => (
              <li key={r.href} className="reveal">
                <Link href={r.href} className="card accent-top">
                  <span className="icon-badge">
                    <Icon name={r.icon} />
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <span className="link-arrow" aria-hidden="true">
                    Learn more <ArrowRight />
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
