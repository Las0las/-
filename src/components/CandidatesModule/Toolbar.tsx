import React, { useState, useEffect } from 'react';
import { Search, Table, Grid3x3, Loader2 } from 'lucide-react';
import type { ViewMode, FilterState } from '../../types';

interface ToolbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  saving?: boolean;
}

/**
 * Toolbar component for search, filters, and view controls
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  view,
  onViewChange,
  filters,
  onFilterChange,
  saving = false,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.searchTerm);

  // Sync local search with prop changes
  useEffect(() => {
    setLocalSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  // Update filter when local search changes
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFilterChange({ searchTerm: value });
  };

  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Search candidates by name, email, or title"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="screening">Screening</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Saving Indicator */}
          {saving && (
            <div className="flex items-center text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewChange('table')}
            className={`p-2 rounded transition-colors ${
              view === 'table'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            aria-label="Table view"
            aria-pressed={view === 'table'}
          >
            <Table className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange('kanban')}
            className={`p-2 rounded transition-colors ${
              view === 'kanban'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            aria-label="Kanban view"
            aria-pressed={view === 'kanban'}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
