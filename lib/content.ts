/**
 * Single access point for site content. Every component reads data through here,
 * so moving from JSON files to a CMS/API later means changing only this module.
 */
import site from "@/content/site.json";
import navigation from "@/content/navigation.json";
import home from "@/content/home.json";
import departmentsData from "@/content/departments.json";
import facilitiesData from "@/content/facilities.json";
import gallery from "@/content/gallery.json";
import eventsData from "@/content/events.json";
import news from "@/content/news.json";
import alumni from "@/content/alumni.json";
import achievements from "@/content/achievements.json";
import accreditation from "@/content/accreditation.json";
import placements from "@/content/placements.json";
import institution from "@/content/institution.json";
import faculty from "@/content/faculty.json";
import policies from "@/content/policies.json";
import committees from "@/content/committees.json";
import programs from "@/content/programs.json";
import academics from "@/content/academics.json";

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  desc?: string;
  external?: boolean;
};
export type NavGroup = { title: string; items: NavItem[] };
export type MegaMenu = { title: string; intro?: string; type?: string; groups: NavGroup[] };
export type MainNavItem = { label: string; href: string; mega?: MegaMenu };

export type Cta = { label: string; href: string; variant?: string; external?: boolean };
export type Department = (typeof departmentsData.departments)[number];
export type Facility = (typeof facilitiesData.facilities)[number];
export type GalleryItem = (typeof gallery.items)[number];
export type EventItem = (typeof eventsData.events)[number] & { endDate?: string };
export type Article = (typeof news.articles)[number];
export type AccreditationBody = (typeof accreditation.bodies)[number];
export type Doc = { title: string; url: string; type?: string; date?: string };

export { site, home, gallery, news, alumni, achievements, accreditation, placements, faculty, policies, committees, programs, academics };

export type InstitutionPage = {
  slug: string;
  title: string;
  kicker: string;
  intro: string;
  sections: { title: string; id?: string; items: string[] }[];
  people: { name: string; role: string; designation?: string; email?: string; phone?: string }[];
  timeline: { date: string; title: string; text?: string }[];
  documents: Doc[];
  reportTypes?: string[];
  legacyUrl: string;
};
export const institutionPages = institution.pages as InstitutionPage[];
export const getInstitutionPage = (slug: string) => institutionPages.find((p) => p.slug === slug);

export type FacultyMember = { id: string; name: string; designation: string; department: string; qualification: string; specialization: string; email: string; photo?: string };
export const facultyMembers = faculty.members as FacultyMember[];

export const mainNav = navigation.main as MainNavItem[];
export const footerNav = navigation.footer as { title: string; links: NavItem[] }[];
export const departments = departmentsData.departments;
export const facilities = facilitiesData.facilities;
export const events = (eventsData.events as EventItem[]).slice().sort((a, b) => a.date.localeCompare(b.date));

export function getDepartment(slug: string) {
  return departments.find((d) => d.slug === slug);
}

export function getArticle(slug: string) {
  return news.articles.find((a) => a.slug === slug);
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

/** Replaces {academicYear}, {eapcetCode} etc. with values from site.json so they are never hard-coded. */
export function fill(text: string): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (site as Record<string, unknown>)[key];
    return typeof value === "string" || typeof value === "number" ? String(value) : `{${key}}`;
  });
}

export function upcomingEvents(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  return events.filter((e) => (e.endDate ?? e.date) >= iso);
}

export function pastEvents(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  return events.filter((e) => (e.endDate ?? e.date) < iso).reverse();
}
