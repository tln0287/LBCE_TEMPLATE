import { FileText, Lock, Mail, Phone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { FormShell } from "@/components/forms/FormShell";
import { emailField, opts, phoneField, type FieldDef } from "@/components/forms/types";
import { departments, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/bgv", {
  title: "Background Verification",
  description: `Employers and verification agencies can request confirmation of a graduate's academic credentials from ${site.name}.`,
});

const verifiable = [
  { icon: "GraduationCap", title: "Degree and program", text: "That the candidate studied the program stated and completed it." },
  { icon: "CalendarDays", title: "Period of study", text: "Year of admission and year of passing." },
  { icon: "UserCheck", title: "Roll number and identity", text: "That the roll number matches the candidate's name in college records." },
  { icon: "FileSearch", title: "Documents issued", text: "Whether a certificate or memorandum of marks submitted to you was issued by the college." },
];

const documents = [
  "A letter on your organisation's letterhead requesting verification",
  "The candidate's signed consent or authorisation for the check",
  "Copies of the certificates or marks memos to be verified",
  "The candidate's full name, roll number, program and year of passing",
];

const steps = [
  { title: "Send the request", text: "Fill in the form below or email the office with the details of the candidate and the documents to be checked." },
  { title: "Send supporting documents", text: "Email the candidate's signed authorisation and copies of the documents. Verification starts only once these arrive." },
  { title: "Records check", text: "The college checks the details against its academic records." },
  { title: "Verification report", text: "The college replies to the official email address you gave with the result of the check." },
];

const programOptions = opts(...departments.flatMap((d) => d.programs.map((p) => p.name)), "Other (state in the notes)");

const fields: FieldDef[] = [
  { name: "organisation", label: "Organisation name", type: "text", required: true, autoComplete: "organization", maxLength: 150, width: "half", requiredMessage: "Enter the name of your organisation or agency" },
  { name: "contactPerson", label: "Contact person", type: "text", required: true, autoComplete: "name", maxLength: 120, width: "half", requiredMessage: "Enter the name of the person we should reply to" },
  emailField({ label: "Official email address", required: true, hint: "Use your organisation's email. The report is sent only to this address." }),
  phoneField({ required: true }),
  { name: "candidateName", label: "Candidate's full name", type: "text", required: true, maxLength: 120, width: "half", hint: "As it appears on the certificate.", requiredMessage: "Enter the candidate's full name as on the certificate" },
  { name: "rollNumber", label: "Roll number", type: "text", required: true, maxLength: 30, width: "half", autoComplete: "off", requiredMessage: "Enter the candidate's roll number" },
  { name: "program", label: "Program", type: "select", required: true, options: programOptions, width: "half", requiredMessage: "Choose the candidate's program" },
  {
    name: "passingYear",
    label: "Year of passing",
    type: "text",
    inputMode: "numeric",
    pattern: "^(19|20)[0-9]{2}$",
    patternMessage: "Enter a four-digit year, for example 2019",
    maxLength: 4,
    required: true,
    width: "half",
  },
  { name: "notes", label: "Documents to verify and other notes", type: "textarea", rows: 4, maxLength: 1500, hint: "For example: B.Tech provisional certificate and consolidated marks memo." },
  {
    name: "attachNote",
    type: "note",
    text: `This form does not take file uploads. After you submit, email the candidate's signed authorisation and copies of the documents to ${site.contact.email}, quoting the candidate's name and roll number.`,
  },
  {
    name: "consent",
    type: "checkbox",
    label: "I confirm that I am authorised by my organisation to make this request and that I hold the candidate's consent for this verification.",
    required: true,
    requiredMessage: "Confirm that you are authorised and hold the candidate's consent",
  },
];

export default function BgvPage() {
  const tel = `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`;
  return (
    <>
      <PageHero
        kicker="For employers and agencies"
        title="Background Verification"
        text="Confirm the academic credentials of a graduate of the college. Send a request with the candidate's consent and the college checks it against its records."
        crumbs={[{ label: "Background Verification" }]}
      >
        <div className="btn-row">
          <a href="#request" className="btn btn--premium">
            Request verification
          </a>
          <SmartLink href={site.externalLinks.bgv} className="btn btn--outline">
            Previous BGV page <Icon name="ArrowUpRight" className="arrow" />
          </SmartLink>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="bgv-what">
        <div className="container">
          <SectionHead id="bgv-what" kicker="Scope" title="What the college can verify" text="Verification covers academic records held by the college." />
          <ul className="grid grid--4 bgv-scope">
            {verifiable.map((v) => (
              <li key={v.title} className="card accent-top">
                <span className="icon-badge">
                  <Icon name={v.icon} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--ivory" aria-labelledby="bgv-how">
        <div className="container bgv-how">
          <div>
            <SectionHead id="bgv-how" kicker="Process" title="How verification works" />
            <ol className="process frm-steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bgv-side">
            <div className="info-panel">
              <h3>
                <FileText aria-hidden="true" className="bgv-ico" /> Documents required
              </h3>
              <ul className="ticks">
                {documents.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="info-panel info-panel--navy">
              <h3>Turnaround and fees</h3>
              <p>
                Turnaround time and any verification fee are confirmed by the office when you send your request. Contact the
                office on <a href={tel}>{site.contact.phone}</a> or <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="request" className="section" aria-labelledby="bgv-form-title">
        <div className="container frm-layout">
          <div className="frm-card">
            <div className="frm-card__head">
              <span className="kicker">Verification request</span>
              <h2 id="bgv-form-title">Request a verification</h2>
              <p>All fields except notes are required so the office can find the right record.</p>
            </div>
            <FormShell
              formName="background-verification"
              fields={fields}
              submitLabel="Send verification request"
              successTitle="Verification request sent"
              successText="Now email the candidate's signed authorisation and document copies so the office can start the check."
              endpoint={site.forms.endpoint}
              fallback={{ email: site.contact.email, phone: site.contact.phone, office: "college office" }}
              mailSubject="Background verification request"
              privacyNote="Candidate details are used only for this verification and shared only with your organisation."
            />
          </div>

          <aside className="frm-trust" aria-label="Data protection and contact">
            <div className="frm-trust__item">
              <ShieldCheck aria-hidden="true" />
              <div>
                <h3>Consent first</h3>
                <p>Include the candidate&rsquo;s signed authorisation with every request. It protects the candidate&rsquo;s records.</p>
              </div>
            </div>
            <div className="frm-trust__item">
              <Lock aria-hidden="true" />
              <div>
                <h3>Official channels only</h3>
                <p>Send requests to, and expect replies from, the college&rsquo;s official email address below. Treat any other sender with caution.</p>
              </div>
            </div>
            <hr />
            <h3>Verification office</h3>
            <ul className="frm-trust__contacts">
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${site.contact.email}?subject=Background verification`}>{site.contact.email}</a>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href={tel}>{site.contact.phone}</a>
              </li>
            </ul>
            <SmartLink href={site.externalLinks.bgv} className="link-arrow">
              BGV page on the previous website <Icon name="ArrowUpRight" />
            </SmartLink>
          </aside>
        </div>
      </section>
    </>
  );
}
