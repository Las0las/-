/**
 * LAWRENCE context model + truncation rules.
 *
 * The design-system rule this file enforces:
 *
 *     Truncate identity, never truncate consequence.
 *
 * Identity ("Christopher Thompson", "SAP S/4 Program Lead",
 * "candidate_resume_v3_final.pdf") is recoverable — the full string is always
 * on the accessible name, and one click opens the context inspector.
 * Consequence ("Authorization required", "Expires Aug 9", "$175/hr") is
 * operational semantics: abbreviating it changes what the operator believes.
 */

export type ContextKind =
  | 'job'
  | 'person'
  | 'evidence'
  | 'mission'
  | 'account'
  | 'file'
  | 'signal';

export type TruncationMode = 'end' | 'middle' | 'none';

export interface ContextItem {
  id: string;
  kind: ContextKind;
  /** Short type prefix rendered before the value, e.g. "Candidate". */
  label?: string;
  /** The identity string. May be truncated for display. */
  value: string;
  /** Second line in the context inspector, e.g. "Canonical · live". */
  qualifier?: string;
  /** Whether the operator may detach this context. */
  removable?: boolean;
  /** Marks operational semantics. Forces `truncation: 'none'`. */
  consequence?: boolean;
  /** Tone for consequence chips. Ignored for ordinary context. */
  tone?: 'danger' | 'warn' | 'ok' | 'info' | 'authority';
  /** Explicit override; otherwise inferred from value shape. */
  truncation?: TruncationMode;
  /** Opaque handle the host app uses to focus the underlying object. */
  focusRef?: string;
}

export type ChipDensity = 'desktop' | 'compact';

/**
 * Bounded chip geometry. Width caps come from the design rule
 * (desktop ≈ 180–240px, compact ≈ 140–180px); the character budgets are the
 * equivalent budget for middle truncation, which cannot be done in CSS.
 */
export const CHIP_METRICS: Record<
  ChipDensity,
  { maxWidthPx: number; charBudget: number }
> = {
  desktop: { maxWidthPx: 220, charBudget: 26 },
  compact: { maxWidthPx: 160, charBudget: 18 },
};

/** Minimum control height for a chip and its remove affordance. */
export const CHIP_MIN_HEIGHT_PX = 32;

/** Default number of chips rendered inline before the `+N` overflow. */
export const CHIP_OVERFLOW_AFTER: Record<ChipDensity, number> = {
  desktop: 4,
  compact: 2,
};

/**
 * Strings that carry operational consequence. Matching values are never
 * truncated, never abbreviated, and never hidden behind `+N`.
 */
const CONSEQUENCE_PATTERNS: RegExp[] = [
  /authoriz/i,
  /\brequired\b/i,
  /^blocked\b/i,
  /^denied\b/i,
  /polic(?:y|ies)\s+denied/i,
  /^due\b/i,
  /^overdue\b/i,
  /^expires?\b/i,
  /^production\b/i,
  /^freeze\b/i,
  /break.?glass/i,
  /^\$\s?\d/,
  /\/hr\b/i,
];

/** Value shapes whose trailing characters carry the identity. */
const SUFFIX_IDENTITY_PATTERNS: RegExp[] = [
  /\.[A-Za-z0-9]{2,5}$/, // filename extension  → candidate_resume…final.pdf
  /[_-][A-Za-z0-9]{4,}$/, // delimited id tail   → acct_9182…731a
  /[0-9a-f]{6,}$/i, // bare hex tail       → PR-02147…8bd7
];

const SEPARATORS = /[._\-/\s]/;

export function isConsequence(item: Pick<ContextItem, 'value' | 'consequence'>): boolean {
  if (item.consequence) return true;
  return CONSEQUENCE_PATTERNS.some((pattern) => pattern.test(item.value));
}

export function carriesSuffixIdentity(value: string): boolean {
  return SUFFIX_IDENTITY_PATTERNS.some((pattern) => pattern.test(value));
}

/** Resolve which truncation a value gets, given explicit overrides. */
export function resolveTruncation(item: ContextItem): TruncationMode {
  if (isConsequence(item)) return 'none';
  if (item.truncation) return item.truncation;
  return carriesSuffixIdentity(item.value) ? 'middle' : 'end';
}

/**
 * Middle ellipsis for values whose suffix carries identity.
 *
 * The tail budget is ~45% of the surviving characters, then snapped forward to
 * a separator so the tail never starts mid-token:
 *
 *   candidate_resume_v3_final.pdf → candidate_re…final.pdf
 *   acct_9182773188731a           → acct_9182…731a
 */
export function truncateMiddle(value: string, budget: number, ellipsis = '…'): string {
  if (budget <= 0) return '';
  if (value.length <= budget) return value;
  if (budget <= ellipsis.length + 1) return value.slice(0, budget - ellipsis.length) + ellipsis;

  const keep = budget - ellipsis.length;
  let tailLength = Math.min(Math.max(Math.round(keep * 0.45), 4), keep - 1);
  let tail = value.slice(value.length - tailLength);

  // Snap the tail forward to a separator boundary when doing so leaves a tail
  // that is still substantial — avoids "…inal.pdf" style fragments.
  const separatorIndex = tail.search(SEPARATORS);
  if (separatorIndex > 0 && tailLength - separatorIndex >= 4) {
    tail = tail.slice(separatorIndex + 1);
    tailLength = tail.length;
  }

  return value.slice(0, keep - tailLength) + ellipsis + tail;
}

/** End ellipsis, used for ordinary semantic labels. */
export function truncateEnd(value: string, budget: number, ellipsis = '…'): string {
  if (budget <= 0) return '';
  if (value.length <= budget) return value;
  if (budget <= ellipsis.length) return ellipsis;
  return value.slice(0, budget - ellipsis.length).trimEnd() + ellipsis;
}

export interface ChipDisplay {
  /** The string actually rendered. */
  text: string;
  /** True when characters were dropped by JS (middle mode only). */
  truncated: boolean;
  mode: TruncationMode;
  /** Full, untruncated accessible name — always announced in full. */
  accessibleName: string;
  /** CSS max-width; `undefined` for consequence chips, which never clip. */
  maxWidthPx?: number;
}

/**
 * Resolve a context item into everything the chip needs to render.
 *
 * `end` mode returns the untruncated string on purpose: CSS handles the
 * ellipsis so the chip clips at the real rendered width rather than at a
 * guessed character count.
 */
export function chipDisplay(item: ContextItem, density: ChipDensity = 'desktop'): ChipDisplay {
  const { maxWidthPx, charBudget } = CHIP_METRICS[density];
  const mode = resolveTruncation(item);
  const accessibleName = item.label ? `${item.label}: ${item.value}` : item.value;

  if (mode === 'none') {
    return { text: item.value, truncated: false, mode, accessibleName };
  }

  if (mode === 'middle') {
    const text = truncateMiddle(item.value, charBudget);
    return { text, truncated: text !== item.value, mode, accessibleName, maxWidthPx };
  }

  return { text: item.value, truncated: false, mode, accessibleName, maxWidthPx };
}

/**
 * Split context for rendering: consequence chips are always visible, ordinary
 * identity chips overflow into `+N`.
 */
export function partitionContext(
  items: ContextItem[],
  density: ChipDensity = 'desktop',
  limit = CHIP_OVERFLOW_AFTER[density],
): { pinned: ContextItem[]; visible: ContextItem[]; overflow: ContextItem[] } {
  const pinned = items.filter((item) => isConsequence(item));
  const ordinary = items.filter((item) => !isConsequence(item));
  return {
    pinned,
    visible: ordinary.slice(0, limit),
    overflow: ordinary.slice(limit),
  };
}

/** Viewport below which chips drop to the compact width budget. */
export const COMPACT_BREAKPOINT_PX = 1024;

/** Display order and headings used by the context inspector. */
export const CONTEXT_GROUPS: { kind: ContextKind; heading: string }[] = [
  { kind: 'mission', heading: 'Mission' },
  { kind: 'job', heading: 'Job' },
  { kind: 'person', heading: 'Person' },
  { kind: 'account', heading: 'Account' },
  { kind: 'evidence', heading: 'Evidence' },
  { kind: 'file', heading: 'File' },
  { kind: 'signal', heading: 'Signal' },
];

export function groupContext(items: ContextItem[]) {
  return CONTEXT_GROUPS.map(({ kind, heading }) => ({
    kind,
    heading,
    items: items.filter((item) => item.kind === kind),
  })).filter((group) => group.items.length > 0);
}
