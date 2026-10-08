"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SPOT_SELECTOR =
  ".card, .quick__card, .accr-card, .doc-card, .ach-card, .news-card, .mega-link, .mega-dept, .dept-card__link, .timeline__card";

/**
 * Page-wide motion helpers, mounted once in the layout:
 * 1. Scroll reveal — any `.reveal` element animates in once when it enters the viewport.
 *    Elements entering together are staggered automatically (unless they set --delay).
 *    Elements added later (e.g. after filtering) are picked up by a MutationObserver.
 * 2. Card spotlight — sets --mx/--my on the hovered card so CSS can draw a soft light
 *    that follows the pointer.
 * Both are skipped for visitors who prefer reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pending = () => Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible):not([data-observed])"));

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        entering.forEach((el, i) => {
          if (!el.style.getPropertyValue("--delay")) el.style.setProperty("--delay", `${Math.min(i, 8) * 80}ms`);
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observe = () =>
      pending().forEach((el) => {
        el.dataset.observed = "true";
        io.observe(el);
      });
    observe();

    const mo = new MutationObserver(() => observe());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.querySelectorAll<HTMLElement>(".reveal[data-observed]:not(.is-visible)").forEach((el) => delete el.dataset.observed);
    };
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(SPOT_SELECTOR);
      if (!card) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
