import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";

export const metadata = { title: "Page not found", robots: { index: false } };

const LINKS = [
  { label: "Admissions", href: "/admissions", icon: "GraduationCap" },
  { label: "Departments", href: "/departments", icon: "Building2" },
  { label: "Academics", href: "/academics", icon: "BookOpen" },
  { label: "Placements", href: "/placements", icon: "Briefcase" },
  { label: "LBC Times", href: "/lbc-times", icon: "Newspaper" },
  { label: "Contact", href: "/contact", icon: "Phone" },
];

export default function NotFound() {
  return (
    <section className="nf" aria-labelledby="nf-title">
      <div className="page-hero__grid" aria-hidden="true" />
      <div className="container nf__inner">
        <p className="nf__code" aria-hidden="true">
          404
        </p>
        <span className="kicker">Page not found</span>
        <h1 id="nf-title">We couldn&apos;t find that page.</h1>
        <p className="nf__text">
          The page may have moved during the website update. Search for what you need, or use one of the links below.
        </p>
        <SearchBar className="searchbar--dark" placeholder="Search for a page, department or document…" />
        <div className="btn-row">
          <LinkButton href="/" variant="premium">
            Back to home
          </LinkButton>
        </div>
        <ul className="nf__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>
                <Icon name={l.icon} />
                <span>{l.label}</span>
                <ArrowRight className="nf__arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
