/**
 * Site search engine — pure functions, used both by the Ctrl+K palette (browser)
 * and the /search results page (server).
 *
 * Ranking: every query term must match somewhere in an entry (title, keywords,
 * subtitle or body). A term can match exactly, as a prefix, as a substring, or
 * within a small typo distance. Title matches weigh most; phrase and "title starts
 * with" matches get a bonus. Common words people search for are expanded with
 * synonyms ("fees" also finds online payment, "exam" finds examinations).
 */

export type SearchGroup =
  | "Quick actions"
  | "Pages"
  | "Sections"
  | "Departments"
  | "Facilities"
  | "Faculty"
  | "Events"
  | "News"
  | "Documents"
  | "Policies"
  | "Committees"
  | "Contact";

export const GROUP_ORDER: SearchGroup[] = [
  "Quick actions",
  "Pages",
  "Sections",
  "Departments",
  "Facilities",
  "Faculty",
  "Events",
  "News",
  "Documents",
  "Policies",
  "Committees",
  "Contact",
];

export type SearchEntry = {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string;
  body?: string;
  external?: boolean;
  icon?: string;
};

export type SearchResult = SearchEntry & { score: number };

type Prepared = {
  entry: SearchEntry;
  title: string;
  titleTokens: string[];
  fields: { tokens: string[]; text: string; weight: number }[];
};

const STOP = new Set(["the", "a", "an", "of", "for", "to", "in", "and", "at", "on", "is", "how", "what", "i", "my", "me", "do", "can", "with", "about", "lbce", "college", "please", "show", "find", "get", "need", "want", "page", "info", "information", "details"]);

/** Query words → extra words to try. Keys and values are normalized tokens. */
const SYNONYMS: Record<string, string[]> = {
  fee: ["fees", "payment", "pay"],
  fees: ["payment", "pay"],
  pay: ["payment", "fees"],
  payment: ["pay", "fees"],
  exam: ["examination", "examinations"],
  exams: ["examination", "examinations"],
  result: ["results", "examination"],
  results: ["examination"],
  syllabus: ["curriculum"],
  timetable: ["calendar"],
  schedule: ["calendar"],
  hostel: ["hostels"],
  canteen: ["cafeteria", "food"],
  food: ["cafeteria"],
  bus: ["transportation", "transport"],
  buses: ["transportation", "transport"],
  transport: ["transportation"],
  ragging: ["anti-ragging", "antiragging"],
  complaint: ["grievance"],
  complaints: ["grievance"],
  issue: ["grievance"],
  job: ["placements", "careers", "recruiters"],
  jobs: ["placements", "careers", "recruiters"],
  vacancy: ["careers"],
  vacancies: ["careers"],
  recruitment: ["careers", "placements"],
  salary: ["package", "placements"],
  package: ["placements"],
  company: ["recruiters", "placements"],
  companies: ["recruiters", "placements"],
  apply: ["admissions", "enquiry", "application"],
  admission: ["admissions"],
  join: ["admissions"],
  eligibility: ["admissions"],
  eapcet: ["admissions", "dlbc"],
  counselling: ["admissions", "eapcet"],
  phone: ["call", "contact", "number"],
  number: ["phone", "contact"],
  call: ["phone"],
  mobile: ["phone"],
  mail: ["email"],
  email: ["mail"],
  address: ["location", "directions", "map"],
  location: ["address", "directions", "map"],
  map: ["directions", "location"],
  where: ["location", "address"],
  photo: ["gallery", "photos"],
  photos: ["gallery"],
  pics: ["gallery"],
  pictures: ["gallery"],
  images: ["gallery"],
  news: ["lbc", "times", "announcements"],
  newsletter: ["lbc", "times"],
  fest: ["festival", "cultural"],
  festival: ["cultural", "events"],
  games: ["sports"],
  ranking: ["nirf"],
  rank: ["nirf"],
  accreditation: ["naac", "aicte", "nirf", "iso"],
  approval: ["aicte"],
  quality: ["iqac", "iso"],
  verification: ["bgv", "background"],
  verify: ["bgv", "verification"],
  certificate: ["bgv", "verification", "certificates"],
  startup: ["iic", "entrepreneurship", "startups"],
  startups: ["iic", "entrepreneurship"],
  innovation: ["iic", "research"],
  teachers: ["faculty"],
  teacher: ["faculty"],
  professors: ["faculty"],
  staff: ["faculty", "careers"],
  lab: ["laboratories", "labs"],
  labs: ["laboratories"],
  computer: ["cse"],
  cse: ["computer", "science"],
  ece: ["electronics", "communication"],
  eee: ["electrical", "electronics"],
  mech: ["mechanical"],
  civil: ["structures"],
  ai: ["artificial", "intelligence", "machine", "learning"],
  ml: ["machine", "learning"],
  principal: ["leadership", "contact"],
  head: ["leadership"],
  rules: ["policies", "regulations"],
  rule: ["policies", "regulations"],
  policy: ["policies"],
  harassment: ["internal", "complaints", "icc"],
  women: ["women", "empowerment", "icc"],
  library: ["books", "library"],
  books: ["library"],
  wifi: ["it", "computer", "labs"],
  internship: ["internships", "placements", "training"],
  internships: ["placements", "training"],
  training: ["placements", "skill"],
  alumni: ["graduates"],
  graduates: ["alumni"],
  diploma: ["polytechnic"],
  polytechnic: ["diploma"],
  btech: ["b.tech", "undergraduate"],
  mtech: ["postgraduate"],
  pg: ["postgraduate"],
  ug: ["undergraduate"],
};

export function normalize(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/b\.tech/g, "btech")
    .replace(/m\.tech/g, "mtech")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokenize(s: string) {
  return normalize(s).split(" ").filter(Boolean);
}

/** Optimal string alignment distance with an early exit once it exceeds `max`. */
function editDistance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2 = new Array(b.length + 1).fill(0);
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev2[j] = prev[j];
    prev = cur;
  }
  return prev[b.length];
}

export function prepareIndex(entries: SearchEntry[]): Prepared[] {
  return entries.map((entry) => {
    const title = normalize(entry.title);
    const mk = (text: string | undefined, weight: number) => {
      const t = normalize(text ?? "");
      return { text: t, tokens: t.split(" ").filter(Boolean), weight };
    };
    return {
      entry,
      title,
      titleTokens: title.split(" ").filter(Boolean),
      fields: [mk(entry.title, 1), mk(entry.keywords, 0.6), mk(entry.subtitle, 0.45), mk(entry.body, 0.22)],
    };
  });
}

/** Score one query term (with its synonyms) against an entry's fields. 0 = no match. */
function termScore(term: string, alts: string[], p: Prepared) {
  let best = 0;
  // Typo budget: none for short words, 1 for 4–8 letters, 2 for longer; first letter must agree.
  const maxTypos = term.length >= 9 ? 2 : term.length >= 4 ? 1 : 0;
  for (const f of p.fields) {
    for (const tok of f.tokens) {
      let s = 0;
      if (tok === term) s = 10;
      // Prefix: strong when the word is nearly complete, weaker for long completions ("fee" → "feedback").
      else if (term.length >= 3 && tok.startsWith(term)) s = tok.length - term.length <= 3 ? 7.5 : 5;
      else if (term.length >= 4 && tok.includes(term)) s = 3.5;
      else if (
        maxTypos &&
        tok.length >= 3 &&
        tok[0] === term[0] &&
        (editDistance(term, tok, maxTypos) <= maxTypos ||
          (tok.length > term.length + 1 && editDistance(term, tok.slice(0, term.length + 1), maxTypos) <= maxTypos))
      )
        s = 4;
      else {
        for (const alt of alts) {
          if (tok === alt) {
            s = 8;
            break;
          }
          if (alt.length >= 3 && tok.startsWith(alt)) s = Math.max(s, 4.5);
        }
      }
      if (s * f.weight > best) best = s * f.weight;
      if (best >= 10) return best;
    }
  }
  return best;
}

export function search(index: Prepared[], query: string, limit = 60): SearchResult[] {
  const qNorm = normalize(query);
  if (!qNorm) return [];
  let terms = qNorm.split(" ").filter(Boolean);
  const meaningful = terms.filter((t) => !STOP.has(t));
  if (meaningful.length) terms = meaningful;
  const alts = terms.map((t) => SYNONYMS[t] ?? []);

  // Pass 1: every term must match. Pass 2 (only if pass 1 finds little): tolerate one miss.
  const run = (allowMiss: number) => {
    const out: SearchResult[] = [];
    for (const p of index) {
      let total = 0;
      let missed = 0;
      for (let i = 0; i < terms.length; i++) {
        const s = termScore(terms[i], alts[i], p);
        if (s === 0) missed++;
        total += s;
      }
      if (missed > allowMiss || missed === terms.length) continue;
      // Whole-phrase bonuses only on word boundaries ("fee" must not boost "Feedback").
      const t = ` ${p.title} `;
      if (p.title === qNorm) total += 20;
      else if (t.startsWith(` ${qNorm} `)) total += 10;
      else if (t.includes(` ${qNorm} `)) total += 6;
      if (p.entry.group === "Pages" || p.entry.group === "Quick actions" || p.entry.group === "Contact") total *= 1.12;
      if (p.entry.group === "Departments") total *= 1.06;
      out.push({ ...p.entry, score: missed ? total * 0.55 : total });
    }
    return out;
  };
  let results = run(0);
  if (results.length < 3 && terms.length >= 2) {
    const seen = new Set(results.map((r) => r.id));
    results = results.concat(run(1).filter((r) => !seen.has(r.id)));
  }
  results.sort((a, b) => b.score - a.score || a.title.length - b.title.length);
  return results.slice(0, limit);
}

/**
 * Groups results by type. The strongest few hits are pulled into a leading
 * "Top results" group so the best answer is always first.
 */
export function groupResults(results: SearchResult[], top = 3) {
  const best = top && results.length >= 3 ? results.slice(0, results.length > 6 ? top : 1) : [];
  const bestIds = new Set(best.map((r) => r.id));
  const map = new Map<SearchGroup, SearchResult[]>();
  for (const r of results) {
    if (bestIds.has(r.id)) continue;
    if (!map.has(r.group)) map.set(r.group, []);
    map.get(r.group)!.push(r);
  }
  const grouped = GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({ group: g as SearchGroup | "Top results", items: map.get(g)! }));
  return best.length ? [{ group: "Top results" as const, items: best }, ...grouped] : grouped;
}

/** Splits text into plain/matched segments for highlighting query terms (prefix matches). */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const terms = tokenize(query).filter((t) => t.length >= 2 && !STOP.has(t));
  if (!terms.length || !text) return [{ text, hit: false }];
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length);
  const re = new RegExp(`(?<![a-z0-9])(${escaped.join("|")})`, "gi");
  const out: { text: string; hit: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: text.slice(last, i), hit: false });
    out.push({ text: m[0], hit: true });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), hit: false });
  return out;
}

/** A short excerpt of `body` around the first matching term, for result snippets. */
export function snippet(body: string | undefined, query: string, radius = 70) {
  if (!body) return "";
  const terms = tokenize(query).filter((t) => t.length >= 3 && !STOP.has(t));
  const lower = body.toLowerCase();
  let at = -1;
  for (const t of terms) {
    at = lower.indexOf(t);
    if (at >= 0) break;
  }
  if (at < 0) return body.length > radius * 2 ? body.slice(0, radius * 2).trimEnd() + "…" : body;
  const start = Math.max(0, at - radius);
  const end = Math.min(body.length, at + radius);
  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}
