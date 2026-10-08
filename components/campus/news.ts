import { news, type Article } from "@/lib/content";

/** Sample articles (placeholders in content/news.json) are flagged so the label stays visible. */
export const isSampleArticle = (a: Pick<Article, "slug" | "title">) => a.slug.startsWith("sample-") || /^sample\b/i.test(a.title);

export const articlesByDate = () => [...news.articles].sort((a, b) => b.date.localeCompare(a.date));

const monthYear = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });

/** Groups articles by month and year, newest first. */
export function newsArchive() {
  const groups = new Map<string, { label: string; items: Article[] }>();
  for (const a of articlesByDate()) {
    const key = a.date.slice(0, 7);
    if (!groups.has(key)) groups.set(key, { label: monthYear.format(new Date(`${a.date}T12:00:00Z`)), items: [] });
    groups.get(key)!.items.push(a);
  }
  return Array.from(groups, ([key, g]) => ({ key, ...g }));
}
