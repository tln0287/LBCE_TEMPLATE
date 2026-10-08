"use client";

import { useState } from "react";
import { Megaphone, Pause, Play } from "lucide-react";
import { SmartLink } from "@/components/ui/SmartLink";

type Item = { text: string; href: string; external?: boolean };

/** Announcement marquee beneath the hero. Pausable, pauses on hover/focus, static for reduced motion. */
export function Ticker({ items }: { items: Item[] }) {
  const [paused, setPaused] = useState(false);
  const loop = [...items, ...items];
  return (
    <section className="ticker" aria-label="Latest announcements" data-paused={paused}>
      <div className="container ticker__inner">
        <p className="ticker__label">
          <Megaphone aria-hidden="true" />
          <span>Latest announcements</span>
        </p>
        <div className="ticker__viewport">
          <ul className="ticker__track">
            {loop.map((item, i) => (
              <li key={i} aria-hidden={i >= items.length ? true : undefined}>
                <SmartLink href={item.href} external={item.external} tabIndex={i >= items.length ? -1 : undefined}>
                  {item.text}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="ticker__toggle"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Resume announcements" : "Pause announcements"}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
