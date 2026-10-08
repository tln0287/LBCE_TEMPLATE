import Link from "next/link";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHead } from "@/components/ui/Section";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { Icon } from "@/components/ui/Icon";
import { FormShell } from "@/components/forms/FormShell";
import { emailField, nameField, opts, phoneField, type FieldDef } from "@/components/forms/types";
import { site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/contact", {
  title: "Contact",
  description: `Address, phone, email, map and directions for ${site.name}, Visakhapatnam.`,
});

const tel = `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`;

const offices: { name: string; icon: string; text: string; email?: string }[] = [
  { name: "Principal's Office", icon: "Landmark", text: "General enquiries, letters and official correspondence.", email: site.contact.email },
  { name: "Admissions Office", icon: "GraduationCap", text: "Programs, eligibility, counselling and fee payment." },
  { name: "Examination Cell", icon: "ClipboardCheck", text: "Exam schedules, results, certificates and transcripts." },
  { name: "Training & Placement Cell", icon: "Briefcase", text: "Campus recruitment, internships and company visits." },
];

const fields: FieldDef[] = [
  nameField({ required: true }),
  emailField({ required: true }),
  phoneField({ hint: "Optional. Add it if you would like a call back." }),
  {
    name: "topic",
    label: "Topic",
    type: "select",
    required: true,
    placeholder: "Select a topic",
    requiredMessage: "Choose the topic closest to your message",
    width: "half",
    options: opts("Admissions", "Examinations and certificates", "Placements and recruitment", "Visiting the campus", "Media and events", "Other"),
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    requiredMessage: "Write your message before sending",
    minLength: 10,
    maxLength: 2000,
    rows: 6,
  },
];

const hasSocial = Object.values(site.social).some(Boolean);

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Contact the college"
        text="Call, email or visit us on National Highway 16 in Visakhapatnam. Use the form to send a message to the right office."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section" aria-labelledby="cnt-reach">
        <div className="container">
          <h2 id="cnt-reach" className="sr-only">
            Ways to reach us
          </h2>
          <ul className="cnt-cards">
            <li className="cnt-card">
              <span className="icon-badge">
                <MapPin aria-hidden="true" />
              </span>
              <h3>Address</h3>
              <address>{site.contact.address}</address>
              <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                Get directions <Navigation aria-hidden="true" />
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </li>
            <li className="cnt-card">
              <span className="icon-badge">
                <Phone aria-hidden="true" />
              </span>
              <h3>Phone</h3>
              <p>Main office</p>
              <a href={tel} className="cnt-card__big">
                {site.contact.phone}
              </a>
            </li>
            <li className="cnt-card">
              <span className="icon-badge">
                <Mail aria-hidden="true" />
              </span>
              <h3>Email</h3>
              <p>Principal&rsquo;s office</p>
              <a href={`mailto:${site.contact.email}`} className="cnt-card__big">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--sky cnt-map-section" aria-labelledby="cnt-map-title">
        <div className="container cnt-map-grid">
          <div className="cnt-map-text">
            <SectionHead id="cnt-map-title" kicker="Find us" title="Getting here" />
            <ul className="ticks">
              <li>The campus is on National Highway 16 near Rama Talkies Road, Resapuvanipalem.</li>
              <li>Search for &ldquo;{site.name}&rdquo; in your maps app, or use the directions button.</li>
            </ul>
            <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              <Navigation aria-hidden="true" /> Open directions in Google Maps
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="cnt-map">
            <iframe
              title={`Map showing the location of ${site.name}`}
              src={site.contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cnt-dir">
        <div className="container">
          <SectionHead
            id="cnt-dir"
            kicker="Office directory"
            title="Who to contact"
            text={`Direct numbers and emails for each office will be published here. Until then, call the main office on ${site.contact.phone} and ask to be connected.`}
          />
          <ul className="grid grid--4 cnt-dir">
            {offices.map((o) => (
              <li key={o.name} className="card accent-top">
                <span className="icon-badge">
                  <Icon name={o.icon} />
                </span>
                <h3>{o.name}</h3>
                <p>{o.text}</p>
                <dl className="cnt-dir__meta">
                  <div>
                    <dt>Email</dt>
                    <dd>{o.email ? <a href={`mailto:${o.email}`}>{o.email}</a> : <span className="cnt-tbp">To be published</span>}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{o.email ? <a href={tel}>{site.contact.phone}</a> : <span className="cnt-tbp">To be published</span>}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="message" className="section section--ivory" aria-labelledby="cnt-form-title">
        <div className="container frm-layout">
          <div className="frm-card">
            <div className="frm-card__head">
              <span className="kicker">Write to us</span>
              <h2 id="cnt-form-title">Send a message</h2>
              <p>Choose a topic so your message reaches the right office.</p>
            </div>
            <FormShell
              formName="contact"
              fields={fields}
              submitLabel="Send message"
              successTitle="Message sent"
              successText="The office will reply to the email address you gave."
              endpoint={site.forms.endpoint}
              fallback={{ email: site.contact.email, phone: site.contact.phone, office: "college office" }}
              mailSubject="Message from the website"
              privacyNote="We use your details only to reply to this message."
            />
          </div>
          <aside className="frm-trust" aria-label="Office information">
            <div className="frm-trust__item">
              <Clock aria-hidden="true" />
              <div>
                <h3>Office hours</h3>
                <p>Office hours will be published here. Call {site.contact.phone} before visiting.</p>
              </div>
            </div>
            <hr />
            <h3>Quick links</h3>
            <ul className="frm-trust__links">
              <li><Link href="/admissions#apply">Admission enquiry</Link></li>
              <li><Link href="/grievance">Raise a grievance</Link></li>
              <li><Link href="/bgv">Background verification</Link></li>
              <li><Link href="/feedback">Give feedback</Link></li>
            </ul>
            {hasSocial && (
              <>
                <hr />
                <h3>Follow us</h3>
                <div className="cnt-social">
                  <SocialIcons />
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
