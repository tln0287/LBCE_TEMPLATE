"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ExternalLink, Eye, FileText, Mail, Search, Users, X } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { Doc } from "@/lib/content";
import { DocViewerModal } from "./DocViewerModal";
import { ACTION, groupCommittees, groupOf, type CommitteeItem } from "./committeeGroups";

/**
 * Master–detail committee directory.
 * Desktop: grouped, searchable list on the left; the selected committee in full on the right.
 * Mobile: the list becomes an accordion with the detail opening under the selected item.
 * Deep links (/committees#icc) select that committee; selecting updates the URL hash.
 */
export function CommitteeExplorer({ committees, legacyUrl }: { committees: CommitteeItem[]; legacyUrl: string }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(committees[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [doc, setDoc] = useState<Doc | null>(null);
  const closeDoc = useCallback(() => setDoc(null), []);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id && committees.some((c) => c.id === id)) {
        setSelected(id);
        setMobileOpen(id);
        setQ("");
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [committees]);

  const term = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      committees.filter(
        (c) => !term || [c.name, c.purpose, groupOf(c), ...c.responsibilities].join(" ").toLowerCase().includes(term),
      ),
    [committees, term],
  );
  const groups = useMemo(() => groupCommittees(filtered), [filtered]);
  const current = committees.find((c) => c.id === selected) ?? committees[0];

  const choose = (id: string) => {
    setSelected(id);
    setMobileOpen((m) => (m === id ? null : id));
    history.replaceState(null, "", `#${id}`);
    if (window.matchMedia("(min-width: 961px)").matches) {
      detailRef.current?.focus({ preventScroll: true });
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const ids = filtered.map((c) => c.id);
    const i = ids.indexOf(selected);
    const next = ids[(i + (e.key === "ArrowDown" ? 1 : -1) + ids.length) % ids.length];
    if (next) {
      setSelected(next);
      document.getElementById(`cx-btn-${next}`)?.focus();
    }
  };

  return (
    <div className="cx">
      <aside className="cx__side">
        <label className="cx__search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search committees</span>
          <input
            type="search"
            placeholder="Search, e.g. ragging, exams, women"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search">
              <X aria-hidden="true" />
            </button>
          )}
        </label>
        <p className="cx__count" role="status" aria-live="polite">
          {filtered.length === committees.length ? `${committees.length} committees` : `${filtered.length} of ${committees.length} committees`}
        </p>

        {filtered.length === 0 ? (
          <div className="cx__none">
            <p>No committee matches “{q}”.</p>
            <button type="button" className="btn btn--outline-dark btn--sm" onClick={() => setQ("")}>
              Clear search
            </button>
          </div>
        ) : (
          <nav aria-label="Committees" onKeyDown={onListKey}>
            {groups.map(([group, items]) => (
              <div key={group} className="cx__group">
                <p className="cx__group-title">
                  {group}
                  <span>{items.length}</span>
                </p>
                <ul>
                  {items.map((c) => {
                    const active = c.id === current?.id;
                    return (
                      <li key={c.id} id={c.id} className="cx__item" data-active={active}>
                        <button
                          type="button"
                          id={`cx-btn-${c.id}`}
                          className="cx__btn"
                          aria-current={active ? "true" : undefined}
                          aria-expanded={mobileOpen === c.id}
                          aria-controls="cx-detail"
                          onClick={() => choose(c.id)}
                        >
                          <span className="cx__btn-icon">
                            <Icon name={c.icon} />
                          </span>
                          <span className="cx__btn-text">
                            <span className="cx__btn-name">{c.name}</span>
                            <span className="cx__btn-purpose">{c.purpose}</span>
                          </span>
                          <ArrowRight className="cx__btn-arrow" aria-hidden="true" />
                          <ChevronDown className="cx__btn-chev" aria-hidden="true" />
                        </button>
                        {/* Mobile: detail opens inline under the chosen committee */}
                        {mobileOpen === c.id && (
                          <div className="cx__inline">
                            <Detail c={c} legacyUrl={legacyUrl} onDoc={setDoc} compact />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </aside>

      <div className="cx__detail" id="cx-detail" ref={detailRef} tabIndex={-1} aria-live="polite">
        {current && <Detail key={current.id} c={current} legacyUrl={legacyUrl} onDoc={setDoc} />}
      </div>

      {doc && <DocViewerModal doc={doc} onClose={closeDoc} />}
    </div>
  );
}

function Detail({
  c,
  legacyUrl,
  onDoc,
  compact = false,
}: {
  c: CommitteeItem;
  legacyUrl: string;
  onDoc: (d: Doc) => void;
  compact?: boolean;
}) {
  const action = ACTION[c.id];
  return (
    <article className={`cx-d ${compact ? "cx-d--compact" : ""}`} aria-labelledby={`cx-h-${c.id}${compact ? "-m" : ""}`}>
      {!compact && (
        <header className="cx-d__head">
          <span className="cx-d__icon">
            <Icon name={c.icon} />
          </span>
          <div>
            <span className="cx-d__group">{groupOf(c)} committee</span>
            <h2 id={`cx-h-${c.id}`}>{c.name}</h2>
            <p>{c.purpose}</p>
          </div>
          {action && (
            <Link href={action.href} className="btn btn--premium btn--sm cx-d__action">
              {action.label}
              <ArrowRight className="arrow" aria-hidden="true" />
            </Link>
          )}
        </header>
      )}
      {compact && <h3 id={`cx-h-${c.id}-m`} className="sr-only">{c.name}</h3>}

      <div className="cx-d__body">
        <section className="cx-d__block">
          <h3>What it does</h3>
          <ul className="cx-d__resp">
            {c.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <div className="cx-d__cols">
          <section className="cx-d__block">
            <h3>
              <Users aria-hidden="true" /> Members
            </h3>
            {c.members.length ? (
              <ul className="cx-d__members">
                {c.members.map((m) => {
                  const mm = typeof m === "string" ? { name: m } : m;
                  return (
                    <li key={mm.name}>
                      <span className="cx-d__avatar" aria-hidden="true">
                        {mm.name
                          .split(/\s+/)
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span>
                        <strong>{mm.name}</strong>
                        {(mm.role || mm.designation) && <small>{[mm.role, mm.designation].filter(Boolean).join(", ")}</small>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="cx-d__pending">Member list will be published once the official composition is supplied.</p>
            )}
          </section>

          <section className="cx-d__block">
            <h3>
              <FileText aria-hidden="true" /> Documents
            </h3>
            {c.documents.length ? (
              <ul className="cx-d__docs">
                {c.documents.map((d) => (
                  <li key={d.url}>
                    <FileText aria-hidden="true" />
                    <span>{d.title}</span>
                    <button type="button" className="btn btn--outline-dark btn--sm" onClick={() => onDoc(d)} aria-haspopup="dialog">
                      <Eye aria-hidden="true" /> View<span className="sr-only"> {d.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cx-d__pending">Minutes and circulars will appear here as they are published.</p>
            )}
          </section>
        </div>

        <section className="cx-d__block cx-d__contact">
          <h3>
            <Mail aria-hidden="true" /> Contact
          </h3>
          {c.contact ? (
            /@/.test(c.contact) ? <a href={`mailto:${c.contact}`}>{c.contact}</a> : <p>{c.contact}</p>
          ) : (
            <p className="cx-d__pending">Contact the college office until a committee contact is published.</p>
          )}
          <div className="cx-d__links">
            {compact && action && (
              <Link href={action.href} className="btn btn--premium btn--sm">
                {action.label}
              </Link>
            )}
            {legacyUrl && (
              <a href={legacyUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                View on the current website <ExternalLink aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
