"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Eye } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { imgUrl } from "@/lib/img";

export type GalleryGridItem = { id: string; category: string; caption: string; image: string; ratio?: string };

const RATIO: Record<string, [number, number]> = {
  landscape: [3, 2],
  square: [1, 1],
  portrait: [4, 5],
};
const ratioOf = (r?: string) => RATIO[r ?? "landscape"] ?? RATIO.landscape;

/**
 * Masonry gallery (CSS columns) with category chips and a full-screen lightbox:
 * next/previous, captions, Esc, arrow keys, focus trap + restore, swipe and zoom.
 */
export function GalleryGrid({
  items,
  categories,
  label = "Gallery categories",
}: {
  items: GalleryGridItem[];
  categories: string[];
  label?: string;
}) {
  const [active, setActive] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const cats = useMemo(
    () => categories.map((c) => ({ name: c, count: items.filter((i) => i.category === c).length })).filter((c) => c.count > 0),
    [categories, items],
  );
  const visible = useMemo(() => (active === "All" ? items : items.filter((i) => i.category === active)), [active, items]);

  const openAt = (index: number, el: HTMLElement) => {
    triggerRef.current = el;
    setOpen(index);
  };
  const close = useCallback(() => {
    setOpen(null);
    // Restore focus to the tile that opened the viewer.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <div className="gal">
      <div className="gal__bar">
        <div className="chips" role="group" aria-label={label}>
          <button type="button" className="chip" aria-pressed={active === "All"} onClick={() => setActive("All")}>
            All <span className="gal__count">{items.length}</span>
          </button>
          {cats.map((c) => (
            <button key={c.name} type="button" className="chip" aria-pressed={active === c.name} onClick={() => setActive(c.name)}>
              {c.name} <span className="gal__count">{c.count}</span>
            </button>
          ))}
        </div>
        <p className="gal__status" aria-live="polite">
          {visible.length} {visible.length === 1 ? "photo" : "photos"}
          {active !== "All" ? ` in ${active}` : ""}
        </p>
      </div>

      <ul className="gal__grid" key={active}>
        {visible.map((item, i) => {
          const [w, h] = ratioOf(item.ratio);
          return (
            <li key={item.id} className="gal__item" style={{ ["--i" as string]: Math.min(i, 12) }}>
              <figure className="gal__card">
                <button
                  type="button"
                  className="gal__tile"
                  style={{ aspectRatio: `${w} / ${h}` }}
                  onClick={(e) => openAt(i, e.currentTarget)}
                  aria-label={`View larger: ${item.caption}`}
                  aria-haspopup="dialog"
                >
                  <Img src={item.image} alt={item.caption} width={800} height={Math.round((800 * h) / w)} sizes="(max-width: 520px) 100vw, (max-width: 960px) 50vw, 33vw" />
                  <span className="gal__view" aria-hidden="true">
                    <Eye /> View
                  </span>
                </button>
                <figcaption>
                  <span className="gal__cat">{item.category}</span>
                  <span className="gal__caption">{item.caption}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      {open !== null && visible[open] && (
        <Lightbox items={visible} index={open} onIndex={setOpen} onClose={close} />
      )}
    </div>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: GalleryGridItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [mounted, setMounted] = useState(false);
  const capId = useId();
  const item = items[index];
  const total = items.length;
  const [w, h] = ratioOf(item.ratio);

  const go = useCallback(
    (dir: 1 | -1) => {
      setZoom(false);
      onIndex((index + dir + total) % total);
    },
    [index, total, onIndex],
  );

  useEffect(() => setMounted(true), []);

  // Scroll lock + initial focus.
  useEffect(() => {
    document.body.classList.add("no-scroll");
    closeRef.current?.focus();
    return () => document.body.classList.remove("no-scroll");
  }, []);

  // Preload neighbours so next/previous feel instant.
  useEffect(() => {
    if (total < 2) return;
    [items[(index + 1) % total], items[(index - 1 + total) % total]].forEach((n) => {
      const img = new window.Image();
      img.src = imgUrl(n.image, 1600);
    });
  }, [index, items, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab" && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!ref.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const setOriginFrom = (clientX: number, clientY: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100));
    setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      className="gal-lb"
      role="dialog"
      aria-modal="true"
      aria-labelledby={capId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="gal-lb__top">
        <span className="gal-lb__count" aria-live="polite">
          {index + 1} / {total}
        </span>
        <div className="gal-lb__tools">
          <button type="button" className="gal-lb__btn" onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? "Zoom out" : "Zoom in"}>
            {zoom ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}
          </button>
          <button ref={closeRef} type="button" className="gal-lb__btn" onClick={onClose} aria-label="Close viewer">
            <X aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={`gal-lb__stage ${zoom ? "is-zoomed" : ""}`}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start || zoom) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
          else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) onClose();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="gal-lb__frame"
          key={item.id}
          onDoubleClick={(e) => {
            setOriginFrom(e.clientX, e.clientY, e.currentTarget);
            setZoom((z) => !z);
          }}
          onPointerMove={(e) => {
            if (zoom && e.pointerType === "mouse") setOriginFrom(e.clientX, e.clientY, e.currentTarget);
          }}
          style={{ ["--origin" as string]: origin, ["--ar" as string]: (w / h).toFixed(4) }}
        >
          <Img src={item.image} alt={item.caption} width={2000} height={Math.round((2000 * h) / w)} sizes="100vw" priority />
        </div>
      </div>

      <button type="button" className="gal-lb__nav gal-lb__nav--prev" onClick={() => go(-1)} aria-label="Previous photo" disabled={total < 2}>
        <ChevronLeft aria-hidden="true" />
      </button>
      <button type="button" className="gal-lb__nav gal-lb__nav--next" onClick={() => go(1)} aria-label="Next photo" disabled={total < 2}>
        <ChevronRight aria-hidden="true" />
      </button>

      <div className="gal-lb__foot">
        <p className="gal-lb__caption" id={capId}>
          <span className="gal-lb__cat">{item.category}</span>
          {item.caption}
        </p>
        <p className="gal-lb__hint">Use arrow keys or swipe to browse. Double-click or use the zoom button to enlarge.</p>
      </div>
    </div>,
    document.body,
  );
}
