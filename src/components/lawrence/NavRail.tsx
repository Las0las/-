import React from 'react';
import {
  Users, Briefcase, Building2, Send, Target, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';

export interface RailSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Sections outside this slice stay visible but inert — no dead ends. */
  available: boolean;
}

export const RAIL_SECTIONS: RailSection[] = [
  { id: 'candidates', label: 'Candidates', icon: Users, available: true },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, available: false },
  { id: 'accounts', label: 'Accounts', icon: Building2, available: false },
  { id: 'submissions', label: 'Submissions', icon: Send, available: false },
  { id: 'missions', label: 'Missions', icon: Target, available: false },
];

interface NavRailProps {
  activeId: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSelect: (id: string) => void;
}

/** ORIENT — where the operator is, at tier 0/1 weight only. */
const NavRail: React.FC<NavRailProps> = ({
  activeId, collapsed, onToggleCollapsed, onSelect,
}) => (
  <nav
    aria-label="Workbench sections"
    className={`flex h-full flex-col border-r border-edge-subtle bg-env transition-[width] duration-200 ${
      collapsed ? 'w-14' : 'w-52'
    }`}
  >
    <div className="flex items-center gap-2 px-3 py-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-authority text-xs font-bold text-white">
        L
      </span>
      {!collapsed && (
        <span className="truncate text-sm font-semibold tracking-[0.12em] text-ink-primary">
          LAWRENCE
        </span>
      )}
    </div>

    <ul className="flex-1 space-y-1 px-2">
      {RAIL_SECTIONS.map((section) => {
        const Icon = section.icon;
        const active = section.id === activeId;
        return (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => section.available && onSelect(section.id)}
              aria-current={active ? 'page' : undefined}
              aria-disabled={!section.available}
              title={section.available ? section.label : `${section.label} — not part of this slice`}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-edge-focus ${
                active
                  ? 'bg-selected text-ink-primary'
                  : section.available
                    ? 'text-ink-secondary hover:bg-interactive hover:text-ink-primary'
                    : 'cursor-not-allowed text-ink-muted/60'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{section.label}</span>}
            </button>
          </li>
        );
      })}
    </ul>

    <button
      type="button"
      onClick={onToggleCollapsed}
      aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      className="m-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-muted hover:bg-interactive hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
    >
      {collapsed ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <>
          <PanelLeftClose className="h-4 w-4" />
          <span>Collapse</span>
        </>
      )}
    </button>
  </nav>
);

export default NavRail;
