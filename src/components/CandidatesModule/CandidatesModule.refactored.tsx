import React, { useState, useMemo } from 'react';
import { Plus, Archive } from 'lucide-react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CandidateTable } from './CandidateTable';
import { CandidateKanban } from './CandidateKanban';
import { CandidateSidebar } from './CandidateSidebar';
import { Toolbar } from './Toolbar';
import { StatsFooter } from './StatsFooter';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useCandidates } from '../../hooks/useCandidates';
import { useDebounce } from '../../hooks/useDebounce';
import { generateMockCandidates, generateMockJobs } from '../../utils/mockData';
import type {
  Candidate,
  ViewMode,
  SidebarContent,
  DeleteConfirmation,
  FilterState,
  PaginationState
} from '../../types';

/**
 * Main Candidates Module - Refactored Version
 *
 * Improvements:
 * - Reduced from 1500+ to ~200 lines
 * - Extracted components for separation of concerns
 * - Custom hooks for data management
 * - Better TypeScript types
 * - Cleaner state management
 */
const CandidatesModule: React.FC = () => {
  // Data management with custom hook
  const {
    candidates,
    jobs,
    submissions,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    archiveCandidate,
    restoreCandidate,
    submitToJob,
    error: dataError,
  } = useCandidates(generateMockCandidates(), generateMockJobs(), []);

  // UI State
  const [view, setView] = useState<ViewMode>('table');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<SidebarContent>('profile');
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: 'all',
    showArchived: false,
  });

  // Pagination State
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 20,
  });

  // Debounce search term for performance
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Filter candidates with memoization
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const isArchived = candidate.status === 'archived';
      if (!filters.showArchived && isArchived) return false;
      if (filters.showArchived && !isArchived) return false;

      const matchesSearch =
        debouncedSearchTerm === '' ||
        candidate.firstName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        candidate.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (candidate.candidateSummary?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || false);

      const matchesFilter = filters.status === 'all' || candidate.status === filters.status;

      return matchesSearch && matchesFilter;
    });
  }, [candidates, debouncedSearchTerm, filters.status, filters.showArchived]);

  // Paginated candidates
  const paginatedCandidates = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, pagination.currentPage, pagination.itemsPerPage]);

  // Calculate stats
  const stats = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      total: candidates.filter((c) => c.status !== 'archived').length,
      active: candidates.filter((c) => c.status !== 'rejected' && c.status !== 'archived').length,
      thisWeek: candidates.filter(
        (c) => new Date(c.createdAt) > weekAgo && c.status !== 'archived'
      ).length,
      archived: candidates.filter((c) => c.status === 'archived').length,
    };
  }, [candidates]);

  // Handlers
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSidebarContent('profile');
    setSidebarOpen(true);
  };

  const handleSubmitCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSidebarContent('submit');
    setSidebarOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSidebarContent('editCandidate');
    setSidebarOpen(true);
  };

  const handleNewCandidate = () => {
    setSelectedCandidate(null);
    setSidebarContent('newCandidate');
    setSidebarOpen(true);
  };

  const handleArchiveRequest = (candidate: Candidate) => {
    setDeleteConfirm({ type: 'candidate', item: candidate });
  };

  const handleDeleteRequest = (candidate: Candidate) => {
    setDeleteConfirm({ type: 'candidate', item: candidate });
  };

  const handleConfirmAction = () => {
    if (!deleteConfirm) return;

    const candidate = deleteConfirm.item as Candidate;
    if (candidate.status === 'archived') {
      deleteCandidate(candidate.id);
    } else {
      archiveCandidate(candidate.id);
    }
    setDeleteConfirm(null);
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const totalPages = Math.ceil(filteredCandidates.length / pagination.itemsPerPage);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
          <div className="bg-gray-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {filters.showArchived ? 'Archived Candidates' : 'Candidates'}
                </h1>
                <p className="text-gray-400 mt-1">Manage and track all candidates</p>
              </div>
              <div className="flex items-center space-x-4">
                {dataError && (
                  <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm">
                    {dataError.message}
                  </div>
                )}
                <button
                  onClick={() => handleFilterChange({ showArchived: !filters.showArchived })}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    filters.showArchived
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Archive className="w-5 h-5" />
                  <span>
                    {filters.showArchived ? 'Show Active' : `View Archived (${stats.archived})`}
                  </span>
                </button>
                <button
                  onClick={handleNewCandidate}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Candidate</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <Toolbar
          view={view}
          onViewChange={setView}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content */}
        <div className="relative">
          {view === 'table' ? (
            <CandidateTable
              candidates={paginatedCandidates}
              jobs={jobs}
              submissions={submissions}
              onView={handleViewCandidate}
              onSubmit={handleSubmitCandidate}
              onEdit={handleEditCandidate}
              onArchive={handleArchiveRequest}
              onRestore={restoreCandidate}
              onDelete={handleDeleteRequest}
              pagination={{
                currentPage: pagination.currentPage,
                totalPages,
                totalItems: filteredCandidates.length,
                itemsPerPage: pagination.itemsPerPage,
                onPageChange: handlePageChange,
              }}
            />
          ) : (
            <CandidateKanban
              candidates={filteredCandidates}
              showArchived={filters.showArchived}
              onView={handleViewCandidate}
              onSubmit={handleSubmitCandidate}
              onEdit={handleEditCandidate}
              onRestore={restoreCandidate}
            />
          )}
        </div>

        {/* Sidebar */}
        <CandidateSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          content={sidebarContent}
          candidate={selectedCandidate}
          jobs={jobs}
          submissions={submissions}
          onCreate={createCandidate}
          onUpdate={updateCandidate}
          onSubmit={submitToJob}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          confirmation={deleteConfirm}
          onConfirm={handleConfirmAction}
          onCancel={() => setDeleteConfirm(null)}
        />

        {/* Stats Footer */}
        <StatsFooter stats={stats} candidates={candidates} jobs={jobs} submissions={submissions} />
      </div>
    </ErrorBoundary>
  );
};

export default CandidatesModule;
