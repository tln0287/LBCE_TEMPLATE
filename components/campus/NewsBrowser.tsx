"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { formatDate } from "@/lib/format";

export type NewsBrowserItem = { slug: string; title: string; category: string; date: string; image: string; excerpt: string; sample?: boolean };

/** Latest news with free-text search and category chips (client-side; the list is small). */
export function NewsBrowser({ articles, categories }: { articles: NewsBrowserItem[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const q = useDeferredValue(query.trim().toLowerCase());

  const cats = useMemo(
    () => categories.map((c) => ({ name: c, count: articles.filter((a) => a.category === c).length })).filter((c) => c.count > 0),
    [articles, categories],
  );
  const results = useMemo(
    () =>
      articles.filter(
        (a) => (cat === "All" || a.category === cat) && (!q || `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(q)),
      ),
    [articles, cat, q],
  );

  return (
    <div className="lbct-browser">
      <div className="lbct-browser__bar">
        <div className="searchbox">
          <Search aria-hidden="true" />
          <label htmlFor="lbct-search" className="sr-only">
            Search LBC Times
          </label>
          <input
            id="lbct-search"
            type="search"
            className="input"
            placeholder="Search news"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="chips" role="group" aria-label="News categories">
          <button type="button" className="chip" aria-pressed={cat === "All"} onClick={() => setCat("All")}>
            All
          </button>
          {cats.map((c) => (
            <button key={c.name} type="button" className="chip" aria-pressed={cat === c.name} onClick={() => setCat(c.name)}>
              {c.name} <span className="gal__count">{c.count}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="lbct-browser__status" aria-live="polite">
        {results.length} {results.length === 1 ? "story" : "stories"}
        {cat !== "All" ? ` in ${cat}` : ""}
        {q ? ` matching “${query.trim()}”` : ""}
      </p>
      {results.length ? (
        <ul className="lbct-grid">
          {results.map((a) => (
            <li key={a.slug}>
              <Link href={`/lbc-times/${a.slug}`} className="lbct-card">
                <div className="lbct-card__img">
                  <Img src={a.image} alt="" width={700} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 30vw" />
                </div>
                <div className="lbct-card__body">
                  <span className="lbct-card__cat">
                    {a.category}
                    {a.sample && <span className="lbct-sample">Sample</span>}
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <h3>No stories found</h3>
          <p>Try a different search term or category.</p>
          <button
            type="button"
            className="btn btn--outline-dark btn--sm"
            onClick={() => {
              setQuery("");
              setCat("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
