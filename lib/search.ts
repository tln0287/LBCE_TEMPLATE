/**
 * Builds the site-wide search index from the same content the pages render, so
 * search never drifts from the site. Covers pages, every in-page section (anchors),
 * departments and their labs/research/programs, facilities, activities, events,
 * news, documents, policies, committees, contacts and quick actions.
 *
 * Served as a static JSON file (/search-index.json) that the Ctrl+K palette fetches
 * on demand, and used directly by the /search results page on the server.
 */
import { ROUTES } from "./routes";
import {
  academics,
  accreditation,
  achievements,
  committees,
  departments,
  events,
  facilities,
  facultyMembers,
  gallery,
  home,
  institutionPages,
  mainNav,
  news,
  placements,
  policies,
  programs,
  site,
} from "./content";
import { formatDate, formatRange } from "./format";
import type { SearchEntry } from "./searchEngine";

export type { SearchEntry, SearchGroup } from "./searchEngine";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const clip = (s: string, n = 320) => (s.length > n ? s.slice(0, n) : s);

export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const seen = new Set<string>();
  const add = (e: Omit<SearchEntry, "id"> & { id?: string }) => {
    const id = e.id ?? `${e.group}:${e.href}:${e.title}`;
    // One entry per destination + title, whichever source (menu or content) adds it first.
    const dest = `${e.href}|${e.title.toLowerCase()}`;
    if (seen.has(id) || seen.has(dest)) return;
    seen.add(id);
    seen.add(dest);
    out.push({ ...e, id, body: e.body ? clip(e.body) : undefined });
  };
  const tel = `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`;
  const L = site.externalLinks;

  /* ---------- Quick actions ---------- */
  add({ group: "Quick actions", title: "Apply for admission", subtitle: `Admissions ${site.academicYear} enquiry form`, href: "/admissions#apply", icon: "Send", keywords: "apply now admission enquiry join application" });
  add({ group: "Quick actions", title: "Pay fees online", subtitle: "Secure payment via CCAvenue", href: L.onlinePayment, external: true, icon: "CreditCard", keywords: "fee payment pay online ccavenue tuition" });
  add({ group: "Quick actions", title: `Call the college: ${site.contact.phone}`, subtitle: "Phone", href: tel, icon: "Phone", keywords: "phone call contact number telephone" });
  add({ group: "Quick actions", title: `Email ${site.contact.email}`, subtitle: "Email the principal's office", href: `mailto:${site.contact.email}`, icon: "Mail", keywords: "email mail contact principal" });
  add({ group: "Quick actions", title: "Get directions to campus", subtitle: site.contact.address, href: site.contact.mapUrl, external: true, icon: "MapPin", keywords: "map directions location address route visakhapatnam" });
  add({ group: "Quick actions", title: "Submit a grievance", subtitle: "Grievance Redressal form", href: "/grievance#submit", icon: "MessageSquare", keywords: "complaint grievance issue problem" });
  add({ group: "Quick actions", title: "Give feedback", subtitle: "Students, faculty, alumni, parents", href: "/feedback", icon: "MessageSquare", keywords: "feedback survey suggestion rating" });
  add({ group: "Quick actions", title: "Request background verification", subtitle: "For employers and agencies", href: "/bgv#request", icon: "UserCheck", keywords: "bgv verification background employer certificate degree verify" });
  add({ group: "Quick actions", title: "Register as alumni", subtitle: "Alumni registration", href: site.externalLinks.alumni, external: true, icon: "GraduationCap", keywords: "alumni register registration graduates" });
  if (L.studentPortal) add({ group: "Quick actions", title: "Student Portal", href: L.studentPortal, external: true, icon: "ArrowUpRight", keywords: "student login portal" });
  if (L.facultyPortal) add({ group: "Quick actions", title: "Faculty Portal", href: L.facultyPortal, external: true, icon: "ArrowUpRight", keywords: "faculty login portal" });

  /* ---------- Pages ---------- */
  for (const r of ROUTES) add({ group: "Pages", title: r.title, subtitle: r.description, href: r.path, keywords: r.section });

  /* ---------- Contact facts ---------- */
  add({ group: "Contact", title: "Address", subtitle: site.contact.address, href: "/contact", keywords: "address location where map visakhapatnam" });
  add({ group: "Contact", title: "Phone number", subtitle: site.contact.phone, href: tel, keywords: "phone number call contact" });
  add({ group: "Contact", title: "Email", subtitle: site.contact.email, href: `mailto:${site.contact.email}`, keywords: "email mail principal" });
  add({ group: "Contact", title: `EAPCET code ${site.eapcetCode}`, subtitle: "Use this code during AP EAPCET counselling", href: "/admissions#eligibility", keywords: "eapcet code counselling dlbc admission" });
  add({ group: "Contact", title: "Affiliation & approval", subtitle: site.affiliation, href: "/profile#history", keywords: "andhra university affiliated aicte approved" });
  add({ group: "Contact", title: `Established ${site.established}`, subtitle: "College history", href: "/profile#history", keywords: "established founded history year since" });

  /* ---------- Departments ---------- */
  const deptSections: [string, string][] = [
    ["about", "About the Department"],
    ["vision-mission", "Vision & Mission"],
    ["programs", "Programs"],
    ["faculty", "Faculty"],
    ["laboratories", "Laboratories"],
    ["research", "Research"],
    ["publications", "Publications"],
    ["projects", "Projects"],
    ["achievements", "Achievements"],
    ["student-activities", "Student Activities"],
    ["placements", "Placements"],
    ["contact", "Contact"],
  ];
  for (const d of departments) {
    const base = `/departments/${d.slug}`;
    add({
      group: "Departments",
      title: `${d.name} (${d.code})`,
      subtitle: d.summary,
      href: base,
      icon: d.icon,
      keywords: [d.code, ...d.programs.map((p) => p.name), ...d.research, ...d.labs].join(" "),
      body: [d.about, d.vision, ...d.mission].join(" "),
    });
    for (const [id, label] of deptSections) {
      add({ group: "Sections", title: `${label}, ${d.code}`, subtitle: d.name, href: `${base}#${id}`, keywords: `${d.code} ${label}` });
    }
    for (const lab of d.labs) add({ group: "Sections", title: lab, subtitle: `Laboratory, ${d.name}`, href: `${base}#laboratories`, keywords: `lab laboratory ${d.code}` });
    for (const r of d.research) add({ group: "Sections", title: r, subtitle: `Research area, ${d.name}`, href: `${base}#research`, keywords: `research ${d.code}` });
    for (const p of d.programs) add({ group: "Sections", title: p.name, subtitle: `${p.level}, ${p.duration}`, href: `${base}#programs`, keywords: `program course degree ${d.code} btech` });
  }

  /* ---------- Faculty ---------- */
  for (const f of facultyMembers) {
    add({
      group: "Faculty",
      title: f.name,
      subtitle: `${f.designation}, ${departments.find((d) => d.slug === f.department)?.code ?? f.department}`,
      href: `/faculty?q=${encodeURIComponent(f.name)}`,
      keywords: `${f.specialization} ${f.qualification} ${f.email}`,
    });
  }

  /* ---------- Facilities & campus ---------- */
  for (const f of facilities) add({ group: "Facilities", title: f.title, subtitle: f.text, href: `/facilities#${f.id}`, icon: f.icon });
  for (const c of gallery.categories) add({ group: "Sections", title: `${c} photos`, subtitle: "Gallery", href: "/gallery", keywords: "gallery photos pictures images" });
  for (const c of home.campusLife) add({ group: "Sections", title: c.title, subtitle: "Campus life", href: c.href, keywords: "campus life student" });

  /* ---------- Menu destinations (mega menus) ---------- */
  for (const item of mainNav) {
    for (const g of item.mega?.groups ?? []) {
      for (const i of g.items) {
        if (i.external) {
          add({ group: "Documents", title: i.label, subtitle: i.desc ?? g.title, href: i.href, external: true });
        } else if (i.href.includes("#")) {
          add({ group: "Sections", title: i.label, subtitle: `${item.label}: ${g.title}`, href: i.href, keywords: i.desc });
        }
      }
    }
  }

  /* ---------- Activities, skills, achievements ---------- */
  for (const a of programs.activities) add({ group: "Sections", title: a.title, subtitle: a.text, href: `/activities#${a.id}`, icon: a.icon, keywords: "activities" });
  for (const a of programs.skillDevelopment.areas) add({ group: "Sections", title: a.title, subtitle: `Skill development: ${a.text}`, href: `/skill-development#area-${a.id}`, icon: a.icon, keywords: "skill development training" });
  add({ group: "Sections", title: "Capacity building programs", subtitle: programs.capacityBuilding.intro, href: "/capacity-building", keywords: "capacity building training programs" });
  for (const c of achievements.categories) add({ group: "Sections", title: c.title, subtitle: c.text, href: `/achievements#${c.id}`, icon: c.icon, keywords: "achievements awards" });

  /* ---------- Academics ---------- */
  const acadSections: [string, string, string][] = [
    ["programs", "Programs offered", "undergraduate postgraduate diploma btech courses"],
    ["calendar", "Academic calendar", "calendar semester dates holidays timetable schedule"],
    ["regulations", "Academic regulations", "regulations rules andhra university"],
    ["curriculum", "Curriculum & syllabus", "syllabus curriculum course structure"],
    ["examination", "Examinations & results", "exam examination results schedule hall ticket"],
    ["academic-bodies", "Academic bodies", "academic council board of studies"],
  ];
  for (const [id, title, kw] of acadSections) add({ group: "Sections", title, subtitle: "Academics", href: `/academics#${id}`, keywords: kw });
  for (const p of academics.programs) add({ group: "Sections", title: `${p.name} (${p.level})`, subtitle: p.text, href: "/academics#programs", keywords: `${p.duration} program course` });

  /* ---------- Research ---------- */
  add({ group: "Sections", title: "Research areas", subtitle: "Research & Innovation", href: "/research#areas", keywords: departments.flatMap((d) => d.research).join(" ") });
  for (const [id, title] of [["publications", "Publications"], ["patents", "Patents"], ["projects", "Funded projects"]] as const) {
    add({ group: "Sections", title, subtitle: "Research & Innovation", href: `/research#${id}`, keywords: "research" });
  }

  /* ---------- Placements & admissions ---------- */
  const plc: [string, string, string][] = [
    ["statistics", "Placement statistics", "statistics placed percentage highest package"],
    ["process", "Placement process", placements.process.map((p) => p.title).join(" ")],
    ["training", "Placement training", placements.training.map((t) => t.title).join(" ")],
    ["recruiters", "Recruiters", "companies recruiters hiring"],
    ["career", "Internships & career development", "internship internships career guidance"],
  ];
  for (const [id, title, kw] of plc) add({ group: "Sections", title, subtitle: "Placements", href: `/placements#${id}`, keywords: kw });
  const adm: [string, string, string][] = [
    ["programs", "Programs for admission", "courses programs btech diploma"],
    ["eligibility", "Admission eligibility", "eligibility eapcet qualification criteria"],
    ["process", "Admission process", "process steps counselling how to apply"],
    ["documents", "Documents required for admission", "documents certificates checklist"],
    ["pay", "Pay admission fees online", "fees payment ccavenue"],
    ["apply", "Admission enquiry form", "apply enquiry form contact admissions"],
    ["faq", "Admissions FAQ", "questions faq"],
  ];
  for (const [id, title, kw] of adm) add({ group: "Sections", title, subtitle: `Admissions ${site.academicYear}`, href: `/admissions#${id}`, keywords: kw });

  /* ---------- Profile ---------- */
  const prof: [string, string, string, string?][] = [
    ["history", "History of the college", "history established 2010 founded"],
    ["vision", "Vision & mission", "vision mission", home.intro.pillars.map((p) => p.text).join(" ")],
    ["philosophy", "Academic philosophy", "philosophy outcome based learning"],
    ["leadership", "Leadership", "principal leadership management chairman"],
    ["governance", "Governance", "governing body academic council iqac committees"],
    ["accreditation", "Accreditation", "naac aicte ugc nirf iso"],
  ];
  for (const [id, title, kw, body] of prof) add({ group: "Sections", title, subtitle: "College profile", href: `/profile#${id}`, keywords: kw, body });

  /* ---------- Institutional pages and their sections ---------- */
  for (const p of institutionPages) {
    for (const s of p.sections) {
      add({ group: "Sections", title: `${p.title}: ${s.title}`, subtitle: s.items.slice(0, 2).join(". "), href: `/${p.slug}#${s.id ?? slug(s.title)}`, keywords: p.slug, body: s.items.join(". ") });
    }
    if (p.people.length) add({ group: "Sections", title: `${p.title} members`, subtitle: p.title, href: `/${p.slug}#people`, body: p.people.map((x) => `${x.name} ${x.role}`).join(", ") });
    for (const d of p.documents) add({ group: "Documents", title: d.title, subtitle: `${p.title}${d.type ? `, ${d.type}` : ""}`, href: d.url, external: /^https?:/.test(d.url) });
    for (const r of p.reportTypes ?? []) add({ group: "Documents", title: `${r} (${p.title})`, subtitle: "Reports", href: `/${p.slug}#reports-list`, keywords: "report reports aqar minutes" });
  }
  for (const b of accreditation.bodies) {
    add({ group: "Sections", title: `${b.name}: ${b.full}`, subtitle: b.text, href: `/${b.slug}`, keywords: "accreditation" });
    for (const d of b.documents) add({ group: "Documents", title: d.title, subtitle: `${b.name}, ${d.type ?? "Document"}`, href: d.url, external: /^https?:/.test(d.url) });
  }

  /* ---------- Key external documents & legacy pages ---------- */
  add({ group: "Documents", title: "NIRF 2026 Functional Address", subtitle: "PDF", href: L.nirf2026FunctionalAddress, external: true, keywords: "nirf ranking pdf" });
  add({ group: "Documents", title: "UGC Mandate 2025–26", subtitle: "PDF", href: L.ugcMandate, external: true, keywords: "ugc mandate pdf" });

  /* ---------- Policies & committees ---------- */
  for (const p of policies.policies) {
    add({ group: "Policies", title: p.title, subtitle: p.text, href: `/policies#${p.id}`, icon: p.icon, keywords: "policy policies rules" });
    for (const d of p.documents as { title: string; url: string }[]) add({ group: "Documents", title: d.title, subtitle: p.title, href: d.url, external: true });
  }
  for (const c of committees.committees) {
    add({ group: "Committees", title: c.name, subtitle: c.purpose, href: `/committees#${c.id}`, icon: c.icon, keywords: "committee cell", body: c.responsibilities.join(". ") });
  }

  /* ---------- Events ---------- */
  for (const e of events) {
    add({
      group: "Events",
      title: e.title,
      subtitle: `${formatRange(e.date, e.endDate)}, ${e.location}`,
      href: `/events#${e.slug}`,
      keywords: `${e.category} event ${e.location}`,
      body: e.summary,
    });
  }
  add({ group: "Sections", title: "Upcoming events", subtitle: "Events", href: "/events#upcoming", keywords: "upcoming events calendar" });
  add({ group: "Sections", title: "Events calendar", subtitle: "Events", href: "/events#calendar", keywords: "calendar month events" });
  add({ group: "Sections", title: "Past events", subtitle: "Events", href: "/events#past", keywords: "past previous events archive" });

  /* ---------- News ---------- */
  for (const a of news.articles) {
    add({
      group: "News",
      title: a.title,
      subtitle: `${a.category}, ${formatDate(a.date)}`,
      href: `/lbc-times/${a.slug}`,
      keywords: `${a.category} news lbc times`,
      body: [a.excerpt, ...a.body].join(" "),
    });
  }
  for (const a of home.announcements) add({ group: "News", title: a.text, subtitle: "Announcement", href: a.href, external: a.external });

  /* ---------- Services sections ---------- */
  const svc: [string, string, string, string][] = [
    ["/grievance#procedure", "Grievance procedure", "Grievance Redressal", "grievance steps process complaint"],
    ["/bgv#request", "Verification request form", "Background Verification", "bgv employer verify degree"],
    ["/contact#message", "Contact form", "Contact", "message enquiry contact form"],
    ["/feedback", "Student feedback", "Feedback", "student feedback"],
    ["/feedback", "Parent feedback", "Feedback", "parent feedback"],
    ["/feedback", "Alumni feedback", "Feedback", "alumni feedback"],
    ["/feedback", "Faculty feedback", "Feedback", "faculty feedback"],
  ];
  for (const [href, title, subtitle, kw] of svc) add({ group: "Sections", title, subtitle, href, keywords: kw });

  return out;
}
