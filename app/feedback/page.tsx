import { Lock, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";
import { FeedbackTabs, type FeedbackTab } from "@/components/forms/FeedbackTabs";
import { emailField, nameField, opts, type FieldDef } from "@/components/forms/types";
import { departments, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/feedback", {
  title: "Feedback",
  description: `Share feedback with ${site.name}: separate forms for students, faculty, alumni, parents and visitors.`,
});

const deptOptions = opts(...departments.map((d) => d.name));
const privacy = "Feedback is read by the college's quality team (IQAC) and used only to improve teaching and services.";

const rating = (name: string, label: string): FieldDef => ({ name, label, type: "rating", required: true, width: "half" });

const comments = (label = "Comments and suggestions", required = false): FieldDef => ({
  name: "comments",
  label,
  type: "textarea",
  required,
  requiredMessage: "Write your feedback before sending",
  hint: "What works well, and what should change? Specific examples help most.",
  maxLength: 2000,
  rows: 5,
});

const optionalName = nameField({ label: "Name", hint: "Optional. Leave blank to give feedback anonymously." });
const optionalEmail = emailField({ label: "Email address", hint: "Optional. Only if you would like a reply." });

const base = (formName: string, label: string) => ({
  formName,
  submitLabel: "Send feedback",
  successTitle: `${label} feedback sent`,
  successText: "Thank you. Your feedback has reached the college's quality team.",
  mailSubject: `${label} feedback`,
  privacyNote: privacy,
});

const tabs: FeedbackTab[] = [
  {
    id: "student",
    label: "Student",
    icon: "GraduationCap",
    title: "Student feedback",
    intro: "Rate your experience of teaching, labs and campus services this semester.",
    form: {
      ...base("feedback-student", "Student"),
      fields: [
        optionalName,
        { name: "department", label: "Department", type: "select", required: true, options: deptOptions, width: "half" },
        {
          name: "year",
          label: "Year of study",
          type: "choice",
          required: true,
          options: opts("1st year", "2nd year", "3rd year", "4th year"),
        },
        rating("teaching", "Quality of teaching"),
        rating("labs", "Labs and practical sessions"),
        rating("library", "Library and learning resources"),
        rating("facilities", "Campus facilities"),
        rating("placement", "Training and placement support"),
        rating("overall", "Overall experience"),
        comments(),
      ],
    },
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: "Presentation",
    title: "Faculty feedback",
    intro: "Tell us about the curriculum, resources and support for teaching and research.",
    form: {
      ...base("feedback-faculty", "Faculty"),
      fields: [
        optionalName,
        { name: "department", label: "Department", type: "select", required: true, options: deptOptions, width: "half" },
        rating("curriculum", "Curriculum and syllabus"),
        rating("resources", "Teaching resources and labs"),
        rating("research", "Support for research and development"),
        rating("administration", "Administrative support"),
        rating("overall", "Overall work environment"),
        comments(),
      ],
    },
  },
  {
    id: "alumni",
    label: "Alumni",
    icon: "Award",
    title: "Alumni feedback",
    intro: "Looking back, how well did your time at the college prepare you for your career?",
    form: {
      ...base("feedback-alumni", "Alumni"),
      fields: [
        optionalName,
        optionalEmail,
        { name: "department", label: "Department", type: "select", required: true, options: deptOptions, width: "half" },
        {
          name: "passingYear",
          label: "Year of passing",
          type: "text",
          inputMode: "numeric",
          pattern: "^(19|20)[0-9]{2}$",
          patternMessage: "Enter a four-digit year, for example 2018",
          maxLength: 4,
          required: true,
          width: "half",
        },
        rating("relevance", "Relevance of the curriculum to your work"),
        rating("skills", "Skills you gained"),
        rating("placement", "Placement and career support"),
        rating("overall", "Overall experience"),
        comments("Suggestions for the college"),
      ],
    },
  },
  {
    id: "parent",
    label: "Parent",
    icon: "Users",
    title: "Parent feedback",
    intro: "As a parent or guardian, share how the college is supporting your ward.",
    form: {
      ...base("feedback-parent", "Parent"),
      fields: [
        optionalName,
        optionalEmail,
        { name: "department", label: "Your ward's department", type: "select", required: true, options: deptOptions, width: "half" },
        {
          name: "year",
          label: "Your ward's year of study",
          type: "select",
          required: true,
          options: opts("1st year", "2nd year", "3rd year", "4th year"),
          width: "half",
        },
        rating("academics", "Academic progress of your ward"),
        rating("communication", "Communication from the college"),
        rating("safety", "Safety and discipline on campus"),
        rating("facilities", "Facilities and services"),
        rating("overall", "Overall satisfaction"),
        comments(),
      ],
    },
  },
  {
    id: "general",
    label: "General",
    icon: "MessageSquare",
    title: "General feedback",
    intro: "Visitors, employers and members of the public: tell us anything about the college or this website.",
    form: {
      ...base("feedback-general", "General"),
      fields: [
        optionalName,
        optionalEmail,
        {
          name: "topic",
          label: "Topic",
          type: "select",
          required: true,
          options: opts("Admissions", "Academics", "Campus and facilities", "Events", "This website", "Other"),
        },
        rating("overall", "Overall impression"),
        comments("Your feedback", true),
      ],
    },
  },
];

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Feedback"
        text="Your feedback shapes teaching, facilities and services. Choose who you are, rate a few areas and add comments. It takes about two minutes."
        crumbs={[{ label: "Feedback" }]}
      />

      <section className="section section--sky fbk-section" aria-labelledby="fbk-title">
        <div className="container frm-layout">
          <div className="frm-card">
            <div className="frm-card__head">
              <span className="kicker">Give feedback</span>
              <h2 id="fbk-title" className="sr-only">
                Feedback forms
              </h2>
              <p>Ratings run from 1 (poor) to 5 (excellent). Use the arrow keys to move between options.</p>
            </div>
            <FeedbackTabs tabs={tabs} endpoint={site.forms.endpoint} fallback={{ email: site.contact.email, phone: site.contact.phone }} />
          </div>

          <aside className="frm-trust" aria-label="How feedback is used">
            <div className="frm-trust__item">
              <Lock aria-hidden="true" />
              <div>
                <h3>Anonymous if you prefer</h3>
                <p>Name and email are optional on every form. Leave them blank and your feedback is not linked to you.</p>
              </div>
            </div>
            <hr />
            <h3>How we use it</h3>
            <ul className="ticks">
              <li>Reviewed by the Internal Quality Assurance Cell (IQAC)</li>
              <li>Summarised for departments and college leadership</li>
              <li>Used to plan improvements to teaching and services</li>
            </ul>
            <hr />
            <h3>Have a complaint instead?</h3>
            <p>
              Feedback is not the right place for a specific complaint. Use the <Link href="/grievance">grievance form</Link> so the
              committee can respond to you.
            </p>
            <ul className="frm-trust__contacts">
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}>{site.contact.phone}</a>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
