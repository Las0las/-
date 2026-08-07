/**
 * LAWRENCE surface hierarchy — single source of truth.
 *
 * Consumed by tailwind.config.js, which both (a) maps these into Tailwind
 * colour utilities and (b) emits them as `--lw-*` custom properties on :root
 * so raw CSS can use the same values without drifting.
 *
 * The hierarchy is deliberately stepped, not shaded. Each tier must be
 * unmistakably different from the one above it:
 *
 *   TIER 0  environment   muted canvas, carries no product weight
 *   TIER 1  workspace     dominant operational surface
 *   TIER 2  surface       cards / rows / inspector / composer
 *   TIER 3  interactive   hover / selected / dragging
 *   TIER 4  focus         keyboard focus + authority treatment
 */

/** Tier 0 → Tier 4, plus the borders and text that separate them. */
export const surfaces = {
  env: '#070a11',
  workspace: '#131a29',
  surface: '#1d2637',
  raised: '#243049',
  interactive: '#2a3549',
  selected: '#33415a',
};

export const borders = {
  subtle: '#212b3f',
  DEFAULT: '#33405a',
  strong: '#4a5a7c',
  focus: '#7c8dff',
};

export const text = {
  primary: '#f2f5fa',
  secondary: '#aab6cc',
  muted: '#74829c',
  inverse: '#0a0e16',
};

/** Authority accent — reserved for consequential/governed affordances. */
export const authority = {
  DEFAULT: '#6b7dff',
  hover: '#8090ff',
  soft: '#232c52',
};

/** Operational semantics. These are never decorative and never truncated. */
export const consequence = {
  danger: '#f4614c',
  warn: '#f2a93b',
  ok: '#3dd68c',
  info: '#58b6f0',
};

/**
 * Re-tuned neutral ramp. The existing modules already use gray-900 for the
 * workspace and gray-800 for cards — the relationship was right, the contrast
 * was not. Remapping the ramp fixes every surface in one place instead of
 * rewriting several thousand class names.
 */
export const gray = {
  50: '#f7f9fc',
  100: '#edf1f7',
  200: '#dde3ee',
  300: '#c4cdde',
  400: '#aab6cc',
  500: '#566481',
  600: '#3a4761',
  700: '#2a3549',
  800: '#1d2637',
  900: '#131a29',
  950: '#070a11',
};

/** Flattened `--lw-*` custom properties for the Tailwind base layer. */
export const cssVariables = {
  '--lw-env': surfaces.env,
  '--lw-workspace': surfaces.workspace,
  '--lw-surface': surfaces.surface,
  '--lw-raised': surfaces.raised,
  '--lw-interactive': surfaces.interactive,
  '--lw-selected': surfaces.selected,
  '--lw-border-subtle': borders.subtle,
  '--lw-border': borders.DEFAULT,
  '--lw-border-strong': borders.strong,
  '--lw-border-focus': borders.focus,
  '--lw-text': text.primary,
  '--lw-text-secondary': text.secondary,
  '--lw-text-muted': text.muted,
  '--lw-authority': authority.DEFAULT,
  '--lw-danger': consequence.danger,
  '--lw-warn': consequence.warn,
  '--lw-ok': consequence.ok,
  '--lw-info': consequence.info,
};
