import { ContextItem, ContextKind } from './context';
import { ComposerMode } from './grammar';

/**
 * The object currently in FOCUS — selected without losing the surrounding
 * operating context. The inspector renders this; the composer attaches it.
 */
export interface FocusedObject {
  id: string;
  kind: ContextKind;
  title: string;
  subtitle?: string;
  /** Short qualifier shown under the title, e.g. "Candidate · evaluated". */
  qualifier?: string;
  /** Scannable facts. `consequence` facts are rendered in an operational tone. */
  facts: { label: string; value: string; consequence?: boolean }[];
  /** Evidence trail — what the operator can inspect to justify a decision. */
  evidence?: { label: string; value: string }[];
  /** The context chip this object contributes to the composer. */
  contextItem: ContextItem;
  /**
   * Precomputed Plan-mode answer for this object, e.g. ranked job matches for
   * a focused candidate. When present, submitting in Plan mode returns it
   * immediately instead of queuing — it's already been computed from the
   * object's own data, not fabricated by a model.
   */
  quickPlan?: { summary: string; steps: string[] };
}

export type SessionState = 'queued' | 'awaiting-authorization' | 'executed' | 'declined';

/**
 * One pass through COMPOSE → AUTHORIZE → EXECUTE → OBSERVE. Non-consequential
 * modes land in `queued`; `act` stops at `awaiting-authorization` until the
 * operator explicitly authorizes, and only then produces a receipt.
 */
export interface SessionEntry {
  id: string;
  mode: ComposerMode;
  prompt: string;
  context: { label: string; value: string }[];
  sources: string[];
  createdAt: string;
  state: SessionState;
  receipt?: string;
}
