"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Lock, Mail, Phone, Send } from "lucide-react";
import type { FieldDef, NoteField } from "./types";

type Status = "idle" | "submitting" | "success" | "unconfigured" | "error";

export type FormShellProps = {
  /** Sent with the payload so the receiving service knows which form it is. */
  formName: string;
  fields: FieldDef[];
  /** Button text that says exactly what happens, e.g. "Submit grievance". */
  submitLabel: string;
  /** Names what happened, e.g. "Grievance submitted". */
  successTitle: string;
  successText?: string;
  /** site.forms.endpoint — passed from the server page. Empty means not connected. */
  endpoint: string;
  /** Where to send people when online submission is unavailable. */
  fallback: { email: string; phone: string; office?: string };
  /** Subject line used for the "email this instead" link. */
  mailSubject: string;
  /** Show the lock line beside the submit button. */
  privacyNote?: string;
};

const HONEYPOT = "company_website";

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function isNote(f: FieldDef): f is NoteField {
  return f.type === "note";
}

type InputField = Exclude<FieldDef, NoteField>;

/** Turns the browser's constraint-validation state into a message that says how to fix the problem. */
function messageFor(field: InputField, el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const v = el.validity;
  const blank = el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox") ? false : el.value.trim() === "";
  if (v.valueMissing || (field.required && blank)) {
    if (field.requiredMessage) return field.requiredMessage;
    if (field.type === "checkbox") return "Tick this box to continue";
    if (field.type === "rating") return `Rate ${lowerFirst(field.label)} from 1 to 5`;
    if (field.type === "select" || field.type === "choice") return `Choose ${lowerFirst(field.label)}`;
    return `Enter your ${lowerFirst(field.label)}`;
  }
  if (v.typeMismatch && field.type === "email") return "Enter an email address in the format name@example.com";
  if (v.patternMismatch && "patternMessage" in field && field.patternMessage) return field.patternMessage;
  if (v.patternMismatch) return `Check the format of ${lowerFirst(field.label)}`;
  if (v.tooShort && "minLength" in field && field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters. You have entered ${el.value.length}.`;
  }
  if (v.tooLong && "maxLength" in field && field.maxLength) return `${field.label} must be ${field.maxLength} characters or fewer`;
  return "";
}

export function FormShell({
  formName,
  fields,
  submitLabel,
  successTitle,
  successText,
  endpoint,
  fallback,
  mailSubject,
  privacyNote,
}: FormShellProps) {
  const uid = useId().replace(/:/g, "");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const inputs = fields.filter((f): f is InputField => !isNote(f));
  const fid = (name: string) => `${uid}-${name}`;

  function elementFor(name: string) {
    return formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${name}"]`) ?? null;
  }

  function validateField(field: InputField) {
    const el = elementFor(field.name);
    return el ? messageFor(field, el) : "";
  }

  function validateAll() {
    const next: Record<string, string> = {};
    for (const f of inputs) {
      const msg = validateField(f);
      if (msg) next[f.name] = msg;
    }
    return next;
  }

  /** After the first submit attempt, errors update as people fix them; before that, only on leaving a filled field. */
  function revalidate(field: InputField, onBlur: boolean) {
    const el = elementFor(field.name);
    if (!el) return;
    const hasValue = el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox") ? true : el.value !== "";
    if (!attempted && !(onBlur && hasValue) && !errors[field.name]) return;
    const msg = validateField(field);
    setErrors((prev) => {
      if ((prev[field.name] ?? "") === msg) return prev;
      const next = { ...prev };
      if (msg) next[field.name] = msg;
      else delete next[field.name];
      return next;
    });
  }

  function collect() {
    const fd = new FormData(formRef.current!);
    const data: Record<string, string> = {};
    for (const f of inputs) {
      if (f.type === "checkbox") data[f.name] = fd.get(f.name) ? "Yes" : "No";
      else data[f.name] = String(fd.get(f.name) ?? "").trim();
    }
    return { data, trap: String(fd.get(HONEYPOT) ?? "") };
  }

  function buildMailto(data: Record<string, string>) {
    const lines = inputs
      .filter((f) => data[f.name])
      .map((f) => {
        const opt = "options" in f ? f.options.find((o) => o.value === data[f.name]) : undefined;
        const value = f.type === "rating" ? `${data[f.name]} / 5` : opt?.label ?? data[f.name];
        return `${f.label}: ${value}`;
      });
    const body = lines.join("\n").slice(0, 1800);
    return `mailto:${fallback.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
  }

  function focusSoon(ref: React.RefObject<HTMLElement | null>) {
    requestAnimationFrame(() => ref.current?.focus());
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    const found = validateAll();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      focusSoon(summaryRef);
      return;
    }
    const { data, trap } = collect();

    // No endpoint configured: say so plainly and keep everything the person typed.
    if (!endpoint) {
      setMailto(buildMailto(data));
      setStatus("unconfigured");
      focusSoon(statusRef);
      return;
    }
    // Honeypot filled: an automated submission. Drop it quietly.
    if (trap) {
      setStatus("success");
      formRef.current?.reset();
      focusSoon(statusRef);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ form: formName, page: window.location.pathname, submittedAt: new Date().toISOString(), data }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setAttempted(false);
      setCounts({});
      formRef.current?.reset();
    } catch {
      setMailto(buildMailto(data));
      setStatus("error");
    }
    focusSoon(statusRef);
  }

  const errorList = inputs.filter((f) => errors[f.name]);
  const tel = `tel:${fallback.phone.replace(/[^\d+]/g, "")}`;

  function describedBy(f: InputField) {
    return [f.hint ? `${fid(f.name)}-hint` : "", errors[f.name] ? `${fid(f.name)}-error` : ""].filter(Boolean).join(" ") || undefined;
  }

  function renderField(f: FieldDef) {
    if (isNote(f)) {
      return (
        <p key={f.name} className="frm-note frm-span">
          <Info aria-hidden="true" />
          <span>{f.text}</span>
        </p>
      );
    }
    const id = fid(f.name);
    const err = errors[f.name];
    const span = f.width === "half" ? "" : "frm-span";
    const req = f.required ? (
      <span className="frm-req" aria-hidden="true">
        *
      </span>
    ) : (
      <span className="frm-opt">(optional)</span>
    );
    const hint = f.hint ? (
      <span id={`${id}-hint`} className="hint">
        {f.hint}
      </span>
    ) : null;
    const errorEl = err ? (
      <span id={`${id}-error`} className="field-error frm-error">
        <AlertCircle aria-hidden="true" />
        {err}
      </span>
    ) : null;
    const common = {
      id,
      name: f.name,
      required: f.required,
      "aria-invalid": err ? (true as const) : undefined,
      "aria-describedby": describedBy(f),
      onBlur: () => revalidate(f, true),
      onChange: () => revalidate(f, false),
    };

    switch (f.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div key={f.name} className={`field ${span}`}>
            <label htmlFor={id}>
              {f.label} {req}
            </label>
            {hint}
            <input
              {...common}
              className="input"
              type={f.type}
              autoComplete={f.autoComplete}
              inputMode={f.inputMode}
              pattern={f.pattern}
              minLength={f.minLength}
              maxLength={f.maxLength}
              spellCheck={f.type === "text" ? undefined : false}
            />
            {errorEl}
          </div>
        );
      case "select":
        return (
          <div key={f.name} className={`field ${span}`}>
            <label htmlFor={id}>
              {f.label} {req}
            </label>
            {hint}
            <select {...common} className="select" defaultValue="">
              <option value="" disabled={f.required}>
                {f.placeholder ?? "Select an option"}
              </option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errorEl}
          </div>
        );
      case "textarea": {
        const n = counts[f.name] ?? 0;
        return (
          <div key={f.name} className={`field ${span}`}>
            <label htmlFor={id}>
              {f.label} {req}
            </label>
            {hint}
            <textarea
              {...common}
              className="textarea"
              rows={f.rows ?? 6}
              minLength={f.minLength}
              maxLength={f.maxLength}
              onInput={(e) => {
                const len = e.currentTarget.value.length;
                setCounts((c) => ({ ...c, [f.name]: len }));
              }}
            />
            <span className="frm-foot">
              {errorEl ?? <span />}
              {f.maxLength && (
                <span className="frm-count" aria-hidden="true">
                  {n} / {f.maxLength}
                </span>
              )}
            </span>
          </div>
        );
      }
      case "checkbox":
        return (
          <div key={f.name} className={`field frm-check ${span}`}>
            <div className="frm-check__row">
              <input {...common} type="checkbox" value="yes" className="frm-check__box" />
              <label htmlFor={id}>
                {f.label} {f.required && <span className="frm-req" aria-hidden="true">*</span>}
              </label>
            </div>
            {hint}
            {errorEl}
          </div>
        );
      case "choice":
      case "rating": {
        const options =
          f.type === "rating" ? [1, 2, 3, 4, 5].map((v) => ({ value: String(v), label: String(v) })) : f.options;
        return (
          <fieldset
            key={f.name}
            className={`frm-group ${f.type === "rating" ? "frm-rating" : "frm-choice"} ${span}`}
            aria-describedby={describedBy(f)}
          >
            <legend>
              {f.label} {req}
            </legend>
            {hint}
            <div className="frm-group__opts">
              {options.map((o, i) => (
                <label key={o.value} className="frm-pill">
                  <input
                    type="radio"
                    name={f.name}
                    value={o.value}
                    required={f.required}
                    aria-invalid={err ? true : undefined}
                    onBlur={() => revalidate(f, true)}
                    onChange={() => revalidate(f, false)}
                    id={i === 0 ? id : undefined}
                  />
                  <span>
                    {o.label}
                    {f.type === "rating" && <span className="sr-only"> out of 5</span>}
                  </span>
                </label>
              ))}
            </div>
            {f.type === "rating" && (
              <span className="frm-scale" aria-hidden="true">
                <span>1 · {f.lowLabel ?? "Poor"}</span>
                <span>5 · {f.highLabel ?? "Excellent"}</span>
              </span>
            )}
            {f.type === "rating" && (
              <span className="sr-only">
                1 means {f.lowLabel ?? "poor"}, 5 means {f.highLabel ?? "excellent"}.
              </span>
            )}
            {errorEl}
          </fieldset>
        );
      }
    }
  }

  return (
    <div className="frm">
      <div ref={statusRef} tabIndex={-1} className="frm-status" aria-live="polite">
        {status === "success" && (
          <div className="notice notice--success" role="status">
            <CheckCircle2 aria-hidden="true" />
            <div>
              <strong>{successTitle}.</strong> {successText ?? "Thank you. The office will respond using the contact details you gave."}
            </div>
          </div>
        )}
        {status === "unconfigured" && (
          <div className="notice notice--warn frm-fallback" role="status">
            <Info aria-hidden="true" />
            <div>
              <strong>Not sent: online submission isn&rsquo;t connected yet.</strong>
              <p>
                Your details are still in the form below. Please send them by email or phone
                {fallback.office ? `, or visit the ${fallback.office}` : ""}.
              </p>
              <div className="frm-fallback__actions">
                <a className="btn btn--primary btn--sm" href={mailto}>
                  <Mail aria-hidden="true" /> Email these details
                </a>
                <a className="btn btn--outline-dark btn--sm" href={tel}>
                  <Phone aria-hidden="true" /> Call {fallback.phone}
                </a>
              </div>
              <p className="frm-fallback__small">
                The email button opens your mail app with what you typed, addressed to {fallback.email}.
              </p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="notice notice--warn" role="status">
            <AlertCircle aria-hidden="true" />
            <div>
              <strong>Not sent: we couldn&rsquo;t reach the server.</strong>
              <p>
                Check your connection and select &ldquo;{submitLabel}&rdquo; again, or{" "}
                <a href={mailto}>email the details to {fallback.email}</a> or call <a href={tel}>{fallback.phone}</a>.
              </p>
            </div>
          </div>
        )}
      </div>

      {errorList.length > 0 && attempted && (
        <div ref={summaryRef} tabIndex={-1} className="frm-summary" role="alert" aria-labelledby={`${uid}-summary-title`}>
          <h3 id={`${uid}-summary-title`}>
            <AlertCircle aria-hidden="true" />
            {errorList.length === 1 ? "Fix 1 field to continue" : `Fix ${errorList.length} fields to continue`}
          </h3>
          <ul>
            {errorList.map((f) => (
              <li key={f.name}>
                <a
                  href={`#${fid(f.name)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(fid(f.name));
                    el?.focus();
                    el?.scrollIntoView({ block: "center", behavior: "smooth" });
                  }}
                >
                  {errors[f.name]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form ref={formRef} className="form frm-form" noValidate onSubmit={onSubmit} aria-busy={status === "submitting"}>
        <div className="frm-grid">{fields.map(renderField)}</div>

        {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
        <div className="frm-hp" aria-hidden="true">
          <label htmlFor={`${uid}-${HONEYPOT}`}>Leave this field empty</label>
          <input id={`${uid}-${HONEYPOT}`} name={HONEYPOT} type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <p className="frm-legend">
          Fields marked <span className="frm-req">*</span> are required.
        </p>

        <div className="frm-actions">
          <button type="submit" className="btn btn--primary frm-submit" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 className="frm-spin" aria-hidden="true" /> Sending…
              </>
            ) : (
              <>
                <Send aria-hidden="true" /> {submitLabel}
              </>
            )}
          </button>
          {privacyNote && (
            <p className="frm-privacy">
              <Lock aria-hidden="true" />
              <span>{privacyNote}</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
