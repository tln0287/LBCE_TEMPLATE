/**
 * Registry of every static page. Used for metadata, breadcrumbs, the sitemap and
 * the "Pages" group of the command-palette search. Add a page here when you add a route.
 */
export type RouteInfo = { path: string; title: string; description: string; section?: string };

export const ROUTES: RouteInfo[] = [
  { path: "/", title: "Home", description: "Dr. Lankapalli Bullayya College of Engineering, Visakhapatnam." },
  { path: "/profile", title: "College Profile", description: "History, vision, mission and leadership of the college.", section: "Institution" },
  { path: "/departments", title: "Departments", description: "Five engineering departments: CSE, Civil, ECE, EEE and Mechanical.", section: "Academics" },
  { path: "/academics", title: "Academics", description: "Programs, academic calendar, regulations, curriculum and examinations.", section: "Academics" },
  { path: "/facilities", title: "Facilities", description: "Classrooms, labs, library, hostels, sports, transport and more.", section: "Campus" },
  { path: "/campus-life", title: "Campus Life", description: "Student life, clubs, festivals, sports and events.", section: "Campus" },
  { path: "/campus-glimpses", title: "Campus Glimpses", description: "A visual tour of the campus.", section: "Campus" },
  { path: "/gallery", title: "Gallery", description: "Photos from campus, events, technical and cultural activities.", section: "Campus" },
  { path: "/activities", title: "Activities", description: "Technical, cultural and sports activities, clubs, workshops and conferences.", section: "Activities" },
  { path: "/capacity-building", title: "Capacity Building Programs", description: "Capacity building programs for students and faculty.", section: "Activities" },
  { path: "/skill-development", title: "Skill Development", description: "Training programs, certifications and career readiness.", section: "Activities" },
  { path: "/research", title: "Research & Innovation", description: "Research areas, publications, patents, projects and IIC.", section: "Activities" },
  { path: "/achievements", title: "Achievements", description: "Student, faculty, research and sports achievements.", section: "Activities" },
  { path: "/placements", title: "Placements", description: "Training & Placement Cell, process, recruiters and statistics.", section: "Placements" },
  { path: "/alumni", title: "Alumni", description: "Alumni network, registration and portal.", section: "Institution" },
  { path: "/faculty", title: "Faculty Directory", description: "Search faculty by department, designation and specialization.", section: "Institution" },
  { path: "/events", title: "Events", description: "Upcoming, featured and past events.", section: "News" },
  { path: "/lbc-times", title: "LBC Times", description: "News and stories from the college.", section: "News" },
  { path: "/governing-body", title: "Governing Body", description: "Composition and proceedings of the Governing Body.", section: "Governance" },
  { path: "/academic-council", title: "Academic Council", description: "Academic Council composition and minutes.", section: "Governance" },
  { path: "/board-of-studies", title: "Board of Studies", description: "Boards of Studies by department.", section: "Governance" },
  { path: "/committees", title: "Committees", description: "Statutory and institutional committees.", section: "Governance" },
  { path: "/iqac", title: "IQAC", description: "Internal Quality Assurance Cell: members, activities, AQARs and reports.", section: "Quality" },
  { path: "/naac", title: "NAAC", description: "NAAC accreditation information and documents.", section: "Accreditation" },
  { path: "/aicte", title: "AICTE", description: "AICTE approvals, mandatory disclosure and documents.", section: "Accreditation" },
  { path: "/ugc", title: "UGC", description: "UGC mandate and compliance documents.", section: "Accreditation" },
  { path: "/nirf", title: "NIRF", description: "NIRF data, reports and functional address.", section: "Accreditation" },
  { path: "/iso", title: "ISO", description: "ISO certification, scope and quality objectives.", section: "Accreditation" },
  { path: "/iic", title: "Institution's Innovation Council", description: "IIC activities, innovation and entrepreneurship.", section: "Activities" },
  { path: "/rti", title: "Right to Information", description: "RTI officers, procedure and disclosures.", section: "Governance" },
  { path: "/policies", title: "Policies", description: "Academic, student, research, HR, campus and other policies.", section: "Resources" },
  { path: "/reports", title: "Reports", description: "Annual reports, AQARs and other institutional reports.", section: "Resources" },
  { path: "/downloads", title: "Downloads", description: "Forms, notices and institutional documents.", section: "Resources" },
  { path: "/bgv", title: "Background Verification", description: "Verify the academic credentials of a graduate.", section: "Services" },
  { path: "/grievance", title: "Grievance Redressal", description: "Submit and track grievances.", section: "Services" },
  { path: "/feedback", title: "Feedback", description: "Feedback from students, faculty, alumni and parents.", section: "Services" },
  { path: "/admissions", title: "Admissions", description: "Programs, eligibility, process and fees.", section: "Admissions" },
  { path: "/contact", title: "Contact", description: "Address, phone, email and directions.", section: "Contact" },
  { path: "/search", title: "Search", description: "Search pages, departments, facilities, events, news and documents.", section: "Help" },
  { path: "/careers", title: "Careers", description: "Faculty and staff openings at the college.", section: "Institution" },
];

export function routeInfo(path: string) {
  return ROUTES.find((r) => r.path === path);
}
