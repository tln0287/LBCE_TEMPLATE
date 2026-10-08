import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { Floaters } from "@/components/ui/Floaters";
import { JsonLd } from "@/components/ui/JsonLd";
import { HeroScene } from "@/components/three/HeroScene";
import { site } from "@/lib/content";

export type Crumb = { label: string; href?: string };

/**
 * Inner-page hero — light (warm white + blueprint grid) so navy stays reserved for the
 * site frame. Left: breadcrumbs (with BreadcrumbList schema), kicker, title, text, actions.
 * Right: an optional framed photo, or any custom visual passed as `aside`.
 */
export function PageHero({
  title,
  kicker,
  text,
  crumbs,
  image,
  imageAlt = "",
  aside,
  children,
}: {
  title: ReactNode;
  kicker?: string;
  text?: ReactNode;
  crumbs: Crumb[];
  image?: string;
  imageAlt?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  const visual =
    aside ??
    (image ? (
      <figure className="page-hero__photo">
        <Img src={image} alt={imageAlt} priority sizes="(max-width: 900px) 100vw, 45vw" width={1200} />
      </figure>
    ) : null);

  return (
    <section className={`page-hero ${visual ? "page-hero--split" : ""}`}>
      <div className="page-hero__grid" aria-hidden="true" />
      <div className="page-hero__glow" aria-hidden="true" />
      <Floaters className="floaters--hero" />
      <HeroScene variant="compact" />
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              {all.map((c, i) => (
                <li key={c.label}>
                  {c.href && i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                  {i < all.length - 1 && <ChevronRight aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </nav>
          {kicker && <span className="kicker">{kicker}</span>}
          <h1>
            <span className="page-hero__title">{title}</span>
          </h1>
          {text && <p className="page-hero__text">{text}</p>}
          {children && <div className="page-hero__extra">{children}</div>}
        </div>
        {visual && <div className="page-hero__visual">{visual}</div>}
      </div>
      <div className="page-hero__trail" aria-hidden="true" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: new URL(c.href, site.url).toString() } : {}),
          })),
        }}
      />
    </section>
  );
}
