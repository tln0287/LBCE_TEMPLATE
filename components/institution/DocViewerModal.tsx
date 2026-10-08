"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";
import type { Doc } from "@/lib/content";

export const isPdf = (doc: Doc) => doc.type === "PDF" || /\.pdf($|\?)/i.test(doc.url);

/**
 * Accessible document viewer: role="dialog", Esc closes, Tab is trapped inside,
 * focus returns to the element that opened it, page scroll is locked.
 */
export function DocViewerModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.classList.add("no-scroll");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
      opener?.focus?.();
    };
  }, [onClose]);

  const pdf = isPdf(doc);

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className="docview" role="dialog" aria-modal="true" aria-labelledby="docview-title">
        <header className="docview__head">
          <div>
            <span className="docview__type">{doc.type ?? (pdf ? "PDF" : "Document")}</span>
            <h2 id="docview-title">{doc.title}</h2>
          </div>
          <div className="docview__actions">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn--outline-dark btn--sm">
              <ExternalLink aria-hidden="true" /> Open<span className="sr-only"> in a new tab</span>
            </a>
            <a href={doc.url} download className="btn btn--primary btn--sm">
              <Download aria-hidden="true" /> Download
            </a>
            <button ref={closeRef} type="button" className="docview__close" onClick={onClose} aria-label="Close document viewer">
              <X aria-hidden="true" />
            </button>
          </div>
        </header>
        <div className="docview__body">
          {pdf ? (
            <iframe src={doc.url} title={`${doc.title} (PDF viewer)`} />
          ) : (
            <div className="docview__fallback">
              <p>This document can&apos;t be previewed here. Open it in a new tab or download it.</p>
            </div>
          )}
        </div>
        {pdf && (
          <p className="docview__hint">
            If the preview doesn&apos;t load, your browser may block embedded PDFs. Use <strong>Open</strong> or <strong>Download</strong>.
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
