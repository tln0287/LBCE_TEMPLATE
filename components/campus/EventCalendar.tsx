"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatRange } from "@/lib/format";

export type CalendarEvent = { slug: string; title: string; date: string; endDate?: string; category: string; location: string };

const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
const dayLabelFmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const WEEKDAYS = [
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"],
  ["Sun", "Sunday"],
];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const utc = (y: number, m: number, d = 1) => new Date(Date.UTC(y, m, d, 12));

/**
 * Simple month view. All dates are handled in UTC so the grid never shifts with
 * the visitor's time zone; `today` and the starting month come from the server.
 */
export function EventCalendar({ events, initialMonth, today }: { events: CalendarEvent[]; initialMonth: string; today: string }) {
  const [y0, m0] = initialMonth.split("-").map(Number);
  const [cursor, setCursor] = useState({ y: y0, m: m0 - 1 });

  const { cells, monthEvents, label } = useMemo(() => {
    const first = utc(cursor.y, cursor.m, 1);
    const daysInMonth = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
    const lead = (first.getUTCDay() + 6) % 7; // Monday-first
    const prefix = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`;
    const out: { day: number | null; iso?: string; items: CalendarEvent[] }[] = [];
    for (let i = 0; i < lead; i++) out.push({ day: null, items: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const key = iso(utc(cursor.y, cursor.m, d));
      out.push({ day: d, iso: key, items: events.filter((e) => e.date <= key && (e.endDate ?? e.date) >= key) });
    }
    while (out.length % 7) out.push({ day: null, items: [] });
    const monthEvents = events.filter((e) => e.date.slice(0, 7) <= prefix && (e.endDate ?? e.date).slice(0, 7) >= prefix);
    return { cells: out, monthEvents, label: monthFmt.format(first) };
  }, [cursor, events]);

  const shift = (dir: 1 | -1) =>
    setCursor((c) => {
      const m = c.m + dir;
      return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="evt-cal">
      <div className="evt-cal__panel">
        <div className="evt-cal__head">
          <h3 className="evt-cal__month" aria-live="polite">
            {label}
          </h3>
          <div className="evt-cal__nav">
            <button type="button" className="round-btn round-btn--light" onClick={() => shift(-1)} aria-label="Previous month">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className="round-btn round-btn--light" onClick={() => shift(1)} aria-label="Next month">
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <table className="evt-cal__grid">
          <caption className="sr-only">Events in {label}</caption>
          <thead>
            <tr>
              {WEEKDAYS.map(([s, l]) => (
                <th key={s} scope="col" abbr={l}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, wi) => (
              <tr key={wi}>
                {w.map((c, ci) =>
                  c.day === null ? (
                    <td key={ci} className="evt-cal__cell is-empty" />
                  ) : (
                    <td
                      key={ci}
                      className={`evt-cal__cell ${c.items.length ? "has-events" : ""} ${c.iso === today ? "is-today" : ""}`}
                      aria-label={c.items.length ? `${dayLabelFmt.format(utc(cursor.y, cursor.m, c.day))}, ${c.items.length} event${c.items.length > 1 ? "s" : ""}` : undefined}
                    >
                      <span className="evt-cal__day" aria-hidden={c.items.length ? true : undefined}>
                        {c.day}
                      </span>
                      {c.items.length > 0 && (
                        <ul className="evt-cal__items">
                          {c.items.map((e) => (
                            <li key={e.slug}>
                              <a href={`#${e.slug}`} title={e.title}>
                                <span className="evt-cal__dot" aria-hidden="true" />
                                <span className="evt-cal__title">{e.title}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="evt-cal__list">
        <h3>In {label.split(" ")[0]}</h3>
        {monthEvents.length ? (
          <ul>
            {monthEvents.map((e) => (
              <li key={e.slug}>
                <a href={`#${e.slug}`}>
                  <span className="tag">{e.category}</span>
                  <strong>{e.title}</strong>
                  <span className="evt-cal__when">
                    {formatRange(e.date, e.endDate)} · {e.location}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="evt-cal__none">No events listed for this month.</p>
        )}
      </div>
    </div>
  );
}
