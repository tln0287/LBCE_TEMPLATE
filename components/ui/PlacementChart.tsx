import { EmptyState } from "./Section";

export type YearPoint = { year: string; placed: number; total?: number };

/**
 * Students placed by year — single-series bar chart (Royal Blue, latest year in Gold).
 * Hover/focus shows the value; a data table follows for screen readers.
 * Renders an empty state until verified data is supplied in content/placements.json.
 */
export function PlacementChart({ data, dark = false }: { data: YearPoint[]; dark?: boolean }) {
  if (!data.length) {
    return (
      <EmptyState title="Year-wise placement chart">
        This chart appears automatically once the Training &amp; Placement Cell publishes verified year-wise figures.
      </EmptyState>
    );
  }
  const max = Math.max(...data.map((d) => d.placed), 1);
  const nice = Math.ceil(max / 50) * 50;
  const W = 640;
  const H = 280;
  const pad = { l: 44, r: 12, t: 16, b: 36 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const bw = Math.min(56, (iw / data.length) * 0.56);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(nice * f));
  const ink = dark ? "#A9B6C4" : "#667085";
  const grid = dark ? "rgba(255,255,255,0.08)" : "#E4E9EE";

  return (
    <figure className="chart">
      <figcaption className="chart__title">Students placed, by year</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bar chart of students placed by year">
        {ticks.map((t) => {
          const y = pad.t + ih - (t / nice) * ih;
          return (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke={grid} strokeWidth={1} />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill={ink}>
                {t}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const cx = pad.l + (iw / data.length) * (i + 0.5);
          const h = (d.placed / nice) * ih;
          const latest = i === data.length - 1;
          return (
            <g key={d.year} className="chart__bar" tabIndex={0} aria-label={`${d.year}: ${d.placed} students placed`}>
              <rect x={cx - bw / 2 - 6} y={pad.t} width={bw + 12} height={ih} fill="transparent" />
              <path
                d={`M${cx - bw / 2},${pad.t + ih} V${pad.t + ih - h + 4} q0,-4 4,-4 H${cx + bw / 2 - 4} q4,0 4,4 V${pad.t + ih} Z`}
                fill={latest ? "#C9A227" : "#145DA0"}
              />
              <text x={cx} y={H - 12} textAnchor="middle" fontSize="12" fill={ink}>
                {d.year}
              </text>
              <text className="chart__value" x={cx} y={pad.t + ih - h - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill={dark ? "#fff" : "#17212B"}>
                {d.placed}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>Students placed by year</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Students placed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.year}>
              <td>{d.year}</td>
              <td>{d.placed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
