import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/campus/GalleryGrid";
import { LinkButton } from "@/components/ui/Button";
import { PlaceholderNote, SectionHead } from "@/components/ui/Section";
import { gallery, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/gallery");

export default function GalleryPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Campus" }, { label: "Gallery" }]}
        kicker="Gallery"
        title="Campus Gallery"
        text="Campus, events, technical and cultural activities, sports, convocations and workshops, in pictures."
        image={gallery.items[0]?.image}
      />

      <section className="section section--ivory gal-section" aria-labelledby="gal-title">
        <div className="container">
          <SectionHead
            id="gal-title"
            kicker="Photographs"
            title="Moments from campus"
            text="Filter by category, then select any photo to open the full-screen viewer."
            action={
              <LinkButton href={site.externalLinks.gallery} variant="outline-dark" external>
                Full archive on the current site
              </LinkButton>
            }
          />
          <GalleryGrid items={gallery.items} categories={gallery.categories} />
          <div className="gal-section__note">
            <PlaceholderNote>
              Representative photographs are shown until the college&apos;s own photography is supplied. Replace them in content/gallery.json.
            </PlaceholderNote>
          </div>
        </div>
      </section>
    </>
  );
}
