/** Serializable form definitions, so server pages can describe a form and FormShell renders it. */
export type Option = { value: string; label: string };

type Base = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  /** "half" fields sit two to a row on wide screens. */
  width?: "full" | "half";
  /** Message shown when a required field is left empty. Defaults to "Enter your <label>". */
  requiredMessage?: string;
};

export type TextField = Base & {
  type: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  pattern?: string;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
};
export type SelectField = Base & { type: "select"; options: Option[]; placeholder?: string };
export type TextareaField = Base & { type: "textarea"; rows?: number; minLength?: number; maxLength?: number };
export type ChoiceField = Base & { type: "choice"; options: Option[] };
export type RatingField = Base & { type: "rating"; lowLabel?: string; highLabel?: string };
export type CheckboxField = Base & { type: "checkbox" };
/** Non-input row: a short note inside the form (e.g. about documents to email separately). */
export type NoteField = { type: "note"; name: string; text: string; icon?: string };

export type FieldDef = TextField | SelectField | TextareaField | ChoiceField | RatingField | CheckboxField | NoteField;

export const opts = (...labels: string[]): Option[] => labels.map((l) => ({ value: l, label: l }));

/** Common field presets so every form phrases errors the same way. */
export const phoneField = (over: Partial<TextField> = {}): TextField => ({
  name: "phone",
  label: "Phone number",
  type: "tel",
  autoComplete: "tel",
  inputMode: "tel",
  // Escaped for the `v` regex flag browsers use for the pattern attribute.
  pattern: String.raw`^\+?[0-9 \(\)\-]{10,15}$`,
  patternMessage: "Enter a phone number with at least 10 digits, for example 98765 43210",
  width: "half",
  ...over,
});

export const emailField = (over: Partial<TextField> = {}): TextField => ({
  name: "email",
  label: "Email address",
  type: "email",
  autoComplete: "email",
  inputMode: "email",
  width: "half",
  ...over,
});

export const nameField = (over: Partial<TextField> = {}): TextField => ({
  name: "name",
  label: "Full name",
  type: "text",
  autoComplete: "name",
  maxLength: 120,
  width: "half",
  ...over,
});
