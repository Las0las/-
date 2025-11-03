import React, { memo } from 'react';
import {
  Star,
  Send,
  Edit,
  Archive,
  CheckCircle,
  Trash2,
  Linkedin,
  Users,
} from 'lucide-react';
import type { Candidate, Job, Submission } from '../../types';
import { getInitials } from '../../utils/formatting';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface CandidateTableProps {
  candidates: Candidate[];
  jobs: Job[];
  submissions: Submission[];
  onView: (candidate: Candidate) => void;
  onSubmit: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onArchive: (candidate: Candidate) => void;
  onRestore: (id: string) => void;
  onDelete: (candidate: Candidate) => void;
  pagination: PaginationProps;
}

const TableRow = memo(
  ({
    candidate,
    onView,
    onSubmit,
    onEdit,
    onArchive,
    onRestore,
    onDelete,
  }: {
    candidate: Candidate;
    onView: () => void;
    onSubmit: () => void;
    onEdit: () => void;
    onArchive: () => void;
    onRestore: () => void;
    onDelete: () => void;
  }) => (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="p-4">
        <button
          onClick={onView}
          className="flex items-center space-x-3 hover:text-purple-400 transition-colors"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(candidate.firstName, candidate.lastName)}
          </div>
          <div className="text-left">
            <div className="text-white font-medium">
              {candidate.firstName} {candidate.lastName}
            </div>
            <div className="text-gray-400 text-sm">{candidate.email}</div>
          </div>
        </button>
      </td>
      <td className="p-4 text-gray-300">{candidate.title}</td>
      <td className="p-4 text-gray-300">{candidate.location}</td>
      <td className="p-4 text-gray-300">{candidate.experience} years</td>
      <td className="p-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium uppercase">
          {candidate.employmentType || 'Any'}
        </span>
      </td>
      <td className="p-4 text-gray-300 text-sm">
        {candidate.availabilityToStart || 'TBD'}
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            candidate.status === 'new'
              ? 'bg-blue-500/20 text-blue-400'
              : candidate.status === 'screening'
              ? 'bg-yellow-500/20 text-yellow-400'
              : candidate.status === 'interviewing'
              ? 'bg-purple-500/20 text-purple-400'
              : candidate.status === 'offer'
              ? 'bg-green-500/20 text-green-400'
              : candidate.status === 'hired'
              ? 'bg-emerald-500/20 text-emerald-400'
              : candidate.status === 'archived'
              ? 'bg-gray-500/20 text-gray-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {candidate.status}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < candidate.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          {candidate.linkedin && (
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="View LinkedIn"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="w-4 h-4 text-gray-400" />
            </a>
          )}
          {candidate.status !== 'archived' ? (
            <>
              <button
                onClick={onSubmit}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Submit to Job"
              >
                <Send className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={onEdit}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Edit Candidate"
              >
                <Edit className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={onArchive}
                className="p-1 hover:bg-red-700 rounded transition-colors"
                title="Archive Candidate"
              >
                <Archive className="w-4 h-4 text-red-400" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRestore}
                className="p-1 hover:bg-green-700 rounded transition-colors"
                title="Restore Candidate"
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 hover:bg-red-700 rounded transition-colors"
                title="Delete Permanently"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
);

TableRow.displayName = 'TableRow';

/**
 * Table view for candidates
 */
export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onView,
  onSubmit,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  pagination,
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage, onPageChange } = pagination;

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <tr>
              <th className="text-left p-4 text-gray-300">Name</th>
              <th className="text-left p-4 text-gray-300">Title</th>
              <th className="text-left p-4 text-gray-300">Location</th>
              <th className="text-left p-4 text-gray-300">Experience</th>
              <th className="text-left p-4 text-gray-300">Employment</th>
              <th className="text-left p-4 text-gray-300">Availability</th>
              <th className="text-left p-4 text-gray-300">Status</th>
              <th className="text-left p-4 text-gray-300">Rating</th>
              <th className="text-left p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                candidate={candidate}
                onView={() => onView(candidate)}
                onSubmit={() => onSubmit(candidate)}
                onEdit={() => onEdit(candidate)}
                onArchive={() => onArchive(candidate)}
                onRestore={() => onRestore(candidate.id)}
                onDelete={() => onDelete(candidate)}
              />
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No candidates found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} candidates
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
