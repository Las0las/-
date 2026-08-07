import React from 'react';
import {
  PanelRightClose, ShieldCheck, ShieldAlert, Receipt, MessageSquare, Circle,
} from 'lucide-react';
import { FocusedObject, SessionEntry } from '../../lawrence/objects';
import { modeSpec } from '../../lawrence/grammar';

interface InspectorProps {
  focused: FocusedObject | null;
  entries: SessionEntry[];
  onClose: () => void;
  onAuthorize: (entry: SessionEntry) => void;
  onDecline: (entry: SessionEntry) => void;
}

const STATE_LABEL: Record<SessionEntry['state'], string> = {
  queued: 'Queued',
  'awaiting-authorization': 'Authorization required',
  executed: 'Executed',
  declined: 'Declined',
};

const STATE_TONE: Record<SessionEntry['state'], string> = {
  queued: 'text-ink-muted',
  'awaiting-authorization': 'text-consequence-warn',
  executed: 'text-consequence-ok',
  declined: 'text-consequence-danger',
};

/**
 * UNDERSTAND + OBSERVE.
 *
 * A persistent rail, not a modal: ordinary object exploration must never cost
 * the operator their place. Modal focus is reserved for bounded high-focus
 * operations (authorization review, execution receipt, comparison).
 */
const Inspector: React.FC<InspectorProps> = ({
  focused, entries, onClose, onAuthorize, onDecline,
}) => (
  <aside
    aria-label="Context inspector"
    className="flex h-full w-full flex-col overflow-hidden border-l border-edge-subtle bg-surface"
  >
    <header className="flex items-center justify-between border-b border-edge-subtle px-4 py-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        Inspector
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Hide inspector"
        className="rounded p-1 text-ink-muted hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
      >
        <PanelRightClose className="h-4 w-4" />
      </button>
    </header>

    <div className="flex-1 overflow-y-auto">
      <section className="border-b border-edge-subtle px-4 py-4">
        {focused ? (
          <>
            <h3 className="text-base font-semibold text-ink-primary">{focused.title}</h3>
            {focused.subtitle && (
              <p className="mt-0.5 text-sm text-ink-secondary">{focused.subtitle}</p>
            )}
            {focused.qualifier && (
              <p className="mt-1 text-xs text-ink-muted">{focused.qualifier}</p>
            )}

            <dl className="mt-4 space-y-2">
              {focused.facts.map((fact) => (
                <div key={fact.label} className="flex items-start justify-between gap-3">
                  <dt className="text-xs text-ink-muted">{fact.label}</dt>
                  <dd
                    className={`text-right text-xs ${
                      fact.consequence
                        ? 'font-semibold text-consequence-warn'
                        : 'text-ink-primary'
                    }`}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {focused.evidence && focused.evidence.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  Evidence
                </h4>
                <ul className="space-y-2">
                  {focused.evidence.map((item) => (
                    <li
                      key={item.label}
                      className="rounded-lg border border-edge-subtle bg-raised px-3 py-2 transition-colors hover:border-edge hover:bg-interactive"
                    >
                      <span className="block text-[11px] uppercase tracking-wide text-ink-muted">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block break-words text-xs text-ink-secondary">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="py-6 text-center">
            <Circle className="mx-auto mb-3 h-6 w-6 text-ink-muted" />
            <p className="text-sm text-ink-secondary">Nothing in focus</p>
            <p className="mt-1 text-xs text-ink-muted">
              Select an object in the workspace to inspect it without losing your place.
            </p>
          </div>
        )}
      </section>

      <section className="px-4 py-4">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Activity
        </h4>
        {entries.length === 0 ? (
          <p className="text-xs text-ink-muted">
            Nothing composed yet. Ask, plan, act, or review from the dock below.
          </p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => {
              const spec = modeSpec(entry.mode);
              const pending = entry.state === 'awaiting-authorization';
              return (
                <li
                  key={entry.id}
                  className={`rounded-lg border bg-raised px-3 py-2.5 ${
                    pending ? 'border-authority/70 ring-1 ring-authority/25' : 'border-edge-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-secondary">
                      {spec.consequential ? (
                        <ShieldAlert className="h-3.5 w-3.5 text-authority" />
                      ) : (
                        <MessageSquare className="h-3.5 w-3.5 text-ink-muted" />
                      )}
                      {spec.label}
                    </span>
                    <span className={`text-[11px] font-semibold ${STATE_TONE[entry.state]}`}>
                      {STATE_LABEL[entry.state]}
                    </span>
                  </div>

                  <p className="mt-1.5 break-words text-xs text-ink-primary">{entry.prompt}</p>

                  {entry.context.length > 0 && (
                    <p className="mt-1.5 break-words text-[11px] text-ink-muted">
                      {entry.context.map((item) => item.value).join(' · ')}
                    </p>
                  )}

                  {pending && (
                    <div className="mt-2.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onAuthorize(entry)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-authority px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-authority-hover focus:outline-none focus:ring-2 focus:ring-edge-focus"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Authorize
                      </button>
                      <button
                        type="button"
                        onClick={() => onDecline(entry)}
                        className="rounded-md border border-edge px-2.5 py-1.5 text-[11px] text-ink-secondary hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {entry.receipt && (
                    <p className="mt-2 inline-flex items-start gap-1.5 break-words text-[11px] text-consequence-ok">
                      <Receipt className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {entry.receipt}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  </aside>
);

export default Inspector;
