import type { Metadata } from "next";
import { site } from "./content";
import { routeInfo } from "./routes";

/** Page metadata with canonical URL and OpenGraph, pulled from the route registry by default. */
export function pageMeta(path: string, overrides: { title?: string; description?: string; image?: string } = {}): Metadata {
  const info = routeInfo(path);
  const title = overrides.title ?? info?.title ?? site.shortName;
  const description = overrides.description ?? info?.description ?? site.name;
  const image = overrides.image ?? "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=630&fit=crop&q=70";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.shortName}`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["CollegeOrUniversity", "EducationalOrganization"],
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    foundingDate: String(site.established),
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Survey No. 44, National Highway 16, Near Rama Talkies Rd, Resapuvanipalem",
      addressLocality: "Visakhapatnam",
      addressRegion: "Andhra Pradesh",
      postalCode: "530013",
      addressCountry: "IN",
    },
    parentOrganization: { "@type": "CollegeOrUniversity", name: "Andhra University" },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

/** WebSite schema with a SearchAction so search engines can offer a site search box. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}
