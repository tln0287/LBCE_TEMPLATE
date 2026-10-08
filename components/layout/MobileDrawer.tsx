"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Phone, Plus, Search, X } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { openSearch } from "./searchEvents";
import type { MainNavItem, NavItem } from "@/lib/content";
import type { DeptLite } from "./Header";

/** Mobile navigation: a full-height drawer with accordion sections, not a shrunken desktop menu. */
export function MobileDrawer({
  open,
  onClose,
  nav,
  departments,
  pathname,
  applyHref,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  nav: MainNavItem[];
  departments: DeptLite[];
  pathname: string;
  applyHref: string;
  contact: { phone: string };
}) {
  const [section, setSection] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.classList.add("no-scroll");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep focus inside the drawer while it is open.
      const visible = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null && !el.closest("[inert]"));
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div className="drawer" id="mobile-drawer" data-open={open} inert={!open}>
      <button type="button" className="drawer__scrim" aria-label="Close menu" tabIndex={-1} onClick={onClose} />
      <div className="drawer__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="drawer__head">
          <Link href="/" className="brand" onClick={onClose}>
            <BrandMark className="brand__mark" />
            <span className="brand__name">LBCE</span>
          </Link>
          <button type="button" className="icon-btn" ref={closeRef} onClick={onClose} aria-label="Close menu">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="drawer__body">
          <button
            type="button"
            className="drawer__search"
            onClick={() => {
              onClose();
              openSearch();
            }}
          >
            <Search aria-hidden="true" /> Search pages, departments, documents
          </button>
          <ul>
            {nav.map((item) => {
              if (!item.mega) {
                return (
                  <li className="acc" key={item.label}>
                    <Link href={item.href} className="acc__link" aria-current={pathname === item.href ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const expanded = section === item.label;
              const pid = `acc-${item.label.toLowerCase().replace(/\W+/g, "-")}`;
              const groups: { title: string; items: NavItem[] }[] =
                item.mega.type === "departments"
                  ? [
                      {
                        title: item.mega.title,
                        items: departments.map((d) => ({ label: d.name, href: `/departments/${d.slug}`, icon: d.icon })),
                      },
                    ]
                  : item.mega.groups;
              return (
                <li className="acc" key={item.label}>
                  <button
                    type="button"
                    className="acc__trigger"
                    aria-expanded={expanded}
                    aria-controls={pid}
                    onClick={() => setSection(expanded ? null : item.label)}
                  >
                    {item.label}
                    <Plus aria-hidden="true" />
                  </button>
                  <div className="acc__panel" id={pid} data-open={expanded} inert={!expanded}>
                    <div>
                      <Link href={item.href} className="acc__sub" style={{ fontWeight: 700 }}>
                        <ArrowRight aria-hidden="true" /> {item.label} overview
                      </Link>
                      {groups.map((g) => (
                        <div className="acc__group" key={g.title}>
                          <p className="acc__group-title">{g.title}</p>
                          {g.items.map((i) => (
                            <SmartLink key={i.label} href={i.href} external={i.external} className="acc__sub">
                              <Icon name={i.icon ?? "ArrowRight"} /> {i.label}
                            </SmartLink>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="drawer__foot">
          <Link href={applyHref} className="btn btn--premium">
            Apply Now
          </Link>
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="btn btn--outline">
            <Phone aria-hidden="true" /> Call {contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
