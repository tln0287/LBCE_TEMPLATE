/**
 * Line-drawn motif per department, used as a decorative typographic companion to
 * the outlined department code. Strokes use currentColor; one accent path is gold.
 * Purely decorative: always aria-hidden.
 */

function gearPath(cx: number, cy: number, r: number, teeth: number, depth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners = [
      [r - depth, a],
      [r, a + step * 0.15],
      [r, a + step * 0.45],
      [r - depth, a + step * 0.6],
    ] as const;
    for (const [rad, ang] of corners) {
      pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
    }
  }
  return `M${pts.join("L")}Z`;
}

function wave(y: number, amp: number, period: number, phase = 0, from = 20, to = 380) {
  const pts: string[] = [];
  for (let x = from; x <= to; x += 4) {
    pts.push(`${x},${(y + amp * Math.sin(((x - from) / period) * Math.PI * 2 + phase)).toFixed(1)}`);
  }
  return `M${pts.join("L")}`;
}

function Cse() {
  const nodes = [
    [200, 70],
    [120, 160],
    [280, 160],
    [80, 250],
    [160, 250],
    [240, 250],
    [320, 250],
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
  ];
  return (
    <>
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 16 : 11} className={i === 0 ? "dept-motif__accent" : undefined} />
      ))}
      <path d="M130 330 L100 350 L130 370" />
      <path d="M270 330 L300 350 L270 370" />
      <line x1="215" y1="322" x2="185" y2="378" className="dept-motif__accent" />
    </>
  );
}

function Civil() {
  const xs = [30, 87, 144, 201, 258, 315, 372];
  return (
    <>
      <path d="M20 300 Q200 90 380 300" />
      <line x1="20" y1="300" x2="380" y2="300" />
      <line x1="58" y1="230" x2="344" y2="230" className="dept-motif__accent" />
      {xs.slice(0, -1).map((x, i) => (
        <path key={x} d={`M${x} 300 L${x + 28} 230 L${xs[i + 1]} 300`} />
      ))}
      <line x1="20" y1="300" x2="20" y2="360" />
      <line x1="380" y1="300" x2="380" y2="360" />
      <line x1="0" y1="360" x2="400" y2="360" />
      {[50, 110, 170, 230, 290, 350].map((x) => (
        <line key={x} x1={x} y1="360" x2={x - 18} y2="378" />
      ))}
    </>
  );
}

function Ece() {
  return (
    <>
      <rect x="140" y="140" width="120" height="120" rx="10" />
      <rect x="170" y="170" width="60" height="60" rx="4" className="dept-motif__accent" />
      {[160, 186, 214, 240].map((p) => (
        <g key={p}>
          <line x1={p} y1="140" x2={p} y2="110" />
          <line x1={p} y1="260" x2={p} y2="290" />
          <line x1="140" y1={p} x2="110" y2={p} />
          <line x1="260" y1={p} x2="290" y2={p} />
        </g>
      ))}
      <path d={wave(60, 22, 90)} />
      <path d={wave(340, 14, 45)} className="dept-motif__accent" />
    </>
  );
}

function Eee() {
  return (
    <>
      <path d={wave(200, 70, 240, 0)} />
      <path d={wave(200, 70, 240, (Math.PI * 2) / 3)} />
      <path d={wave(200, 70, 240, (Math.PI * 4) / 3)} className="dept-motif__accent" />
      <line x1="20" y1="200" x2="380" y2="200" strokeDasharray="4 8" />
      <path d="M214 300 L184 350 L208 350 L190 392 L236 334 L210 334 L228 300 Z" className="dept-motif__accent" />
    </>
  );
}

function Mech() {
  return (
    <>
      <path d={gearPath(160, 170, 110, 14, 18)} />
      <circle cx="160" cy="170" r="34" />
      <circle cx="160" cy="170" r="10" className="dept-motif__accent" />
      <path d={gearPath(300, 310, 70, 10, 16)} className="dept-motif__accent" />
      <circle cx="300" cy="310" r="22" />
    </>
  );
}

const MOTIFS: Record<string, () => React.JSX.Element> = { CSE: Cse, CIVIL: Civil, ECE: Ece, EEE: Eee, MECH: Mech };

export function DeptMotif({ code, className = "" }: { code: string; className?: string }) {
  const Motif = MOTIFS[code] ?? Cse;
  return (
    <svg className={`dept-motif ${className}`} viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <Motif />
    </svg>
  );
}
