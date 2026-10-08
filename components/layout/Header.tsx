"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Mail, Menu, Phone, Search } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { MobileDrawer } from "./MobileDrawer";
import { openSearch } from "./searchEvents";
import type { MainNavItem, NavItem } from "@/lib/content";

export type DeptLite = { slug: string; code: string; name: string; summary: string; icon: string; short: string };

type Props = {
  nav: MainNavItem[];
  departments: DeptLite[];
  utility: NavItem[];
  brand: { name: string; tagline: string };
  contact: { phone: string; email: string };
  applyHref: string;
};

/** The one top-level item to highlight: a direct URL match wins over a link found inside another item's mega menu. */
export function activeLabel(pathname: string, nav: MainNavItem[]): string | undefined {
  const direct = nav
    .filter((i) => (i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(i.href + "/")))
    .sort((a, b) => b.href.length - a.href.length)[0];
  if (direct) return direct.label;
  return nav.find((i) => i.mega?.groups.some((g) => g.items.some((x) => !x.external && x.href.split("#")[0] === pathname)))?.label;
}

const slugify = (s: string) => s.toLowerCase().replace(/\W+/g, "-");

export function Header({ nav, departments, utility, brand, contact, applyHref }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Hysteresis (on at 64px, off at 16px) so the state can't oscillate around one threshold.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => (prev ? y > 16 : y > 64));
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty("transform", `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const label = open;
      setOpen(null);
      headerRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${label}"]`)?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const hoverOpen = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(label), 90);
  }, []);
  const hoverClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 180);
  }, []);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const current = activeLabel(pathname, nav);

  return (
    <>
      <div className="utility">
        <div className="container utility__inner">
          <nav className="utility__group utility__left" aria-label="Quick links">
            {utility
              .filter((u) => u.href)
              .map((u) => (
                <SmartLink key={u.label} href={u.href} external={u.external}>
                  {u.label}
                </SmartLink>
              ))}
          </nav>
          <div className="utility__group">
            <Link href="/contact" className="hide-sm">
              Contact
            </Link>
            <a href={`mailto:${contact.email}`} className="hide-sm">
              <Mail aria-hidden="true" />
              {contact.email}
            </a>
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
              <Phone aria-hidden="true" />
              {contact.phone}
            </a>
            <span className="utility__divider" aria-hidden="true" />
            <button type="button" className="utility__search" onClick={openSearch} aria-keyshortcuts="Control+K">
              <Search aria-hidden="true" />
              Search <kbd>Ctrl K</kbd>
            </button>
          </div>
        </div>
      </div>

    <header className="site-header" data-scrolled={scrolled} ref={headerRef}>
      <div className="navbar" onMouseLeave={hoverClose}>
        <div className="container navbar__inner">
          <Link href="/" className="brand" aria-label={`${brand.name}, home`}>
            <BrandMark className="brand__mark" />
            <span className="brand__text">
              <span className="brand__name">
                Dr. Lankapalli Bullayya
                <br />
                College of Engineering
              </span>
              <span className="brand__sub">{brand.tagline}</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Main">
            <ul className="nav__list">
              {nav.map((item) => {
                const active = item.label === current;
                if (!item.mega) {
                  return (
                    <li className="nav__item" key={item.label}>
                      <Link
                        href={item.href}
                        className="nav__link"
                        aria-current={active ? "page" : undefined}
                        onMouseEnter={hoverClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const expanded = open === item.label;
                const panelId = `mega-${slugify(item.label)}`;
                return (
                  <li className="nav__item" key={item.label} onMouseEnter={() => hoverOpen(item.label)}>
                    <button
                      type="button"
                      className="nav__link"
                      data-menu={item.label}
                      data-active={active}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => {
                        window.clearTimeout(closeTimer.current);
                        setOpen(expanded ? null : item.label);
                      }}
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" />
                    </button>
                    <MegaPanel
                      id={panelId}
                      item={item}
                      open={expanded}
                      departments={departments}
                      onEnter={() => window.clearTimeout(closeTimer.current)}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar__actions">
            <Link href={applyHref} className="btn btn--premium btn--sm navbar__cta-desktop">
              Apply Now
            </Link>
            <button type="button" className="icon-btn menu-toggle" onClick={openSearch} aria-label="Search">
              <Search aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-label="Open menu"
              aria-expanded={drawer}
              aria-controls="mobile-drawer"
              onClick={() => setDrawer(true)}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={drawer}
        onClose={closeDrawer}
        nav={nav}
        departments={departments}
        pathname={pathname}
        applyHref={applyHref}
        contact={contact}
      />
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
    </header>
    </>
  );
}

function MegaPanel({
  id,
  item,
  open,
  departments,
  onEnter,
}: {
  id: string;
  item: MainNavItem;
  open: boolean;
  departments: DeptLite[];
  onEnter: () => void;
}) {
  const mega = item.mega!;
  return (
    <div className="mega" id={id} data-open={open} onMouseEnter={onEnter} inert={!open}>
      <div className="container mega__inner">
        <div className="mega__intro">
          <h2>{mega.title}</h2>
          {mega.intro && <p>{mega.intro}</p>}
          <Link href={item.href} className="link-arrow" style={{ color: "var(--gold)" }}>
            {mega.type === "departments" ? "All departments" : `${item.label} overview`}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        {mega.type === "departments" ? (
          <div className="mega-depts">
            {departments.map((d) => (
              <Link key={d.slug} href={`/departments/${d.slug}`} className="mega-dept">
                <span className="mega-dept__code" aria-hidden="true">
                  {d.code}
                </span>
                <Icon name={d.icon} className="dept-icon" />
                <h3>{d.name}</h3>
                <p>{d.summary}</p>
                <span className="mega-dept__cta">
                  Explore {d.short}
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mega__groups">
            {mega.groups.map((g) => (
              <div key={g.title}>
                <h3 className="mega__group-title">{g.title}</h3>
                <ul className="mega__links">
                  {g.items.map((i) => (
                    <li key={i.label}>
                      <SmartLink href={i.href} external={i.external} className="mega-link">
                        <Icon name={i.icon ?? "ArrowRight"} />
                        <span>
                          <span className="mega-link__label">{i.label}</span>
                          {i.desc && <span className="mega-link__desc">{i.desc}</span>}
                        </span>
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
