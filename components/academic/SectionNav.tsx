"use client";

import { useEffect, useState } from "react";

/**
 * Sticky in-page navigation (shared `.subnav` styling) that marks the section
 * currently in view with aria-current. Works as plain anchors without JS.
 */
export function SectionNav({ items, label = "On this page" }: { items: { id: string; label: string }[]; label?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        const first = items.find((i) => visible.has(i.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    if (!active) return;
    const link = document.querySelector<HTMLElement>(`.acad-subnav a[href="#${CSS.escape(active)}"]`);
    const list = link?.closest("ul");
    if (link && list) {
      const target = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
      list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav className="subnav acad-subnav" aria-label={label}>
      <div className="container">
        <ul>
          {items.map((i) => (
            <li key={i.id}>
              <a href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
