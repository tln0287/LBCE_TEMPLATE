import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SearchBar } from "@/components/ui/SearchBar";
import { buildSearchIndex } from "@/lib/search";
import { GROUP_ORDER, groupResults, highlight, prepareIndex, search, snippet, type SearchGroup } from "@/lib/searchEngine";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the LBCE website: pages, departments, facilities, events, news, documents and policies.",
  robots: { index: false, follow: true },
};

let prepared: ReturnType<typeof prepareIndex> | null = null;
const getIndex = () => (prepared ??= prepareIndex(buildSearchIndex()));

const GROUP_ICON: Record<SearchGroup | "Top results", string> = {
  "Top results": "Target",
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
const TRY = ["Admissions", "Hostel", "Library", "Exam results", "Anti-ragging", "CSE labs", "NIRF", "Placements", "Bus", "Grievance"];

function Marked({ text, q }: { text: string; q: string }) {
  return (
    <>
      {highlight(text, q).map((s, i) => (s.hit ? <mark key={i}>{s.text}</mark> : <span key={i}>{s.text}</span>))}
    </>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; group?: string }> }) {
  const { q: rawQ = "", group: rawGroup } = await searchParams;
  const q = rawQ.trim().slice(0, 120);
  const all = q ? search(getIndex(), q, 200) : [];
  const groups = groupResults(all);
  // Filter chips count every result in a type (ignoring the "Top results" pull-out).
  const byType = groupResults(all, 0);
  const group = GROUP_ORDER.find((g) => g === rawGroup);
  const shown = group ? byType.filter((g) => g.group === group) : groups;
  const href = (g?: string) => `/search?q=${encodeURIComponent(q)}${g ? `&group=${encodeURIComponent(g)}` : ""}`;

  return (
    <>
      <section className="search-hero">
        <div className="search-hero__grid" aria-hidden="true" />
        <div className="container search-hero__inner">
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              <li>
                <Link href="/">Home</Link>
                <ChevronRight aria-hidden="true" />
              </li>
              <li>
                <span aria-current="page">Search</span>
              </li>
            </ol>
          </nav>
          <h1>{q ? <>Results for “{q}”</> : "Search the website"}</h1>
          <SearchBar defaultValue={q} autoOpen={false} placeholder="Try “hostel”, “exam results” or “CSE labs”" />
          {q && (
            <p className="search-hero__count" role="status">
              {all.length ? `${all.length} result${all.length === 1 ? "" : "s"} across ${byType.length} categor${byType.length === 1 ? "y" : "ies"}` : "No results"}
            </p>
          )}
        </div>
      </section>

      <section className="section search-results">
        <div className="container">
          {q && byType.length > 1 && (
            <nav className="chips search-filters" aria-label="Filter results by type">
              <Link href={href()} className="chip" aria-current={!group ? "true" : undefined} aria-selected={!group}>
                All <span className="search-filters__n">{all.length}</span>
              </Link>
              {byType.map((g) => (
                <Link key={g.group} href={href(g.group)} className="chip" aria-current={group === g.group ? "true" : undefined} aria-selected={group === g.group}>
                  {g.group} <span className="search-filters__n">{g.items.length}</span>
                </Link>
              ))}
            </nav>
          )}

          {!q && (
            <div className="search-empty">
              <h2>Popular searches</h2>
              <div className="chips">
                {TRY.map((t) => (
                  <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="chip">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {q && all.length === 0 && (
            <div className="search-empty">
              <h2>Nothing matched “{q}”</h2>
              <p>Check the spelling, use fewer words, or try one of these searches.</p>
              <div className="chips">
                {TRY.map((t) => (
                  <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="chip">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {shown.map((g) => (
            <section key={g.group} className="search-group" aria-labelledby={`sg-${g.group.replace(/\W+/g, "-")}`}>
              <h2 id={`sg-${g.group.replace(/\W+/g, "-")}`} className="search-group__title">
                <Icon name={GROUP_ICON[g.group]} /> {g.group}
                <span>{g.items.length}</span>
              </h2>
              <ol className="search-list">
                {g.items.map((r) => {
                  const snip = r.body ? snippet(r.body, q) : "";
                  const ext = r.external || /^(tel|mailto):/.test(r.href);
                  const inner = (
                    <>
                      <span className="search-item__icon">
                        <Icon name={r.icon ?? GROUP_ICON[r.group]} />
                      </span>
                      <span className="search-item__text">
                        <span className="search-item__title">
                          <Marked text={r.title} q={q} />
                        </span>
                        {r.subtitle && (
                          <span className="search-item__sub">
                            <Marked text={r.subtitle} q={q} />
                          </span>
                        )}
                        {snip && (
                          <span className="search-item__snip">
                            <Marked text={snip} q={q} />
                          </span>
                        )}
                        <span className="search-item__url">{r.external ? new URL(r.href).hostname + new URL(r.href).pathname : r.href}</span>
                      </span>
                      {r.external && <ArrowUpRight className="search-item__ext" aria-label="opens in a new tab" />}
                    </>
                  );
                  return (
                    <li key={r.id}>
                      {ext ? (
                        <a href={r.href} className="search-item" target={r.external ? "_blank" : undefined} rel="noopener noreferrer">
                          {inner}
                        </a>
                      ) : (
                        <Link href={r.href} className="search-item">
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
