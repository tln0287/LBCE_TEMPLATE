import Link from "next/link";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { LinkButton } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { footerNav, site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__top">
          <div style={{ display: "grid", gap: 20 }}>
            <Link href="/" className="brand" aria-label={`${site.name}, home`}>
              <BrandMark className="brand__mark" />
              <span className="brand__text">
                <span className="brand__name">{site.name}</span>
                <span className="brand__sub">{site.affiliation}</span>
              </span>
            </Link>
            <h2>Admissions for {site.academicYear} are open.</h2>
          </div>
          <div className="btn-row">
            <LinkButton href="/admissions" variant="premium">
              Apply Now
            </LinkButton>
            <LinkButton href={site.externalLinks.onlinePayment} variant="outline">
              Pay Online
            </LinkButton>
          </div>
        </div>

        <div className="footer__grid">
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="footer__title">{col.title}</h3>
              <ul className="footer__links">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href} external={l.external}>
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h3 className="footer__title">Contact</h3>
            <address className="footer__contact" style={{ fontStyle: "normal" }}>
              <div>
                <MapPin aria-hidden="true" />
                <span>{site.contact.address}</span>
              </div>
              <div>
                <Phone aria-hidden="true" />
                <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`}>{site.contact.phone}</a>
              </div>
              <div>
                <Mail aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </div>
              <div>
                <Navigation aria-hidden="true" />
                <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer">
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </address>
            <SocialIcons />
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {site.name}. All Rights Reserved.
          </p>
          <p style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
            <span>
              EAPCET code <strong style={{ color: "var(--gold)" }}>{site.eapcetCode}</strong>
            </span>
            <Link href="/policies">Policies</Link>
            <Link href="/rti">RTI</Link>
            <Link href="/grievance">Grievance</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
