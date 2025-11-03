import React from 'react';
import {
  Star,
  MapPin,
  Briefcase,
  FileCheck,
  CalendarDays,
  Linkedin,
  Send,
  Edit,
  CheckCircle,
} from 'lucide-react';
import type { Candidate } from '../../types';
import { getInitials } from '../../utils/formatting';

interface CandidateKanbanProps {
  candidates: Candidate[];
  showArchived: boolean;
  onView: (candidate: Candidate) => void;
  onSubmit: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onRestore: (id: string) => void;
}

/**
 * Kanban board view for candidates
 */
export const CandidateKanban: React.FC<CandidateKanbanProps> = ({
  candidates,
  showArchived,
  onView,
  onSubmit,
  onEdit,
  onRestore,
}) => {
  const columns = showArchived
    ? ['archived']
    : ['new', 'screening', 'interviewing', 'offer', 'hired', 'rejected'];

  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {columns.map((status) => {
        const columnCandidates = candidates.filter((c) => c.status === status);

        return (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium capitalize">{status}</h3>
                <span className="text-gray-400 text-sm">{columnCandidates.length}</span>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {columnCandidates.slice(0, 20).map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => onView(candidate)}
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {candidate.firstName} {candidate.lastName}
                        </div>
                        <div className="text-gray-400 text-sm">{candidate.title}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{candidate.location}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Briefcase className="w-4 h-4 mr-1 flex-shrink-0" />
                        {candidate.experience} years
                      </div>
                      {candidate.employmentType && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <FileCheck className="w-4 h-4 mr-1 flex-shrink-0" />
                          {candidate.employmentType.toUpperCase()}
                        </div>
                      )}
                      {candidate.availabilityToStart && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <CalendarDays className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{candidate.availabilityToStart}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < candidate.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center space-x-1">
                        {candidate.linkedin && (
                          <a
                            href={candidate.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                            title="View LinkedIn"
                          >
                            <Linkedin className="w-4 h-4 text-gray-400" />
                          </a>
                        )}
                        {status !== 'archived' ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSubmit(candidate);
                              }}
                              className="p-1 hover:bg-gray-800 rounded transition-colors"
                              title="Submit to Job"
                            >
                              <Send className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(candidate);
                              }}
                              className="p-1 hover:bg-gray-800 rounded transition-colors"
                              title="Edit Candidate"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestore(candidate.id);
                            }}
                            className="p-1 hover:bg-green-800 rounded transition-colors"
                            title="Restore Candidate"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {columnCandidates.length > 20 && (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    +{columnCandidates.length - 20} more
                  </div>
                )}
                {columnCandidates.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No candidates</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
