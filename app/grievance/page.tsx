import { Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { FormShell } from "@/components/forms/FormShell";
import { emailField, nameField, opts, phoneField, type FieldDef } from "@/components/forms/types";
import { committees, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/grievance", {
  title: "Grievance Redressal",
  description: `Raise a grievance with the Grievance Redressal Committee of ${site.name}. See the procedure, who can apply and how to contact the office.`,
});

const fields: FieldDef[] = [
  nameField({ required: true }),
  {
    name: "role",
    label: "I am a",
    type: "choice",
    required: true,
    requiredMessage: "Choose whether you are a student, parent, staff member or other",
    options: opts("Student", "Parent", "Staff", "Other"),
  },
  {
    name: "idNumber",
    label: "Roll number or employee number",
    type: "text",
    hint: "Helps the committee find your records faster.",
    maxLength: 30,
    autoComplete: "off",
    width: "half",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    requiredMessage: "Choose the category that best fits your grievance",
    placeholder: "Select a category",
    options: opts(
      "Academic (teaching, attendance, internal marks)",
      "Examination and results",
      "Fees, scholarships and certificates",
      "Hostel and transport",
      "Infrastructure and facilities",
      "Harassment or discrimination",
      "Administration",
      "Other",
    ),
    width: "half",
  },
  emailField({ required: true }),
  phoneField({ required: true }),
  {
    name: "subject",
    label: "Subject",
    type: "text",
    required: true,
    requiredMessage: "Enter a short subject, for example “Internal marks not updated”",
    maxLength: 150,
  },
  {
    name: "description",
    label: "Describe your grievance",
    type: "textarea",
    required: true,
    requiredMessage: "Describe your grievance: what happened, when, and who was involved",
    hint: "Include dates, places and the people or offices involved. Do not include passwords or bank details.",
    minLength: 30,
    maxLength: 3000,
    rows: 7,
  },
  {
    name: "consent",
    label:
      "I confirm the information above is true, and I agree that the Grievance Redressal Committee may use it to look into my grievance and contact me.",
    type: "checkbox",
    required: true,
    requiredMessage: "Tick the confirmation box so the committee can act on your grievance",
  },
];

const steps = [
  { title: "Submit your grievance", text: "Use the form on this page, email the office or hand in a written complaint at the college office. Give your contact details so the committee can reach you." },
  { title: "Acknowledgement", text: "The office records the grievance and acknowledges it using the contact details you provided." },
  { title: "Review by the committee", text: "The Grievance Redressal Committee examines the grievance and may ask you or others for more information or a hearing." },
  { title: "Decision and communication", text: "The committee decides on the action to take and communicates the decision to you." },
  { title: "Follow-up", text: "If you are not satisfied with the outcome, contact the office and quote your original grievance to ask about next steps." },
];

export default function GrievancePage() {
  const committee = committees.committees.find((c) => c.id === "grievance");
  const members = (committee?.members ?? []) as { name: string; role: string }[];
  const tel = `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <PageHero
        kicker="Student & staff services"
        title="Grievance Redressal"
        text="Students, parents and staff can raise a concern with the Grievance Redressal Committee. Every grievance is recorded, reviewed and answered."
        crumbs={[{ label: "Grievance Redressal" }]}
      >
        <div className="btn-row">
          <a href="#submit" className="btn btn--premium">
            Submit a grievance
          </a>
          <a href="#procedure" className="btn btn--outline">
            See the procedure
          </a>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="grv-about">
        <div className="container split">
          <div className="block">
            <SectionHead
              id="grv-about"
              kicker="About"
              title="A fair hearing for every concern"
              text={committee?.purpose ?? "The committee hears and resolves grievances of students and staff."}
            />
            <div className="grid grid--3 grv-cards">
              <div className="card accent-top">
                <span className="icon-badge">
                  <Icon name="Users" />
                </span>
                <h3>Who can apply</h3>
                <p>Current students, their parents or guardians, and teaching and non-teaching staff of the college.</p>
              </div>
              <div className="card accent-top">
                <span className="icon-badge">
                  <Icon name="ClipboardCheck" />
                </span>
                <h3>What you can raise</h3>
                <p>Academic, examination, fee, certificate, hostel, transport, facility and administrative concerns.</p>
              </div>
              <div className="card accent-top">
                <span className="icon-badge">
                  <Icon name="ShieldCheck" />
                </span>
                <h3>Confidential handling</h3>
                <p>Details are shared only with the committee members and offices needed to resolve the grievance.</p>
              </div>
            </div>
            <PlaceholderNote>
              Complaints of sexual harassment are handled by the Internal Complaints Committee, and ragging complaints by the
              Anti-Ragging Committee. See <SmartLink href="/committees">Committees</SmartLink> for both.
            </PlaceholderNote>
          </div>

          <aside className="split__aside" aria-label="Committee">
            <div className="info-panel info-panel--navy grv-committee">
              <h2>{committee?.name ?? "Grievance Redressal Committee"}</h2>
              {committee && (
                <ul className="ticks">
                  {committee.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              )}
              <h3>Members</h3>
              {members.length > 0 ? (
                <ul className="grv-members">
                  {members.map((m) => (
                    <li key={m.name}>
                      <strong>{m.name}</strong>
                      <span>{m.role}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>The current list of committee members will be published here once the college confirms it.</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="procedure" className="section section--ivory" aria-labelledby="grv-proc">
        <div className="container">
          <SectionHead id="grv-proc" kicker="Procedure" title="How a grievance is handled" text="Five steps, from submission to decision." />
          <ol className="process frm-steps">
            {steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="frm-muted">
            The office can tell you the expected timeline and the current status of your grievance. Quote your name, the
            date you submitted it and its subject.
          </p>
        </div>
      </section>

      <section id="submit" className="section" aria-labelledby="grv-form-title">
        <div className="container frm-layout">
          <div className="frm-card">
            <div className="frm-card__head">
              <span className="kicker">Submit online</span>
              <h2 id="grv-form-title">Submit a grievance</h2>
              <p>Tell us what happened. The more specific you are, the faster the committee can act.</p>
            </div>
            <FormShell
              formName="grievance"
              fields={fields}
              submitLabel="Submit grievance"
              successTitle="Grievance submitted"
              successText="The office will acknowledge it using the email or phone number you gave."
              endpoint={site.forms.endpoint}
              fallback={{ email: site.contact.email, phone: site.contact.phone, office: "college office" }}
              mailSubject="Grievance"
              privacyNote="Your details go only to the Grievance Redressal Committee. We never ask for passwords or payment details."
            />
          </div>

          <aside className="frm-trust" aria-label="Privacy and other ways to reach us">
            <div className="frm-trust__item">
              <Lock aria-hidden="true" />
              <div>
                <h3>Your privacy</h3>
                <p>Your grievance is seen only by the committee and the offices needed to resolve it.</p>
              </div>
            </div>
            <div className="frm-trust__item">
              <ShieldCheck aria-hidden="true" />
              <div>
                <h3>What we never ask for</h3>
                <p>Passwords, OTPs, bank or card details. If anyone asks for these in the college&rsquo;s name, report it.</p>
              </div>
            </div>
            <hr />
            <h3>Prefer another way?</h3>
            <ul className="frm-trust__contacts">
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${site.contact.email}?subject=Grievance`}>{site.contact.email}</a>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href={tel}>{site.contact.phone}</a>
              </li>
              <li>
                <MapPin aria-hidden="true" />
                <span>In writing at the college office, {site.contact.address}</span>
              </li>
            </ul>
            <SmartLink href={site.externalLinks.grievance} className="link-arrow">
              Grievance page on the previous website <Icon name="ArrowUpRight" />
            </SmartLink>
          </aside>
        </div>
      </section>

    </>
  );
}
