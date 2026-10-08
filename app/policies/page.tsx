import { PageHero } from "@/components/layout/PageHero";
import { PolicyViewer, type PolicyItem } from "@/components/institution/PolicyViewer";
import { LinkButton } from "@/components/ui/Button";
import { policies } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/policies");

export default function PoliciesPage() {
  const list = policies.policies as PolicyItem[];
  return (
    <>
      <PageHero
        kicker="Resources"
        title="Policies"
        text="Academic, student, research, HR, campus and other institutional policies. Open any policy document to read it here or download it."
        crumbs={[{ label: "Policies" }]}
      />
      <nav className="subnav" aria-label="Policies">
        <div className="container">
          <ul>
            {list.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>{p.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <section className="section section--ivory" aria-label="Policy documents">
        <div className="container">
          <PolicyViewer policies={list} legacyUrl={policies.legacyUrl} />
          {policies.legacyUrl && (
            <div className="pol-foot">
              <p>Looking for a policy not listed here? The current website carries the full set while documents are being moved.</p>
              <LinkButton href={policies.legacyUrl} variant="outline-dark">
                Policies on the current website
              </LinkButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
