import React, { useCallback, useMemo, useState } from 'react';
import { PanelRightOpen } from 'lucide-react';
import NavRail from './NavRail';
import Inspector from './Inspector';
import Composer, { ComposerSubmission } from './Composer';
import { ContextItem, COMPACT_BREAKPOINT_PX } from '../../lawrence/context';
import { FocusedObject, SessionEntry } from '../../lawrence/objects';
import { modeSpec } from '../../lawrence/grammar';

export interface WorkbenchApi {
  /** FOCUS — select an object without losing the surrounding context. */
  focus: (object: FocusedObject | null) => void;
  focusedId: string | null;
}

interface WorkbenchShellProps {
  renderWorkspace: (api: WorkbenchApi) => React.ReactNode;
}

/**
 * Seeded operating context, in the same spirit as the module's seeded
 * candidates and jobs. It exists so the chip rules are exercised against real
 * shapes: end-truncated semantic labels, a middle-truncated filename whose
 * suffix carries identity, and a rate that is never truncated at all.
 */
const SEED_CONTEXT: ContextItem[] = [
  {
    id: 'mission-sap-coverage',
    kind: 'mission',
    label: 'Mission',
    value: 'SAP Coverage Mission',
    qualifier: 'Active · Adam',
    removable: true,
  },
  {
    id: 'job-sap-lead',
    kind: 'job',
    label: 'Job',
    value: 'SAP S/4 Program Lead',
    qualifier: 'Canonical · live',
    removable: true,
  },
  {
    id: 'account-apollo',
    kind: 'account',
    label: 'Account',
    value: 'Apollo Healthcare Commercial Expansion',
    qualifier: 'Tier 1 · renewal Q4',
    removable: true,
  },
  {
    id: 'evidence-interviews',
    kind: 'evidence',
    label: 'Evidence',
    value: 'Interview evidence',
    qualifier: 'Readable alias · 12 sources',
    removable: true,
  },
  {
    id: 'file-resume',
    kind: 'file',
    label: 'File',
    value: 'candidate_resume_v3_final.pdf',
    qualifier: 'Updated Aug 5',
    removable: true,
  },
  {
    id: 'rate-floor',
    kind: 'signal',
    value: '$175/hr',
    qualifier: 'Approved rate floor',
    consequence: true,
    tone: 'info',
  },
];

const SOURCES = [
  'Candidate records',
  'Job requisitions',
  'Interview evidence',
  'Relationship history',
  'Policy library',
];

const AUTHORIZATION_CHIP: ContextItem = {
  id: 'authorization-required',
  kind: 'signal',
  value: 'Authorization required',
  consequence: true,
  tone: 'authority',
};

/**
 * The LAWRENCE workbench.
 *
 *   TIER 0  env          the rail and the gutters
 *   TIER 1  workspace    the dominant operating surface (children)
 *   TIER 2  surface      inspector, composer, cards
 *   TIER 3  interactive  hover / selected
 *   TIER 4  focus        keyboard ring + authority treatment
 *
 * Layout is rail | workspace | inspector with the composer docked across the
 * workspace and inspector columns. Nothing floats in a background void and
 * the workspace is never capped at a reading width — this is an operating
 * surface, not a document.
 */
const WorkbenchShell: React.FC<WorkbenchShellProps> = ({ renderWorkspace }) => {
  const [railCollapsed, setRailCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < COMPACT_BREAKPOINT_PX,
  );
  const [inspectorOpen, setInspectorOpen] = useState(true);
  // Below the compact breakpoint the inspector becomes a temporary overlay
  // rather than a column — bounded focus, same content, no dead end.
  const [overlayInspector, setOverlayInspector] = useState(false);
  const [focused, setFocused] = useState<FocusedObject | null>(null);
  const [detached, setDetached] = useState<string[]>([]);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([
    'Candidate records',
    'Job requisitions',
  ]);

  const focus = useCallback((object: FocusedObject | null) => {
    setFocused(object);
    if (object) {
      setInspectorOpen(true);
      setDetached((ids) => ids.filter((id) => id !== object.contextItem.id));
    }
  }, []);

  const pendingAuthorization = entries.some(
    (entry) => entry.state === 'awaiting-authorization',
  );

  const context = useMemo(() => {
    const items = [...SEED_CONTEXT];
    if (focused) items.splice(2, 0, focused.contextItem);
    // Consequence context is never detachable and never hidden behind +N.
    const visible = items.filter((item) => !detached.includes(item.id));
    return pendingAuthorization ? [AUTHORIZATION_CHIP, ...visible] : visible;
  }, [focused, detached, pendingAuthorization]);

  const removeContext = useCallback((item: ContextItem) => {
    setDetached((ids) => (ids.includes(item.id) ? ids : [...ids, item.id]));
    setFocused((current) => (current?.contextItem.id === item.id ? null : current));
  }, []);

  const removeAllContext = useCallback(() => {
    setDetached(context.filter((item) => item.removable).map((item) => item.id));
    setFocused(null);
  }, [context]);

  const inspectContext = useCallback((item: ContextItem) => {
    setInspectorOpen(true);
    if (focused?.contextItem.id !== item.id) {
      setFocused({
        id: item.id,
        kind: item.kind,
        title: item.value,
        qualifier: item.qualifier,
        facts: [
          { label: 'Type', value: item.label ?? item.kind },
          { label: 'Attached', value: item.removable ? 'Detachable' : 'Pinned' },
        ],
        contextItem: item,
      });
    }
  }, [focused]);

  const handleSubmit = useCallback((submission: ComposerSubmission) => {
    const spec = modeSpec(submission.mode);
    // Plan mode against a focused object with a precomputed answer (e.g. a
    // candidate's ranked job matches) resolves immediately — it's real,
    // already-computed data, not a fabricated response.
    const quickPlan = submission.mode === 'plan' ? focused?.quickPlan : undefined;
    setEntries((current) => [
      {
        id: `entry-${Date.now()}`,
        mode: submission.mode,
        prompt: submission.prompt,
        context: submission.context.map((item) => ({
          label: item.label ?? item.kind,
          value: item.value,
        })),
        sources: submission.sources,
        createdAt: new Date().toISOString(),
        // Consequential modes stop at AUTHORIZE. Everything else without a
        // precomputed answer is queued — no model is wired up in this build.
        state: spec.consequential ? 'awaiting-authorization' : quickPlan ? 'executed' : 'queued',
        receipt: quickPlan
          ? [quickPlan.summary, ...quickPlan.steps].join(' ')
          : undefined,
      },
      ...current,
    ]);
    setInspectorOpen(true);
  }, [focused]);

  const authorize = useCallback((entry: SessionEntry) => {
    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              state: 'executed',
              receipt: `Authorized ${new Date().toLocaleTimeString()} · ${item.context.length} context ${
                item.context.length === 1 ? 'object' : 'objects'
              } · ${item.sources.length} ${item.sources.length === 1 ? 'source' : 'sources'}`,
            }
          : item,
      ),
    );
  }, []);

  const decline = useCallback((entry: SessionEntry) => {
    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id
          ? { ...item, state: 'declined', receipt: 'Declined — no action taken.' }
          : item,
      ),
    );
  }, []);

  const api = useMemo<WorkbenchApi>(
    () => ({ focus, focusedId: focused?.id ?? null }),
    [focus, focused],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-env text-ink-primary">
      <NavRail
        activeId="candidates"
        collapsed={railCollapsed}
        onToggleCollapsed={() => setRailCollapsed((value) => !value)}
        onSelect={() => undefined}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1">
          {/* TIER 1 — the workspace owns the width it needs. */}
          <main className="min-w-0 flex-1 overflow-y-auto bg-workspace">
            {renderWorkspace(api)}
          </main>

          {inspectorOpen ? (
            <div className="hidden w-80 shrink-0 lg:block">
              <Inspector
                focused={focused}
                entries={entries}
                onClose={() => setInspectorOpen(false)}
                onAuthorize={authorize}
                onDecline={decline}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setInspectorOpen(true)}
              aria-label="Show inspector"
              className="hidden shrink-0 items-center border-l border-edge-subtle bg-surface px-2 text-ink-muted hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus lg:flex"
            >
              <PanelRightOpen className="h-4 w-4" />
            </button>
          )}

          {/* Compact viewports reach the same inspector as an overlay. */}
          <button
            type="button"
            onClick={() => setOverlayInspector(true)}
            aria-label="Show inspector"
            className="absolute right-0 top-24 z-30 rounded-l-lg border border-r-0 border-edge bg-surface px-1.5 py-3 text-ink-muted shadow-raised hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus lg:hidden"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>

          {overlayInspector && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setOverlayInspector(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] shadow-raised">
                <Inspector
                  focused={focused}
                  entries={entries}
                  onClose={() => setOverlayInspector(false)}
                  onAuthorize={authorize}
                  onDecline={decline}
                />
              </div>
            </div>
          )}
        </div>

        {/* COMPOSE — docked across workspace + inspector, always present. */}
        <div className="shrink-0 border-t border-edge-subtle bg-env px-4 py-3 shadow-dock">
          <Composer
            context={context}
            sources={SOURCES}
            activeSources={activeSources}
            onSubmit={handleSubmit}
            onRemoveContext={removeContext}
            onRemoveAllContext={removeAllContext}
            onInspectContext={inspectContext}
            onToggleSource={(source) =>
              setActiveSources((current) =>
                current.includes(source)
                  ? current.filter((item) => item !== source)
                  : [...current, source],
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default WorkbenchShell;
