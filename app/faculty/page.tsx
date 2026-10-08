import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FacultyDirectory } from "@/components/academic/FacultyDirectory";
import { departments, faculty, facultyMembers } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/faculty");

export default function FacultyPage() {
  const depts = departments.map((d) => ({ slug: d.slug, code: d.code, name: d.name }));
  return (
    <>
      <PageHero
        kicker="People"
        title="Faculty Directory"
        text="Find faculty by name, department, designation or area of specialization."
        crumbs={[{ label: "Faculty Directory" }]}
      />
      <section className="section section--ivory fac-dir-section" aria-label="Faculty directory">
        <div className="container">
          <Suspense
            fallback={
              <div className="empty" aria-busy="true">
                <h3>Loading the faculty directory</h3>
                <p>Search and filters will appear in a moment.</p>
              </div>
            }
          >
            <FacultyDirectory members={facultyMembers} departments={depts} designations={faculty.designations} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
