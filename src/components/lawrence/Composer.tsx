import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronDown, Layers, Check } from 'lucide-react';
import ContextChip from './ContextChip';
import ContextSheet from './ContextSheet';
import {
  ContextItem, ChipDensity, partitionContext, CHIP_MIN_HEIGHT_PX, COMPACT_BREAKPOINT_PX,
} from '../../lawrence/context';
import { COMPOSER_MODES, ComposerMode, modeSpec } from '../../lawrence/grammar';

export interface ComposerSubmission {
  mode: ComposerMode;
  prompt: string;
  context: ContextItem[];
  sources: string[];
}

/** Chip width budget follows the viewport unless the caller pins it. */
const useChipDensity = (override?: ChipDensity): ChipDensity => {
  const [density, setDensity] = useState<ChipDensity>(() =>
    typeof window !== 'undefined' && window.innerWidth < COMPACT_BREAKPOINT_PX
      ? 'compact'
      : 'desktop',
  );

  useEffect(() => {
    if (override) return undefined;
    const query = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT_PX - 1}px)`);
    const update = () => setDensity(query.matches ? 'compact' : 'desktop');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [override]);

  return override ?? density;
};

interface ComposerProps {
  context: ContextItem[];
  sources: string[];
  activeSources: string[];
  /** Omit to follow the viewport. */
  density?: ChipDensity;
  onSubmit: (submission: ComposerSubmission) => void;
  onRemoveContext: (item: ContextItem) => void;
  onRemoveAllContext: () => void;
  onInspectContext: (item: ContextItem) => void;
  onToggleSource: (source: string) => void;
}

/**
 * The persistent interaction anchor.
 *
 * Docked, never floating in a void: the composer owns the bottom of the
 * workspace at all times so the operator never hunts for where to act. Mode
 * selection sits inside the composer rather than in a separate surface,
 * because the mode changes what submitting means.
 */
const Composer: React.FC<ComposerProps> = ({
  context,
  sources,
  activeSources,
  density: densityOverride,
  onSubmit,
  onRemoveContext,
  onRemoveAllContext,
  onInspectContext,
  onToggleSource,
}) => {
  const [mode, setMode] = useState<ComposerMode>('ask');
  const [prompt, setPrompt] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);

  const density = useChipDensity(densityOverride);
  const spec = modeSpec(mode);
  const { pinned, visible, overflow } = partitionContext(context, density);

  // Auto-grow, bounded. The composer never becomes the page.
  useLayoutEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = 'auto';
    node.style.height = `${Math.min(node.scrollHeight, 168)}px`;
  }, [prompt]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      // ⌘/Ctrl + 1–4 switches operating mode from anywhere.
      if ((event.metaKey || event.ctrlKey) && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        setMode(COMPOSER_MODES[Number(event.key) - 1].id);
        textareaRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!sourcesOpen) return;
    const handlePointer = (event: MouseEvent) => {
      if (sourcesRef.current && !sourcesRef.current.contains(event.target as Node)) {
        setSourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [sourcesOpen]);

  const submit = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onSubmit({ mode, prompt: trimmed, context, sources: activeSources });
    setPrompt('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={`rounded-xl border bg-surface shadow-raised transition-colors ${
        spec.consequential ? 'border-authority/70 ring-1 ring-authority/25' : 'border-edge'
      }`}
    >
      {/* Prompt line */}
      <div className="flex items-end gap-2 px-3 pt-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask LAWRENCE…"
          aria-label={`${spec.label} LAWRENCE — ${spec.description}`}
          className="flex-1 resize-none bg-transparent py-1.5 text-sm leading-6 text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!prompt.trim()}
          aria-label={spec.submitLabel}
          title={`${spec.submitLabel} · Enter`}
          className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-edge-focus disabled:cursor-not-allowed disabled:opacity-40 ${
            spec.consequential
              ? 'bg-authority text-white hover:bg-authority-hover'
              : 'bg-interactive text-ink-primary hover:bg-selected'
          }`}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* Context line — bounded chips, consequence pinned, overflow inspectable */}
      <div className="relative flex flex-wrap items-center gap-1.5 px-3 pt-2">
        {pinned.map((item) => (
          <ContextChip key={item.id} item={item} density={density} />
        ))}
        {visible.map((item) => (
          <ContextChip
            key={item.id}
            item={item}
            density={density}
            onInspect={onInspectContext}
            onRemove={onRemoveContext}
          />
        ))}
        {overflow.length > 0 && (
          <button
            type="button"
            onClick={() => setSheetOpen((open) => !open)}
            aria-expanded={sheetOpen}
            aria-label={`Inspect ${overflow.length} more context ${overflow.length === 1 ? 'object' : 'objects'}`}
            style={{ minHeight: CHIP_MIN_HEIGHT_PX }}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-edge bg-raised px-2.5 text-xs text-ink-secondary hover:border-edge-strong hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
          >
            <Layers className="h-3.5 w-3.5" />
            +{overflow.length}
          </button>
        )}
        {context.length === 0 && (
          <span className="py-1.5 text-xs text-ink-muted">No context attached</span>
        )}

        <ContextSheet
          open={sheetOpen}
          items={context}
          onClose={() => setSheetOpen(false)}
          onInspect={(item) => {
            onInspectContext(item);
            setSheetOpen(false);
          }}
          onRemove={onRemoveContext}
          onRemoveAll={() => {
            onRemoveAllContext();
            setSheetOpen(false);
          }}
          onManage={() => setSheetOpen(false)}
        />
      </div>

      {/* Mode line — the operating grammar, not personas */}
      <div className="mt-2 flex items-center justify-between gap-3 border-t border-edge-subtle px-3 py-2">
        <div role="radiogroup" aria-label="Operating mode" className="flex items-center gap-1">
          {COMPOSER_MODES.map((option, index) => {
            const active = option.id === mode;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMode(option.id)}
                title={`${option.description} · ⌘${index + 1}`}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-edge-focus ${
                  active
                    ? option.consequential
                      ? 'bg-authority text-white'
                      : 'bg-selected text-ink-primary'
                    : 'text-ink-secondary hover:bg-interactive hover:text-ink-primary'
                }`}
              >
                {option.label}
              </button>
            );
          })}
          <span className="ml-2 hidden text-xs text-ink-muted lg:inline">{spec.description}</span>
        </div>

        <div className="relative" ref={sourcesRef}>
          <button
            type="button"
            onClick={() => setSourcesOpen((open) => !open)}
            aria-expanded={sourcesOpen}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-ink-secondary hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
          >
            Sources
            {activeSources.length > 0 && (
              <span className="text-ink-muted">({activeSources.length})</span>
            )}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {sourcesOpen && (
            <div
              role="menu"
              aria-label="Retrieval sources"
              className="absolute bottom-full right-0 z-30 mb-2 w-56 overflow-hidden rounded-lg border border-edge-strong bg-surface py-1 shadow-raised"
            >
              {sources.map((source) => {
                const on = activeSources.includes(source);
                return (
                  <button
                    key={source}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={on}
                    onClick={() => onToggleSource(source)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-ink-secondary hover:bg-interactive hover:text-ink-primary focus:outline-none focus:bg-interactive"
                  >
                    {source}
                    {on && <Check className="h-3.5 w-3.5 text-authority" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Composer;
