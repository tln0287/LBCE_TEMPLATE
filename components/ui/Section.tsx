import type { ReactNode } from "react";

export function SectionHead({
  kicker,
  title,
  text,
  action,
  center,
  id,
}: {
  kicker?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  const cls = ["section-head", action ? "section-head--split" : "", center ? "section-head--center" : ""].join(" ");
  const body = (
    <>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2 id={id}>{title}</h2>
      {text && <p>{text}</p>}
    </>
  );
  return (
    <div className={`${cls} reveal`}>
      {action ? (
        <>
          <div style={{ display: "grid", gap: 16 }}>{body}</div>
          <div>{action}</div>
        </>
      ) : (
        body
      )}
    </div>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p className="placeholder-note" role="note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
