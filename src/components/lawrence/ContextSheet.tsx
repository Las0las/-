import React, { useEffect, useRef } from 'react';
import { X, Trash2, SlidersHorizontal } from 'lucide-react';
import { ContextItem, groupContext, isConsequence } from '../../lawrence/context';

interface ContextSheetProps {
  open: boolean;
  items: ContextItem[];
  onClose: () => void;
  onInspect?: (item: ContextItem) => void;
  onRemove?: (item: ContextItem) => void;
  onRemoveAll?: () => void;
  onManage?: () => void;
}

/**
 * Context inspector — what `+N` opens.
 *
 * `+N` is not a dropdown of leftovers; it is the same inspection grammar used
 * everywhere else in LAWRENCE: grouped by object type, each entry showing its
 * canonical value and its qualifier, each individually detachable.
 */
const ContextSheet: React.FC<ContextSheetProps> = ({
  open,
  items,
  onClose,
  onInspect,
  onRemove,
  onRemoveAll,
  onManage,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const handlePointer = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handlePointer);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handlePointer);
    };
  }, [open, onClose]);

  if (!open) return null;

  const groups = groupContext(items);
  const removable = items.filter((item) => item.removable && !isConsequence(item));

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Context attached"
      className="absolute bottom-full left-0 z-30 mb-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-edge-strong bg-surface shadow-raised"
    >
      <div className="flex items-center justify-between border-b border-edge-subtle px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-primary">Context attached</h2>
          <p className="text-xs text-ink-muted">
            {items.length} {items.length === 1 ? 'object' : 'objects'} in scope
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close context inspector"
          className="rounded p-1 text-ink-muted hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {groups.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-ink-muted">No context attached.</p>
        )}
        {groups.map((group) => (
          <section key={group.kind} className="border-b border-edge-subtle/60 px-4 py-3 last:border-b-0">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {group.heading}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => onInspect?.(item)}
                    className="min-w-0 flex-1 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-interactive focus:outline-none focus:ring-2 focus:ring-edge-focus"
                  >
                    {/* Full value — the inspector never truncates. */}
                    <span className="block break-words text-sm text-ink-primary">{item.value}</span>
                    {item.qualifier && (
                      <span className="mt-0.5 block text-xs text-ink-muted">{item.qualifier}</span>
                    )}
                  </button>
                  {item.removable && !isConsequence(item) && (
                    <button
                      type="button"
                      onClick={() => onRemove?.(item)}
                      aria-label={`Remove ${item.label ? `${item.label}: ` : ''}${item.value} from context`}
                      className="mt-1.5 rounded p-1 text-ink-muted hover:text-consequence-danger focus:outline-none focus:ring-2 focus:ring-edge-focus"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-edge-subtle bg-workspace px-3 py-2">
        <button
          type="button"
          onClick={onRemoveAll}
          disabled={removable.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-ink-secondary hover:bg-interactive hover:text-consequence-danger disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-edge-focus"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove all
        </button>
        <button
          type="button"
          onClick={onManage}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-ink-secondary hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Manage context
        </button>
      </div>
    </div>
  );
};

export default ContextSheet;
