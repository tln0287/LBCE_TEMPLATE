"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value` when scrolled into view. Non-numeric values (e.g. the
 * "XX" placeholders awaiting verified data) render as-is, without animation.
 */
export function Counter({ value, suffix = "", duration = 1600 }: { value: string; suffix?: string; duration?: number }) {
  const target = Number(value.replace(/,/g, ""));
  const numeric = value.trim() !== "" && Number.isFinite(target);
  const ref = useRef<HTMLSpanElement>(null);
  // Server render shows the final value (correct without JS); the count-up only runs on first entry.
  const [display, setDisplay] = useState(numeric ? target.toLocaleString("en-IN") : value);

  useEffect(() => {
    if (!numeric || !ref.current) return;
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(target.toLocaleString("en-IN"));
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setDisplay("0");
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(Math.round(target * eased).toLocaleString("en-IN"));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [numeric, target, duration]);

  return (
    <span ref={ref} aria-label={`${numeric ? target.toLocaleString("en-IN") : value}${suffix}`}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
    </span>
  );
}
