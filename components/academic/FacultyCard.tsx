import { Mail } from "lucide-react";
import { Img } from "@/components/ui/Img";
import type { FacultyMember } from "@/lib/content";

function initials(name: string) {
  return name
    .replace(/^(Dr|Prof|Mr|Mrs|Ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Faculty profile card. No hooks, so it renders on the server and inside the client directory. */
export function FacultyCard({ member, departmentName }: { member: FacultyMember; departmentName?: string }) {
  return (
    <article className="fac-card">
      <div className="fac-card__photo">
        {member.photo ? (
          <Img src={member.photo} alt={`Portrait of ${member.name}`} width={480} height={480} sizes="(max-width: 600px) 40vw, 200px" />
        ) : (
          <span className="fac-card__initials" aria-hidden="true">
            {initials(member.name)}
          </span>
        )}
      </div>
      <div className="fac-card__body">
        <h3 className="fac-card__name">{member.name}</h3>
        <p className="fac-card__role">{member.designation}</p>
        {departmentName && <p className="fac-card__dept">{departmentName}</p>}
        <dl className="fac-card__facts">
          {member.qualification && (
            <div>
              <dt>Qualification</dt>
              <dd>{member.qualification}</dd>
            </div>
          )}
          {member.specialization && (
            <div>
              <dt>Specialization</dt>
              <dd>{member.specialization}</dd>
            </div>
          )}
        </dl>
        {member.email && (
          <a className="fac-card__mail" href={`mailto:${member.email}`}>
            <Mail aria-hidden="true" />
            <span>{member.email}</span>
          </a>
        )}
      </div>
    </article>
  );
}
