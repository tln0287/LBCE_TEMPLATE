import Link from "next/link";
import { ArrowRight, ArrowUpRight, CreditCard, Lock, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { FormShell } from "@/components/forms/FormShell";
import { emailField, nameField, opts, phoneField, type FieldDef } from "@/components/forms/types";
import { academics, departments, fill, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/admissions", {
  title: `Admissions ${site.academicYear}`,
  description: `Admissions ${site.academicYear} at ${site.name}, Visakhapatnam. B.Tech through AP EAPCET (college code ${site.eapcetCode}), polytechnic diploma, eligibility, process, documents and online fee payment.`,
});

const tel = `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`;

const steps = [
  { title: "Take AP EAPCET", text: "Register for and write the AP EAPCET entrance test in the engineering stream." },
  { title: "Attend certificate verification", text: "Verify your certificates during AP EAPCET counselling, as scheduled by the counselling authority." },
  { title: `Choose code ${site.eapcetCode} in web options`, text: `List ${site.shortName} using college code ${site.eapcetCode} and order your preferred branches.` },
  { title: "Get your seat allotment", text: "Download the allotment order once seats are allotted, and pay the fee as instructed in the order." },
  { title: "Report to the college", text: "Report at the college office with your allotment order and original documents to confirm admission." },
];

const documents = [
  "AP EAPCET hall ticket and rank card",
  "Seat allotment order and fee payment receipt",
  "SSC (Class 10) marks memo",
  "Intermediate (10+2) or equivalent marks memo",
  "Study certificates (Class 6 to Intermediate)",
  "Transfer certificate",
  "Aadhaar card",
  "Caste, income or EWS certificate, if applicable",
  "Passport-size photographs",
];

const faqs = [
  { q: "What is the college's AP EAPCET code?", a: `${site.eapcetCode}. Use this code when you enter web options during AP EAPCET counselling.` },
  {
    q: "Which B.Tech branches does the college offer?",
    a: `${departments.map((d) => d.name).join(", ")}.`,
  },
  { q: "Is the college approved and affiliated?", a: `Yes. ${site.affiliation}.` },
  {
    q: `Are polytechnic diploma admissions open for ${site.academicYear}?`,
    a: site.admissionsOpen
      ? `Yes, diploma admissions are open for ${site.academicYear}. Send an enquiry or call ${site.contact.phone} for eligibility and the admission process.`
      : `Diploma admissions for ${site.academicYear} are not open yet. Watch this page and the announcements for dates.`,
  },
  {
    q: "What are the fees and last year's cut-off ranks?",
    a: `They are not published on this website yet. Call the office on ${site.contact.phone} or email ${site.contact.email} for the current fee structure.`,
  },
  {
    q: "How do I pay fees online?",
    a: "Use the Pay online button on this page. It opens CCAvenue's secure payment page in a new tab, where you enter the student's details and pay. Keep the receipt it gives you.",
  },
  {
    q: "Can I visit the campus before taking admission?",
    a: `Call the office on ${site.contact.phone} to arrange a visit. Directions are on the Contact page.`,
  },
];

const enquiryFields: FieldDef[] = [
  nameField({ required: true, label: "Student's full name", requiredMessage: "Enter the student's full name" }),
  phoneField({ required: true }),
  emailField({ required: true }),
  {
    name: "program",
    label: "Program of interest",
    type: "select",
    required: true,
    placeholder: "Select a program",
    requiredMessage: "Choose the program you are interested in",
    width: "half",
    options: [
      ...departments.map((d) => ({ value: d.programs[0]?.name ?? d.name, label: d.programs[0]?.name ?? d.name })),
      ...opts("Polytechnic Diploma", "M.Tech / PG programs", "Not sure yet"),
    ],
  },
  {
    name: "message",
    label: "Your question",
    type: "textarea",
    hint: "For example, your EAPCET rank, a question about hostels, or a good time to call you.",
    maxLength: 1500,
    rows: 5,
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        kicker={site.admissionsOpen ? `Admissions open · ${site.academicYear}` : `Admissions ${site.academicYear}`}
        title={`Admissions ${site.academicYear}`}
        text={`Join ${site.shortName} through AP EAPCET counselling using college code ${site.eapcetCode}. ${site.affiliation}.`}
        crumbs={[{ label: "Admissions" }]}
      >
        <div className="btn-row">
          <a href="#apply" className="btn btn--premium">
            Apply now <ArrowRight className="arrow" aria-hidden="true" />
          </a>
          <a href={site.externalLinks.onlinePayment} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            <CreditCard aria-hidden="true" /> Pay fees online
            <span className="sr-only"> (opens CCAvenue in a new tab)</span>
          </a>
        </div>
        <p className="adm-code" aria-label={`AP EAPCET college code ${site.eapcetCode}`}>
          <span>AP EAPCET code</span>
          <strong>{site.eapcetCode}</strong>
        </p>
      </PageHero>

      <nav className="subnav" aria-label="On this page">
        <div className="container">
          <ul>
            <li><a href="#programs">Programs</a></li>
            <li><a href="#eligibility">Eligibility</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#documents">Documents</a></li>
            <li><a href="#pay">Pay online</a></li>
            <li><a href="#apply">Enquire</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
      </nav>

      <section id="programs" className="section" aria-labelledby="adm-programs">
        <div className="container">
          <SectionHead id="adm-programs" kicker="Programs" title="Programs offered" text="Undergraduate engineering, with diploma and postgraduate options." />
          <ul className="grid grid--3 adm-levels">
            {academics.programs.map((p) => (
              <li key={p.name} className="card accent-top">
                <span className="icon-badge">
                  <Icon name={p.icon} />
                </span>
                <span className="tag">{p.level} · {p.duration}</span>
                <h3>{p.name}</h3>
                <p>{fill(p.text)}</p>
              </li>
            ))}
          </ul>

          <h3 className="adm-sub">B.Tech branches</h3>
          <ul className="adm-branches">
            {departments.map((d) => (
              <li key={d.slug}>
                <Link href={`/departments/${d.slug}`} className="adm-branch">
                  <span className="icon-badge">
                    <Icon name={d.icon} />
                  </span>
                  <span>
                    <strong>{d.programs[0]?.name ?? d.name}</strong>
                    <span>{d.programs[0]?.duration ?? "4 years"} · Intake to be published</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="adm-branch__arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="eligibility" className="section section--ivory" aria-labelledby="adm-elig">
        <div className="container">
          <SectionHead id="adm-elig" kicker="Eligibility" title="Who can apply" />
          <div className="grid grid--3">
            <div className="card adm-elig">
              <h3>B.Tech (first year)</h3>
              <ul className="ticks">
                <li>Intermediate (10+2) or equivalent with Mathematics, Physics and Chemistry</li>
                <li>A valid AP EAPCET rank in the engineering stream</li>
                <li>Admission through AP EAPCET counselling using code <strong>{site.eapcetCode}</strong></li>
              </ul>
            </div>
            <div className="card adm-elig">
              <h3>Polytechnic Diploma</h3>
              <ul className="ticks">
                <li>{site.admissionsOpen ? `Admissions open for ${site.academicYear}, as announced by the college` : "Admission dates will be announced"}</li>
                <li>Eligibility and process are confirmed by the admissions office</li>
              </ul>
            </div>
            <div className="card adm-elig">
              <h3>M.Tech / PG programs</h3>
              <ul className="ticks">
                <li>Offered where approved; to be confirmed by the college</li>
                <li>Contact the office for availability</li>
              </ul>
            </div>
          </div>
          <PlaceholderNote>
            Eligibility follows the rules of AP EAPCET and Andhra University for the year. Cut-off ranks, intake and fees are not
            published here yet; call {site.contact.phone} for current figures.
          </PlaceholderNote>
        </div>
      </section>

      <section id="process" className="section" aria-labelledby="adm-proc">
        <div className="container adm-two">
          <div>
            <SectionHead id="adm-proc" kicker="Process" title="How to get admission to B.Tech" />
            <ol className="process frm-steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div id="documents" className="adm-docs">
            <h2 className="adm-docs__title">Documents checklist</h2>
            <p>Bring the originals and photocopies when you report to the college.</p>
            <ul className="adm-checklist">
              {documents.map((d) => (
                <li key={d}>
                  <Icon name="CheckCircle2" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <p className="frm-muted">The office confirms the final list at the time of admission.</p>
          </div>
        </div>
      </section>

      <section id="pay" className="section section--navy-grad adm-pay" aria-labelledby="adm-pay-title">
        <div className="container adm-pay__inner">
          <div className="adm-pay__text">
            <span className="kicker">Fee payment</span>
            <h2 id="adm-pay-title">Pay fees online</h2>
            <p>
              Pay admission and tuition fees online. The button opens CCAvenue&rsquo;s secure payment page in a new tab; you
              enter payment details there, never on this website.
            </p>
          </div>
          <div className="adm-pay__card">
            <span className="adm-pay__icon" aria-hidden="true">
              <CreditCard />
            </span>
            <a href={site.externalLinks.onlinePayment} target="_blank" rel="noopener noreferrer" className="btn btn--premium">
              Pay online on CCAvenue <ArrowUpRight className="arrow" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="adm-pay__note">
              <Lock aria-hidden="true" />
              <span>Secure payment by CCAvenue. Save the receipt and bring a copy to the college office.</span>
            </p>
          </div>
        </div>
      </section>

      <section id="apply" className="section section--sky" aria-labelledby="adm-apply" tabIndex={-1}>
        <div className="container frm-layout">
          <div className="frm-card">
            <div className="frm-card__head">
              <span className="kicker">Apply now</span>
              <h2 id="adm-apply">Send an admission enquiry</h2>
              <p>
                Leave your details and the admissions office will call you back. B.Tech seats are allotted through AP EAPCET
                counselling; this enquiry does not reserve a seat.
              </p>
            </div>
            <FormShell
              formName="admission-enquiry"
              fields={enquiryFields}
              submitLabel="Send enquiry"
              successTitle="Enquiry sent"
              successText="The admissions office will contact you on the phone number or email you gave."
              endpoint={site.forms.endpoint}
              fallback={{ email: site.contact.email, phone: site.contact.phone, office: "admissions office at the college" }}
              mailSubject={`Admission enquiry ${site.academicYear}`}
              privacyNote="We use your details only to answer this enquiry."
            />
          </div>

          <aside className="frm-trust" aria-label="Admissions contact">
            <div className="adm-code adm-code--panel">
              <span>AP EAPCET code</span>
              <strong>{site.eapcetCode}</strong>
            </div>
            <hr />
            <h3>Talk to admissions</h3>
            <ul className="frm-trust__contacts">
              <li>
                <Phone aria-hidden="true" />
                <a href={tel}>{site.contact.phone}</a>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${site.contact.email}?subject=Admission enquiry`}>{site.contact.email}</a>
              </li>
              <li>
                <Icon name="MapPin" />
                <span>{site.contact.address}</span>
              </li>
            </ul>
            <Link href="/contact" className="link-arrow">
              Directions and contacts <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <section id="faq" className="section" aria-labelledby="adm-faq">
        <div className="container adm-faq">
          <SectionHead id="adm-faq" kicker="FAQ" title="Admission questions" />
          <div className="adm-accordion">
            {faqs.map((f, i) => (
              <details key={f.q} className="adm-qa" open={i === 0}>
                <summary>
                  <span>{f.q}</span>
                  <Icon name="Plus" className="adm-qa__icon" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
