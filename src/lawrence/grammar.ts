/**
 * LAWRENCE interaction grammar.
 *
 * The composer modes are not personas (Write / Learn / Code). They map onto
 * the system's own operating grammar, so the mode the operator picks is the
 * same thing the architecture already distinguishes.
 */

export type ComposerMode = 'ask' | 'plan' | 'act' | 'review';

export interface ComposerModeSpec {
  id: ComposerMode;
  label: string;
  description: string;
  /** Whether submitting in this mode produces a governed, consequential move. */
  consequential: boolean;
  /** Verb on the submit affordance. */
  submitLabel: string;
}

export const COMPOSER_MODES: ComposerModeSpec[] = [
  {
    id: 'ask',
    label: 'Ask',
    description: 'Understand / explain / retrieve',
    consequential: false,
    submitLabel: 'Ask',
  },
  {
    id: 'plan',
    label: 'Plan',
    description: 'Construct bounded next moves',
    consequential: false,
    submitLabel: 'Plan',
  },
  {
    id: 'act',
    label: 'Act',
    description: 'Propose governed consequential action',
    consequential: true,
    submitLabel: 'Propose action',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Inspect evidence / delta / execution',
    consequential: false,
    submitLabel: 'Review',
  },
];

export function modeSpec(mode: ComposerMode): ComposerModeSpec {
  return COMPOSER_MODES.find((spec) => spec.id === mode) ?? COMPOSER_MODES[0];
}

/**
 * The operating loop the shell is built around. Every stage below is a real
 * surface in the UI, not a diagram: ORIENT is the rail, FIND is the toolbar,
 * FOCUS is row selection, UNDERSTAND is the inspector, COMPOSE is the dock,
 * AUTHORIZE is the explicit confirmation on Act, EXECUTE emits a receipt, and
 * OBSERVE is the activity log the receipt lands in.
 */
export const INTERACTION_GRAMMAR = [
  'ORIENT',
  'FIND',
  'FOCUS',
  'UNDERSTAND',
  'COMPOSE',
  'AUTHORIZE',
  'EXECUTE',
  'OBSERVE',
  'RESUME',
] as const;

export type GrammarStage = (typeof INTERACTION_GRAMMAR)[number];
