import Link from "next/link";
import { GraduationCap, Phone, Send } from "lucide-react";

/** Sticky bottom actions on small screens. */
export function MobileCTA() {
  return (
    <nav className="mobile-cta" aria-label="Quick actions">
      <Link href="/admissions">
        <GraduationCap aria-hidden="true" />
        Admissions
      </Link>
      <Link href="/contact">
        <Phone aria-hidden="true" />
        Contact
      </Link>
      <Link href="/admissions#apply" className="is-primary">
        <Send aria-hidden="true" />
        Apply
      </Link>
    </nav>
  );
}
