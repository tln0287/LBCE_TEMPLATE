"use client";

import { useRef, type ReactNode } from "react";

/**
 * Subtle 3D tilt that follows the pointer (max ~6°). Disabled for touch and
 * reduced motion via CSS (the transform is only applied on fine pointers).
 */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    ref.current.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
    ref.current.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
