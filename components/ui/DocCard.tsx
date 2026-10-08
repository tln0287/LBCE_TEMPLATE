import { Download, ExternalLink, FileText } from "lucide-react";
import { isExternal } from "@/lib/format";
import type { Doc } from "@/lib/content";

export function DocCard({ doc }: { doc: Doc }) {
  const pdf = doc.type === "PDF" || /\.pdf($|\?)/i.test(doc.url);
  return (
    <a className="doc-card" href={doc.url} target={isExternal(doc.url) ? "_blank" : undefined} rel="noopener noreferrer">
      <span className="icon-badge" aria-hidden="true">
        <FileText />
      </span>
      <span>
        <span className="doc-card__title">{doc.title}</span>
        <span className="doc-card__meta">
          {[doc.type ?? "Document", doc.date].filter(Boolean).join(", ")}
        </span>
      </span>
      <span className="doc-card__action" aria-hidden="true">
        {pdf ? <Download /> : <ExternalLink />}
      </span>
      {isExternal(doc.url) && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export function DocList({ docs }: { docs: Doc[] }) {
  return (
    <div className="grid grid--2" style={{ gap: 12 }}>
      {docs.map((d) => (
        <DocCard key={d.url + d.title} doc={d} />
      ))}
    </div>
  );
}
