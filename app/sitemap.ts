import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";
import { departments, news, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  return [
    ...ROUTES.map((r) => ({
      url: `${base}${r.path === "/" ? "" : r.path}`,
      lastModified: now,
      changeFrequency: (r.path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: r.path === "/" ? 1 : r.section === "Admissions" ? 0.9 : 0.7,
    })),
    ...departments.map((d) => ({
      url: `${base}/departments/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...news.articles.map((a) => ({
      url: `${base}/lbc-times/${a.slug}`,
      lastModified: new Date(`${a.date}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
