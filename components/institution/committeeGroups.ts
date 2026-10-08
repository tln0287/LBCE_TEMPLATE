import type { Doc } from "@/lib/content";

type Member = { name: string; role?: string; designation?: string };
export type CommitteeItem = {
  id: string;
  name: string;
  icon: string;
  purpose: string;
  responsibilities: string[];
  members: (Member | string)[];
  documents: Doc[];
  contact: string;
  category?: string;
};

/**
 * Browsing groups for the directory. A `category` on a committee in
 * content/committees.json overrides this map.
 */
const GROUP: Record<string, string> = {
  "anti-ragging": "Statutory",
  grievance: "Statutory",
  icc: "Statutory",
  "sc-st": "Statutory",
  "women-empowerment": "Student welfare",
  discipline: "Student welfare",
  sports: "Student welfare",
  examination: "Academic",
  library: "Academic",
};
export const GROUP_ORDER = ["Statutory", "Student welfare", "Academic", "Other"];
export const groupOf = (c: CommitteeItem) => c.category ?? GROUP[c.id] ?? "Other";

export function groupCommittees(list: CommitteeItem[]) {
  const map = new Map<string, CommitteeItem[]>();
  for (const c of list) {
    const g = groupOf(c);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(c);
  }
  return [...map.entries()].sort((a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]));
}

/** Committees where someone can raise a concern directly, with where to do it. */
export const ACTION: Record<string, { label: string; href: string }> = {
  "anti-ragging": { label: "Report ragging", href: "/grievance#submit" },
  grievance: { label: "Submit a grievance", href: "/grievance#submit" },
  icc: { label: "Raise a complaint confidentially", href: "/grievance#submit" },
  "sc-st": { label: "Raise a concern", href: "/grievance#submit" },
  "women-empowerment": { label: "Contact the cell", href: "/contact" },
};
