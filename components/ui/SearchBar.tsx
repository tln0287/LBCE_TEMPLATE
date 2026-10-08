"use client";

import { Search } from "lucide-react";
import { openSearch } from "@/components/layout/searchEvents";

/**
 * A search field that opens the command palette (keeping whatever was typed).
 * Without JavaScript it is a plain GET form to /search, so it always works.
 */
export function SearchBar({
  placeholder = "Search admissions, departments, facilities, documents…",
  suggestions = [],
  defaultValue = "",
  className = "",
  autoOpen = true,
}: {
  placeholder?: string;
  suggestions?: string[];
  defaultValue?: string;
  className?: string;
  autoOpen?: boolean;
}) {
  return (
    <div className={`searchbar ${className}`}>
      <form action="/search" method="get" role="search" className="searchbar__form" onSubmit={(e) => {
        if (!autoOpen) return;
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        openSearch(typeof q === "string" ? q : "");
      }}>
        <Search className="searchbar__icon" aria-hidden="true" />
        <label htmlFor="site-search-input" className="sr-only">
          Search the website
        </label>
        <input
          id="site-search-input"
          name="q"
          type="search"
          className="searchbar__input"
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete="off"
          enterKeyHint="search"
          onFocus={(e) => {
            if (!autoOpen) return;
            const v = e.currentTarget.value;
            e.currentTarget.blur();
            openSearch(v);
          }}
        />
        <kbd className="searchbar__kbd" aria-hidden="true">
          Ctrl K
        </kbd>
        <button type="submit" className="btn btn--primary btn--sm searchbar__btn">
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <div className="searchbar__chips">
          <span>Popular:</span>
          {suggestions.map((s) => (
            <button key={s} type="button" className="searchbar__chip" onClick={() => openSearch(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
