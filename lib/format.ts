const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit" });
const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "short" });

/** Dates are stored as YYYY-MM-DD; parse at noon UTC so the day never shifts across time zones. */
function parse(iso: string) {
  return new Date(`${iso}T12:00:00Z`);
}

export const formatDate = (iso: string) => dateFmt.format(parse(iso));
export const formatDay = (iso: string) => dayFmt.format(parse(iso));
export const formatMonth = (iso: string) => monthFmt.format(parse(iso));

export function formatRange(start: string, end?: string) {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
