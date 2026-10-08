import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/careers", {
  title: "Careers",
  description: `Faculty and staff openings at ${site.name}, Visakhapatnam, and how to apply.`,
});

/** Openings stay empty until the college publishes them; the page then lists each one. */
type Opening = { title: string; department: string; type: string; qualification: string; lastDate?: string };
const openings: Opening[] = [];

const cvMail = `mailto:${site.contact.email}?subject=${encodeURIComponent("CV for faculty/staff positions")}`;

const steps = [
  { title: "Check the opening", text: "Read the qualification and experience required for the post." },
  { title: "Prepare your application", text: "A cover letter naming the post, your CV, and copies of degree certificates and experience letters as one PDF." },
  { title: "Email the application", text: `Send it to ${site.contact.email} with the post and department in the subject line.` },
  { title: "Shortlisting and interview", text: "Shortlisted candidates are contacted by email or phone with the interview details." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Work with us"
        title="Careers"
        text="Teaching and non-teaching openings at the college are listed here. You can also send your CV for future openings."
        crumbs={[{ label: "Careers" }]}
      />

      <section className="section" aria-labelledby="car-open">
        <div className="container">
          <SectionHead id="car-open" kicker="Openings" title="Current openings" />
          {openings.length === 0 ? (
            <EmptyState
              title="No openings are listed right now"
              action={
                <div className="btn-row">
                  <a href={cvMail} className="btn btn--primary">
                    <Mail aria-hidden="true" /> Email your CV
                  </a>
                  <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`} className="btn btn--outline-dark">
                    <Phone aria-hidden="true" /> Call {site.contact.phone}
                  </a>
                </div>
              }
            >
              {`New faculty and staff positions will be posted here. To be considered for future openings, email your CV to ${site.contact.email} with the department and post you are interested in.`}
            </EmptyState>
          ) : (
            <ul className="grid grid--2">
              {openings.map((o) => (
                <li key={o.title + o.department} className="card accent-top">
                  <span className="tag">{o.department} · {o.type}</span>
                  <h3>{o.title}</h3>
                  <p>{o.qualification}</p>
                  {o.lastDate && <p>Last date: {o.lastDate}</p>}
                  <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Application: ${o.title}, ${o.department}`)}`} className="link-arrow">
                    Apply by email <Icon name="ArrowRight" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section section--ivory" aria-labelledby="car-how">
        <div className="container adm-two">
          <div>
            <SectionHead id="car-how" kicker="How to apply" title="Applying for a position" />
            <ol className="process frm-steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="info-panel info-panel--navy">
            <h3>Types of positions</h3>
            <ul className="ticks">
              <li>Teaching faculty for the engineering departments</li>
              <li>Laboratory and technical staff</li>
              <li>Administrative and support staff</li>
            </ul>
            <p>
              If anyone asks you for money in the college&rsquo;s name for a job or an interview, check with the office first at{" "}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
