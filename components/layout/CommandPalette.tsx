"use client";

import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, CornerDownLeft, Loader2, Search, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import {
  groupResults,
  highlight,
  prepareIndex,
  search,
  snippet,
  type SearchEntry,
  type SearchGroup,
  type SearchResult,
} from "@/lib/searchEngine";
import { OPEN_SEARCH_EVENT } from "./searchEvents";

const GROUP_ICON: Record<SearchGroup, string> = {
  "Quick actions": "Zap",
  Pages: "LayoutGrid",
  Sections: "Layers",
  Departments: "Building2",
  Facilities: "Building",
  Faculty: "Users",
  Events: "CalendarDays",
  News: "Newspaper",
  Documents: "FileText",
  Policies: "Scale",
  Committees: "Network",
  Contact: "Phone",
};
const PER_GROUP = 5;
const RECENT_KEY = "lbce-recent-searches";
const SUGGESTED = ["Admissions", "Departments", "Placements", "Academics", "Facilities", "Contact"];
const TRY = ["hostel fees", "library", "exam results", "anti-ragging", "cse labs", "nirf", "bus routes", "placements"];

let indexPromise: Promise<ReturnType<typeof prepareIndex>> | null = null;
/** Fetches and prepares the index once per session. */
function loadIndex() {
  indexPromise ??= fetch("/search-index.json")
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<SearchEntry[]>;
    })
    .then(prepareIndex)
    .catch((e) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]").slice(0, 5);
  } catch {
    return [];
  }
}
function saveRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: recent searches are a convenience only */
  }
}

function Marked({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((s, i) => (s.hit ? <mark key={i}>{s.text}</mark> : <Fragment key={i}>{s.text}</Fragment>))}
    </>
  );
}

type Row =
  | { kind: "result"; entry: SearchResult | SearchEntry }
  | { kind: "recent"; query: string }
  | { kind: "all"; query: string; count: number };

/** Global search: Ctrl/Cmd+K or "/" opens a grouped, keyboard-driven command palette over the whole site. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<Awaited<ReturnType<typeof loadIndex>> | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const ensureIndex = useCallback(() => {
    if (index) return;
    setStatus("loading");
    loadIndex()
      .then((idx) => {
        setIndex(idx);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable='true']");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      if (q) setQuery(q);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    // Warm the index when the browser is idle so the first search is instant.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const t = idle ? idle(() => loadIndex().catch(() => {})) : window.setTimeout(() => loadIndex().catch(() => {}), 3000);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      if (!idle) window.clearTimeout(t as number);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    ensureIndex();
    setRecent(readRecent());
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => {
      document.body.classList.remove("no-scroll");
      restoreRef.current?.focus?.();
    };
  }, [open, ensureIndex]);

  const q = query.trim();
  const results = useMemo(() => (index && q ? search(index, q, 80) : []), [index, q]);

  const groups = useMemo(() => {
    if (q) return groupResults(results).map((g) => ({ title: g.group as string, group: g.group, items: g.items.slice(0, PER_GROUP) }));
    if (!index) return [];
    const entries = index.map((p) => p.entry);
    return [
      { title: "Quick actions", group: "Quick actions" as SearchGroup, items: entries.filter((e) => e.group === "Quick actions").slice(0, 5) },
      { title: "Popular pages", group: "Pages" as SearchGroup, items: SUGGESTED.map((t) => entries.find((e) => e.group === "Pages" && e.title === t)).filter(Boolean) as SearchEntry[] },
    ];
  }, [q, results, index]);

  const rows: Row[] = useMemo(() => {
    const r: Row[] = [];
    if (!q) recent.forEach((x) => r.push({ kind: "recent", query: x }));
    groups.forEach((g) => g.items.forEach((entry) => r.push({ kind: "result", entry })));
    if (q && results.length) r.push({ kind: "all", query: q, count: results.length });
    return r;
  }, [q, recent, groups, results.length]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const close = () => setOpen(false);

  const go = (row: Row) => {
    if (row.kind === "recent") {
      setQuery(row.query);
      return;
    }
    if (q) saveRecent(q);
    if (row.kind === "all") {
      close();
      router.push(`/search?q=${encodeURIComponent(row.query)}`);
      return;
    }
    const { href, external } = row.entry;
    close();
    setQuery("");
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else if (/^(tel|mailto):/.test(href)) window.location.href = href;
    else router.push(href);
  };

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query) setQuery("");
      else close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(rows.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + rows.length) % Math.max(rows.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rows[active]) go(rows[active]);
      else if (q) go({ kind: "all", query: q, count: 0 });
    } else if (e.key === "Tab") {
      // Keep focus in the dialog: Tab cycles results like the arrow keys.
      e.preventDefault();
      setActive((a) => (e.shiftKey ? (a - 1 + rows.length) % Math.max(rows.length, 1) : (a + 1) % Math.max(rows.length, 1)));
    }
  };

  let i = -1;
  const rowProps = (idx: number) => ({
    id: `pal-${idx}`,
    "data-index": idx,
    role: "option" as const,
    "aria-selected": idx === active,
    onMouseMove: () => setActive(idx),
  });

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search the site" onKeyDown={onKeyDown}>
        <div className="palette__bar">
          {status === "loading" ? <Loader2 className="palette__spin" aria-hidden="true" /> : <Search aria-hidden="true" />}
          <input
            ref={inputRef}
            className="palette__input"
            placeholder="Search pages, departments, facilities, documents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={rows[active] ? `pal-${active}` : undefined}
            aria-autocomplete="list"
            enterKeyHint="search"
          />
          {query && (
            <button type="button" className="palette__clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Clear search">
              <X aria-hidden="true" />
            </button>
          )}
          <button type="button" className="palette__close" onClick={close}>
            Esc
          </button>
        </div>

        <div className="palette__results" id="palette-results" role="listbox" ref={listRef} aria-label="Search results">
          {status === "error" && (
            <p className="palette__empty">
              Search couldn&apos;t load. Check your connection and press Enter to open the full results page.
            </p>
          )}

          {!q && recent.length > 0 && (
            <div role="group" aria-label="Recent searches">
              <p className="palette__group-title">Recent searches</p>
              {recent.map((r) => {
                i += 1;
                const idx = i;
                return (
                  <div key={`r-${r}`} {...rowProps(idx)} className="palette__item" onClick={() => go({ kind: "recent", query: r })}>
                    <Clock aria-hidden="true" />
                    <span className="palette__item-title">{r}</span>
                  </div>
                );
              })}
            </div>
          )}

          {q && index && results.length === 0 && (
            <div className="palette__empty">
              <p>
                No matches for <strong>“{q}”</strong>. Check the spelling, or try one of these:
              </p>
              <div className="palette__try">
                {TRY.map((t) => (
                  <button key={t} type="button" className="chip" onClick={() => setQuery(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {groups.map((g) => (
            <div key={g.title} role="group" aria-label={g.title}>
              <p className="palette__group-title">{g.title}</p>
              {g.items.map((entry) => {
                i += 1;
                const idx = i;
                const snip = q && "score" in entry && entry.body ? snippet(entry.body, q, 50) : "";
                return (
                  <div key={entry.id} {...rowProps(idx)} className="palette__item" onClick={() => go({ kind: "result", entry })}>
                    <span className="palette__icon">
                      <Icon name={entry.icon ?? GROUP_ICON[entry.group]} />
                    </span>
                    <span className="palette__text">
                      <span className="palette__item-title">
                        <Marked text={entry.title} query={q} />
                      </span>
                      {(snip || entry.subtitle) && (
                        <span className="palette__item-sub">
                          <Marked text={snip || entry.subtitle || ""} query={q} />
                        </span>
                      )}
                    </span>
                    {entry.external ? (
                      <ArrowUpRight className="palette__go" aria-label="opens in a new tab" />
                    ) : (
                      <CornerDownLeft className="palette__go palette__go--enter" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {q && results.length > 0 && (() => {
            i += 1;
            const idx = i;
            return (
              <div {...rowProps(idx)} className="palette__item palette__all" onClick={() => go({ kind: "all", query: q, count: results.length })}>
                <Search aria-hidden="true" />
                <span className="palette__item-title">
                  See all {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
                </span>
                <ArrowRight className="palette__go" aria-hidden="true" />
              </div>
            );
          })()}
        </div>

        <div className="palette__foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>Enter</kbd> open
          </span>
          <span>
            <kbd>Esc</kbd> {query ? "clear" : "close"}
          </span>
          <span className="palette__foot-tip">
            Tip: press <kbd>/</kbd> anywhere to search
          </span>
        </div>
      </div>
    </div>
  );
}
