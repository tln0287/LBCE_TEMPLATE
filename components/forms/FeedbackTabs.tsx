"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { FormShell, type FormShellProps } from "./FormShell";

export type FeedbackTab = {
  id: string;
  label: string;
  icon: string;
  title: string;
  intro: string;
  form: Omit<FormShellProps, "endpoint" | "fallback">;
};

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation): arrow keys move
 * between tabs, Home/End jump to the ends. Every panel stays mounted so switching
 * tabs never discards what someone has typed.
 */
export function FeedbackTabs({
  tabs,
  endpoint,
  fallback,
}: {
  tabs: FeedbackTab[];
  endpoint: string;
  fallback: FormShellProps["fallback"];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="fbk">
      <div className="fbk-tabs" role="tablist" aria-label="Who is giving feedback" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`fbk-tab-${t.id}`}
            aria-controls={`fbk-panel-${t.id}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className="fbk-tab"
            onClick={() => setActive(i)}
          >
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`fbk-panel-${t.id}`}
          aria-labelledby={`fbk-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="fbk-panel"
        >
          <div className="fbk-panel__head">
            <h2>{t.title}</h2>
            <p>{t.intro}</p>
          </div>
          <FormShell {...t.form} endpoint={endpoint} fallback={fallback} />
        </div>
      ))}
    </div>
  );
}
