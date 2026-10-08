"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { FacultyCard } from "./FacultyCard";
import type { FacultyMember } from "@/lib/content";

type Dept = { slug: string; code: string; name: string };

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/**
 * Searchable, filterable faculty grid. Filter state mirrors the URL (?q=, ?dept=,
 * ?designation=, ?spec=) so results can be linked and the back button works.
 */
export function FacultyDirectory({
  members,
  departments,
  designations,
}: {
  members: FacultyMember[];
  departments: Dept[];
  designations: string[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(() => params.get("q") ?? "");
  const [dept, setDept] = useState(() => params.get("dept") ?? "");
  const [designation, setDesignation] = useState(() => params.get("designation") ?? "");
  const [spec, setSpec] = useState(() => params.get("spec") ?? "");

  // Keep the URL in sync (replace, so typing does not flood history).
  useEffect(() => {
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (dept) next.set("dept", dept);
    if (designation) next.set("designation", designation);
    if (spec) next.set("spec", spec);
    const qs = next.toString();
    if (qs !== params.toString()) router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, dept, designation, spec]);

  const deptName = useMemo(() => new Map(departments.map((d) => [d.slug, d.name])), [departments]);

  const designationOptions = useMemo(
    () => Array.from(new Set([...designations, ...members.map((m) => m.designation).filter(Boolean)])),
    [designations, members],
  );
  const specOptions = useMemo(
    () =>
      Array.from(
        new Set(
          members
            .flatMap((m) => m.specialization.split(/[,;/]/))
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [members],
  );

  const results = useMemo(() => {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    return members.filter((m) => {
      if (dept && m.department !== dept) return false;
      if (designation && m.designation !== designation) return false;
      if (spec && !norm(m.specialization).includes(norm(spec))) return false;
      if (!terms.length) return true;
      const hay = norm([m.name, m.designation, deptName.get(m.department) ?? m.department, m.qualification, m.specialization, m.email].join(" "));
      return terms.every((t) => hay.includes(t));
    });
  }, [members, q, dept, designation, spec, deptName]);

  const filtered = Boolean(q.trim() || dept || designation || spec);
  const reset = () => {
    setQ("");
    setDept("");
    setDesignation("");
    setSpec("");
  };

  return (
    <div className="fac-dir">
      <form className="fac-dir-filters" role="search" aria-label="Filter faculty" onSubmit={(e) => e.preventDefault()}>
        <div className="field fac-dir-filters__search">
          <label htmlFor="fac-q">Search</label>
          <div className="searchbox">
            <Search aria-hidden="true" />
            <input
              id="fac-q"
              className="input"
              type="search"
              placeholder="Name, subject or qualification"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="fac-dept">Department</label>
          <select id="fac-dept" className="select" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="fac-desig">Designation</label>
          <select id="fac-desig" className="select" value={designation} onChange={(e) => setDesignation(e.target.value)}>
            <option value="">All designations</option>
            {designationOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="fac-spec">Specialization</label>
          <select
            id="fac-spec"
            className="select"
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            disabled={specOptions.length === 0}
            aria-describedby={specOptions.length === 0 ? "fac-spec-hint" : undefined}
          >
            <option value="">All specializations</option>
            {specOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {specOptions.length === 0 && (
            <span id="fac-spec-hint" className="hint">
              Available once profiles are published.
            </span>
          )}
        </div>
      </form>

      <div className="fac-dir-status">
        <p aria-live="polite">
          {members.length === 0
            ? "No faculty profiles published yet."
            : `Showing ${results.length} of ${members.length} faculty member${members.length === 1 ? "" : "s"}.`}
        </p>
        {filtered && (
          <button type="button" className="fac-dir-reset" onClick={reset}>
            <X aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="empty">
          <h3>The faculty directory is being compiled</h3>
          <p>
            Faculty profiles will be published once each department supplies them. Meanwhile, browse the departments to see programs, laboratories
            and research areas.
          </p>
          <div className="fac-dir-depts">
            {departments.map((d) => (
              <Link key={d.slug} href={`/departments/${d.slug}#faculty`} className="chip">
                {d.code}
                <span className="sr-only"> ({d.name})</span>
              </Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="empty">
          <h3>No faculty match these filters</h3>
          <p>Try a different search term or clear the filters.</p>
          <button type="button" className="btn btn--outline-dark btn--sm" onClick={reset}>
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="fac-dir-grid">
          {results.map((m) => (
            <li key={m.id}>
              <FacultyCard member={m} departmentName={deptName.get(m.department)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
