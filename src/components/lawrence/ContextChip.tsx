import React from 'react';
import {
  Briefcase, User, FileText, Target, Building, Paperclip, Activity, X,
} from 'lucide-react';
import {
  ContextItem, ChipDensity, ContextKind, chipDisplay, isConsequence, CHIP_MIN_HEIGHT_PX,
} from '../../lawrence/context';

const KIND_ICON: Record<ContextKind, React.ComponentType<{ className?: string }>> = {
  job: Briefcase,
  person: User,
  evidence: FileText,
  mission: Target,
  account: Building,
  file: Paperclip,
  signal: Activity,
};

const TONE_CLASS: Record<string, string> = {
  danger: 'border-consequence-danger/60 bg-consequence-danger/15 text-consequence-danger',
  warn: 'border-consequence-warn/60 bg-consequence-warn/15 text-consequence-warn',
  ok: 'border-consequence-ok/60 bg-consequence-ok/15 text-consequence-ok',
  info: 'border-consequence-info/60 bg-consequence-info/15 text-consequence-info',
  authority: 'border-authority/70 bg-authority/15 text-authority-hover',
};

interface ContextChipProps {
  item: ContextItem;
  density?: ChipDensity;
  /** Click → Focus / Inspector. */
  onInspect?: (item: ContextItem) => void;
  /** × → remove context where removable. */
  onRemove?: (item: ContextItem) => void;
}

/**
 * A single context chip.
 *
 * One line · bounded width · ellipsis · ≥32px control height · full accessible
 * name · click to inspect · × to detach. Consequence chips opt out of the
 * width cap entirely — operational semantics are never clipped.
 */
const ContextChip: React.FC<ContextChipProps> = ({
  item,
  density = 'desktop',
  onInspect,
  onRemove,
}) => {
  const display = chipDisplay(item, density);
  const consequential = isConsequence(item);
  const Icon = KIND_ICON[item.kind];
  const removable = Boolean(item.removable && onRemove && !consequential);

  if (consequential) {
    const tone = TONE_CLASS[item.tone ?? 'warn'];
    return (
      <span
        role="status"
        title={display.accessibleName}
        style={{ minHeight: CHIP_MIN_HEIGHT_PX }}
        className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-xs font-semibold tracking-wide ${tone}`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {display.text}
      </span>
    );
  }

  return (
    <span
      className="group inline-flex shrink-0 items-center rounded-lg border border-edge bg-raised text-xs text-ink-secondary transition-colors hover:border-edge-strong hover:bg-interactive hover:text-ink-primary focus-within:border-edge-focus focus-within:ring-2 focus-within:ring-edge-focus/40"
      style={{ minHeight: CHIP_MIN_HEIGHT_PX }}
    >
      <button
        type="button"
        onClick={() => onInspect?.(item)}
        title={display.accessibleName}
        aria-label={`Inspect ${display.accessibleName}`}
        style={{ maxWidth: display.maxWidthPx, minHeight: CHIP_MIN_HEIGHT_PX }}
        className={`flex min-w-0 items-center gap-1.5 px-2.5 focus:outline-none ${removable ? 'pr-1' : ''}`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-ink-muted group-hover:text-authority" />
        {item.label && (
          <span className="shrink-0 text-ink-muted">{item.label}:</span>
        )}
        <span className="truncate whitespace-nowrap text-ink-primary">{display.text}</span>
      </button>
      {removable && (
        <button
          type="button"
          onClick={() => onRemove?.(item)}
          aria-label={`Remove ${display.accessibleName} from context`}
          title={`Remove ${display.accessibleName}`}
          style={{ minHeight: CHIP_MIN_HEIGHT_PX }}
          className="flex items-center rounded-r-lg px-1.5 text-ink-muted hover:text-consequence-danger focus:outline-none focus:text-consequence-danger"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
};

export default ContextChip;
