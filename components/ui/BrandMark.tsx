/**
 * Placeholder monogram until the official college logo is supplied.
 * Replace this SVG with the logo file (white version for the navy header).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 2 43 13v22L24 46 5 35V13z" fill="none" stroke="#C9A227" strokeWidth="1.6" />
      <path d="M24 8.5 37.5 16.3v15.4L24 39.5 10.5 31.7V16.3z" fill="#145DA0" opacity="0.28" />
      <text
        x="24"
        y="29.5"
        textAnchor="middle"
        fontFamily="var(--font-manrope), sans-serif"
        fontWeight="800"
        fontSize="14"
        letterSpacing="-0.5"
        fill="#FFFFFF"
      >
        LB
      </text>
    </svg>
  );
}
