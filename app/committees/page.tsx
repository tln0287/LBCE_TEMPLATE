import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, Phone, Scale, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CommitteeExplorer } from "@/components/institution/CommitteeExplorer";
import { GROUP_ORDER, groupCommittees, type CommitteeItem } from "@/components/institution/committeeGroups";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { committees, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/committees");

const GROUP_TONE: Record<string, string> = { Statutory: "gold", "Student welfare": "blue", Academic: "navy", Other: "muted" };

/** Hero visual: every committee as a node around a hub, coloured by group; nodes link to the committee. */
function CommitteeHub({ list }: { list: CommitteeItem[] }) {
  const groups = groupCommittees(list);
  const ordered = groups.flatMap(([g, items]) => items.map((c) => ({ c, g })));
  const n = ordered.length;
  const R = 41; // % of the square
  return (
    <div className="cx-hub" role="group" aria-label={`${n} committees, grouped by type`}>
      <svg className="cx-hub__lines" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={R} className="cx-hub__orbit" />
        <circle cx="50" cy="50" r="27" className="cx-hub__orbit cx-hub__orbit--inner" />
        {ordered.map(({ c, g }, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={c.id}
              x1="50"
              y1="50"
              x2={50 + Math.cos(a) * R}
              y2={50 + Math.sin(a) * R}
              className={`cx-hub__spoke cx-hub__spoke--${GROUP_TONE[g]}`}
              style={{ ["--i" as string]: i }}
            />
          );
        })}
      </svg>
      <div className="cx-hub__core">
        <strong>{n}</strong>
        <span>committees</span>
      </div>
      {ordered.map(({ c, g }, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`cx-hub__node cx-hub__node--${GROUP_TONE[g]}`}
            style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%`, ["--i" as string]: i }}
          >
            <Icon name={c.icon} />
            <span className="cx-hub__tip">{c.name}</span>
          </a>
        );
      })}
      <ul className="cx-hub__legend" aria-hidden="true">
        {groups.map(([g, items]) => (
          <li key={g} className={`cx-hub__key cx-hub__key--${GROUP_TONE[g]}`}>
            {g} <b>{items.length}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

const HELP = [
  {
    icon: ShieldCheck,
    title: "Facing ragging?",
    text: "Ragging is not tolerated. Report it to the Anti-Ragging Committee, which investigates complaints and recommends action.",
    href: "#anti-ragging",
    cta: "Anti-Ragging Committee",
  },
  {
    icon: Scale,
    title: "Harassment complaint",
    text: "The Internal Complaints Committee handles complaints of sexual harassment confidentially, under the POSH Act.",
    href: "#icc",
    cta: "Internal Complaints Committee",
  },
  {
    icon: MessageSquare,
    title: "Any other concern",
    text: "Students, parents and staff can raise any grievance online with the Grievance Redressal Committee.",
    href: "/grievance#submit",
    cta: "Submit a grievance",
  },
];

export default function CommitteesPage() {
  const list = committees.committees as CommitteeItem[];
  const counts = groupCommittees(list);
  return (
    <>
      <PageHero
        kicker="Governance"
        title="Committees"
        text="Statutory and institutional committees that safeguard students and staff and keep academic life running fairly. Choose a committee to see what it does, who serves on it and how to reach it."
        crumbs={[{ label: "Committees" }]}
        aside={<CommitteeHub list={list} />}
      >
        <ul className="cx-stats" aria-label="Committees by type">
          {counts
            .sort((a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]))
            .map(([g, items]) => (
              <li key={g}>
                <strong>{items.length}</strong>
                <span>{g}</span>
              </li>
            ))}
        </ul>
      </PageHero>

      <section className="section cx-help-section" aria-labelledby="cx-help-title">
        <div className="container">
          <h2 id="cx-help-title" className="cx-help__title">
            Need help now?
          </h2>
          <ul className="cx-help">
            {HELP.map((h) => (
              <li key={h.title} className="reveal">
                <Link href={h.href} className="cx-help__card">
                  <span className="cx-help__icon">
                    <h.icon aria-hidden="true" />
                  </span>
                  <span className="cx-help__body">
                    <strong>{h.title}</strong>
                    <span>{h.text}</span>
                    <span className="cx-help__cta">
                      {h.cta} <ArrowRight aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--ivory cx-section" aria-labelledby="cx-dir-title">
        <div className="container">
          <div className="cx-section__head">
            <div>
              <span className="kicker">Directory</span>
              <h2 id="cx-dir-title">All committees</h2>
            </div>
            <p>Select a committee to see its responsibilities, members, documents and contact.</p>
          </div>
          <CommitteeExplorer committees={list} legacyUrl={committees.legacyUrl} />
        </div>
      </section>

      <section className="section cx-contact-section" aria-labelledby="cx-contact-title">
        <div className="container">
          <div className="cx-contact">
            <span className="cx-contact__icon">
              <Icon name="Network" />
            </span>
            <div className="cx-contact__text">
              <h2 id="cx-contact-title">Not sure which committee to contact?</h2>
              <p>Write to the college office and your message will be passed to the right committee.</p>
              <p className="cx-contact__links">
                <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}>
                  <Phone aria-hidden="true" /> {site.contact.phone}
                </a>
                <a href={`mailto:${site.contact.email}`}>
                  <Mail aria-hidden="true" /> {site.contact.email}
                </a>
              </p>
            </div>
            <div className="btn-row">
              <LinkButton href="/grievance" variant="premium">
                Submit a grievance
              </LinkButton>
              {committees.legacyUrl && (
                <LinkButton href={committees.legacyUrl} variant="outline">
                  Current committees page
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
