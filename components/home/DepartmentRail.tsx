"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import type { Department } from "@/lib/content";

const SURFACES = ["white", "ivory", "sky"] as const;

/** Horizontal, swipeable department carousel with scroll-snap and prev/next buttons. */
export function DepartmentRail({ departments }: { departments: Department[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () =>
      setEdges({ start: rail.scrollLeft < 8, end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8 });
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="dept-rail">
      <div className="dept-rail__nav">
        <button type="button" className="round-btn" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Previous departments">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className="round-btn" onClick={() => scroll(1)} disabled={edges.end} aria-label="Next departments">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <ul className="dept-rail__track" ref={railRef} aria-label="Engineering departments">
        {departments.map((d, i) => (
          <li key={d.slug} className={`dept-card dept-card--${SURFACES[i % SURFACES.length]}`}>
            <Link href={`/departments/${d.slug}`} className="dept-card__link">
              <div className="dept-card__media">
                <Img src={d.image} alt="" width={800} sizes="(max-width: 640px) 85vw, 420px" />
                <span className="dept-card__code" aria-hidden="true">
                  {d.code}
                </span>
              </div>
              <div className="dept-card__body">
                <span className="icon-badge">
                  <Icon name={d.icon} />
                </span>
                <h3>{d.name}</h3>
                <p>{d.summary}</p>
                <dl className="dept-card__facts">
                  <div>
                    <dt>Programs</dt>
                    <dd>{d.programs.length}</dd>
                  </div>
                  <div>
                    <dt>Labs</dt>
                    <dd>{d.labs.length}</dd>
                  </div>
                  <div>
                    <dt>Faculty</dt>
                    <dd>{d.faculty}</dd>
                  </div>
                  <div>
                    <dt>Research areas</dt>
                    <dd>{d.research.length}</dd>
                  </div>
                </dl>
                <span className="dept-card__cta">
                  Explore department <ArrowRight aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
