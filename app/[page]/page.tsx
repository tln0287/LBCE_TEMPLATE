import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { DocList } from "@/components/ui/DocCard";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { EmptyState, PlaceholderNote } from "@/components/ui/Section";
import { accreditation, getInstitutionPage, institutionPages, site } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return institutionPages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const data = getInstitutionPage(page);
  return pageMeta(`/${page}`, data ? { title: data.title, description: data.intro } : {});
}

/** Bodies whose official figures (grades, ranks, approval or certificate numbers) are only ever shown from published documents. */
const VERIFIED_ONLY: Record<string, string> = {
  naac: "The accreditation grade and validity period are shown only from the official NAAC certificate once it is published here.",
  aicte: "Approval letter references and approved intake are shown only from the official AICTE Extension of Approval documents.",
  nirf: "Rankings and submitted data are shown only from the official NIRF documents.",
  iso: "The standard, certifying body and certificate number are shown only from the official ISO certificate.",
};

const ICON_FOR: Record<string, string> = {
  "governing-body": "Gavel",
  "academic-council": "Landmark",
  "board-of-studies": "BookOpen",
  reports: "BarChart3",
  downloads: "Download",
};
const iconFor = (slug: string) =>
  ICON_FOR[slug] ?? accreditation.bodies.find((b) => b.slug === slug)?.icon ?? "FileText";

const PEOPLE_LABEL: Record<string, string> = { rti: "Information officers" };

export default async function InstitutionPageView({ params }: { params: Promise<{ page: string }> }) {
  const { page: slug } = await params;
  const page = getInstitutionPage(slug);
  if (!page) notFound();

  const peopleTitle = PEOPLE_LABEL[slug] ?? "Members";
  const sectionId = (title: string, id?: string) => id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const toc = [
    ...page.sections.map((s) => ({ id: sectionId(s.title, s.id), label: s.title })),
    { id: "people", label: peopleTitle },
    ...(page.reportTypes?.length ? [{ id: "reports-list", label: "Reports" }] : []),
    ...(page.timeline.length ? [{ id: "timeline", label: "Timeline" }] : []),
    { id: "documents", label: "Documents" },
  ];
  const related = institutionPages.filter((p) => p.slug !== slug);
  const sameGroup = related.filter((p) => p.kicker === page.kicker);
  const others = related.filter((p) => p.kicker !== page.kicker);

  return (
    <>
      <PageHero kicker={page.kicker} title={page.title} text={page.intro} crumbs={[{ label: page.title }]} />

      <section className="section inst">
        <div className="container split">
          <div className="inst__main">
            {VERIFIED_ONLY[slug] && <PlaceholderNote>{VERIFIED_ONLY[slug]}</PlaceholderNote>}

            {page.sections.map((s, i) => (
              <section key={s.title} id={sectionId(s.title, s.id)} className="inst-block reveal" aria-labelledby={`h-${sectionId(s.title, s.id)}`}>
                <header className="inst-block__head">
                  <span className="inst-block__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`h-${sectionId(s.title, s.id)}`}>{s.title}</h2>
                </header>
                <ul className="ticks inst-block__list">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section id="people" className="inst-block reveal" aria-labelledby="h-people">
              <header className="inst-block__head">
                <span className="inst-block__icon" aria-hidden="true">
                  <Icon name="Users" />
                </span>
                <h2 id="h-people">{peopleTitle}</h2>
              </header>
              {page.people.length ? (
                <div className="table-wrap">
                  <table className="table table--stack">
                    <caption className="sr-only">
                      {page.title}: {peopleTitle.toLowerCase()}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Role</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.people.map((p) => (
                        <tr key={p.name + p.role}>
                          <td data-label="Name">
                            <strong className="inst-person">{p.name}</strong>
                          </td>
                          <td data-label="Role">{p.role}</td>
                          <td data-label="Designation">{p.designation ?? "—"}</td>
                          <td data-label="Contact">
                            {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
                            {p.email && p.phone && <br />}
                            {p.phone && <a href={`tel:${p.phone.replace(/[^\d+]/g, "")}`}>{p.phone}</a>}
                            {!p.email && !p.phone && "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title={`${peopleTitle} will be listed here`}>
                  The official composition of the {page.title} will be published once it is supplied by the college office.
                  {page.legacyUrl ? " Meanwhile, the current website may carry the latest list." : ""}
                </EmptyState>
              )}
            </section>

            {page.reportTypes?.length ? (
              <section id="reports-list" className="inst-block reveal" aria-labelledby="h-reports-list">
                <header className="inst-block__head">
                  <span className="inst-block__icon" aria-hidden="true">
                    <Icon name="ClipboardCheck" />
                  </span>
                  <h2 id="h-reports-list">Reports</h2>
                </header>
                <ul className="inst-reports">
                  {page.reportTypes.map((r) => {
                    const docs = page.documents.filter((d) => d.title.toLowerCase().includes(r.toLowerCase().split(" ")[0]));
                    return (
                      <li key={r} className="inst-report">
                        <span className="icon-badge" aria-hidden="true">
                          <Icon name="FileText" />
                        </span>
                        <div>
                          <h3>{r}</h3>
                          <p className="inst-report__status">
                            {docs.length ? (
                              `${docs.length} document${docs.length > 1 ? "s" : ""} published`
                            ) : (
                              <>
                                <Clock aria-hidden="true" /> Awaiting upload
                              </>
                            )}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {page.timeline.length > 0 && (
              <section id="timeline" className="inst-block reveal" aria-labelledby="h-timeline">
                <header className="inst-block__head">
                  <span className="inst-block__icon" aria-hidden="true">
                    <Icon name="CalendarDays" />
                  </span>
                  <h2 id="h-timeline">Timeline</h2>
                </header>
                <ol className="inst-timeline">
                  {page.timeline.map((t) => (
                    <li key={t.date + t.title}>
                      <time dateTime={t.date}>{/^\d{4}-\d{2}-\d{2}$/.test(t.date) ? formatDate(t.date) : t.date}</time>
                      <h3>{t.title}</h3>
                      {t.text && <p>{t.text}</p>}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section id="documents" className="inst-block reveal" aria-labelledby="h-documents">
              <header className="inst-block__head">
                <span className="inst-block__icon" aria-hidden="true">
                  <Icon name="FileText" />
                </span>
                <h2 id="h-documents">Documents</h2>
              </header>
              {page.documents.length ? (
                <DocList docs={page.documents} />
              ) : (
                <EmptyState
                  title="Documents are being uploaded"
                  action={
                    page.legacyUrl ? (
                      <SmartLink href={page.legacyUrl} className="link-arrow">
                        View on the current website <ExternalLink aria-hidden="true" />
                      </SmartLink>
                    ) : undefined
                  }
                >
                  Official {page.title} documents will appear here as they are published.
                </EmptyState>
              )}
            </section>
          </div>

          <aside className="split__aside" aria-label="Related information">
            <nav className="info-panel inst-toc" aria-label="On this page">
              <h2>On this page</h2>
              <ul>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {page.legacyUrl && (
              <SmartLink href={page.legacyUrl} className="inst-legacy">
                <ExternalLink aria-hidden="true" />
                <span>View on the current website</span>
              </SmartLink>
            )}

            <nav className="info-panel inst-related" aria-label="Related bodies">
              <h2>Related</h2>
              <ul>
                {[...sameGroup, ...others].slice(0, 8).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/${p.slug}`}>
                      <Icon name={iconFor(p.slug)} />
                      <span>{p.title}</span>
                      <ArrowRight className="inst-related__arrow" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/committees">
                    <Icon name="Network" />
                    <span>Committees</span>
                    <ArrowRight className="inst-related__arrow" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="info-panel info-panel--navy inst-contact">
              <h2>Contact</h2>
              <p>For queries about the {page.title}, contact the college office.</p>
              <ul>
                <li>
                  <Phone aria-hidden="true" />
                  <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}>{site.contact.phone}</a>
                </li>
                <li>
                  <Mail aria-hidden="true" />
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </li>
                <li>
                  <MapPin aria-hidden="true" />
                  <span>{site.contact.address}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
