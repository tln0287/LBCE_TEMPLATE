export const OPEN_SEARCH_EVENT = "lbce:open-search";

/** Opens the command palette, optionally pre-filled with a query. */
export function openSearch(query?: string | unknown) {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT, { detail: typeof query === "string" ? query : "" }));
}
