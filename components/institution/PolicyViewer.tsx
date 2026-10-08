"use client";

import { useCallback, useState } from "react";
import { Clock, Eye, ExternalLink, FileText } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { Doc } from "@/lib/content";
import { DocViewerModal, isPdf } from "./DocViewerModal";

export type PolicyItem = { id: string; title: string; icon: string; text: string; documents: Doc[] };

export function PolicyViewer({ policies, legacyUrl }: { policies: PolicyItem[]; legacyUrl: string }) {
  const [open, setOpen] = useState<Doc | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <ul className="pol-grid">
        {policies.map((p) => (
          <li key={p.id} id={p.id} className="pol-card">
            <div className="pol-card__head">
              <span className="icon-badge" aria-hidden="true">
                <Icon name={p.icon} />
              </span>
              <h2>{p.title}</h2>
            </div>
            <p className="pol-card__text">{p.text}</p>
            {p.documents.length ? (
              <ul className="pol-docs">
                {p.documents.map((d) => (
                  <li key={d.url}>
                    <FileText aria-hidden="true" className="pol-docs__icon" />
                    <span className="pol-docs__title">
                      {d.title}
                      <span className="pol-docs__meta">{[d.type ?? (isPdf(d) ? "PDF" : "Document"), d.date].filter(Boolean).join(", ")}</span>
                    </span>
                    <button type="button" className="btn btn--outline-dark btn--sm" onClick={() => setOpen(d)} aria-haspopup="dialog">
                      <Eye aria-hidden="true" /> View<span className="sr-only"> {d.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="pol-card__pending">
                <p>
                  <Clock aria-hidden="true" /> Documents are being uploaded.
                </p>
                {legacyUrl && (
                  <a href={legacyUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                    View on the current website <ExternalLink aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {open && <DocViewerModal doc={open} onClose={close} />}
    </>
  );
}
