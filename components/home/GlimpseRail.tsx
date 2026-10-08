"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Img } from "@/components/ui/Img";

type Item = { id: string; caption: string; image: string; category: string };

/** Horizontally scrolling campus glimpses with scroll-snap. */
export function GlimpseRail({ items }: { items: Item[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: "smooth" });
  return (
    <div className="glimpses">
      <ul className="glimpses__track" ref={ref} aria-label="Campus photographs">
        {items.map((g) => (
          <li key={g.id} className="glimpse">
            <figure>
              <Img src={g.image} alt={g.caption} width={1000} sizes="(max-width: 640px) 85vw, 560px" />
              <figcaption>
                <span className="glimpse__cat">{g.category}</span>
                {g.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="container glimpses__nav">
        <button type="button" className="round-btn round-btn--light" onClick={() => scroll(-1)} aria-label="Scroll photos left">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className="round-btn round-btn--light" onClick={() => scroll(1)} aria-label="Scroll photos right">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
