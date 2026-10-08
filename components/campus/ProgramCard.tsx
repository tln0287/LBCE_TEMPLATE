import { CalendarDays, Building2, Users } from "lucide-react";
import { DocCard } from "@/components/ui/DocCard";
import { Img } from "@/components/ui/Img";
import { formatRange } from "@/lib/format";
import type { Doc } from "@/lib/content";

/**
 * Shape of an entry in programs.json → capacityBuilding.programs / skillDevelopment.programs.
 * All fields except title are optional so partial records still render cleanly.
 */
export type ProgramRecord = {
  id?: string;
  title: string;
  date?: string;
  endDate?: string;
  organizer?: string;
  participants?: string | number;
  description?: string;
  area?: string;
  images?: { src: string; caption?: string }[] | string[];
  document?: Doc;
  documents?: Doc[];
};

export function ProgramCard({ program }: { program: ProgramRecord }) {
  const images = (program.images ?? []).map((im) => (typeof im === "string" ? { src: im, caption: "" } : im));
  const docs = [...(program.document ? [program.document] : []), ...(program.documents ?? [])];
  return (
    <article className="prog-card" id={program.id}>
      {images[0] && (
        <div className="prog-card__img">
          <Img src={images[0].src} alt={images[0].caption || program.title} width={900} sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
      )}
      <div className="prog-card__body">
        {program.area && <span className="tag">{program.area}</span>}
        <h3>{program.title}</h3>
        <ul className="prog-card__meta">
          {program.date && (
            <li>
              <CalendarDays aria-hidden="true" />
              <span className="sr-only">Date: </span>
              {formatRange(program.date, program.endDate)}
            </li>
          )}
          {program.organizer && (
            <li>
              <Building2 aria-hidden="true" />
              <span className="sr-only">Organised by: </span>
              {program.organizer}
            </li>
          )}
          {program.participants !== undefined && program.participants !== "" && (
            <li>
              <Users aria-hidden="true" />
              <span className="sr-only">Participants: </span>
              {program.participants} participants
            </li>
          )}
        </ul>
        {program.description && <p>{program.description}</p>}
        {images.length > 1 && (
          <ul className="prog-card__thumbs" aria-label={`Photos from ${program.title}`}>
            {images.slice(1, 5).map((im) => (
              <li key={im.src}>
                <Img src={im.src} alt={im.caption || program.title} width={240} sizes="96px" />
              </li>
            ))}
          </ul>
        )}
        {docs.map((d) => (
          <DocCard key={d.url} doc={d} />
        ))}
      </div>
    </article>
  );
}
