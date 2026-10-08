"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck, CalendarDays, ChevronLeft, ChevronRight, GraduationCap, Pause, Play } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";
import { Floaters } from "@/components/ui/Floaters";
import { Img } from "@/components/ui/Img";
import { LinkButton } from "@/components/ui/Button";
import type { Cta } from "@/lib/content";

export type HeroSlide = {
  id: string;
  title: string[];
  highlight: number;
  text: string;
  image: string;
  alt: string;
  ctas: Cta[];
};

type Facts = { established: number; affiliation: string; academicYear: string; eapcetCode: string };

const INTERVAL = 7000;

/**
 * Light, split hero: headline and actions on the left; on the right a framed photo
 * carousel (Ken Burns) with floating 3D fact cards and a blueprint lattice behind.
 * Accessible carousel controls: previous / next / pause / slide indicators with progress.
 */
export function HeroCarousel({ slides, heading, facts }: { slides: HeroSlide[]; heading: string; facts: Facts }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hoverPause, setHoverPause] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPlaying(false);
  }, []);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);
  const running = playing && !hoverPause;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  // Pointer tilt for the photo stage (fine pointers only; CSS disables it for reduced motion).
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stageRef.current.style.setProperty("--ry", `${(x * 8 - 6).toFixed(2)}deg`);
    stageRef.current.style.setProperty("--rx", `${(-y * 6 + 3).toFixed(2)}deg`);
  };
  const onLeave = () => {
    stageRef.current?.style.removeProperty("--ry");
    stageRef.current?.style.removeProperty("--rx");
  };

  return (
    <section
      ref={rootRef}
      className="hero2"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      onFocusCapture={() => setHoverPause(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHoverPause(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="hero2__grid" aria-hidden="true" />
      <div className="hero2__glow" aria-hidden="true" />
      <Floaters className="floaters--hero" />
      <HeroScene variant="compact" />

      <div className="container hero2__inner">
        <h1 className="sr-only">{heading}</h1>

        <div className="hero2__copy">
          <p className="hero2__eyebrow">
            <span className="hero2__pulse" aria-hidden="true" />
            Admissions {facts.academicYear} open, EAPCET code <strong>{facts.eapcetCode}</strong>
          </p>
          <div className="hero2__slides" aria-live={running ? "off" : "polite"}>
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="hero2__slide"
                data-active={i === index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                inert={i !== index}
              >
                <h2 className="hero2__title">
                  {s.title.map((line, li) => (
                    <span key={li} className="hero2__line" style={{ ["--li" as string]: li }}>
                      <span className={li === s.highlight ? "hero2__hl" : undefined}>{line}</span>
                    </span>
                  ))}
                </h2>
                <p className="hero2__text">{s.text}</p>
                <div className="btn-row hero2__ctas">
                  {s.ctas.map((c) => (
                    <LinkButton
                      key={c.label}
                      href={c.href}
                      variant={c.variant === "outline" ? "outline-dark" : (c.variant ?? "primary")}
                      external={c.external}
                    >
                      {c.label}
                    </LinkButton>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hero2__controls">
            <div className="hero2__tabs" role="group" aria-label="Choose slide">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className="hero2__tab"
                  aria-current={i === index}
                  aria-label={`Slide ${i + 1}: ${s.title.join(" ")}`}
                  onClick={() => go(i)}
                >
                  <span className="hero2__tab-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hero2__tab-bar">
                    <span
                      key={`${index}-${i}`}
                      className="hero2__tab-fill"
                      data-state={i === index ? (running ? "running" : "paused") : i < index ? "done" : "idle"}
                      style={{ animationDuration: `${INTERVAL}ms` }}
                    />
                  </span>
                </button>
              ))}
            </div>
            <div className="hero2__buttons">
              <button type="button" className="round-btn" onClick={() => go(index - 1)} aria-label="Previous slide">
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="round-btn"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                aria-pressed={!playing}
              >
                {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <button type="button" className="round-btn" onClick={() => go(index + 1)} aria-label="Next slide">
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="hero2__visual" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div className="hero2__stage" ref={stageRef}>
            <div className="hero2__frame">
              {slides.map((s, i) => (
                <div key={s.id} className="hero2__image" data-active={i === index} aria-hidden={i !== index}>
                  <Img src={s.image} alt={s.alt} priority={i === 0} width={1400} sizes="(max-width: 960px) 100vw, 50vw" />
                </div>
              ))}
              <div className="hero2__caption" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {slides[index].title.join(" ")}
              </div>
            </div>

            <div className="hero2__card hero2__card--est">
              <span className="hero2__card-icon">
                <CalendarDays aria-hidden="true" />
              </span>
              <span>
                <strong>Established {facts.established}</strong>
                <small>Visakhapatnam, Andhra Pradesh</small>
              </span>
            </div>
            <div className="hero2__card hero2__card--aicte">
              <span className="hero2__card-icon hero2__card-icon--gold">
                <BadgeCheck aria-hidden="true" />
              </span>
              <span>
                <strong>AICTE approved</strong>
                <small>Affiliated to Andhra University</small>
              </span>
            </div>
            <div className="hero2__card hero2__card--dept">
              <span className="hero2__card-icon hero2__card-icon--navy">
                <GraduationCap aria-hidden="true" />
              </span>
              <span>
                <strong>5 departments</strong>
                <small>CSE, Civil, ECE, EEE, Mechanical</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
