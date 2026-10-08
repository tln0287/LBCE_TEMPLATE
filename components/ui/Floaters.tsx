/**
 * Slow-drifting outline shapes for dark sections: hexagons, rings, crosshairs and a
 * dimension line, drawn like blueprint annotations. Purely decorative; CSS-animated;
 * frozen when the visitor prefers reduced motion.
 */
export function Floaters({ className = "" }: { className?: string }) {
  return (
    <div className={`floaters ${className}`} aria-hidden="true">
      <svg className="floater floater--hex" viewBox="0 0 100 100">
        <path d="M50 4 90 27v46L50 96 10 73V27z" />
        <path d="M50 22 74 36v28L50 78 26 64V36z" opacity="0.5" />
      </svg>
      <svg className="floater floater--ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" />
        <circle cx="50" cy="50" r="30" strokeDasharray="3 6" />
      </svg>
      <svg className="floater floater--cross" viewBox="0 0 40 40">
        <path d="M20 4v32M4 20h32" />
        <circle cx="20" cy="20" r="7" />
      </svg>
      <svg className="floater floater--dim" viewBox="0 0 160 24">
        <path d="M4 12h152M4 4v16M156 4v16M4 12l8-5M4 12l8 5M156 12l-8-5M156 12l-8 5" />
      </svg>
      <svg className="floater floater--gear" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="18" />
        <path d="M50 8v12M50 80v12M8 50h12M80 50h12M20 20l9 9M71 71l9 9M80 20l-9 9M29 71l-9 9" />
        <circle cx="50" cy="50" r="34" strokeDasharray="2 5" />
      </svg>
    </div>
  );
}
